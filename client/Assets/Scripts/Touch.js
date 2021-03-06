cc.Class({
    extends: cc.Component,

    properties: {
        tank: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        this.last_touch = null;
        this.is_face = null;
        this.pre_move = new Array();
        this.tank = this.tank.getComponent('Tank');
        var begin = function (event){
            // 模拟器，手机上能多点触摸，浏览器取到的是undefined
            var touchID = event.touch.getID();
            var location = event.touch.getLocation();
            // 判断，如果点击区域是车身，则接下来move是移动、否则，则是炮塔转动到瞄准该位置
            var is_on_body = this.tank.IsOnBody(location);
            if (is_on_body){
                // console.log("start move!");
                this.last_touch = touchID;
            }
            else{
                // console.log("face target!");
                this.is_face = touchID;
                this.tank.face(location.x, location.y);
            }
        };
        var move = function (event){
            var touchID = event.touch.getID();
            var location = event.touch.getLocation();
            // console.log("touchend move,touch id:" + touchID + ";:"+this.last_touch +"|"+this.is_face);

            if (touchID === this.is_face){
                // cc.log("move face!");
                this.tank.face(location.x, location.y);
            }
            else if(touchID === this.last_touch){
                // this.pre_move.unshift(location);
                // console.log("id:" + touchID + ";" + this.touchID);
            }
        };
        var end = function (event){
            var touchID = event.touch.getID();
            var location = event.touch.getLocation();
            // 如果是移动，松开手就开始移动
            if (touchID === this.last_touch){
                // console.log("end move touch,x:" + location.x + ",y:" + location.y);
                this.tank.move(location);
                this.last_touch = null;
            }
            // 判断，如果炮塔旋转完毕，已瞄准触屏方向，松开就开炮
            else{
                this.tank.fire();
                this.face = null;
            }
        };
        this.node.on(cc.Node.EventType.TOUCH_START, begin, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, move, this);
        this.node.on(cc.Node.EventType.TOUCH_END, end, this);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        // console.log("touch tick!" + dt);
        // if(this.pre_move.length !== 0){
        //     var location = this.pre_move.pop();
        //     this.tank.move(location);
        // }
    },
});
