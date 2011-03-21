$.fn.extend({

    loadingIndicator: function(options){

    },

    apiRequester: function(options){

      options =  $.extend(options, {
        selectors: {
          form: this.selector
        }
      })

      var api_requester = new ApiRequester(options)
      return this
    }

})
