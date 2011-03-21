var Cookie = function(){

    var MILLISECONDS_PER_DAY=24*60*60*1000

    this.cookies = function(){
        return document.cookie.split(';');
    }

    this.create = function(hash){
        if (hash.days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*MILLISECONDS_PER_DAY));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        document.cookie = hash.name+"="+hash.value+expires+"; path=/";
    }

    this.read = function(name) {
        var nameEQ = name + "=";
        for(var i=0;i < this.cookies.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    this.delete = function(name) {
        this.create(name,"",-1);
    }

}