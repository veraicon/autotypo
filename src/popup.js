var LocalUdvGeneralKey="LocalUdvGeneralKey";
//本地用户定义组的总入口。存储localstorage的key
function LocalUdvGeneral(){
	this.size=0;
	this.keyList=new Array();
	this.add=add;
	this.getFromJson=getFromJson;
	function add(key){
		this.keyList[this.keyList.length]=key;
		this.size=this.size+1;
	}
	function getFromJson(json)
	{
		var localFromJson=$.parseJSON(json);
        this.size=localFromJson.size;
		this.keyList=localFromJson.keyList;
	}
}
function fillAllTextInput(){
	//alert('hi');
	//chrome.tabs.getCurrent(function(tab){
	//	alert(tab);
	//})
	chrome.tabs.executeScript({
	//code: 'document.body.style.backgroundColor="red"'
	file: 'fill.js'
	});
}

function localStTest(){
	localStorage.myName='walkingp';
	localStorage['mySite']='http://www.cnblogs.com/walkingp';
	localStorage.setItem('age','24');
	var age=localStorage.getItem('age');
	localStorage.removeItem('age');
	//alert('name:' + localStorage.myName + '\rsite:' + localStorage['mySite']);
}

//以单一默认值填写全部input
function singleDefaultFill(){
	var singleDefaultValue=$("#singleDefaultInput").val();
	if(!singleDefaultValue){
		singleDefaultValue=" ";
	}
	//消息发送
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {singleDefault: singleDefaultValue}, function(response) {
			console.log(response.farewell);
		});
	});
	console.log(singleDefaultValue);
	//chrome.tabs.executeScript({
	//	file: 'jquery-2.1.3.min.js'
	//});
	chrome.tabs.executeScript({
		file: 'singleDefaultFill.js'
	});
}
/*与setCurrentInputSet.js脚本互通,以当前button对应key对应的用户存储值填写当前表单*/
function autoFillByUDV(){
	var key=$(this).attr("id");
	console.log(key);
	chrome.tabs.executeScript({
		file: 'setCurrentInputSet.js'
	});
	currentInputJson=localStorage.getItem(key);
	//消息发送
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {currentInputJson: currentInputJson}, function(response) {
			console.log(response.success);
		});
	});
}

/*与getCurrentInputSet.js配合将当前用户填写的值全部保存下来，作为组策略*/
function storeUDVSet(){
	//取得用户定义的key名字
	var setKey=$("#storeUDVSetInput").val();
	//执行注入脚本取得用户当前填写的全部input
	chrome.tabs.executeScript({
		file: 'getCurrentInputSet.js'
	});
	//接收注入脚本取得的用户当前input内容
	var currentInputResultJson
	chrome.extension.onMessage.addListener(
		function(request, sender, sendResponse) {
			//console.log(sender.tab.url);
			//if (request.greeting1 == "hello1")
			currentInputResultJson=request.currentInputResultJson;
			console.log(currentInputResultJson);
			sendResponse({success: "true"});
			//提示消息并存入localstorage
			localStorage.setItem(setKey,currentInputResultJson);
			localUdvGeneral.add(setKey);
			localStorage.setItem(LocalUdvGeneralKey,JSON.stringify(localUdvGeneral));
			//将结果回显在popup
			$("#storeUDVSetDiv").append("<p class=‘text-success’>添加成功！</p>");
			singleUDVBtn="<div class='col-md-4'>"+
				"<a class='btn btn-small btn-primary udvBtn' id='"+setKey+
				"'>"+setKey+"</a></div>"
			$("#UDVSetDiv").append(singleUDVBtn);
			$("#"+setKey).click(autoFillByUDV);
	});
	
}

/*读取localstorage，将值初始化在对应popup页面区域*/
function initUDVSetDiv(){
	//先读取general，如果是空的，先初始化
	var localUdvGeneralJson=localStorage.getItem("LocalUdvGeneralKey");
	localUdvGeneral=new LocalUdvGeneral();//初始化
	if(localUdvGeneralJson==null||localUdvGeneralJson==""){
	}else{
		localUdvGeneral.getFromJson(localUdvGeneralJson);//读取general udv并解析	
		console.log(localUdvGeneral);
		for(var i=0;i<localUdvGeneral.keyList.length;i++){
			singleUDVBtn="<div class='col-md-4'>"+
				"<a class='btn btn-small btn-primary udvBtn' id='"+localUdvGeneral.keyList[i]+
				"'>"+localUdvGeneral.keyList[i]+"</a></div>"

			$("#UDVSetDiv").append(singleUDVBtn);
			$("#"+localUdvGeneral.keyList[i]).click(autoFillByUDV);
		}
	}
	

}

function deleteAllUdv(){
	localStorage.clear();
	localUdvGeneral=new LocalUdvGeneral();//初始化
	$("#UDVSetDiv").empty();
}

var localUdvGeneral=null;
$(document).ready(function(){	
/*向tab页注入jquery*/
	chrome.tabs.executeScript({
		file: 'jquery-2.1.3.min.js'
	});
	/*读取localstorage已有值，初始化插件*/
	initUDVSetDiv();
	
/*绑定事件*/
	//删除全部udvset记录
	$("#deleteUDVSetBtn").click(deleteAllUdv);
	//单默认值填写所有input策略
	$('#singleDefaultBtn').click(singleDefaultFill);
	//组策略
	//var autoFillBtn=document.getElementById('autofillBtn');
	//autoFillBtn.addEventListener('click',fillAllTextInput,false);
	//将当前用户填写的值全部保存下来，作为组策略
	var storeUDVSetBtn=document.getElementById('storeUDVSetBtn');
	storeUDVSetBtn.addEventListener('click',storeUDVSet,false);
	
	
	
	//固定策略
	//用户自定义策略扩展

	$('#localStTestBtn').click(localStTest);
}
);

