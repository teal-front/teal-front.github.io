/*
 * author: teal
 * time: 07/27/2014
 * description:
 * 绑定单个按钮，实现无刷新上传并显示图片
 * 支持进度条，暂不支持取消上传
 */
var RealTimeView = function (bindBtn, showWrap, progressBar, actionURL) {
    this.bindBtn = bindBtn; //原始点击按钮
    this.showWrap = showWrap; //上传完毕用于显示图片的IMG元素
    this.progressBar = progressBar; //显示上传进度
    this.actionURL = actionURL;
    this.UPLOAD_PROGRESS_NAME = "test";

    if (typeof window.FormData == "function") {
        this.uploadType = "formData";
    } else {
        this.uploadType = "iframe";
        this.callbackName = "UPLOAD_" + (new Date()).getTime();
        this.actionURL += "?callback=" + this.callbackName;
        window[this.callbackName] = bind(this.uploadCompleteHandler, this);
    }
    this.initDOM();
    this.bindEvents();
};
RealTimeView.prototype.initDOM = function () {
    //create input:file
    if (this.uploadType == "formData") {
        this._wrap('<input class="file" name="uploadfile" type="file" multiple accept="image/*"/>');
    } else {
        //create form & hidden iframe
        this._wrap('<form method="post" enctype="multipart/form-data" action="' + this.actionURL + '" name="form-upload" target="hidden_iframe" class="form-file">' +
            '<input type="hidden" name="' + SESSION_UPLOAD_PROGRESS_NAME + '" value="'+ this.UPLOAD_PROGRESS_NAME +'" />' +
            '<input type="file" name="uploadfile" class="file"/>' +
            '<iframe id="hidden_iframe" name="hidden_iframe" src="about:blank" style="display:none;"></iframe>' +
            '</form>');
    }
};
RealTimeView.prototype.bindEvents = function () {
    var that = this,
        xhr;

    if (this.uploadType == "iframe") {
        this.oFileBtn.onchange = function () {
            if (this.value == "") return;
            that.oForm.submit();
            that.startProgress();
        };
    } else {
        this.oFileBtn.onchange = function () {
            if (this.value == "") return;
            var data = new FormData();
            data.append("uploadfile", this.files[0]);
            data.append("type", "formData");
            xhr = ajax({
                type: "post",
                url: that.actionURL,
                data: data,
                completeHandler: function (url) {
                    that.uploadCompleteHandler(url);
                },
                progressHandler: function (e) {
                    if (e.lengthComputable) {
                        var percent = Math.ceil(e.loaded / e.total * 100);
                        that.progressBar.style.width = percent + "%";
                    }
                }
            });
        };
    }
    //取消上传
    this.oCancelBtn && (this.oCancelBtn.onclick = function () {
        if (that.uploadType == "formData") {
            xhr.onblur();
        } else {
            ajax({
                type: "get",
                url: that.actionURL + "?action=cancelUpload"
            });
        }
    });
};
RealTimeView.prototype.startProgress = function () {
    var that = this;
    this.progressBar.style.width = 0;

    if (this.uploadType === "iframe") {
        !function () {
            var args = arguments;
            ajax({
                type: "get",
                url: that.actionURL + "&" + SESSION_UPLOAD_PROGRESS_NAME + "=" + that.UPLOAD_PROGRESS_NAME + "&_t=" + Date.now(),
                completeHandler:function (data) {
                    console.log("data: " + ":type " + typeof data + "value: " + data);
                    var percent = parseInt(data);
                    console.log(percent);
                    that.progressBar.style.width = percent + "%";
                    if (percent < 100) {
                        setTimeout(args.callee, 1000);
                    } else {
                        console.log("uploaded complete.");
                    }
                }
            });
        }();
    }
};
RealTimeView.prototype.uploadCompleteHandler = function (url) {
    this.showWrap.src = url;
    this.showWrap.style.display = "inline-block";
};
RealTimeView.prototype._wrap = function (appendHTML) {
    //create bindBtn wrap
    var oWrap = document.createElement("div");
    oWrap.className = "upload-wrap";
    oWrap.style.width = this.bindBtn.offsetWidth + "px";
    oWrap.style.height = this.bindBtn.offsetHeight + "px";

    //create form or input:file
    var oDiv = document.createElement("div");
    oDiv.innerHTML = appendHTML;
    var oField = oDiv.lastChild;

    //reposition
    this.bindBtn.parentNode.insertBefore(oWrap, this.bindBtn);
    oWrap.appendChild(this.bindBtn);
    oWrap.appendChild(oField);
    oDiv = null;

    if (this.uploadType == "iframe") {
        this.oForm = oField;
        this.oFileBtn = this.oForm.uploadfile;
    } else {
        this.oFileBtn = oField;
    }
};

//---------------------------helpers
function bind (fn, context) {
    return function () {
        fn.apply(context, arguments);
    };
}

function getById (id) {
    return document.getElementById(id);
}

function ajax (options) {
    options.type || (options.type = "get");
    options.data || (options.data = null);

    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open(options.type, options.url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            options.completeHandler(xhr.responseText);
        }
    };
    if (options.progressHandler) {
        xhr.upload.onprogress = options.progressHandler;
    }
    if (options.cancelHandler) {
        xhr.onblur = options.cancelHandler;
    }
    xhr.send(options.data);

    return xhr;
}