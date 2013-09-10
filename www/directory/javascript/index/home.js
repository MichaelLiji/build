(function(Home, NonstaticClass, Panel, PagePanel, OverflowPanel, Control, LoadingBar, BatchLoad, Global){
this.Schedule = (function(Calendar, ProjectAnchorList, groupingHtml){
	function Grouping(data){
		this.combine(groupingHtml.create({
			dateData : data
		}));

		new ProjectAnchorList(data.projects).appendTo(this.find("dd")[0]);
	};
	Grouping = new NonstaticClass(Grouping, null, Panel.prototype);


	function ScheduleContent(selector, calendar){
		var topLi, scheduleContent = this,

			dateTable = calendar.dateTable,

			rect = this.rect(), x = rect.x + this.width() / 2, y = rect.y + 20;

		// 初始化日程信息的滚动效果
		this.attach({
			continuousgesture : function(e){
				var date = new Date(dateTable.getFocused().get("time", "attr") - 0),
				
					top = scheduleContent.get("top", "css").split("px").join("") - 0 || 0;

				if(top < 0){
					if(scheduleContent.height() + top <= scheduleContent.parent().height()){
						date.setDate(date.getDate() + 1);
					}
					else {
						var rect = scheduleContent.parent().rect(),

							pointEl = jQun(document.elementFromPoint(rect.left + scheduleContent.width() / 2, rect.top + 20)).between(">li", this);

						if(pointEl[0] !== topLi){
							topLi = pointEl[0];
							date = new Date(pointEl.get("time", "attr") - 0);
						}
					}
				}
				else {
					date.setDate(date.getDate() - 1);
				}
				
				dateTable.focus(date);
			}
		});
	};
	ScheduleContent = new NonstaticClass(ScheduleContent, null, OverflowPanel.prototype);


	function Schedule(selector, signHtml){
		var batchLoad,
		
			schedule = this, lastData = {},
			
			contentEl = this.find("section ol"),

			calendar = new Calendar(true);

		// 初始化batchload
		batchLoad = new BatchLoad("getSchedules", function(data){
			lastData = {};

			data.schedules.forEach(function(date){
				var asideEl = calendar.find('li[datestatus][time="' + date.time + '"] aside');

				lastData[date.time] = date;

				if(asideEl.length === 0)
					return;
					
				var asideAttr = asideEl.attributes;

				if(asideAttr.get("projectsLength") != null)
					return;
				
				var projects = date.projects;

				asideEl.innerHTML = signHtml.render(date);
				asideAttr.set("projectsLength", projects.length);
			});
		});

		// 初始化日历
		calendar.appendTo(this.find(">header")[0]);
		calendar.attach({
			shrink : function(){
				contentEl.parent().classList.remove("calendarStretched");
			},
			stretch : function(){
				contentEl.parent().classList.add("calendarStretched");
			}
		});
		calendar.attach({
			focusmonth : function(){
				batchLoad.callServer();
			},
			focusdate : function(e){
				var targetEl = jQun(e.target), topEl = contentEl.find("li.top"),

					time = targetEl.get("time", "attr");

				if(topEl.length > 0){
					if(time === topEl.get("time", "attr")){
						return;
					}

					topEl.classList.remove("top");
				}

				var date = new Date(time - 0), contentUl = contentEl[0],

					scheduleItemEls = contentEl.find(">li");

				if(scheduleItemEls.length > 0){
					var d = new Date(time - 0),
					
						t = d.setDate(d.getDate() + 1);

					if(jQun(scheduleItemEls[0]).get("time", "attr") == t){
						var el = new Grouping.constructor(lastData[time]);

						el.insertTo(contentUl, 0);
						scheduleItemEls.splice(0, scheduleItemEls.length - 1);
						scheduleItemEls.remove();
						contentEl.set("top", el.height() * -1 + "px", "css");
						return;
					}

					t = d.setDate(d.getDate() - 2);

					if(jQun(scheduleItemEls[scheduleItemEls.length - 1]).get("time", "attr") == t){
						var el = new Grouping.constructor(lastData[time]);

						el.appendTo(contentUl, 0);
						scheduleItemEls.splice(0, 1);
						scheduleItemEls.remove();
						return;
					}
				}
				
				contentEl.innerHTML = "";

				for(var i = 0;i < 10;i++){
					if(lastData[date.getTime()]){
					new Grouping.constructor(lastData[date.getTime()]).appendTo(contentUl);
					}
					date.setDate(date.getDate() + 1);
				}
			}
		});
		calendar.dateTable.focus(new Date());
	
		new ScheduleContent.constructor(contentEl[0], calendar);
	};
	Schedule = new NonstaticClass(Schedule, null, PagePanel.prototype);

	Schedule.override({
		hideBackButton : true,
		title : "MY CALENDAR 日程"
	});

	Schedule.properties({
		add : function(data){
			this.find("> header > dl").innerHTML = this.html.render(data);
		},
		batchLoad : undefined,
		html : undefined
	});

	return Schedule.constructor;
}(
	Control.Time.Calendar,
	Control.List.ProjectAnchorList,
	new jQun.HTML([
		'<li time="{dateData.time}" projectslength="{dateData.projects.length}">',
			'<dt class="whiteFont">',
				'<span class="lightBgColor smallRadius">{dateData.localeDateString}</span>',
			'</dt>',
			'<dd></dd>',
		'</li>'
	].join(""))				
));

this.Project = (function(){
	function Project(selector, html){
		///	<summary>
		///	项目。
		///	</summary>
		/// <param name="selector" type="string">对应的元素选择器</param>
		/// <param name="html" type="jQun.HTML">项目html模板</param>
		var project = this,

			batchLoad = new BatchLoad("getProjects", function(data){
				project.add(data);

				if(!this.isEqual("pageIndex", "pageMax"))
					return;
				
				// 添加空文件夹
				project.addEmptyFolders(data.emptyFolders);
				// 添加未解锁的项目
				project.addEmptyFolders(this.getParam("pageSize") - data.projects.length, true);
			});
		
		this.assign({
			html : html,
			batchLoad : batchLoad
		});

		batchLoad.setParam("pageIndex", 0, 1);
		batchLoad.setParam("pageSize", 10);
		batchLoad.setParam("pageMax", -1);

		this.attach({
			beforeshow : function(){
				project.load();
			},
			leaveborder : function(e){
				if(e.direction !== "bottom")
					return;

				project.load();
			},
			userclick : function(e){
				var targetEl = jQun(e.target);

				if(targetEl.between('figure[status="0"]', this).length > 0){
					Global.history.go("addProject");
				}
			}
		});

		new OverflowPanel(this.find(">ul"));
	};
	Project = new NonstaticClass(Project, null, PagePanel.prototype);

	Project.override({
		hideBackButton : true,
		title : "MY PROJECTS 项目",
		tools : [{ urlname : "systemOption", action : "set" }]
	});

	Project.properties({
		add : function(data){
			///	<summary>
			///	添加数据。
			///	</summary>
			/// <param name="data" type="array">项目数据</param>
			this.html.create(data).appendTo(this.find(">ul")[0]);
		},
		addEmptyFolders : function(_len, _isUnopened){
			///	<summary>
			///	添加未解锁的项目，1次为10个。
			///	</summary>
			var data = [], i = {
				id : -1,
				importantLevel : 0,
				title : "新建项目",
				users : [],
				lastMessage : "",
				unread : 0,
				status : _isUnopened ? -1 : 0,
				color : -1
			};

			jQun.forEach(_len == undefined ? this.batchLoad.getParam("pageSize") : _len, function(){
				data.push(i);
			});

			this.add({ projects : data });
		},
		html : undefined,
		load : function(){
			///	<summary>
			///	去服务器取数据，并加载。
			///	</summary>
			var batchLoad = this.batchLoad;

			if(batchLoad.isEqual("pageIndex", "pageMax")){
				this.addEmptyFolders(10, true);
				return;
			}

			batchLoad.callServer();
		},
		batchLoad : undefined
	});

	return Project.constructor;
}());

this.Partner = (function(Navigator, UserIndexList, InputSelectionList, Validation, CallServer){
	function SelectorList(text, _placeholder){
		///	<summary>
		///	选择列表。
		///	</summary>
		/// <param name="text" type="string">标题文字</param>
		/// <param name="_placeholder" type="string">输入框默认文字</param>
		var validation = new Validation(this.find(">header>input"), function(textEl, Validation){
			return Validation.result(textEl.value, "notEmpty");
		});

		this.attach({
			clickbutton : function(e){
				if(e.buttonType === "cancel")
					return;

				var inputText = e.inputText;

				if(!validation.validate()){
					e.stopPropagation();
					return;
				}
				
				CallServer.open("createGroup", {}, function(){
				
				});
			}
		}, true);
	};
	SelectorList = new NonstaticClass(SelectorList, null, InputSelectionList.prototype);

	function Partner(selector, groupingHtml){
		///	<summary>
		///	拍档。
		///	</summary>
		/// <param name="selector" type="string">元素选择器</param>
		/// <param name="groupingHtml" type="jQun.HTML">分组模板</param>
		var userIndexList, groupPanel,

			partner = this, panelStyle = this.style,

			navigator = new Navigator();


		// 初始化用户列表
		userIndexList = new UserIndexList();

		this.assign({
			userIndexList : userIndexList
		});
	
		// 添加navigator
		navigator.appendTo(this.find(">ul>li:first-child")[0]);

		// 监听事件
		this.attach({
			userclick : function(e){
				var targetEl = jQun(e.target), el = targetEl.between(".group button", this);

				// 如果点击的是分组栏上的按钮
				if(el.length > 0){
					// 如果点击的是添加分组
					if(el.get("action", "attr") === "addGroup"){
						new SelectorList.constructor("添加组拍档", "输入组名称");
						return;
					}
					
					// 否则点击的是分组按钮
					partner.focus(el.get("groupId", "attr"), el);
				}
			},
			beforeshow : function(){
				// 获取分组数据
				CallServer.open("getPartnerGroups", null, function(data){
					var groups = data.groups, len = groups.length;
				
					// 添加分组区域
					navigator.content(groupingHtml.render(data));
					navigator.tab(Math.ceil(len / 3));
					navigator.focusTab(0);

					if(len === 0)
						return;

					partner.focus(groups[0].id);
				});
			}
		});

		userIndexList.appendTo(this.find(">ul>li:last-child")[0]);
	};
	Partner = new NonstaticClass(Partner, null, PagePanel.prototype);

	Partner.override({
		hideBackButton : true,
		title : "MY PARTNERS 拍档"
	});

	Partner.properties({
		focus : function(groupId, _groupEl){
			///	<summary>
			///	切换分组。
			///	</summary>
			/// <param name="groupId" type="number">分组的id</param>
			/// <param name="_groupEl" type="jQun.HTMLElementList">该分组元素</param>
			var partner = this, classList;

			// 如果分组元素不存在
			if(!_groupEl){
				_groupEl = this.find('.group button[groupid="' + groupId + '"]');
			}

			classList = _groupEl.classList;
			
			// 如果聚焦的分组已经是当前分组
			if(classList.contains("focused")){
				return;	
			}

			var userIndexList = this.userIndexList;

			// 聚焦当前分组
			this.find('.group button.focused').classList.remove("focused");
			_groupEl.classList.add("focused");
			this.set("top", 0, "css");

			userIndexList.hide();

			// 还没当前分组的数据，那么就去取数据，再进行加载
			CallServer.open("getPartners", { groupId : groupId }, function(data){
				// 渲染数据
				userIndexList.refresh(data);
				userIndexList.show();

				// 防止用户快速切换分组导致数据错误
				if(classList.contains("focused"))
					return;

				partner.focus(groupId, _groupEl);
			});
		},
		userIndexList : undefined
	});

	return Partner.constructor;
}(
	Control.Drag.Navigator,
	Control.List.UserIndexList,
	Control.List.InputSelectionList,
	Bao.API.DOM.Validation,
	Bao.CallServer
));

this.Tab = (function(focusTabEvent, blurTabEvent){
	function Tab(selector, itemHtml){
		///	<summary>
		///	SPP脚部选项卡。
		///	</summary>
		/// <param name="selector" type="string">对应的元素选择器</param>
		/// <param name="itemHtml" type="jQun.HTML">选项卡html模板</param>
		var btnEls, btnClassList, tab = this;

		this.find("ul").innerHTML = itemHtml.render();

		this.assign({
			btnEls : this.find("button")
		});

		this.attach({
			userclick : function(e){
				var buttonEl = jQun(e.target).between("button", this);

				if(buttonEl.length === 0)
					return;

				if(buttonEl.classList.contains("focused"))
					return;

				tab.blur();
				tab.focus(buttonEl.parent().get("tab", "attr"));
				Global.history.go(buttonEl.parent().get("tab", "attr"));
			}
		});
	};
	Tab = new NonstaticClass(Tab, null, Panel.prototype);

	Tab.properties({
		blur : function(){
			///	<summary>
			///	让选项卡失去焦点。
			///	</summary>
			var focusedEl = this.btnEls.between(".focused", this[0]);

			if(focusedEl.length === 0)
				return;

			focusedEl.classList.remove("focused");
		},
		btnEls : undefined,
		focus : function(name){
			///	<summary>
			///	使指定名称的选项卡聚焦。
			///	</summary>
			/// <param name="name" type="string">选项卡名称</param>
			var buttonEl = this.btnEls.between('[tab="' + name + '"]', this[0]);

			buttonEl.classList.add("focused");
		}
	});

	return Tab.constructor;
}(
	new jQun.Event("focustab")
));

this.SPP = (function(Tab, HTML){
	function SPP(selector){
		///	<summary>
		///	日程、项目、拍档页。
		///	</summary>
		/// <param name="selector" type="string">对应的元素</param>
		var tab = new Tab(
			// selector
			"#tab_SPP",
			// itemHtml
			new HTML("spp_item_html", true)
		);

		this.attach({
			beforeshow : function(e){
				tab.blur();
				tab.focus(e.currentPanel.id);
			}
		});
	};
	SPP = new NonstaticClass(SPP, "Bao.Page.Index.SPP", Panel.prototype);

	return SPP.constructor;
}(
	this.Tab,
	jQun.HTML
));

Home.members(this);
}.call(
	{},
	Bao.Page.Index.Home,
	jQun.NonstaticClass,
	Bao.API.DOM.Panel,
	Bao.API.DOM.PagePanel,
	Bao.API.DOM.OverflowPanel,
	Bao.UI.Control,
	Bao.UI.Control.Wait.LoadingBar,
	Bao.API.Data.BatchLoad,
	Bao.Global
));