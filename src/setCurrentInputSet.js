function UserCurrentInput(name,className,id,index,value){
	this.name=name;
	this.className=className;
	this.id=id;
	this.index=index;
	this.value=value;	
	
}
function CurrentInputResult(){
	this.inputSize=0;
	this.list=new Array();//以UserCurrentInput为element的list
}

/*解析json，并且填写表单*/
function fill(json){
	var udvInputSet=$.parseJSON(json);
	for(var i=0;i<udvInputSet.list.length;i++){
		udvInput=udvInputSet.list[i];
		//填写表单 优先name 然后id 然后index+class是否对的上 都不行就index了
		if(udvInput.name&&udvInput.name!=""&&udvInput.name!="undefined"){
			$("input[name='"+udvInput.name+"']").val(udvInput.value);
		}else if(udvInput.id&&udvInput.id!=""&&udvInput.id!="undefined"){
			$("#"+udvInput.id).val(udvInput.value);
		}
		/*className这个存疑
		else if(!udvInput.className&&udvInput.className!=""){
			classNames=udvInput.className.split(" ");
			className="";
			for(var j=0;j<classNames.length;j++)
			{
				className=className+"."+classNames[j].trim()+" ";
			}
			$("input "+className)[0].val();
			$("input[type='text']")[udvInput.index].attr("class")
		}*/
		else{
			$("input[type='text']").eq(udvInput.index).val(udvInput.value);
		}

	}
}

/*
chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			currentInputJson=request.currentInputJson;
			console.log(currentInputJson);

			//解析json并填写
			fill(currentInputJson);
			//发送返回消息
			sendResponse({success: "true"});
});
*/

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		currentInputJson=request.currentInputJson;
			console.log(currentInputJson);
			//解析json并填写
			fill(currentInputJson);
			//发送返回消息
		sendResponse({success: "true"});
});
