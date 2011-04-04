JSON.pretty_stringify = function(body,indent){
    var indent = indent || "  "
    var indent_regex = new RegExp(indent, "gim")
    var value_regex  = new RegExp(":\s*(\"[^{}\n\r]+\"|true|false|[0-9]+)", "gi")
    var key_regex    = new RegExp("\"([^{}\n\r]+)\"\s*:", "gim")
    var url_regex    = new RegExp("(http:\/\/[^ \"\']+)", "gim")
    var nline_regex  = new RegExp("\n", "g")
    return JSON.stringify(body, null, indent).replace(
        value_regex,  ": <span class='val'>$1</span>"
    ).replace(
        key_regex,    "<span class='key'>$1</span> :"
    ).replace(
        indent_regex, "<span class='indent'></span>"
    ).replace(
        nline_regex, "<div class='line_break'></div>"
    ).replace(
        url_regex, "<a href='$1' target='_blank'>$1</a>"
    )
}