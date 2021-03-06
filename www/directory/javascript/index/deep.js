﻿(function(Deep, NonstaticClass, StaticClass, PagePanel, OverflowPanel, CallServer){
this.GlobalSearch = (function(OverflowPanel, Panel, UserAnchorList, Global, forEach, config){
	function GlobalSearch(selector, groupHtml){
		///	<summary>
		///	全局搜索。
		///	</summary>
		/// <param name="selector" type="string">对应的元素选择器</param>
		/// <param name="groupHtml" type="jQun.HTML">分组的html模板</param>
		var globalSearch = this, textEl = this.find(">header input"),
			
			groupPanel = new OverflowPanel(this.find(".globalSearch_content>ul")[0]);

		this.assign({
			groupHtml : groupHtml,
			groupPanel : groupPanel
		});

		this.find(">header").attach({
			userclick : function(e){
				var targetEl = jQun(e.target);

				if(targetEl.between(">aside>button", this).length > 0){
					var val = textEl.value;

					if(val === "")
						return;

					globalSearch.search(val);
					return;
				}

				if(targetEl.between(">nav>button", this).length > 0){
					Global.history.go("systemOption", true);
				}
			}
		});

		groupPanel.attach({
			clickanchor : function(e){
				var group = jQun(e.target).between(">li>dl", this).get("group", "attr");

				e.stopPropagation();

				if(!group){
					return;
				}

				var cfg = config[group];

				Global.history.go(cfg.panel)[cfg.method](e.anchor);
			}
		}, true);
	};
	GlobalSearch = new NonstaticClass(GlobalSearch, "Bao.Page.Index.Deep.GlobalSearch", PagePanel.prototype);

	GlobalSearch.override({
		showTitleBar : false
	});

	GlobalSearch.properties({
		groupHtml : undefined,
		groupPanel : undefined,
		search : function(text){
			///	<summary>
			///	搜索。
			///	</summary>
			/// <param name="text" type="string">需要搜索的文本值</param>
			if(text === "")
				return;

			var globalSearch = this;

			CallServer.open("globalSearch", { search : text }, function(data){
				var groupPanel = globalSearch.groupPanel;

				// 将top设置为0
				groupPanel.setTop(0);
				// 重新渲染分组
				groupPanel.innerHTML = globalSearch.groupHtml.render();

				// 数据渲染
				forEach(data, function(listData, name){
					if(listData.length === 0){
						return;
					}

					var groupContentEl = groupPanel.find('dl[group="' + name + '"]>dd');

					new UserAnchorList(listData).appendTo(groupContentEl[0]);
					groupContentEl.parent().parent().show();
				});
			});
		}
	});

	return GlobalSearch.constructor;
}(
	Bao.API.DOM.OverflowPanel,
	Bao.API.DOM.Panel,
	Bao.UI.Control.List.UserAnchorList,
	Bao.Global,
	jQun.forEach,
	// config
	{
		projects : {
			panel : "",
			method : ""
		},
		partners : {
			panel : "businessCard",
			method : "fillUser"
		},
		todo : {
			panel : "",
			method : ""
		},
		comments : {
			panel : "",
			method : ""
		}
	}
));

this.Account = (function(LoadingBar, Global, ValidationList){
	function Account(selector, contentHtml){
		///	<summary>
		///	我的账户。
		///	</summary>
		/// <param name="selector" type="string">对应的元素选择器</param>
		/// <param name="contentHtml" type="jQun.HTML">内容的html模板</param>
		var account = this, accountClassList = account.classList,

			validationList = new ValidationList(),

			titleBar = Global.titleBar;

		// 渲染空数据
		this.innerHTML = contentHtml.render({
			name : "",
			company : "",
			email : "",
			position : "",
			phoneNum : "",
			companyAdress : "",
			password : ""
		});

		// 监听事件
		this.attach({
			beforeshow : function(){
				var editButtonEl = titleBar.find('button[action="editAccount"]');

				editButtonEl.onuserclick = function(){
					var footerEl = account.find(">footer");

					// 如果点击了编辑按钮
					if(editButtonEl.get("action", "attr") === "editAccount"){
						// 所有input变为可以输入
						account.find("input").del("readonly", "attr");
						// 编辑按钮变成提交按钮
						editButtonEl.set("action", "submit account", "attr");
						// 修改标题栏的标题
						titleBar.resetTitle("修改账户");
						footerEl.show();
						return;
					}

					if(!validationList.validate())
						return;

					editButtonEl.set("action", "editAccount", "attr");
					// 所有input变为只读
					account.find("input").set("readonly", "", "attr");
					// 修改标题栏的标题
					titleBar.resetTitle("我的账户");
					footerEl.hide();
				};
			},
			userclick : function(e){
				var targetEl = jQun(e.target);

				if(targetEl.between(">footer button", this).length > 0){
					var footerClassList = account.find(">footer").classList;

					if(footerClassList.contains("editable")){
						targetEl.innerHTML = "修改密码";
						footerClassList.remove("editable");
						return;
					}

					targetEl.innerHTML = "取消修改";
					footerClassList.add("editable");
				}
			}
		});

		// 访问服务器
		CallServer.open("myInformation", null, function(info){
			account.innerHTML = contentHtml.render(info);

			// 验证信息
			account.find("dl").forEach(function(parent){
				var parentEl = jQun(parent),

					inputEl = parentEl.find("input"), vtype = inputEl.get("vtype", "attr");

				if(!vtype){
					return;
				}

				validationList.addValidation(parentEl, function(el, Validation){
					if(vtype === "rePwd"){
						return inputEl.value === account.find('dl[desc="editPwd"] input').value;
					}

					return Validation.result(inputEl.value, vtype);
				});
			});
		});
	};
	Account = new NonstaticClass(Account, "Bao.Page.Index.Deep.Account", PagePanel.prototype);

	Account.override({
		title : "我的账户",
		tools : [
			{ urlname : "javascript:void(0);", action : "editAccount" }
		]
	});

	return Account.constructor;
}(
	Bao.UI.Control.Wait.LoadingBar,
	Bao.Global,
	Bao.API.DOM.ValidationList
));

this.QRCode = (function(){
	function QRCode(selector, contentHtml){
		///	<summary>
		///	我的二维码。
		///	</summary>
		/// <param name="selector" type="string">对应的元素选择器</param>
		/// <param name="contentHtml" type="jQun.HTML">内容的html模板</param>
		var qrCode = this;

		CallServer.open("myInformation", null, function(data){
			qrCode.innerHTML = contentHtml.render(data);
		});
	};
	QRCode = new NonstaticClass(QRCode, "Bao.Page.Index.Deep.QRCode", PagePanel.prototype);

	QRCode.override({
		title : "我的二维码"
	});

	return QRCode.constructor;
}());

this.AboutBaoPiQi = (function(){
	function AboutBaoPiQi(selector){
		///	<summary>
		///	关于暴脾气。
		///	</summary>
		/// <param name="selector" type="string">对应的元素选择器</param>
	};
	AboutBaoPiQi = new NonstaticClass(AboutBaoPiQi, "Bao.Page.Index.Deep.AboutBaoPiQi", PagePanel.prototype);

	AboutBaoPiQi.override({
		title : "关于暴脾气"
	});

	return AboutBaoPiQi.constructor;
}());

this.Todo = (function(ChatList, OverflowPanel, Global){
	function Todo(selector, infoHtml){
		var todo = this, chatList = new ChatList(), overflowPanel = new OverflowPanel(this.find(">section")[0]);

		this.assign({
			chatList : chatList,
			infoHtml : infoHtml,
			overflowPanel : overflowPanel
		});

		chatList.appendTo(overflowPanel.find(">figure")[0]);

		chatList.attach({
			messageappended : function(e){
				var message = e.message;

				overflowPanel.bottom();

				if(!message.isSending)
					return;

				var type = message.type, attachment = message.attachment;

				attachment.resetFrom("todo");

				CallServer.open(
					"addCommentForTodo",
					{
						todoId : todo.id,
						attachment : attachment,
						text : message.text,
						type : type
					},
					function(data){
						if(type !== "voice")
							return;

						attachment.resetId(data.id);
					}
				);
			},
			clickpraise : function(e){
				var message = e.message, loginUser = Global.loginUser;

				CallServer.open("praise", {
					messageId : message.id,
					userId : loginUser.id,
					type : "todo"
				}, function(){
					message.addPraise(loginUser);
				})
			}
		});

		this.find(">section>header").attach({
			userclick : function(e, targetEl){
				if(targetEl.between("dt>button").length > 0){
					CallServer.open("todoCompleted", { id : todo.id }, function(data){
						console.log(data);
					}, true);
					return;
				}
			}
		});
	};
	Todo = new NonstaticClass(Todo, "Bao.Page.Index", PagePanel.prototype);

	Todo.override({
		title : "To Do"
	});

	Todo.properties({
		chatList : undefined,
		fill : function(id){
			var todo = this, chatListContent = this.chatList.chatListContent;
		
			CallServer.open("getTodo", { id : id }, function(data){
				var figureEl = todo.find(">section>figure");

				todo.overflowPanel.setTop(0);
				chatListContent.clearAllMessages();
				// 重置颜色
				chatListContent.resetColor(project.color);

				todo.find(">section>header").innerHTML = todo.infoHtml.render(data);

				CallServer.open("getMessages", { id : id, type : "todo" }, function(messages){
					messages.forEach(function(msg){
						this.appendMessageToGroup(msg);
					}, chatListContent);
				});
			});

			this.id = id;
		},
		id : -1,
		infoHtml : undefined,
		overflowPanel : undefined
	});

	return Todo.constructor;
}(
	Bao.UI.Control.Chat.ChatList,
	Bao.API.DOM.OverflowPanel,
	Bao.Global
));

this.SendTodo = (function(UserManagementList, Validation, Global, validationHandle){
	function SendTodo(selector){
		var sendTodo = this, titleBar = Global.titleBar,
		
			titleValidation = new Validation(this.find('li[desc="title"]>input'), validationHandle),

			dateValidation = new Validation(this.find('li[desc="endDate"]>input[type="text"]'), validationHandle),
			
			userManagementList = new UserManagementList("请选择该To Do的执行者");

		this.assign({
			dateValidation : dateValidation,
			titleValidation : titleValidation,
			userManagementList : userManagementList
		});

		userManagementList.appendTo(this.header[0]);
		userManagementList.setMaxLength(1);

		// 提交按钮绑定事件
		this.attach({
			beforeshow : function(e){
				userManagementList.clearUsers();

				titleBar.find('button[action="sendTodoCompleted"]').onuserclick = function(){
					if(!titleValidation.validate())
						return;

					if(!dateValidation.validate())
						return;

					CallServer.open("sendTodo", {
						attachments : [],
						title : titleValidation.validationEl.value,
						date : sendTodo.endDate.getTime(),
						remind : sendTodo.remind ? 1 : 0,
						desc : sendTodo.find("textarea").innerHTML,
						userId : userManagementList.getAllUsers()[0],
						projectId : sendTodo.projectId
					}, function(data){
						Global.history.go("todo").fill(data.id);
					});
				};
			},
			userclick : function(e, targetEl){
				if(targetEl.between('li[desc="remind"] button>span')){
					var classList = targetEl.classList;

					sendTodo.remind = !classList.contains("reminded");
					classList.toggle("reminded");
					return;
				}
			}
		});

		// 绑定日期控件事件
		this.find('li>input[type="date"]').attach({
			change : function(e){
				var endDate = sendTodo = this.valueAsDate;

				this.previousElementSibling.value = endDate.toLocaleDateString();
			},
			userclick : function(){
				dateValidation.clearError();
			}
		});
	};
	SendTodo = new NonstaticClass(SendTodo, "Bao.Page.Index.Deep.SendTodo", PagePanel.prototype);

	SendTodo.override({
		isNoTraces : true,
		restore : function(){
			var dateValidation = this.dateValidation;

			this.titleValidation.clearError();
			dateValidation.clearError();
			// 设置初始时间
			dateValidation.validationEl.value = this.endDate.toLocaleDateString();
		},
		title : "发送 To Do",
		tools : [
			{ urlname : "javascript:void(0);", action : "sendTodoCompleted" }
		]
	});

	SendTodo.properties({
		dateValidation : undefined,
		endDate : new Date(),
		projectId : -1,
		// 完成时候是否提醒
		remind : false,
		resetProjectId : function(id){
			this.projectId = id;
		},
		selectUser : function(userData){
			var sendTodo = this;

			this.userManagementList.userList.addUsers([userData]);
		},
		titleValidation : undefined,
		userManagementList : undefined
	});

	return SendTodo.constructor;
}(
	Bao.UI.Control.List.UserManagementList,
	Bao.API.DOM.Validation,
	Bao.Global,
	// validationHandle
	function(inputEl){
		return jQun.Validation.result(inputEl.value, inputEl.getAttribute("vtype"));
	}
));

this.Archive = (function(AnchorList, Global){
	function Archive(selector){
		var archive = this, overflowPanel = new OverflowPanel(this.find(">section")[0]);

		this.attach({
			clickanchor : function(e){
				e.stopPropagation();
				Global.history.go("archivedProjectView").fill(e.anchor);
			}
		}, true);

		CallServer.open("getAllArchives", null, function(archives){
			archives.forEach(function(archive){
				archive.key = archive.id;
				archive.desc = new Date(archive.completeDate).toLocaleDateString();
			});
			
			overflowPanel.innerHTML = "";
			new AnchorList(archives, true).appendTo(overflowPanel[0]);

			archives.forEach(function(archive){
				overflowPanel.find('li[key="' + archive.id + '"]').classList.add("projectColor_" + archive.color);
			});
		});
	};
	Archive = new NonstaticClass(Archive, "Bao.Page.Index.Deep.Archive", PagePanel.prototype);

	Archive.override({
		title : "归档"
	});

	return Archive.constructor;
}(
	Bao.UI.Control.List.AnchorList,
	Bao.Global
));

this.ArchivedProjectView = (function(AnchorList, Panel){
	function TodoContent(contentHtml){
		this.assign({
			contentHtml : contentHtml
		});
	};
	TodoContent = new NonstaticClass(TodoContent);

	TodoContent.properties({
		contentHtml : undefined,
		create : function(id){
			var dt;

			this.data.every(function(d){
				if(d.id == id){
					dt = d;
					return false;
				}

				return true;
			});

			return this.contentHtml.create(dt || {});
		},
		data : undefined,
		resetData : function(data){
			this.data = data;
		}
	});


	function ArchivedProjectView(selector, attachmentsHtml, todoContentHtml){
		var archivedProjectView = this,
		
			todoContent = new TodoContent.constructor(todoContentHtml);

		this.assign({
			attachmentsHtml : attachmentsHtml,
			todoContent : todoContent
		});

		this.attach({
			clickanchor : function(e){
				var expendEl = archivedProjectView.find('li[key="' + e.anchor + '"]'),

					classList = expendEl.classList;

				e.stopPropagation();

				if(classList.contains("expend")){
					expendEl.find(">dl").remove();
					classList.remove("expend");
					return;
				}

				var el = archivedProjectView.find("li.expend");

				if(el.length > 0){
					el.find(">dl").remove();
					el.classList.remove("expend");
				}

				todoContent.create(e.anchor).appendTo(expendEl[0]);
				classList.add("expend");
			}
		}, true);

		new OverflowPanel(this.header.find(">ul"));
	};
	ArchivedProjectView = new NonstaticClass(ArchivedProjectView, "Bao.Page.Deep.ArchivedProjectView", PagePanel.prototype);

	ArchivedProjectView.override({
		title : "查看归档"
	});

	ArchivedProjectView.properties({
		attachmentsHtml : undefined,
		fill : function(id){
			var archiveProjectView = this;

			CallServer.open("getArchivedProject", { id : id }, function(data){
				var anchorList, anchorListData = [],
					
					sectionEl = archiveProjectView.section, todoList = data.todoList;

				archiveProjectView.todoContent.resetData(todoList);

				todoList.forEach(function(todo){
					var t = this({}, todo);

					this(t, {
						key : todo.id,
						desc : new Date(todo.endTime).toLocaleDateString()
					});

					anchorListData.push(t);
				}, jQun.set);

				archiveProjectView.header.find("ul").innerHTML = archiveProjectView.attachmentsHtml.render(data.project);
				
				sectionEl.innerHTML = "";
				anchorList = new AnchorList(anchorListData, true);
				anchorList.appendTo(sectionEl[0]);
				new OverflowPanel(anchorList);
			});
		},
		todoContent : undefined
	});

	return ArchivedProjectView.constructor;
}(
	Bao.UI.Control.List.AnchorList,
	Bao.API.DOM.Panel
));

this.ProjectManagement = (function(UserManagementList, AnchorList, Global, anchorListData){
	function ProjectManagement(selector){
		var projectManagement = this,
		
			anchorList = new AnchorList(anchorListData),
			
			userManagementList = new UserManagementList("选择成员").appendTo(this.find(">header")[0]);

		this.assign({
			userManagementList : userManagementList
		});

		this.attach({
			beforeshow : function(){
				Global.titleBar.find('button[action="projectManagement_done"]').onuserclick = function(){
					CallServer.open("editProjectInfo", {
						userIds : userManagementList.userList.getAllUsers()
					}, function(){
						Global.history.go("singleProject").fill(projectManagement.id);
					});
				};
			},
			userclick : function(e, targetEl){
				if(targetEl.between(">footer>button:first-child", this).length > 0){
					if(confirm("确定将此项目归档吗？")){
						CallServer.open("archiveProject", {
							id : projectManagement.id
						}, function(){
							Global.history.go("archive");
						});
					}

					return;
				}

				if(targetEl.between(">footer>button:last-child", this).length > 0){
					if(confirm("确定将此项目删除吗？")){
						CallServer.open("removeProject", {
							id : projectManagement.id
						}, function(){
							Global.history.go("project");
						});
					}

					return;
				}
			}
		});

		anchorList.attach({
			clickanchor : function(e){
				var anchor = e.anchor;

				e.stopPropagation();

				if(anchor === "sendTodo"){
					Global.history.go(anchor).resetProjectId(projectManagement.id);
					return;
				}
			}
		}, true);

		anchorList.appendTo(this.find(">section")[0]);
	};
	ProjectManagement = new NonstaticClass(ProjectManagement, "Bao.Page.Index.Deep.ProjectManagement", PagePanel.prototype);

	ProjectManagement.override({
		title : "项目管理",
		tools : [{ urlname : "javascript:void(0);", action : "projectManagement_done" }]
	});

	ProjectManagement.properties({
		fill : function(id){
			var projectManagement = this;

			CallServer.open("getSingleProject", { id : id }, function(data){
				projectManagement.userManagementList.userList.addUsers(data.users);

				Global.titleBar.resetTitle("项目管理：" + data.title);
				projectManagement.id = id;
			});
		},
		id : -1,
		userManagementList : undefined
	});

	return ProjectManagement.constructor;
}(
	Bao.UI.Control.List.UserManagementList,
	Bao.UI.Control.List.AnchorList,
	Bao.Global,
	// anchorListData
	[
		{ title : "发送 To Do", key : "sendTodo" } //,
		// { title : "搜索记录", key : "" },
		// { title : "项目二维码", key : "qrCode" }
	]
));

Deep.members(this);
}.call(
	{},
	Bao.Page.Index.Deep,
	jQun.NonstaticClass,
	jQun.StaticClass,
	Bao.API.DOM.PagePanel,
	Bao.API.DOM.OverflowPanel,
	Bao.CallServer
));