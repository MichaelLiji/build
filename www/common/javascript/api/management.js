(function(Management, NonstaticClass, StaticClass){
this.Loader = (function(Storage, Index, HTML){
	function Loader(){};
	Loader = new StaticClass(Loader);

	Loader.properties({
		aboutBaoPiQi : function(){
			return new Index.Deep.AboutBaoPiQi("#aboutBaoPiQi");
		},
		account : function(){
			return new Index.Deep.Account("#account", new HTML("account_html", true));
		},
		addProject : function(){
			return new Index.Secondary.AddProject("#addProject", new HTML("addProject_color_html", true));
		},
		businessCard : function(){
			return new Index.Secondary.BusinessCard("#businessCard", new HTML("businessCard_html", true));
		},
		globalSearch : function(){
			return new Index.Deep.GlobalSearch("#globalSearch", new HTML("globalSearch_group_html", true));
		},
		load : function(name){
			var pagePanel = this.pageStorage.get(name);

			if(!pagePanel){
				pagePanel = this.pageStorage[name] = this[name]();
			}

			return pagePanel;
		},
		pageStorage : new Storage(),
		partner : function(){
			this.load("spp");
			return new Index.Home.Partner("#partner", new HTML("spp_partnerGroups_html", true));
		},
		project : function(){
			this.load("spp");
			return new Index.Home.Project("#project", new HTML("spp_project_html", true));
		},
		qrCode : function(){
			return new Index.Deep.QRCode("#QRCode", new HTML("QRCode_html", true));
		},
		schedule : function(){
			this.load("spp");
			return new Index.Home.Schedule("#schedule", new HTML("spp_scheduleSign_html", true));
		},
		spp : function(){
			var sppPanel = this.pageStorage.get("spp");

			return sppPanel ? sppPanel : new Index.Home.SPP("#SPP");
		},
		systemOption : function(){
			return new Index.Secondary.SystemOption("#systemOption");
		},
	});

	return Loader;
}(
	jQun.Storage,
	Bao.Page.Index,
	jQun.HTML
));

this.History = (function(List, Loader, redirectEvent){
	function History(){};
	History = new NonstaticClass(History, "Bao.API.Management.History", List.prototype);

	History.properties({
		back : function(){
			///	<summary>
			///	回到上一个记录。
			///	</summary>
			this.go(this[this.length - 1].opener, true);
		},
		getNameByIndex : function(idx){
			///	<summary>
			///	通过索引获取相对应历史记录名称。
			///	</summary>
			///	<param name="idx" type="number">对其添加或修改属性的对象。</param>
			return idx < this.length && idx > -1 ? this[idx].self : undefined;
		},
		go : function(name, _isBack){
			///	<summary>
			///	跳转到指定名称的页面。
			///	</summary>
			///	<param name="name" type="string">需要跳转的页面名称。</param>
			if(!name){
				name = this.homePage;
			}

			var idx = this.indexOf(name), lastIdx = this.length - 1;
			
			// 如果是当前页，或者记录条数为0
			if(lastIdx > -1){
				if(idx === lastIdx){
					return Loader.pageStorage[this[idx].self];
				}
				else {
					// 隐藏上一个panel
					Loader.pageStorage[this.getNameByIndex(lastIdx)].hide();
				}
			}

			var panel, old;

			redirectEvent.trigger(window);

			if(idx > -1){
				panel = Loader.pageStorage[this[idx].self];
				// 显示当前的panel
				panel.show(null, _isBack);
				old = this.splice(idx, 1);
				lastIdx = lastIdx - 1;
			}
			else {
				// 加载、初始化新panel信息
				panel = Loader.load(name);
				panel.show();
			}

			this.push({
				self : name,
				opener : _isBack ? (old ? old.name : null) : this.getNameByIndex(lastIdx)
			});
			return panel;
		},
		homePage : "project"
	});

	History.override({
		indexOf : function(name){
			var idx = -1;

			this.every(function(item, i){
				if(item.self === name){
					idx = i;
					return false;
				}
				
				return true;
			});

			return idx;
		}
	});

	return History.constructor;
}(
	jQun.List,
	this.Loader,
	// redirectEvent
	new jQun.Event("redirect", function(){
		this.attachTo(window);
	})
));

this.Timer = (function(setTimeout, clearTimeout){
	function Timer(_timeout){
		///	<summary>
		///	计时器(时间管理器)。
		///	</summary>
		///	<param name="_timeout" type="number">超时时间。</param>
		this.assign({
			timeout : _timeout || 200
		});
	};
	Timer = new NonstaticClass(Timer, "Bao.API.Management.Timer");

	Timer.properties({
		stop : function(_onbreak){
			///	<summary>
			///	停止计时器。
			///	</summary>
			///	<param name="_onbreak" type="function">如果未超时就被停止，那么会执行这个中断函数，否则不会执行。</param>
			var index = this.index;

			this.isEnabled = false;

			// 如果计时器已运行，说明已超时，则return
			if(index === -1)
				return;

			// 清除计时器
			clearTimeout(index);
			this.index = -1;

			if(typeof _onbreak === "function"){
				_onbreak();
			}
		},
		index : -1,
		isEnabled : false,
		timeout : 200,
		start : function(_ontimeout){
			///	<summary>
			///	开始计时器，该计时器需要人为手动停止。
			///	</summary>
			///	<param name="_ontimeout" type="function">超时所执行的函数。</param>

			// 如果已经开始，则return
			if(this.isEnabled)
				return;

			this.assign({
				index : -1,
				isEnabled : true
			});

			// 设置计时器
			this.index = setTimeout(function(){
				this.index = -1;

				if(!_ontimeout)
					return;

				_ontimeout();
			}.bind(this), this.timeout || 200);
		}
	});

	return Timer.constructor;
}(
	// setTimeout
	setTimeout,
	// clearTimeout
	clearTimeout
));

this.IntervalTimer = (function(Timer){
	function IntervalTimer(_timeout){ };
	IntervalTimer = new NonstaticClass(IntervalTimer, "Bao.API.Management.IntervalTimer", Timer.prototype);

	IntervalTimer.override({
		start : function(oninterval, _times){
			///	<summary>
			///	开始计时器，该计时器需要人为手动停止。
			///	</summary>
			///	<param name="oninterval" type="function">间隔时间所执行的函数。</param>
			///	<param name="_times" type="number">执行次数。</param>
			var intervalTimer = this,

				// 记录当前执行了多少次
				i = 0,

				isNaN = window.isNaN,

				start = Timer.prototype.start;

			// 如果不存在，则表明是无限次数
			if(!_times){
				i = NaN;
				_times = -1;
			}

			start.call(this, function(){
				// 如果是有限次数，则记录
				if(!isNaN(i)){
					i = i + 1;
				}

				// 执行间隔函数
				oninterval(i);

				// 如果该计时器在oninterval函数内被中断，就return
				if(!intervalTimer.isEnabled)
					return;

				intervalTimer.stop();

				// 达到最大次数
				if(i === _times)
					return;

				// 递归
				start.call(intervalTimer, arguments.callee);
			});
		}
	});

	return IntervalTimer.constructor;
}(
	this.Timer
));

Management.members(this);
}.call(
	{},
	Bao.API.Management,
	jQun.NonstaticClass,
	jQun.StaticClass
));