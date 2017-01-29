/**
 * Created by Administrator on 14-5-11.
 */
!function () {
    var supportPostMessage = "postMessage" in window,
        prefix = "chat-";

    var Target = function (target, name) {
        this.target = target;
        this.name = name;
    };
    if (supportPostMessage) {
        Target.prototype.send = function (msg) {
            this.target.postMessage(msg, '*');
        };
    } else {
        Target.prototype.send = function (msg) {
            //console.log(prefix + this.name);
             //this.target.navigator[prefix + this.name](msg);
             this.target["zm"](msg);
        };
    }


    var Messenger = function (messengerName, projectName) {
        this.targets = {};
        this.listenFuncs = [];
        this.name = messengerName;
        prefix = projectName || prefix;
        this._initListen();
    };
    Messenger.prototype._initListen = function () {
        var self = this;
        var messageCallback = function (msg) {
            if (msg instanceof Object && msg.data) {
                msg = msg.data;
            }
            for (var i = 0, l = self.listenFuncs.length; i < l; i++) {
                self.listenFuncs[i](msg);
            }
        };
        if (supportPostMessage) {
            if ("attachEvent" in document) {
                window.attachEvent("onmessage", messageCallback);
            } else if ("addEventListener" in document) {
                window.addEventListener("message", messageCallback, false);
            }
        } else {
            //console.log(prefix + this.name);
            //window.navigator[prefix + this.name] = messageCallback;
            window["zm"] = messageCallback;
        }
    };
    Messenger.prototype.addTarget = function (target, name) {
        var targetObj = new Target(target, name);
        this.targets[name] = targetObj;
    };
    Messenger.prototype.addListen = function (callback) {
        this.listenFuncs.push(callback);
    };
    Messenger.prototype.clearListen = function () {
        this.listenFuncs = [];
    };
    Messenger.prototype.send = function (msg) {
        for (var targetName in this.targets) {
            if (this.targets.hasOwnProperty(targetName)) {
                this.targets[targetName].send(msg);
            }
        }
    };

    window.Messenger = Messenger;
}();