$(function () {
    $("#test-editormd").removeAttr("class");
    var md=$("#mdeditor-textarea").text();
    $("#test-editormd").html("");
    var mdeditor = editormd.markdownToHTML("test-editormd", {
        width: "100%",
        height: 740,
        path: '/lib/',
        //theme: "eclipse",
        //previewTheme: "eclipse",
       // editorTheme: "eclipse",
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
        onload: function () {
            this.fullscreen();
        }

    });

});