var mdfile=getMd();
var relUrl=window.location.href;
function edit(){
    window.location.href="/edit.html#"+mdfile;
}

function view(){
    window.location.href="/view.html#"+mdfile;
}

function toc(){
    window.location.href="/view-toc.html#"+mdfile;
}

function getMd(){
    var url=window.location.href;
    var n=null;
    if(url.indexOf('#')>-1){
       n=url.substring(url.indexOf('#')+1,url.length);
    }
    return n;
}
function getTile(){
    var url =getMd();
    if(url==null)return "";
    var ls = url.lastIndexOf('/')+1;
    return url=decodeURI(url.substring(ls,url.length));
}