/**
* import task to Server
*
*/
var TaskImport=(function(){
	var project_id=0;
	var user_id=0;
	var tracker_id=7;
	var datas=null;

	/**
	*http post command
	*/
	function command(url,data){
		var su=function(){alert('操作成功');};
		var failed=function(){alert('操作失败');};
		var t={
		success:function(f){su=f;return t;},
		failed:function(f){failed=f;return t;}
		}
		$.ajax({
	    	  type: 'POST',
	    	  url:url,
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

	function commandGet(url,data){
		var su=function(){alert('操作成功');};
		var failed=function(){alert('操作失败');};
		var t={
		success:function(f){su=f;return t;},
		failed:function(f){failed=f;return t;}
		}
		uas.checkLogin(function(u){
			console.log(u);
			if(!u.id){failed("not login yet!");return;}
			$.ajax({
				type: 'GET',
				url:url,
				headers:{Authorization:"uas "+uas.getToken()},
				contentType:"application/json;charset=utf-8",
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
		});
		
		return t;
	}

	function projects(){
		return commandGet("http://70mm.cn:8097/project/myprojects?status=1&page=1&limit=300");
	}

	function addRow(){
		datas=datas||[];
		var date=new Date().format('yyyy-MM-dd');

		datas.push({startDate:date,dueDate:date,trackerId:7,statusId:3,subject:"请填写任务内容",checkTaskTime:2});

	}

	/**
	*text to one-hot format
	*/
	function getonehot(text){
		var arr =[];
		var hs =text.split(/[\n\r]+/g);

		var splitor=null;
		for(var i=0;i<hs.length;i++){
		//console.log(hs[i]);
			if(""==hs[i]||hs[i].replace(/[ ]+/g,"").replace(/[-|\t]+/g,"")=="")continue;
			if(splitor==null){
				splitor=',';
				if(/^([^\t]+\t)+.+$/.test(hs[i])){
				splitor=/[\t]+/g;
				}else if(/^([^,]+,){2,200}.+$/.test(hs[i])){
				splitor =',';
				}else if(/^([^|]+|)+.+$/.test(hs[i])){
				splitor='|';
				}else if(/^([^ ]+ )+.+$/.test(hs[i])){
				splitor=/[ ]+/g;
				}
		   }
			var cs= hs[i].split(splitor);
					for(var j=0;j<cs.length;j++){
						arr.push(cs[j]);
					}
					arr.push("\r\n");
		}
		return arr;
	}

function attributeMaping(key){
	if(key=='工时')return 'checkTuas-core.jsaskTime';
	else if(key=='任务')return 'subject';
	else if(key=='任务名称')return 'subject';
	else if(key=='项目ID')return 'projectId';
	else if(key=='结束时间')return 'dueDate';
	else if(key=='开始时间')return 'startDate';
	else if(key=='开始')return 'startDate';
	else if(key=='结束')return 'dueDate';
	else if(key=='类型')return 'trackerId';
	else if(key=='状态')return 'statusId';
	else if(key=='指派人')return 'assignedToId';
	else if(key=='紧急程度')return 'priorityId';
	else if(key='来源')return 'categoryId';
	return key;
}

function headerMaping(key){
	if(key=='checkTaskTime')return '工时';
	else if(key=='subject')return '任务';
	else if(key=='projectId')return '项目ID';
	else if(key=='dueDate')return '结束时间';
	else if(key=='startDate')return '开始时间';
	else if(key=='trackerId')return '类型';
	else if(key=='statusId')return '状态';
	else if(key=='assignedToId')return '指派人';
	else if(key=='priorityId')return '紧急程度';
	else if(key='categoryId')return '来源';
	return key;
}

var prioritys=[
[1,'低'],
[2,'普通'],
[3,'高'],
[4,'紧急'],
[5,'立刻'],
[6,'优先']
];
var categorys=[
[1,'日常'],
[2,'工单'],
[3,'电话'],
[4,'QQ'],
[5,'安排'],
[6,'邮件']
];

var status=[
	[1,'新建'],
	[2,'进行中'],
	[2,'处理中'],
	[2,'未解决'],
	[3,'已解决'],
	[3,'已完成'],
	[3,'完成'],
	[4,'反馈'],
	[5,'已关闭'],
	[5,'关闭'],
	[6,'需求取消'],
	[6,'取消'],
	[8,'挂起'],
	[10000,'处理中'],
	[10001,'审核确认中'],
	[10002,'完成关闭'],
	[10003,'已退回'],
	[10100,'测试设计中'],
	[10300,'开发测试中'],
	[10301,'测试中'],
	[10400,'测试执行中'],
	[10401,'测试设计审核中'],
	[10402,'已验证'],
	[10403,'重新打开'],
	[10404,'验证未通过']
];

var trackers=[
	[1,"缺陷"],
	[1,"BUG"],
	[1,"错误"],
	[2,"功能"],
	[3,"支持"],
	[4,"任务"],
	[5,"测试"],
	[6,"需求"],
	[7,"运维"],
	[5,"测试任务"],
	[6,"需求任务"],
	[7,"运维任务"],
	[8,"安全"],
	[9,"报障"],
	[10,"集成"],
	[11,"日常"]
];


function trackerMapping(key,m){
	return mapping(trackers,key,m);
}

function statusMapping(key,m){
	return mapping(status,key,m);
}

/**
*输入的内容转换 如优先级高 转成 3
*/
function valueTranslate(k,v){
	if(k=='priority_id')return priorityMapping(v,1);
	else if(k=='category_id')return categoryMapping(v,1);
	else if(k=='status_id')return statusMapping(v,1);
	else if(k=='tracker_id') return trackerMapping(v,1);
	return v;
}


function priorityMapping(key,m){
	return mapping(prioritys,key,m);
}

/**
*two ways mapping
*/
function mapping(data,key,m){
	for(var i=0;i<data.length;i++){
		if(!!m){
			if(''+key==''+data[i][1])return data[i][0];
		}else{
			if(''+key==''+data[i][0])return data[i][1];
		}
	}
	return key;
}

function categoryMapping(key,m){
	return mapping(categorys,key,m);
}

function getDefaleMap(){

	var d = "";
	try{
		d=new Date().format('yyyy-MM-dd');
	}catch(e){
		try{
			var d1=new Date();
			d=d1.getFullYear()+"-"+(d1.getMonth()+1)+"-"+d1.getDate();
		}catch(e){}
		
	}
	var a={'status_id':3,'check_task_time':1,'due_date':d,'start_date':d,'tracker_id':7,'subject':'','priority_id':2,'category_id':1};
	return a;
}

/**
*
*Convert onehot data to Json
*@param map  a function for header mapping 
*@param base a function for getting default values;
*/
function onehot2Json(arr,map,base){
	if(arr==undefined|arr==null)return null;
	if(arr.length==undefined||arr.length<2)return null;
	var reader =new Reader(arr);
	var firstLine =reader.next();
	if(firstLine.length==0)return null;
	if(map==undefined||map==null)map=attributeMaping;
	if(base==undefined||base==null)base =getDefaleMap;
	var unkown=-1;
	var header=[];
	var json=[];
	for(var i=0;i<firstLine.length;i++){
		var c=firstLine[i];
		if(map!=null)c=map(c);
		if(isEmpty(c)){
			header[i]=unkown;
		}else{
			header[i]=c;
		}
	}

	while(reader.hasNext()){
		var data =reader.next();
		var o={};
		if(base!=null)o=base();
		json.push(o);
		for(var i=0;i<data.length;i++){
			if(i>=header.length)break;
			var h=header[i];
			var v=data[i];
			if(h==unkown)continue;
			o[h]=valueTranslate(h,v);
		}
	}

	return json;

}

function getJson(text){
	datas=onehot2Json(getonehot(text));
	return datas;
}
function getText(){
	return jsonArrayToText(datas);
}

function hasData(){
	if(datas==null||datas.length==0)return false;
	return true;
}
function getDatas(){
	if(datas==null){
		//datas=[getDefaleMap(),getDefaleMap()];
		return [];
	}
	var d =[];
	for(var i=0;i<datas.length;i++){
		if(!datas[i].del){d.push(datas[i])}
	}
	return d;

}

/**
*Convert json data to default format
*/
function jsonArrayToText(arr){
	if(arr==null||arr.length==0)return "";
	var data =[];
	var col =[];
	var o=arr[0];
	var isFirst=true;
	for(k in o){
		var t=typeof o[k];
		if(k=='LAY_TABLE_INDEX'||k=='del')continue;
		if(t!='function'){
			if(isFirst){
				isFirst=false;
			}else{
				data.push('|');
			}
			col.push(k);
			data.push(headerMaping(k));
		}
	}
	data.push("\r\n");
	for(var i=0;i<arr.length;i++){
		var o=arr[i];
		if(!!o.del)continue;
		isFirst=true;
		for(var j=0;j<col.length;j++){

			if(isFirst){
				isFirst=false;
			}else{
				data.push('|');
			}
			var v=null;
			try{
				v=o[col[j]];
			}catch(e){}
			data.push(v);
		}
		data.push("\r\n");
	}
	return data.join("    ");
}

function setProjectId(id){
	project_id=id;
}

/**
*do upload data to Server
*/
function upload(){
	var d ={project_id:project_id,issues:datas};
	return command("../issue/import",d);
}

/**
*export public functions
*/

var exp={
	getonehot:getonehot,
	onehot2Json:onehot2Json,
	getJson:getJson,
	getText:getText,
	getDatas:getDatas,
	setProjectId:setProjectId,
	upload:upload,
	priorityMapping:priorityMapping,
	categoryMapping:categoryMapping,
	valueTranslate:valueTranslate,
	hasData:hasData,
	addRow:addRow,
	projects:projects

};
return exp;

})();



//alert(/^[\r\n]$/.test("\r\n"))
/**
*one-hot Reader
*/
function Reader(data){
	this.data=data;
	this.cursor=0;
	this.next=function(){
		var arr=[];
		for(;this.cursor <this.data.length;){
		 var d=this.data[this.cursor];
		 this.cursor=this.cursor+1;
		 if(/^[\r\n]+$/.test(d))return arr;
		 arr.push(trim(d));
		}
		return arr;
	};
	this.hasNext=function(){
		//alert(this.cursor);
		return this.data.length>this.cursor;
	}
}




//var defaleMap={'status_id':3,'check_task_time':1};





function trim(x) {
    return x.replace(/^\s+|\s+$/gm,'');
}

function isEmpty(obj){
	if(obj==null)return true;
	if(typeof obj == "string"){
		if(obj.replace(/[ ]+/g,"")=="")return true;
	}
	return false;
}

/**
*给Date 增加 格式化方法
*/
Date.prototype.format = function(format)
{
 var o = {
 "M+" : this.getMonth()+1, //month
 "d+" : this.getDate(),    //day
 "h+" : this.getHours(),   //hour
 "m+" : this.getMinutes(), //minute
 "s+" : this.getSeconds(), //second
 "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
 "S" : this.getMilliseconds() //millisecond
 }
 if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
 (this.getFullYear()+"").substr(4 - RegExp.$1.length));
 for(var k in o)if(new RegExp("("+ k +")").test(format))
 format = format.replace(RegExp.$1,
 RegExp.$1.length==1 ? o[k] :
 ("00"+ o[k]).substr((""+ o[k]).length));
 return format;
}