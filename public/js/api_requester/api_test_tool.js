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
  media: {
    show: {
      relative: "media/show",
      format: "json",
      method: "GET",
      field_0_name: "media_id",
      field_0_value: "5552"
    },
    search: {
      relative: "users",
      format: "json",
      method: "GET",
      field_0_name: "q",
      field_0_value: "Modern Family"
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
      relative: "users/follows",
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
  "media_show",
  "media_search",
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