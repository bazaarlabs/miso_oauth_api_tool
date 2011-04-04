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


     $.ajax({
          url: request_object.url,
          type: "GET",
          dataType: "json",
          data: request_object.data,
          async: false,
          success: function(data, status, httpResponse){
            try{
                var body = JSON.parse(data.body)
                var html_body = JSON.pretty_stringify(body)
            }
            catch(err){
              html_body = data.body
             }
            response_object.data = data
            response_object.http_response = httpResponse
            $("#data").html(html_body)
            response_object.class_name = data.message == "OK" ? "success" : "error"
            $("#status").attr("class",response_object.class_name).val(data.code + ": " + data.message)
            api_r.options.callbacks.ajax && api_r.options.callbacks.ajax.call(api_r)
          },
          error: function(data, status, http_status){
            alert("An error occurred")
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