;define(function(require,exports,module){

    var FriendsView = Backbone.View.extend({
        el:$('#friends'),
        initialize:function(){
//            _.bindAll(this,'');
            var that = this;
            $(window).bind('socAll',function(event,data){
                that.addFriSocId(data);
                console.log(data);
            });
        },
        events:{
            'click #friList':"addFriendChannel"
        },
        dom:{
            friList:'#friList'
        },
        addFriendChannel:function(event){
            var friInfo = {
                    name:$(event.target).parent('li').find('span').text(),
                    socId:$(event.target).parent('li').data("userid")
                };
            $(window).trigger('addChannel',[friInfo]);
        },
        addFriSocId:function(data){
            var that = this;
            var v = 0;
            $.each(data,function(i,n){
                $(that.dom.friList).children('li').eq(v).data("userid", n.socketId);
                v++;
                console.log($(that.dom.friList).children('li').eq(v).data("userid"));
            })
        }
    });

    module.exports = FriendsView;
})