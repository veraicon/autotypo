chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
	var singleDefaultValue=request.singleDefault;
	console.log(singleDefaultValue);
	$("input:text").each(function(){
		$(this).val(singleDefaultValue);
	});
	//document.getElementsByName("shopManager_name")[0].value=singleDefaultValue;
	sendResponse({farewell: "goodbye"});
  });



