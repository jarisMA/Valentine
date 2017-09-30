var container = $('#content');
var swipe = new Swipe(container);
var visualWidth = container.width();
var visualHeight = container.height();


var lamp = {
	elem: $('.b_background'),
	bright: function(){
		this.elem.addClass('lamp-bright');
	},
	dark: function () {
		this.elem.removeClass('lamp-bright');
	}
};

var bird = {
	elem: $('.bird'),
	fly: function () {
		this.elem.addClass('bird-Fly');
		this.elem.transition({
			'right': $('#content').width()
		},15000,'linear');
	}
};

var getValue = function(className){
	var $elem = $('' + className + '');
    //走路的路线坐标
    return {
    	height: $elem.height(),
    	top: $elem.position().top
    };
};
var bridgeY = function(){
	var data = getValue('.c_background_middle');
	return data.top;
}();
var girl = {
	elem: $('.girl'),
	getHeight: function() {
		return this.elem.height();
	},
    // 转身动作
    rotate: function() {
    	this.elem.addClass('girl-rotate');
    },
    setOffset: function() {
    	this.elem.css({
    		left: visualWidth / 2,
    		top: bridgeY - this.getHeight()
    	});
    },
    getOffset: function() {
    	return this.elem.offset();
    },
    getWidth: function() {
    	return this.elem.width();
    }
};
// 修正小女孩位置
girl.setOffset();

// 动画结束事件
var animationEnd = (function() {
	var explorer = navigator.userAgent;
	if (~explorer.indexOf('WebKit')) {
		return 'webkitAnimationEnd';
	}
	return 'animationend';
})();

var logo = {
	elem: $('.logo'),
	run: function() {
		this.elem.addClass('logolightSpeedIn')
		.on(animationEnd, function() {
			$(this).addClass('logoshake').off();
		});
	}
};

function doorAction(left,right,time){
	var $door = $('.door');
	var doorLeft = $('.door-left');
	var doorRight = $('.door-right');
	var defer = $.Deferred();
    //等待开门完成
    var complete = function(){
    	defer.resolve();
    };
    doorLeft.animate({left: left}, time,complete);
    doorRight.animate({left: right}, time,complete);
    return defer;
}
//开门
function openDoor() {
	return doorAction('-50%','100%',2000);
}
//关门
function shutDoor(){
	return doorAction('0%','50%',2000);
}


	var snowflakeURl = [
        'images/snowflake/snowflake1.png',
        'images/snowflake/snowflake2.png',
        'images/snowflake/snowflake3.png',
        'images/snowflake/snowflake4.png',
        'images/snowflake/snowflake5.png',
        'images/snowflake/snowflake6.png'
    ];

    ///////
    //飘雪花 //
    ///////
    function snowflake() {
        // 雪花容器
        var $flakeContainer = $('#snowflake');

        // 随机六张图
        function getImagesName() {
            return snowflakeURl[[Math.floor(Math.random() * 6)]];
        }
        // 创建一个雪花元素
        function createSnowBox() {
            var url = getImagesName();
            return $('<div class="snowbox" />').css({
                'width': 41,
                'height': 41,
                'position': 'absolute',
                'backgroundSize': 'cover',
                'zIndex': 100000,
                'top': '-41px',
                'backgroundImage': 'url(' + url + ')'
            }).addClass('snowRoll');
        }
        // 开始飘花
        setInterval(function() {
            // 运动的轨迹
            var startPositionLeft = Math.random() * visualWidth - 100,
                startOpacity    = 1,
                endPositionTop  = visualHeight - 40,
                endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
                duration        = visualHeight * 10 + Math.random() * 5000;

            // 随机透明度，不小于0.5
            var randomStart = Math.random();
            randomStart = randomStart < 0.5 ? startOpacity : randomStart;

            // 创建一个雪花
            var $flake = createSnowBox();

            // 设计起点位置
            $flake.css({
                left: startPositionLeft,
                opacity : randomStart
            });

            // 加入到容器
            $flakeContainer.append($flake);

            // 开始执行动画
            $flake.transition({
            	//结束点的位置
                top: endPositionTop,
                left: endPositionLeft,
                opacity: 0.7
            }, duration, 'ease-out', function() {
                $(this).remove(); //结束后删除
            });
            
        }, 200);
    }

// 音乐配置
var audioConfig = {
    enable: true, // 是否开启音乐
    playURl: 'music/happy.wav', // 正常播放地址
    cycleURL: 'music/circulation.wav' // 正常循环播放地址
};

//背景音乐 //
function Hmlt5Audio(url, isloop) {
    var audio = new Audio(url);
    audio.autoPlay = true;
    audio.loop = isloop || false;
    audio.play();
    return {
        end: function(callback) {
            audio.addEventListener('ended', function() {
                callback();
            }, false);
        }
    };
}


$(function(){
        //太阳公转
        var boy = BoyWalk();
        var audio1 = Hmlt5Audio(audioConfig.playURl);
        audio1.end(function() {
            Hmlt5Audio(audioConfig.cycleURL, true);
        });
        $('#sun').addClass('rotation');
        //飘云
        $('.cloud:first').addClass('cloud1Anim');
        $('.cloud:last').addClass('cloud2Anim');
        boy.walkTo(2500, 0.2).then(function(){
            //第一次走路完成
            swipe.scrollTo($('#content').width(),8000);
            bird.fly();
        }).then(function(){
            return boy.walkTo(7000, 0.5);//return限制有先后顺序
        }).then(function() {
            //暂停走路
            boy.stopWalk();
        }).then(function() {
            //开门
            return openDoor();
        }).then(function() {
            //开灯
            lamp.bright();
        }).then(function() {
            //进商店
            return boy.toShop(800);
        }).then(function(){
            //买花
            return boy.buyFlower();
        }).then(function() {
            //出商店
            return boy.outShop(800);
        }).then(function() {
            
            shutDoor();
        }).then(function(){
            //灯暗
            lamp.dark();
        }).then(function(){
            swipe.scrollTo($('#content').width()*2,5000);
        }).then(function(){
            //第一次走路到桥底边left,top
            boy.walkTo(5000, 0.15);
        }).then(function() {
            // 第二次走路到桥上left,top
            return boy.walkTo(5000, 0.25, (bridgeY - girl.getHeight()) / visualHeight);
        })
        .then(function() {
            // 实际走路的比例
            var proportionX = (girl.getOffset().left - boy.getWidth() + girl.getWidth() / 3) / visualWidth;
            // 第三次桥上直走到小女孩面前
            return boy.walkTo(2000,proportionX);
        }).then(function() {
            // 图片还原原地停止状态
            boy.resetOriginal();
        }).then(function() {
            // 增加转身动作 
            setTimeout(function() {
                girl.rotate();
                boy.rotate(function() {
                    // 开始logo动画
                    logo.run();
                });
            }, 2000);
        }).then(function(){
            snowflake();
        });
    });