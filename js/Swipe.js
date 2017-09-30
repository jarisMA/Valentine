//页面滑动
//封装API
function Swipe(container){
	var swipe = {};//滑动对象
	var element = container.find(":first");//获取container的第一个子节点ul
	var slides = element.children();//获取ul下的子节点

	//获取容器尺寸
	var width = container.width();
	var height = container.height();
		
	//设置li页面总宽度
	element.css({
		width: (slides.length*width) + 'px',
		height: height + 'px'
	});

	//设置每一个li页面的宽度
	$.each(slides,function(index) {
		var slide = slides.eq(index);//获取到每一个li元素
		slide.css({//设置每一个li的尺寸
			width: width + 'px',
			height: height + 'px'
		});
	});

	//监控完成移动
	swipe.scrollTo = function (x,speed) {
		//执行动画移动
		element.css({// 在speed秒的时间内，向左移动X的位置
			'transition-timing-function':'linear',
            'transition-duration': speed + 'ms',
            'transform':'translate3d(-'+x+'px,0px,0px)'
		});
		return this;
	}
	return swipe;
}