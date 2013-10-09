(function(Time, NonstaticClass, Panel, HTML, Event){
this.DateTable = (function(OverflowPanel, Date, tablePanelHtml, dateTableHtml, focusDateEvent, focusMonthEvent){
	function DateTable(){
		///	<summary>
		///	日期表格。
		///	</summary>
		var dateTable = this;

		this.combine(tablePanelHtml.create());
		// 采用溢出功能
		new OverflowPanel(this[0]);

		this.attach({
			userclick : function(e){
				var dateEl = jQun(e.target).between('li[datestatus]', this);

				if(dateEl.length === 0)
					return;

				dateTable.focus(dateEl.get("time", "attr"));
			},
			leaveborder : function(e){
				// 如果偏离边框的距离小于2行半就return 45*2.5=112.5
				if(e.offsetBorder < 110)
					return;

				var toFocusEl = dateTable.find(
						'li:' + (e.direction === "top" ? "first" : "last") + '-child ol > li[datestatus="0"]'
					);

				toFocusEl.splice(1);

				dateTable.focus(toFocusEl.get("time", "attr") - 0);
			}
		});
	};
	DateTable = new NonstaticClass(DateTable, null, Panel.prototype);

	DateTable.properties({
		addMonth : function(time){
			///	<summary>
			///	添加一个月的表格。
			///	</summary>
			/// <param name="time" type="number">当月第一天的0时0分的毫秒数</param>
			var firstDate = new Date(time);
			
			// 设置本月第一天
			firstDate.setDate(1);

			// 如果恢复已有月份数据成功
			if(this.restore(firstDate.getTime()))
				return;
			
			var lastDate = new Date(time),

				monthData = [], month = firstDate.getMonth();

			// 设置本月最后一天
			lastDate.setMonth(month + 1, 0);

			// 数据
			for(
				var i = firstDate.getDay() * -1,
					l = lastDate.getDay(),
					// l === 6：判断这个月的最后一天是否是星期6，决定这周包含了其它月的日期
					j = lastDate.getDate() - (l === 6 ? 0 : l + 1),
					k = new Date(new Date(firstDate.getTime()).setDate(i + 1));
				i < j;
				i++	
			){
				var d = k.getDate();

				monthData.push({
					time : k.getTime(),
					date : d,
					day : k.getDay(),
					// 0 : 表示本月日期，-1表示上个月日期
					dateStatus : i < 0 ? "-1" : "0"
				});

				k.setDate(d + 1);
			}

			// 渲染数据
			dateTableHtml.create({
				monthData : monthData,
				month : month + 1,
				year : firstDate.getFullYear(),
				time : firstDate.getTime(),
				weeks : Math.ceil(monthData.length / 7)
			}).appendTo(this[0]);
		},
		clearTable : function(){
			///	<summary>
			///	清空表格。
			///	</summary>
			this.save();
			this.innerHTML = "";
		},
		focus : function(time){
			///	<summary>
			///	聚焦到某一天上。
			///	</summary>
			/// <param name="time" type="number">当天任意时刻的毫秒数</param>
			var focusedDateEl,
			
				oldFocusedDateEl = this.getFocused();

			time = new Date(time - 0).setHours(0, 0, 0, 0);
			focusedDateEl = this.find('ol > li[time="' + time + '"]');

			if(oldFocusedDateEl.length > 0){
				var oldTime = oldFocusedDateEl.get("time", "attr") - 0;

				// 如果2个日期的时间差小于1天，就证明是同一天
				if(oldTime === time){
					return;
				}

				var date = new Date(oldTime);

				oldFocusedDateEl.classList.remove("focusedDate");

				// 如果是同月份的日期切换
				if(date.getMonth() === new Date(time).getMonth()){
					focusedDateEl.classList.add("focusedDate");
					focusDateEvent.trigger(focusedDateEl[0]);
					return;
				}

				this.find('li[time="' + date.setDate(1) + '"]').classList.remove("focused");
			}
			
			var monthEl = this.find('li[time="' + new Date(time).setDate(1) + '"]');

			// 更新月份
			this.updateSiblingMonths(time);

			// 如果聚焦元素找不到
			if(focusedDateEl.length === 0){
				focusedDateEl = this.find('ol > li[time="' + time + '"]');
				monthEl = focusedDateEl.parent().parent();
			}
			
			monthEl.classList.add("focused");
			focusedDateEl.classList.add("focusedDate");

			focusMonthEvent.trigger(monthEl[0]);
			focusDateEvent.trigger(focusedDateEl[0]);
		},
		getFocused : function(){
			///	<summary>
			///	获取当前聚焦的日期元素。
			///	</summary>
			return this.find('ol > li.focusedDate');
		},
		restore : function(time){
			///	<summary>
			///	恢复已储存指定时间的当月表格。
			///	</summary>
			/// <param name="time" type="number">当月第一天的0时0分的毫秒数</param>
			var liEl = jQun();

			return !this.savedTable.every(function(li){
				liEl.splice(0, 1, li);
					
				// 如果已经存在该月
				if(liEl.get("time", "attr") == time){
					liEl.appendTo(this[0]);
					return false;
				}

				return true;
			}, this);
		},
		save : function(){
			///	<summary>
			/// 储存目前的月份表格。
			///	</summary>
			this.savedTable = this.find(">li");
		},
		savedTable : undefined,
		top : function(){
			///	<summary>
			///	将当前聚焦的日期置顶。
			///	</summary>
			var top,

				focusedDateEl = this.find("li.focusedDate"),

				focusedMonthEl = focusedDateEl.between("li.focused", this[0]);

			// 如果当前聚焦的日期是属于下个月的容器内
			if(focusedMonthEl.length === 0){
				top = this.find(">li.focused").height() * -1;
			}
			else {
				top = Math.floor(focusedMonthEl.find("li").indexOf(focusedDateEl[0]) / 6 - 1) * -45;
			}

			this.set("top",	top + "px", "css");
		},
		updateSiblingMonths : function(time){
			///	<summary>
			///	更新相邻的月份（指定月份的上个月，指定的月份，指定的月份的下一个月）。
			///	</summary>
			/// <param name="time" type="number">指定月份的某一天的0时0分的毫秒数</param>
			var date = new Date(time),
				
				month = date.getMonth(), year = date.getFullYear();

			// 清空
			this.clearTable();

			for(var i = -1;i < 2;i++){
				date.setFullYear(year, month + i, 1);
				this.addMonth(date.getTime());
			}
		}
	});

	return DateTable.constructor;
}(
	Bao.API.DOM.OverflowPanel,
	window.Date,
	// tablePanelHtml
	new HTML('<ul></ul>'),
	// dateTableHtml
	new HTML([
		'<li class="calendar_month" time="{time}" weeks={weeks}>',
			'<ol class="inlineBlock">',
				'@for(monthData ->> dt){',
					'<li datestatus="{dt.dateStatus}" day="{dt.day}" time="{dt.time}">',
						'<aside purpose="用户自定义内容"></aside>',
						'<p>',
							'<small>{month}月</small>',
							'<span>{dt.date}</span>',
						'</p>',
					'</li>',
				'}',
			'</ol>',
			'<p class="whiteFont">',
				'<strong>{year}年{month}月</strong>',
			'</p>',
		'</li>'
	].join("")),
	// focusDateEvent
	new Event("focusdate"),
	// focusMonthEvent
	new Event("focusmonth")
));

this.Calendar = (function(DateTable, calendarHtml, stretchEvent, shrinkEvent){
	function Calendar(_isStretch){
		///	<summary>
		///	日历控件。
		///	</summary>
		/// <param name="_isStretch" type="boolean">该控件是否可以伸展的</param>
		var dateTable = new DateTable();

		_isStretch = _isStretch === true;

		this.assign({
			dateTable : dateTable,
			isStretch : _isStretch
		});

		// 添加日期表格
		this.combine(calendarHtml.create());
		dateTable.appendTo(this.find("dd")[0]);

		if(!_isStretch)
			return;

		var calendar = this;

		// 重写classList属性
		this.override({
			classList : this.classList
		});

		dateTable.attach({
			focusdate : function(e){
				if(calendar.isStretched())
					return;
				
				dateTable.top();
			}
		});

		jQun(window).attach({
			touchstart : function(e){
				// 如果点的是在该日历控件上，那么展开，否则收起
				if(jQun(e.target).between(calendar[0], calendar.parent()[0]).length > 0){
					calendar.stretch();
					return;
				}
	
				dateTable.top();
				calendar.shrink();
			}
		});
	};
	Calendar = new NonstaticClass(Calendar, "Bao.UI.Control.Time.Calendar", Panel.prototype);

	Calendar.properties({
		dateTable : undefined,
		isStretch : false,
		isStretched : function(){
			///	<summary>
			///	判断该日历是否已经是展开的。
			///	</summary>
			return this.classList.contains("stretch");
		},
		shrink : function(){
			///	<summary>
			///	收起该日历。
			///	</summary>
			if(!this.isStretched())
				return;

			this.classList.remove("stretch");
			shrinkEvent.trigger(this[0]);
		},
		stretch : function(){
			///	<summary>
			///	展开该日历。
			///	</summary>
			if(this.isStretched())
				return;

			this.classList.add("stretch");
			stretchEvent.trigger(this[0]);
		}
	});

	return Calendar.constructor;
}(
	this.DateTable,
	// calendarHtml
	new HTML([
		'<div class="calendar lightBdColor smallRadius">',
			'<dl>',
				'<dt class="inlineBlock whiteFont">',
					'@for(["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"] ->> title, day){',
						'<span day="{day}">{title}</span>',
					'}',
				'</dt>',
				'<dd></dd>',
			'</dl>',
		'</div>'
	].join("")),
	// stretch
	new Event("stretch"),
	// shrink
	new Event("shrink")
));

Time.members(this);
}.call(
	{},
	Bao.UI.Control.Time,
	jQun.NonstaticClass,
	Bao.API.DOM.Panel,
	jQun.HTML,
	jQun.Event
));