var ed=null;
function getMd(){
    var url=window.location.href;
    var n=null;
    if(url.indexOf('#')>-1){
       n=url.substring(url.indexOf('#')+1,url.length);
    }
    return n;
}
var mdfile=getMd();
function getParent(url){
    return url.substring(0,url.lastIndexOf("/"))+"/";
}
var resBase=getParent(mdfile);
var rfile=mdfile.replace("md/","")
var pdir=rfile.substring(0,rfile.lastIndexOf('/'));
if(!pdir)pdir="/";

function getContext(blob) {
    return new Promise((resolve) => {
        if (blob == null) resolve();
        let reader = new FileReader();
        reader.onload = function (event) {
            //console.log(event)
            resolve(event.target.result);
        }
        reader.readAsDataURL(blob);
    });
}


var toolBarIconArray=editormd.toolbarModes["full"];
toolBarIconArray.push("download");
toolBarIconArray.push("save");
toolBarIconArray.push("home");

function init(md,resBase){
    $("#test-editormd").removeAttr("class");
    //var md=$("#mdeditor-textarea").text();
    $("#test-editormd").html("");
    var mdeditor = editormd("test-editormd", {
        width: "100%",
        height: 740,
        path: '/resources/editormd/lib/',
        theme: "eclipse",
        previewTheme: "eclipse",
        editorTheme: "eclipse",
        markdown: md,
        codeFold: true,
        saveHTMLToTextarea: true,    // 保存 HTML 到 Textarea
        searchReplace: true,
        htmlDecode: "style,script,iframe|on*",            // 开启 HTML 标签解析，为了安全性，默认不开启
        emoji: true,
        taskList: true,
        tocm: true,         // Using [TOCM]
        tex: true,                   // 开启科学公式TeX语言支持，默认关闭
        flowChart: true,             // 开启流程图支持，默认关闭
        sequenceDiagram: true,       // 开启时序/序列图支持，默认关闭,
        resBase: resBase,
        onload: function () {
            this.fullscreen();
            var keyMap = {
            "Ctrl-S": function(cm) {
                //alert("Ctrl+S");
                postdata(mdeditor.getMarkdown()).success(function(){});
            },
            "Cmd-S":function(cm) {
                //alert("Cmd+S");
                postdata(mdeditor.getMarkdown()).success(function(){});
            }
        };
            this.addKeyMap(keyMap);
        },
        toolbarIcons : function() {
            // Or return editormd.toolbarModes[name]; // full, simple, mini
            // Using "||" set icons align right.
            
            //toolBarIconArray.push("download");
            //toolBarIconArray.push("save");
            //toolBarIconArray.push("home");
            return toolBarIconArray;
        },
        toolbarIconsClass : {
            download : "fa-download",  // 指定一个FontAawsome的图标类
            save : "fa-save",
            home: "fa-home"
        },
        toolbarIconTexts : {
            download : "download",  // 如果没有图标，则可以这样直接插入内容，可以是字符串或HTML标签
            save : "save",
            home : "home"
        },
        // 自定义工具栏按钮的事件处理
        toolbarHandlers : {
            download : function() {
                this.executePlugin("downloadDialog", "download-dialog/download-dialog");
            },

            save:function(){
                //alert(window.location.href);
                postdata(mdeditor.getMarkdown()).success(function(){alert("success!");});
            },
            home:function(){
                window.location.href="/books.html"
            }


        }

    });
    ed=editormd;
//========================
function command(data){
        var su=function(){alert('操作成功');};
        var failed=function(){alert('操作失败');};
        var t={
        success:function(f){su=f;return t;},
        failed:function(f){failed=f;return t;}
        }
        $.ajax({
              type: 'POST',
              url: "../../../books",
              contentType:"application/json;charset=utf-8",
              data:JSON.stringify(data),
              success: function(rest){
                  if(rest.code==0){
                      if(su)su(rest);
                  }else{
                      if(failed)su(rest);
                  }
                  
                  
              },
              dataType: "json"
            });
        return t;
    }

function isFromExcel(str){
    return  str.indexOf("<html")>-1&&str.indexOf("office:excel")>-1
}

function getTable(str){
    var arr = str.split(/[\r\n]/);
    var list = arr.map(item => {
        if(item==null||item.length==0)return null;
          return item.split("\t");
        }).filter(con => {
        return con!=null;
        });
    var h=list[0];
    var sb=[];
    sb.push(h.join("|"))
    var sp=[];
    for(var i=0;i<h.length;i++){
        sp.push("------------");
    }
    sb.push(sp.join("|"))
    for(var j=1;j<list.length;j++){
        sb.push(list[j].join("|"))
    }
    return "|"+sb.join("|\n|")+"|";
}

document.addEventListener('paste', function(e) {
    if (!e || !e.clipboardData) return;
        var pText = e.clipboardData.getData('text/plain');
        if (pText) {//有文本内容的时候才是true   注意：空字符串''是false
            //mdeditor.insertValue(pText);
            //console.log(pText);
            if(isFromExcel(e.clipboardData.getData('text/html'))){
                //console.log( getTable(pText));
                e.preventDefault(); //阻止默认粘贴事件
                e.stopPropagation(); //阻止事件冒泡
                mdeditor.insertValue(getTable(pText));
            }
            //console.log()
            //    e.preventDefault(); //阻止默认粘贴事件
            //e.stopPropagation(); //阻止事件冒泡
            

        } else if (e.clipboardData.items) {//没有文本内容，判断这个数组，文件可能在这个数组里
            let blob = null, items = e.clipboardData.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].kind === 'file') {//类型 是 文件
                    blob = items[i].getAsFile();
                    if (items[i].type.indexOf("image") !== -1) {//文件类型是图像
                        getContext(blob).then(res => {
                            paste(pdir,res,e=>{mdeditor.insertValue(e);});
                        })
                    } else if (items[i].type.indexOf("text") !== -1) {//文件类型是文本
                        
                    }else{
                        console.log(e)
                    }
                }
            }
        } else {
            alert("粘了个寂寞");
        }
});

function postdata(data){
        var su=function(){alert('操作成功');};
        var failed=function(){alert('操作失败');};
        var t={
        success:function(f){su=f;return t;},
        failed:function(f){failed=f;return t;}
        }
        $.ajax({
              type: 'POST',
              url:"/file?f="+rfile,
              contentType:"text/plain",
              data:data,
              success: function(rest){
                  if(rest.code==0){
                      if(su)su(rest);
                  }else{
                      if(failed)su(rest);
                  }
                  
                  
              },
              dataType: "json"
            });
        return t;
    }
}


function paste(path,file,f){
    $.ajax("/paste?f="+path,{
        type: 'POST',
        dataType: 'text',
        data:file,
        success:e=>{
            f(e);
        },
        statusCode: {
                404: e=>{console.log('404')},
                500: e=>{console.log('500')}
        }
        })
}


$(function () {
    $.ajax(mdfile+"?d="+new Date().getTime(),{
    type: 'GET',
    dataType: 'text',
    success:e=>{
        init(e,resBase);
        var state = {title:'',url:window.location.href.split("#")[0]}
        //history.pushState(state,'',mdfile);
    },
    statusCode: {
            404: e=>{console.log('404')},
            500: e=>{console.log('500')}
    }
    })
   
//========================
});