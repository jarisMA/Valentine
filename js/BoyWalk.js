//走路

function BoyWalk() {
    var instanceX;
    var container = $("#content");
    // 页面可视区域
    var visualWidth = container.width();
    var visualHeight = container.height();

	//获取数据
	var getValue = function(className){
		var $elem = $('' + className + '');
	    //走路的路线坐标
	    return {
	    	height: $elem.height(),
	    	top: $elem.position().top
	    };
	};

    //路的y轴
    var pathY = function(){
    	var data = getValue('.a_background_middle');
    	return data.top + data.height / 2;
    }();

    var $boy = $('#boy');
    var boyHeight = $boy.height();
    // 修正小男孩的正确位置
    // 路的中间位置减去小孩的高度，25是一个修正值
    $boy.css({
    	top:pathY - boyHeight +25
    });

    // 暂停走路
    function pauseWalk() {
        $boy.addClass('pauseWalk');
    }

    // 恢复走路
    function restoreWalk() {
        $boy.removeClass('pauseWalk');
    }

    // css3的动作变化(原地踏步)
    function slowWalk() {
        $boy.addClass('slowWalk');
    }

    // 用transition做运动
    function startRun(options, walkTime) {
        var dfdPlay = $.Deferred();
        // 恢复走路
        restoreWalk();
        // 运动的属性
        $boy.transition(options,
        	{
        		duration:walkTime,
        		easing:'linear',
        		complete:function () {
        			dfdPlay.resolve();
        		}
        	}
        );
        return dfdPlay;
    }

    // 开始走路
    function walkRun(time, disX, disY) {
        time = time || 3000;   
        slowWalk();// 脚动作（原地踏步）

        // 开始走路
        var d1 = startRun({
            'left': disX + 'px',
            'top': disY ? disY + 'px': undefined
        }, time);
        return d1;
    }

    //走进商店
    function walkToShop(runtime) {
        var defer = $.Deferred;
        var doorObj = $('.door');
        //门的坐标
        var offsetDoor = doorObj.offset();
        var doorOffsetLeft = offsetDoor.left;
        //boy当前的坐标
        var offsetBoy = $boy.offset();
        var boyOffsetLeft = offsetBoy.left;

        //当前需要移动坐标                  
        instanceX = (doorOffsetLeft + doorObj.width() / 2) - (boyOffsetLeft + $boy.width() / 2);
        //开始走路
        var walkPlay = startRun({
            'transform': 'translateX(' + instanceX + 'px) scale(0.3,0.3)',
            'opacity': 0.1
        },runtime);
        walkPlay.done(function() {
            defer.resolve;
        });
        return defer;
    }

    //买花
    function buyFlower(){
        var defer = $.Deferred;
        setTimeout(function(){
            $boy.addClass('slowFlowerWalk');
            defer.resolve;
        },1000);
        return defer;
    }

    //走出商店
    function walkOutShop(runtime) {
        var defer = $.Deferred();
        restoreWalk();
        var walkPlay = startRun({
            'transform': 'translateX(' + instanceX + 'px) scale(1,1)',
            'opacity': 1
        },runtime);
        walkPlay.done (function(){
            defer.resolve();
        });
        return defer;
    }

    // 计算移动距离
    function calculateDist(direction, proportion) {
        return (direction == "x" ?
            visualWidth : visualHeight) * proportion;
    }

    return {
        // 开始走路
        walkTo: function(time, proportionX, proportionY) {
            var distX = calculateDist('x', proportionX);
            var distY = calculateDist('y', proportionY);
            return walkRun(time, distX, distY);
        },
        //走进商店
        toShop:function(){
            return walkToShop.apply(null,arguments);
        },
        //买花
        buyFlower: function(){
            return  buyFlower();
        },

        //走出商店
        outShop:function(){
            return walkOutShop.apply(null,arguments);
        },
        // 停止走路
        stopWalk: function() {
            pauseWalk();
        },
        setColor:function(value){
            $boy.css('background-color',value);
        },
        //获取男孩的宽度
        getWidth: function(){
            return $boy.width();
        },
        //复位初始状态
        resetOriginal: function(){
            this.stopWalk();
            //恢复图片
            $boy.removeClass('slowWalk slowFlowerWalk').addClass('boyOriginal');
        },
        //抱着花走路
        setFlowerWalk: function(){
            $boy.addClass('slowFlowerWalk');
        },
        // 转身动作
        rotate: function(callback) {
         restoreWalk();
         $boy.addClass('boy-rotate');
                   // 监听转身完毕
                   if (callback) {
                     $boy.on(animationEnd, function() {
                         callback();
                         $(this).off();
                     });
                 }
             }
    };
}