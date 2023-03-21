/*****************公共类***********************/

	/**
		*
		*唯一ID
		*
		*/
		function uuid() {
			  var s = [];
			  var hexDigits = "0123456789abcdef";
			  for (var i = 0; i < 36; i++) {
				s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
			  }
			  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
			  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
			  s[8] = s[13] = s[18] = s[23] = "-";
			 
			  var uuid = s.join("");
			  return uuid;
		}



		/**
		*JS Map 实现
		*/
		function jsMap(){
			this.entrys={};
			this.put=function(key,value){
				this.entrys[""+key]=value;
			}
			this.get=function(key){
				//alert(entrys[key]);
				return this.entrys[""+key]||null;
			}
			this.values=function(){
				var ar=[];
				for(var key in this.entrys){
					ar.push(this.entrys[key]);
				}
				return ar;
			}
			this.clean=function(){
				this.entrys={};
			}

		}

		/**
		*
		*转Object 为json String 
		*/
		function json2str(o) {
			var arr = [];
			var fmt = function(s) {
			if (typeof s == 'object' && s != null) return json2str(s);
			return /^(string|number)$/.test(typeof s) ? "'" + s + "'" : s;
			}
			for (var i in o) arr.push("'" + i + "':" + fmt(o[i]));
			return '{' + arr.join(',') + '}';
		} 

