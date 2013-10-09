(function(SingleProject, NonstaticClass, Panel, OverflowPanel, Event, CallServer, Global){
this.ProjectPanel = (function(PagePanel, loadProjectEvent){
	function ProjectPanel(selector){};
	ProjectPanel = new NonstaticClass(ProjectPanel, "Bao.Page.Index.SingleProject.ProjectPanel", PagePanel.prototype);

	ProjectPanel.properties({
		fill : function(id){
			var pagePanel = this;

			CallServer.open("getSingleProject", { id : id }, function(project){
				var title = project.title;

				// 重置标题
				pagePanel.title = title;
				Global.titleBar.resetTitle(title);

				loadProjectEvent.setEventAttrs({ project : project });
				loadProjectEvent.trigger(pagePanel[0]);
			});
		}
	});

	return ProjectPanel.constructor;
}(
	Bao.API.DOM.PagePanel,
	// loadProjectEvent
	new Event("loadproject")
));

this.Header = (function(focusTabEvent){
	function Header(selector){
		var header = this;

		this.attach({
			userclick : function(e, targetEl){
				var el = targetEl.between("li", this);

				if(el.length > 0){
					header.focus(el.getAttribute("pagename"));
					return;
				}
			}
		});
	};
	Header = new NonstaticClass(Header, "Bao.Page.Index.SinlgeProject.Header", Panel.prototype);

	Header.properties({
		focus : function(pagename){
			var focusedEl = this.find("li.focused");

			if(focusedEl.length > 0){
				if(focusedEl.getAttribute("pagename") === pagename){
					return;
				}
			}

			focusedEl.classList.remove("focused");
			focusedEl = this.find('li[pagename="' + pagename + '"]');
			focusedEl.classList.add("focused");

			focusTabEvent.setEventAttrs({ pageName : pagename });
			focusTabEvent.trigger(focusedEl[0]);
		},
		setToDoLength : function(length){
			this.find('>ul>li>span').innerHTML = length;
		}
	});

	return Header.constructor;
}(
	// focusTabEvent
	new Event("focustab")
));

this.Discussion = (function(ProjectPanel, ChatList){
	function Discussion(selector, infoHtml){
		///	<summary>
		///	单个项目。
		///	</summary>
		/// <param name="selector" type="string">对应的元素选择器</param>
		/// <param name="infoHtml" type="jQun.HTML">信息模板</param>
		var projecetId, discussion = this,
			
			chatList = new ChatList(), overflowPanel = new OverflowPanel(this.find(">section")[0]);

		chatList.appendTo(overflowPanel.find(">figure")[0]);

		chatList.attach({
			messageappended : function(e){
				overflowPanel.bottom();
			},
			messagecompleted : function(e){
				var message = e.message;

				CallServer.open(
					"addComment",
					{
						projectId : projecetId,
						attachment : message.attachment,
						text : message.text,
						type : message.type
					},
					function(){
				
					}
				);
			},
			clickpraise : function(e){
				var message = e.message, loginUser = Global.loginUser;

				CallServer.open("praise", {
					messageId : message.id,
					userId : loginUser.id,
					type : "project"
				}, function(){
					message.addPraise(loginUser);
				})
			},
			clickdo : function(e){
				Global.history.go("sendToDo").fill(projecetId);
			}
		});

		this.attach({
			loadproject : function(e){
				var project = e.project, chatListContent = chatList.chatListContent;

				projecetId = project.id;
				overflowPanel.setTop(0);

				chatListContent.clearAllMessages();
				// 重置颜色
				chatListContent.resetColor(project.color);
				// 项目信息
				overflowPanel.find(">header>dl").innerHTML = infoHtml.render(project);

				CallServer.open("getMessages", { id : projecetId, type : "project" }, function(messages){
					// 添加聊天信息
					messages.forEach(function(msg){
						chatListContent.appendMessageToGroup(msg);
					});
				});
			}
		});
	};
	Discussion = new NonstaticClass(Discussion, "Bao.Page.Index.SingleProject.Discussion", ProjectPanel.prototype);

	Discussion.override({
		title : "单个项目"
	});

	return Discussion.constructor;
}(
	this.ProjectPanel,
	Bao.UI.Control.Chat.ChatList
));

this.ToDoList = (function(ProjectPanel, AnchorList, formatKey){
	function ToDoList(selector){
		var toDoList = this;

		this.attach({
			loadproject : function(e){
				var project = e.project;

				CallServer.open("getToDoList", { id : project.id }, function(data){
					var completedEl = toDoList.find(">section>dl:first-child>dd"),

						uncompletedEl = toDoList.find(">section>dl:last-child>dd");

					data = formatKey(data);

					completedEl.innerHTML = "";
					uncompletedEl.innerHTML = "";

					new AnchorList(data.completed, true).appendTo(completedEl[0]);
					new AnchorList(data.uncompleted, true).appendTo(uncompletedEl[0]);
				});
			}
		});

		this.attach({
			clickanchor : function(e){
				e.stopPropagation();
				Global.history.go("toDo").fill(e.anchor);
			}
		}, true);

		new OverflowPanel(this.find(">section")[0]);
	};
	ToDoList = new NonstaticClass(ToDoList, "Bao.Pge.Index.SingleProject.ToDoList", ProjectPanel.prototype);

	return ToDoList.constructor;
}(
	this.ProjectPanel,
	Bao.UI.Control.List.AnchorList,
	// formatKey
	function(data){
		data.completed.forEach(function(dt){
			dt.key = dt.id;
		});

		data.uncompleted.forEach(function(dt){
			dt.key = dt.id;
		});

		return data;
	}
));

this.WorkStream = (function(ProjectPanel, LevelAnchorList){
	function WorkStream(selector, infoHtml){
		var workStream = this, ulEl = workStream.find(">ul");

		this.attach({
			loadproject : function(e){
				var project = e.project;
				
				CallServer.open("getWorkStream", { id : project.id }, function(data){
					var asideEls;

					ulEl.innerHTML = infoHtml.render({ workStream : data });
					asideEls = ulEl.find("aside");

					data.forEach(function(dt, i){
						new LevelAnchorList(dt.toDoList).appendTo(asideEls[i]);
					});
				});
			}
		});

		new OverflowPanel(ulEl[0]);
	};
	WorkStream = new NonstaticClass(WorkStream, "Bao.Page.Index.SingleProject.WorkStream", ProjectPanel.prototype);

	return WorkStream.constructor;
}(
	this.ProjectPanel,
	Bao.UI.Control.List.LevelAnchorList
));


this.Self = (function(Header){
	function Self(selector){
		///	<summary>
		///	单个页面。
		///	</summary>
		/// <param name="selector" type="string">对应的元素选择器</param>
		var id, self = this, header = new Header("#singleProjectHeader");

		this.attach({
			beforeshow : function(e, targetEl){
				header.focus(e.currentPanel.id);
			},
			focustab : function(e){
				// 初始化页面的时候，不需要加载数据
				if(id === undefined)
					return;

				Global.history.go(e.pageName).fill(id);
			},
			loadproject : function(e){
				id = e.project.id;
			}
		});
	};
	Self = new NonstaticClass(Self, "Bao.Page.Index.SingleProject.Self", Panel.prototype);

	return Self.constructor;
}(
	this.Header
));


SingleProject.members(this);
}.call(
	{},
	Bao.Page.Index.SingleProject,
	jQun.NonstaticClass,
	Bao.API.DOM.Panel,
	Bao.API.DOM.OverflowPanel,
	jQun.Event,
	Bao.CallServer,
	Bao.Global
));