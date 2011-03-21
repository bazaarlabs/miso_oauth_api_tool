window.ApiTestTool                     = window.ApiTestTool || {}
window.ApiTestTool.submit_button_html  = "<div class='field submit'><input type='button' value='submit' id='submit'/></div>"
window.ApiTestTool.submit_button       = $(window.ApiTestTool.submit_button_html)

window.ApiTestTool.presets            = {
  users: {
    show: {
      relative: "users/show",
      format: "json",
      method: "GET",
      field_0_name: "user_id",
      field_0_value: "138625"
    },
    index: {
      relative: "users",
      format: "json",
      method: "GET",
      field_0_name: "q",
      field_0_value: "justin",
      field_1_name: "following",
      field_1_value: "false"
    }
  },
  comments: {
    index: {
      relative: "feeds/comments",
      format: "json",
      method: "GET",
      field_0_name: "q",
      field_0_value: "justin",
      field_1_name: "",
      field_1_value: ""
    },
    create: {
      relative: "feeds/comments",
      format: "json",
      method: "POST",
      field_0_name: "feed_item_id",
      field_0_value: "1822292",
      field_1_name: "comment",
      field_1_value: "This is a test coment from the api test tool"
    },
    destroy: {
      relative: "feeds/comments",
      format: "json",
      method: "DELETE",
      field_0_name: "comment_id",
      field_0_value: "41158",
      field_1_name: "",
      field_1_value: ""
    }
  },
  likes: {
    index: {
      relative: "feeds/likes",
      format: "json",
      method: "GET",
      field_0_name: "feed_item_id",
      field_0_value: "1822292",
      field_1_name: "",
      field_1_value: ""
    },
    create: {
      relative: "feeds/likes",
      format: "json",
      method: "POST",
      field_0_name: "feed_item_id",
      field_0_value: "1822292"
    },
    destroy: {
      relative: "feeds/likes",
      format: "json",
      method: "DELETE",
      field_0_name: "like_id",
      field_0_value: "41158"
    }
  },
  favorites: {
    index: {
      relative: "media/favorites",
      format: "json",
      method: "GET"
    },
    create: {
      relative: "media/favorites",
      format: "json",
      method: "POST",
      field_0_name: "media_id",
      field_0_value: "14833"
    },
    destroy: {
      relative: "media/favorites",
      format: "json",
      method: "DELETE",
      field_0_name: "media_id",
      field_0_value: "14833"
    }
  },
  following: {
    index: {
      relative: "users/following",
      format: "json",
      method: "GET"
    },
    create: {
      relative: "users/follows",
      format: "json",
      method: "POST",
      field_0_name: "user_id",
      field_0_value: "138627"
    },
    destroy: {
      relative: "users/follows",
      format: "json",
      method: "DELETE",
      field_0_name: "user_id",
      field_0_value: "138627"
    },
  }
}

window.ApiTestTool.setData = function(field_values){
  $(".keypairs input").val("")
  $.each(field_values, function(k,v){
    $("#"+k).val(v)
  })
}

window.ApiTestTool.display_presets = [
  "users_show",
  "users_index",
  "comments_index",
  "comments_create",
  "comments_destroy",
  "likes_index",
  "likes_create",
  "likes_destroy",
  "favorites_index",
  "favorites_create",
  "favorites_destroy",
  "following_index",
  "following_create",
  "following_destroy"
]

function ApiRequester(options){

    var api_r = this

    this.options = options || {}
    this.options.selectors = this.options.selectors || {}
    this.options.callbacks = this.options.callbacks || {}

    this.url_params     = {}
    this.data_params    = {}
    this.response       = {}

    this.selectors = $.extend({
        form:     "form",
        response: "#data",
        keypairs: ".keypairs .field",
        submit:   "#submit"
    },this.options.selectors)

    this.$ = this.$form = $(this.selectors.form)
    this.$submit_button = this.options.submit_button || $(this.selectors.submit)

    if (this.$submit_button.size == 0) {
      this.$submit_button = $(window.ApiTestTool.submit_button_html)
      $("body").append(this.$submit_button)
    }

    this.find = function(selector){ return this.$form.find(selector) }

    this.collect_data = function(){
      var data_params = {}
      this.$form.find(this.selectors.keypairs).each(function(i,j){
        var key = $(j).find(".name").val()
        var val = $(j).find(".value").val()
        if(key != null && key != "")
          data_params[$(j).find(".name").val()] = $(j).find(".value").val()
      })
      this.data_params = data_params
      this.data_params["_method"] = this.$form.find("#method").val()
      return this
    }

    this.build_url = function(){
      this.url_params = {
        format:   this.$form.find("#format").val(),
        relative: this.$form.find("#relative").val(),
        prefix:   this.$form.find("#prefix").val()
      }
      return this
    }

    this.extend_url = function(){
      this.url_params.full = [ this.url_params.prefix, this.url_params.relative ].join("/") + "." + this.url_params.format
      this.url_params.real =   this.url_params.full.replace(/api/,'proxy')
      return this
    }

    this.collect = function(){
        this.build_url().extend_url().collect_data()
        return this
    }

    this.ajax = function(){

     var response_object  = {}
     var response_element = this.find(this.selectors.response)
     var request_object   = this.request = {data: this.data_params, url: this.url_params.real}
     var indent = "  "

     var indent_regex = new RegExp(indent, "gim")
     var value_regex  = new RegExp(":\s*(\"[^{}\n\r]+\"|true|false|[0-9]+)", "gi")
     var key_regex    = new RegExp("\"([^{}\n\r]+)\"\s*:", "gim")

     $.ajax({
          url: request_object.url,
          type: "GET",
          dataType: "json",
          data: request_object.data,
          async: false,
          success: function(data, status, httpResponse){
            var body = JSON.parse(data.body)
            var html_body = JSON.stringify(body, null, indent).replace( value_regex, ": <span class='val'>$1</span>" ).replace( key_regex, "<span class='key'>$1</span> :" ).replace(indent_regex,"<span class='indent'></span>").replace(/\n/g,"<div class='line_break'></div>")
            response_object.data = data
            response_object.http_response = httpResponse
            $("#data").html(html_body)
            response_object.class_name = data.message == "OK" ? "success" : "error"
            $("#status").attr("class",response_object.class_name).val(data.code + ": " + data.message)
            api_r.options.callbacks.ajax && api_r.options.callbacks.ajax.call(api_r)
          }
     })

     this.response = response_object
     return this
   }

   this.submit = function(){
     this.collect().ajax()
     this.options.callbacks.submit && this.options.callbacks.submit.call(this)
     return this
   }

   this.$submit_button.bind("click", function(){
      api_r.submit()
   })

}