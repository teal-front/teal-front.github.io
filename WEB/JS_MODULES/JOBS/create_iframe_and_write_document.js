function (iframeContent, iframeId) {
	var newiframe = document.createElement("iframe");  
	newiframe.id = iframeId || "new_iframe_" + (new Date()).getTime();
	newiframe.src = "about:blank";
	newiframe.scrolling = "no";
	newiframe.frameborder = "0";
	newiframe.style.cssText = "position:absolute;top:200px;left:50%;width:200px;height:200px;margin-left:-100px;border:1px solid #ccc";
	document.body.appendChild(newiframe);

	var idocument = newiframe.contentDocument || newiframe.contentWindow.document;
	idocument.open("text/html", "replace");
	idocument.write(iframeContent);
	idocument.close();
}