var system=(function(){
	var trackers=[{id:1,name:"BUG"},
	{id:1,name:"BUG"},
	{id:2,name:"功能"},
	{id:3,name:"预研"},
	{id:4,name:"联调"},
	{id:5,name:"测试,"},
	{id:6,name:"前端"},
	{id:7,name:"运维"},
	{id:8,name:"分析"},
	{id:9,name:"文档编写"},
	{id:10,name:"用户体验"},
	{id:11,name:"用户研究"},
	{id:12,name:"交互设计"},
	{id:13,name:"视觉设计"},
	{id:14,name:"品牌设计"},
	{id:15,name:"视频动画"},
	{id:16,name:"日报"}
	];
	//0新建，1进行中 2稍后 3完成 4反馈 5关闭 6取消 7问题重现 8挂起，下面的状态只有BUG才有9无法重现  10外部问题  11无法修复 12重复问题 13无须处理 14设计问题
	var status =[{id:0,name:"新建"},
	{id:1,name:"进行中"},
	{id:2,name:"稍后"},
	{id:3,name:"完成"},
	{id:4,name:"反馈"},
	{id:5,name:"关闭"},
	{id:6,name:"取消"}
	];
	var centrals=[{"id":1,"name":"综合服务"},{"id":2,"name":"测试中心"},{"id":3,"name":"运营维护"},{"id":4,"name":"互联网产品"},{"id":5,"name":"增值业务产品"},{"id":6,"name":"数据经营产品"},{"id":7,"name":"信息安全产品"},{"id":8,"name":"技术共享"},{"id":9,"name":"全媒体客服产品"},{"id":10,"name":"物联网研究所"}];
	//var trackers=[{"id":1,"name":"错误","is_in_chlog":true,"position":1,"is_in_roadmap":false,"fields_bits":0},{"id":2,"name":"功能","is_in_chlog":true,"position":2,"is_in_roadmap":true,"fields_bits":0},{"id":3,"name":"支持","is_in_chlog":true,"position":3,"is_in_roadmap":true,"fields_bits":1},{"id":4,"name":"任务","is_in_chlog":false,"position":4,"is_in_roadmap":true,"fields_bits":1},{"id":5,"name":"测试任务","is_in_chlog":false,"position":1,"is_in_roadmap":true,"fields_bits":0},{"id":6,"name":"需求任务","is_in_chlog":false,"position":1,"is_in_roadmap":true,"fields_bits":0},{"id":7,"name":"运维任务","is_in_chlog":false,"position":1,"is_in_roadmap":true,"fields_bits":0}];
	//var status=[{"id":1,"name":"新建","is_closed":false,"is_default":true,"position":1,"default_done_ratio":null,"is_show":1},{"id":2,"name":"进行中","is_closed":false,"is_default":false,"position":2,"default_done_ratio":null,"is_show":1},{"id":3,"name":"已解决","is_closed":false,"is_default":false,"position":3,"default_done_ratio":null,"is_show":1},{"id":4,"name":"反馈","is_closed":false,"is_default":false,"position":5,"default_done_ratio":null,"is_show":null},{"id":5,"name":"已关闭","is_closed":true,"is_default":false,"position":6,"default_done_ratio":null,"is_show":1},{"id":6,"name":"需求取消","is_closed":true,"is_default":false,"position":7,"default_done_ratio":null,"is_show":null},{"id":8,"name":"挂起","is_closed":false,"is_default":false,"position":4,"default_done_ratio":null,"is_show":null},{"id":10000,"name":"处理中","is_closed":false,"is_default":false,"position":1,"default_done_ratio":null,"is_show":null},{"id":10001,"name":"审核确认中","is_closed":false,"is_default":false,"position":1,"default_done_ratio":null,"is_show":null},{"id":10002,"name":"完成关闭","is_closed":false,"is_default":false,"position":1,"default_done_ratio":null,"is_show":null},{"id":10003,"name":"已退回","is_closed":false,"is_default":false,"position":1,"default_done_ratio":null,"is_show":null},{"id":10100,"name":"测试设计中","is_closed":false,"is_default":false,"position":1,"default_done_ratio":null,"is_show":null},{"id":10300,"name":"开发测试中","is_closed":false,"is_default":false,"position":1,"default_done_ratio":null,"is_show":null},{"id":10301,"name":"测试中","is_closed":false,"is_default":false,"position":1,"default_done_ratio":null,"is_show":null},{"id":10400,"name":"测试执行中","is_closed":false,"is_default":false,"position":1,"default_done_ratio":null,"is_show":null},{"id":10401,"name":"测试设计审核中","is_closed":false,"is_default":false,"position":1,"default_done_ratio":null,"is_show":null},{"id":10402,"name":"已验证","is_closed":false,"is_default":false,"position":8,"default_done_ratio":null,"is_show":null},{"id":10403,"name":"重新打开","is_closed":false,"is_default":false,"position":9,"default_done_ratio":null,"is_show":null},{"id":10404,"name":"验证未通过","is_closed":false,"is_default":false,"position":10,"default_done_ratio":null,"is_show":null}];
	var projects=[];//{id:1,name:'project_name'}
	var cm = new jsMap();
	var tm = new jsMap();
	var sm = new jsMap();
	var pm = new jsMap();
	function init(data,map){
		for(var i=0;i<data.length;i++){
			var d=data[i];
			//alert(json2str(d));
			map.put(d.id,d.name);
		}
	}
	
	//init(centrals,cm);
	init(trackers,tm);
	init(status,sm);
	/*$.get("../issue/status",function(data,status){
		init(data.data,sm);
		status=data.data;
		//alert(json2str(data));
	});
	$.get("../issue/trackers",function(data,status){
		init(data.data,tm);
		//alert(json2str(data));
	});
	$.get("../user/groups",function(data,status){
		init(data.data,cm);
		//alert(json2str(data));
	});
	$.get("../projects",function(data,status){
		projects=data.data;
		init(data.data,pm);

		//alert(json2str(data));
	});*/

	

	function changeStatus(e,id){
		alert(id);
	}
	function getStatus(key,id){
		var arr=[];
		arr.push("<select lay-filter=\"issues_status\" >");
		for(var i=0;i<status.length;i++){
			var d=status[i]
			if(d.id==key){
				arr.push("<option value=\"");
				arr.push(d.id);
				arr.push("\" selected>");
				arr.push(d.name);
				arr.push("</option>");
			}else{
				arr.push("<option value=\"");
				arr.push(d.id);
				arr.push("\" >");
				arr.push(d.name);
				arr.push("</option>");
			}
		}
		arr.push("</select>");
		return arr.join("");
	}

	function subjectIcon(key){
		if(key=="1"||key==1){
			return "<span class=\"layui-badge layui-bg-orange\">BUG</span>";
		}else{
			return "<span class=\"layui-badge layui-bg-blue\">"+(tm.get(key)||"unknow")+"</span>"; 
		}
	}
	
	function refresh(){
		$.ajax({
	    	  type: 'POST',
	    	  url: "system",
	    	  contentType:"application/json;charset=utf-8",
	    	  data:JSON.stringify({"command":"refresh"}),
	    	  success: function(rest){
	    		  if(rest.code==0){
	    			  layer.msg('操作成功');
	    		  }else{
	    			  layer.msg('操作失败');
	    		  }
	    		  
	    		  
	    	  },
	    	  dataType: "json"
	    	});
	}
	
	function svnIcon(id){
		return id==1?'<span class="layui-badge layui-bg-green">svn</span>':'<span class="layui-badge">svn</span>';
	}
	function svnClass(id){
		return id==1?'':'layui-btn-warm';
	}
	
	function commandGet(uri){
		var su=function(){alert('操作成功');};
		var failed=function(){alert('操作失败');};
		var t={
		success:function(f){su=f;return t;},
		failed:function(f){failed=f;return t;}
		}
		$.ajax({
	    	  type: 'get',
	    	  url: uri,
	    	  contentType:"application/json;charset=utf-8",
	    	  //data:JSON.stringify(data),
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

	function getUser(){
		return commandGet("../user");
	}
	function getProjects(){
		return commandGet("../projects");
	}

var lastProject_id=null;
var lastDate=null;
var callbacks=[];
var timeline_count=0;
var timeline_time=0;
function project_changed(project_id,date,check_task_time){
	if(project_id==lastProject_id&& date==lastDate){
		timeline_count++;
		try{
			timeline_time+=check_task_time;
		}catch(e){}
		
		return false;
	}else{
		(function(){
			var id="#summary_"+lastDate+"_"+lastProject_id;
			var text="[共"+timeline_count+"个任务 "+timeline_time+"工时]";
			//var text="task:"+timeline_count+"-"+timeline_time+"--"；
			addcallbacks(function(){
				$(id).html(text);
			});
		})();
		lastProject_id=project_id;
		lastDate=date;
		timeline_count=1;
		timeline_time=check_task_time;
		try{
			timeline_time+=check_task_time;
		}catch(e){}
		return true;
	}
}

function addcallbacks(fun){
	callbacks.push(fun);
}

function exeuteAll(){
	for(var i=0;i<callbacks.length;i++){
		try{
			callbacks[i]();
		}catch(e){
			console.log(e);
		}
	}
	callbacks=[];

}

return {
	centrals:function(key){
		
		return cm.get(key)||"unknow";
	},
	trackers:function(key){
		return tm.get(key)||"unknow";
	},
	status:function(key){
		return sm.get(key)||"unknow";
	},
	project:function(key){
		return pm.get(key)||"-";
	},
	svnIcon:svnIcon,
	svnClass:svnClass,
	subjectIcon:subjectIcon,
	getStatus:getStatus,
	refresh:refresh,
	getUser:getUser,
	getProjects:getProjects,
	project_changed:project_changed,
	addcallbacks:addcallbacks,
	exeuteAll:exeuteAll
}

})();
