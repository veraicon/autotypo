function UserCurrentInput(name,className,id,index,value){
	this.name=name;
	this.className=className;
	this.id=id;
	this.index=index;
	this.value=value;	
	
}
function CurrentInputResult(){
	this.success="true";
	this.inputSize=0;
	this.list=new Array();
	this.add=add;
	this.setFail=setFail;
	this.setSuccess=setSuccess;
	function add(userCurrentInput){
		this.list[this.list.length]=userCurrentInput;
		this.inputSize=this.inputSize+1;
	}
	function setFail(){
		this.success="false";
		this.inputSize=0;
		this.list=null;
	}
	function setSuccess(){
		this.success="true";
	}
}
var currentInputResult=new CurrentInputResult();
//取得当前全部input值
$("input[type='text']").each(function(i){
	name=$(this).attr("name");
	className=$(this).attr("class");
	id=$(this).attr("id");
	value=$(this).val();
	userCurrentInput=new UserCurrentInput(name,className,id,i,value);
	currentInputResult.add(userCurrentInput);
});
currentInputResult.setSuccess();
//组成json
var currentInputResultJson=JSON.stringify(currentInputResult);
console.log(currentInputResultJson);
//消息传回
chrome.extension.sendMessage({currentInputResultJson: currentInputResultJson}, function(response) {
  console.log(response.success); 
});