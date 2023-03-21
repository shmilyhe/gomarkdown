/**
 * Books
 */
var Books=(function($){
	/**
	 * command begin
	 */
	function command(data){
		var su=function(){alert('操作成功');};
		var failed=function(){alert('操作失败');};
		var t={
		success:function(f){su=f;return t;},
		failed:function(f){failed=f;return t;}
		}
		$.ajax({
	    	  type: 'POST',
	    	  url: "../books",
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

	function ls (path){
		return command({"command":"ls","path":path});
	}
	function mkdir (path){
		return command({"command":"mkdirs","path":path});
	}
	function touch (path){
		return command({"command":"touch","path":path});
	}
	function rm (path){
		return command({"command":"rm","path":path});
	}

	function mv (path,path2){
		return command({"command":"mv","path":path,"data":path2});
	}
	function summary(path){
		return command({"command":"summary","path":path});
	}

	function getParamter(url,name){
		var off=url.indexOf('?')+1;
		if(off<=0)return null;
		var b =url.substr(off,url.length-off);
		var kvs=b.split('&');
		var p=null;
		for(var i=0;i<kvs.length;i++){
		  var kv=kvs[i];
		  if(kv.indexOf('=')<1)continue;
		  var ar=kv.split('=');
		  if(ar.length<2)continue;
		  if(ar[0]===name)p=ar[1];
		}
		if(p==null)return null;
		if(p.indexOf('/')>-1){
		  p=p.substring(0,p.indexOf('/'));
		}
		if(p.indexOf('#')>-1){
		  p=p.substring(0,p.indexOf('#'));
		}
		
		return p;
	}
	
	return {
		ls:ls,
		mkdir:mkdir,
		touch:touch,
		rm:rm,
		mv:mv,
		summary:summary,
		getParamter:getParamter
	}
	
})($);
