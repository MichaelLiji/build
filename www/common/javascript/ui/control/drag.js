(function(Drag, NonstaticClass, StaticClass, Panel, HTML, IntervalTimer){
this.Scroll = (function(scrollPanel, body){
	function Scroll(){
		///	<summary>
		///	滚动条。
		///	</summary>
		var Scroll = this;

		this.assign({
			buttonStyle : scrollPanel.find(">button").style,
			timer : new IntervalTimer(500)
		});

		jQun(window).attach({
			beforehide : function(){
				Scroll.hidePanel();
			},
			settop : function(e){
				Scroll.reposition(e.overflowPanel);
			}
		});
	};
	Scroll = new StaticClass(Scroll, "jQun.Scroll", {
		buttonStyle : undefined,
		timer : undefined
	});

	Scroll.properties({
		hidePanel : function(){
			///	<summary>
			///	隐藏滚动条。
			///	</summary>
			if(!this.isShow)
				return;

			this.timer.stop();
			this.panel.hidden = true;
			this.panel.remove();
			this.isShow = false;
		},
		isShow : false,
		panel : scrollPanel,
		panelStyle : scrollPanel.style,
		reposition : function(overflowPanel){
			///	<summary>
			///	重新定位。
			///	</summary>
			///	<param name="overflowPanel" type="Bao.API.DOM.OverflowPanel">溢出的元素。</param>
			var buttonStyle = this.buttonStyle,
			
				parentEl = overflowPanel.parent(),

				rect = parentEl[0].getBoundingClientRect(),

				parentHeight = parentEl.height(),

				height = overflowPanel.height();
				
			jQun.forEach({
				top : rect.top + 5,
				left : rect.left + rect.width - 10,
				height : parentHeight - 10
			}, function(value, name){
				this[name] = value + "px";
			}, this.panelStyle);

			// 取父容器的content的高度要使用 height 方法
			buttonStyle.height = (parentHeight * 100 / height) + "%";
			buttonStyle.top = overflowPanel.getTop() * -100 / height + "%";
			
			if(this.times > 0){
				this.times--;
			}
			this.showPanel();
		},
		showPanel : function(){
			///	<summary>
			///	显示滚动条。
			///	</summary>
			if(this.isShow)
				return;

			var Scroll = this;

			this.isShow = true;
			this.panel.appendTo(body);
			this.panel.hidden = false;

			this.timer.start(function(){
				if(Scroll.times++ < 2)
					return;
			
				Scroll.hidePanel();
			});
		},
		times : 0
	});

	return Scroll;
}(
	// scrollPanel
	new HTML([
		'<aside class="scroll normalRadius" hidden>',
			'<button class="normalRadius"></button>',
		'</aside>'
	].join("")).create(),
	document.body
));

this.Navigator = (function(Timer, panelHtml, tabItemsHtml){
	function Navigator(){
		///	<summary>
		///	导航。
		///	</summary>
		var navigator = this;

		this.combine(panelHtml.create());

		this.assign({
			contentEl : this.find(">nav"),
			tabEl : this.find(">aside>ol"),
			timer : new IntervalTimer(70)
		});

		this.attach({
			click : function(e){
				var buttonEls = navigator.buttonEls;

				if(!buttonEls)
					return;

				var target = e.target;

				if(!buttonEls.contains(target))
					return;

				navigator.focusTab(jQun(target).get("idx", "attr"));
			}
		});
	};
	Navigator = new NonstaticClass(Navigator, "Bao.UI.Control.Drag.Navigator", Panel.prototype);

	Navigator.properties({
		buttonEls : undefined,
		content : function(htmlStr){
			///	<summary>
			///	设置导航的主体内容。
			///	</summary>
			/// <param name="htmlStr" type="string">主体内容html字符串</param>
			this.find(">nav").innerHTML = htmlStr;
		},
		contentEl : undefined,
		focusTab : function(idx){
			///	<summary>
			///	切换tab。
			///	</summary>
			/// <param name="idx" type="number">tab的索引</param>
			var tabEl = this.tabEl, focusEl = tabEl.find('button[idx="' + idx + '"]');

			if(focusEl.length === 0)
				return;

			var classList = focusEl.classList;

			if(classList.contains("focused"))
				return;

			var timer = this.timer, contentEl = this.contentEl,
				
				times = 20, round = Math.round,
				
				left = (contentEl.get("left", "css").split("px").join("") - 0) || 0,

				w = (contentEl.width() * idx * -1 - left) / times;

			if(timer.isEnabled){
				timer.stop();
			}
			
			timer.start(function(i){
				contentEl.set("left", round(left + w * i) + "px", "css");
			}, times);

			tabEl.find('button.focused').classList.remove("focused");
			classList.add("focused");
		},
		tab : function(len){
			///	<summary>
			///	设置选项卡。
			///	</summary>
			/// <param name="len" type="number">选项卡的个数</param>
			var tabEl = this.tabEl;
			
			tabEl.innerHTML = tabItemsHtml.render({ length : len });
			this.buttonEls = tabEl.find("button");
		},
		tabEl : undefined,
		timer : undefined
	});

	return Navigator.constructor;
}(
	Bao.API.Management.Timer,
	// panelHtml
	new HTML([
		'<div class="navigator onlyBorderBottom lightBdColor">',
			'<nav></nav>',
			'<aside>',
				'<ol class="inlineBlock"></ol>',
			'</aside>',
		'</div>'
	].join("")),
	// tabItemsHtml
	new HTML([
		'@for(length ->> idx){',
			 '<li>',
				'<button class="normalRadius" idx="{idx}"></button>',
			 '</li>',
		'}'
	].join(""))
));

Drag.members(this);
}.call(
	{},
	Bao.UI.Control.Drag,
	jQun.NonstaticClass,
	jQun.StaticClass,
	Bao.API.DOM.Panel,
	jQun.HTML,
	Bao.API.Management.IntervalTimer
));