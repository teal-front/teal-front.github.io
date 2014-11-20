/*
 *   var p_info={pack:false,restrict:true,easy_close:true,closable:true,force_center:true,buttons:{}};
     $('#edit_replay_dialog').YY_dialog(p_info);
     $('#edit_replay_dialog').YY_dialog('hide');
     $('#edit_replay_dialog').YY_dialog('show');
 */
    $.dialog=function(p){
        var s={
            width:'auto',
            height:'auto',
            maxWidth:800,
            maxHeight:600,
            draggable:false,
            close:false,
            closable:true,
            //title:false,
            dragger:false,
            pack:true,
            restrict:true,
            easyClose:false,
            autoClose:false,
            autoShow:true,
            forceCenter:false,
            zIndex:10000,
            posX:0,
            posY:0,
            buttons: [
            	{
            		"name": "confirm"
            	}
            ],
            mask:{color:'#000',optical:0.5},
            hideScroll: false,
            showClose:false
        };
        var o = $("<div>" + p.content + "</div>").appendTo("body");
        var methods={
            init:function(p){
                s = $.extend(s, p);
                o.data('options',s);
                var dId=o.attr('id')?o.attr('id'):parseInt(Math.random()*1000000);
                var d=$('<div id="YY_dialog_ctn_'+dId+'" class="YY_dialog_ctn"></div>');
                o.data('dialogId',dId);

                $('body').append(d);
                d.css({'overflow':'hidden',border:'1px solid #20c058','background':'#fff','position':'absolute','z-index':s.zIndex,'display':'none','overflow':'hidden'});
                if (s.forceCenter) d.attr('position', 'center');
                var c=$('<div class="dialog"></div>');//dialog内容容器
                d.append(c);
                var oS=methods.calculate(o);//对话框原始内容对象
                if (s.closable&&s.pack||s.showClose){
                    c.append('<b>×</b>');
                    c.children('b').click(methods.hide).css({'color':'#000','position':'absolute','cursor':'pointer','text-align':'center','width':'16px','height':'16px','line-height':'16px','top':'7px','right':'7px','overflow':'hidden'});
                }
                if (s.pack){
                    if (s.title && s.title !== ''){
                        c.append('<h2>'+s.title+'</h2>');
                        if (s.draggable) d.drage({handle:'h2'/*,drag:s.drag,dragStart:s.dragStart,dragStop:s.dragStop*/});
                        c.children('h2').css({'margin':'0','color':'#666','background':'#efefef','padding-left':'10px','line-height':'30px','height':'30px','font-size':'14px'}).get(0).onselectstart = new Function("return false");
                    }
                    var cC=$('<div class="YY_dialog_content" style="white-space:normal;padding:25px; word-break:break-all;"></div>');
                    c.append(cC);
                    cC.find('.YY_dialog_content').css({'width':oS.dW,'height':oS.dH,'padding':'5px','background':'#fff'});
                    if (o.length==1)cC.append(o);
                }else{
                    c.width(oS.dW).height(oS.dH);
                    c.append(o);
                }
                if (s.buttons) {
                    c.append('<div class="mt20 f-tar action"></div>');
                    for (n in s.buttons) {
                        if (s.buttons[n].name != '') {
                            //c.children('.action').append('<button>'+s.buttons[n].name+'</button>');
                            if (s.buttons[n].name === "confirm") {
                            	c.children('.action').append('<a href="javascript:;" class="btn1 btn-theme5 ml10 color4">确定</a>');
                            } else if (s.buttons[n].name === "cancel") {
                            	c.children('.action').append('<a href="javascript:;" class="btn1 btn-theme4">取消</a>');
                            }
                            var btnO=c.children('.action').children('a:last');
                            if (s.buttons[n].action == "close") {
                                btnO.click(methods.hide);
                            } else {
                            	btnO.click(function () {
                                	(s.buttons[n].action || $.noop)();
                                	methods.hide();
                                });
                            }                                
                        }
                    }
                }
                if (s.autoShow)methods.show();
            },
            calculate:function(o){
                var dO=$(document);
                var wO=$(window);
                var result={sT:dO.scrollTop(),sL:dO.scrollLeft(),wH:wO.height(),wW:wO.width()};
                if (typeof o!='undefined'){
                    result.dW=o.outerWidth(true);
                    result.dH=o.outerHeight(true);
                }
                return result;
            },
            show:function(){
                var s=o.data('options');
                $('#YY_dialog_ctn_'+o.data('dialogId')).show();
                if (this.pos_x == null) methods.centerDialog();
                $("#YY_dialog_ctn_" + this.content_id).show().css('opacity',0).stop().animate({opacity:1},500);
                if (this.easy_close){
                    $(document).bind('keydown',esc_close);
                    $('#YY_mask').attr('title','点击此处即可快速[关闭]对话框').bind('click',this.close_dialog);
                }
                if (this.auto_close){
                    $('#YY_dialog_ctn_'+this.content_id).find('s').show().find('a').html(this.auto_close);
                    setTimeout($.proxy(this.auto_close_count,this),1000);
                }else{
                    $('#YY_dialog_ctn_'+this.content_id).find('s').hide();
                }
                if (s.hideScroll){
                    $('html').css({'position':'relative','height':$(window).height()});
                    $('html,body').css({'overflow':'hidden'});
                    $('body').css({'margin-top':-$('body').scrollTop(),height:$(window).height()+$('body').scrollTop()}).scrollTop(0);
                }
                if (s.restrict) {
                    methods.showMask();
                    $(window).bind('resize',methods.setMask);
                    $(window).bind('scroll',methods.setMask);
                }
            },
            hide:function(){
                var s=o.data('options');
                if (typeof (s.close) == 'function')s.close();
                if (s.hideScroll){
                    $('html').css({'position':'','height':'auto'});
                    var st=parseInt($('body').css('margin-top').replace('px',''));
                    $('body').css({'margin-top':0,height:'auto'});
                    $('html,body').css({'overflow':'auto'});
                    $('body').scrollTop(-st);
                }
                if (s.closable||s.closable=='true'){
                    //s.hideSelect(false);
                    $('#YY_dialog_ctn_' + o.data('dialogId')).stop().fadeOut();
                    $('#YY_mask').stop().fadeOut();
                    if (s.easyClose){
                        $(document).unbind('keydown',methods.escClose);
                        $('#YY_mask').unbind('click',methods.close);
                    }
                }else{
                    alert('此对话框内的操作在完成之前对话框将无法关闭，请继续');
                }
                if (s.restrict) {
                    $(window).unbind('resize',methods.setMask);
                    $(window).unbind('scroll',methods.setMask);
                }

            },
            centerDialog:function(){
                var s=o.data('options');
                var _st=$(document).scrollTop();
                var _sl=$(document).scrollLeft();
                var dO=$('#YY_dialog_ctn_'+o.data('dialogId'));
                var dS=methods.calculate(dO);
                var _top = Math.floor(_st + (dS.wH - dS.dH) / 2);
                var _left = Math.floor(_sl + (dS.wW - dS.dW) / 2);
                if (dS.wW<dS.dW)_left=0;
                if (dS.wH<dS.dH)_top=0;
                dO.css({'top':_top,'left':_left});
            },
            escClose:function(){

            },
            //show mask layer
            showMask:function(){
                var s=o.data('options');
                var mskO=$('#YY_mask');
                if (mskO.length==0) {
                    mskO=$('<div id="YY_mask"></div>');
                    $('body').append(mskO);
                }
                mskO.show().css({'cursor':'wait','top':0,'left':0,'z-index':s.zIndex-1,'background':'#000','position':'absolute','opacity':'0.5'});
                methods.setMask();
            },
            //fix mask width , height & position
            setMask:function(){
                var s=o.data('options');
                var wO=methods.calculate();
                var mskO=$('#YY_mask');
                mskO.css({width:wO.sL+wO.wW,height:wO.sT+wO.wH});
                if (s.hideScroll){
                    mskO.css({width:wO.sL+wO.wW-$('body').css('margin-left').replace('px',''),height:wO.sT+wO.wH});
                }
            }
        };
        methods.init(p);

        return $;
    };