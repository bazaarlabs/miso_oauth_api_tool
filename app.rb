require 'rubygems'
require 'sinatra'
require 'oauth'
require 'json'
require 'haml'
require 'yaml'

enable  :sessions, :logging

ALLOW_ENV_KEYS = true
MISO_SITE = ENV['MISO_SITE']
MISO_CALLBACK_URL=ENV['MISO_CALLBACK_URL']

def colorize(text, color_code)
  "#{color_code}#{text}\e[0m"
end

def red(text); colorize(text, "\e[1;31m"); end
def green(text); colorize(text, "\e[1;32m"); end


puts "\nStarting API tool..."
puts "We will be testing #{green(MISO_SITE)}\n\n"

# Generate a consumer key and secret by creating a new application at:
# http://gomiso.com/oauth_clients/new


# Helper method to create an OAuth-signed request
def get_json_hash(url)
  JSON.parse(@access_token.get(url).body)
end

def to_request_json(response)
  { :body => response.body, :code => response.code, :message => response.message}.to_json
end

# Helper method to create an OAuth consumer, which can generate request and access tokens.
def consumer
  @consumer = OAuth::Consumer.new session[:consumer_key], session[:consumer_secret], :site => MISO_SITE
end

def set_session
  if params[:consumer_key] && params[:consumer_secret]
    session[:consumer_key] = params[:consumer_key]
    session[:consumer_secret] = params[:consumer_secret]
  elsif ALLOW_ENV_KEYS
    session[:consumer_key] = ENV['MISO_CONSUMER_KEY']
    session[:consumer_secret] = ENV['MISO_CONSUMER_SECRET']
  else
    session[:consumer_key] = session[:consumer_secret] = nil
  end
end

def access?
  session[:consumer_key] && session[:consumer_secret]
end

def authorized?
  session[:access_token] && session[:access_secret]
end

def flash(key, value=nil)
  if value
    session[key] = value
  else
    @flash = session[key]
    session[key] = nil
    @flash.nil? ? nil : "<div class='flash'>" + @flash + "</div>"
  end
end

before "/" do
  if authorized?
    flash(:authorized, "You've already been authorized.  Go ahead and test your heart out.")
    redirect "/api/test"
  elsif access?
    redirect "/oauth/connect"
  else
    set_session
  end
end

# Simple landing page with sign in prompt.
get "/" do
  haml :home
end

# Generates and stores request token and redirects to Miso sign-in page.
get "/oauth/connect" do
  @request_token = consumer.get_request_token :oauth_callback => MISO_CALLBACK_URL
  session[:request_token], session[:request_token_secret] = @request_token.token, @request_token.secret
  puts @request_token.authorize_url
  redirect @request_token.authorize_url
end

# Upon successful Miso sign-in, request an access token using the original request token.
get "/oauth/callback" do
  @request_token = OAuth::RequestToken.new(consumer, session[:request_token], session[:request_token_secret])
  @access_token = @request_token.get_access_token(:oauth_verifier => params[:oauth_verifier])
  session[:access_token], session[:access_secret] = @access_token.token, @access_token.secret
  redirect "/api/test"
end

# Use the access token to access a user's checkins and basic information.
get "/oauth/user" do
  @access_token = OAuth::AccessToken.new(consumer, session[:access_token], session[:access_secret])
  user = get_json_hash("/api/oauth/v1/users/show.json")['user']
  checkin = get_json_hash("/api/oauth/v1/checkins.json?count=1&user_id=#{user['id']}").first['checkin']

  html = "<img src='#{user['profile_image_url']}' /><br/>#{user['full_name']} (#{user['username']})<br/>"
  html << "Last checked into: #{checkin['media_title']}<br/> <img src='#{checkin['media_poster_url']}' />"
end


get "/api/test" do
  @access_token = OAuth::AccessToken.new(consumer, session[:access_token], session[:access_secret])
  haml :tool
end

get %r{\/proxy\/([\w\/\.]+)$} do
  puts session.inspect
  @access_token = OAuth::AccessToken.new(consumer, session[:access_token], session[:access_secret])
  request_pms = request.env["rack.request.query_hash"]
  request_ps  = request.env["rack.request.query_string"]
  endpoint = params[:captures].first.to_s
  url ="/api/#{endpoint}"
  full_url = [url,request_ps].join("?")
  puts full_url
  puts request_ps
  if request_pms["_method"] == "GET"
    to_request_json(@access_token.get(full_url))
  elsif request_pms["_method"] == "POST"
    to_request_json(@access_token.post(url, request_pms))
  elsif request_pms["_method"] == "PUT"
    to_request_json(@access_token.put(url, request_pms))
  elsif request_pms["_method"] == "DELETE"
    to_request_json(@access_token.delete(full_url))
  end
end
