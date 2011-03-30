$(document).ready(function(){

  $(".response h2").append(window.ApiTestTool.submit_button)

  $("form#tool").apiRequester({ submit_button : window.ApiTestTool.submit_button })

  $.each( window.ApiTestTool.display_presets, function(i,j){
    var $element = $("<div class='preset' id='" + j + "'>" + j.replace("_", "/") + "</div>")
    $(".presets").append($element)
    $element.click(function(){
      var parts = $(this).attr("id").split("_")
      window.ApiTestTool.setData(window.ApiTestTool.presets[parts[0]][parts[1]])
    })
  })

  $(".preset").hide()
  $(".presets h4").append("<span class='expander'>▼</span>")
  $(".presets").css({cursor: "pointer"}).hover(
    function(){$(".preset").show()},
    function(){$(".preset").hide()}
  )

})