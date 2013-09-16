(function(Secondary, NonstaticClass, StaticClass, PagePanel,  CallServer){
this.AddProject = (function(Global, Validation, UserManagementList){
	function AddProject(selector, colorHtml){
		///	<summary>
		///	添加项目。
		///	</summary>
		/// <param name="selector" type="string">对应的元素选择器</param>
		/// <param name="colorHtml" type="jQun.HTML">颜色模板</param>
		var titleValidation, colorValidation, addProject = this;

		// 标题验证
		titleValidation = new Validation(
			this.find('section[desc="title"]'),
			function(titleEl){
				return titleEl.find(">input").value !== "";
			}
		);
		colorValidation = new Validation(
			this.find('section[desc="color"]'),
			function(colorEl){
				return colorEl.find("button.selected").length !== 0;
			}
		);

		this.assign({
			colorHtml : colorHtml,
			colorValidation : colorValidation,
			titleValidation : titleValidation,
			userManagementList : new UserManagementList("添加项目拍档")
		});

		this.attach({
			userclick : function(e){
				var targetEl = jQun(e.target);

				if(targetEl.between('>section[desc="color"] button', this).length > 0){
					addProject.find('>section[desc="color"] button').classList.remove("selected");
					targetEl.classList.add("selected");
				}
			},
			beforeshow : function(){
				Global.titleBar.find('button[action="submit"]').onuserclick = function(){
					if(!titleValidation.validate())
						return;

					if(!colorValidation.validate())
						return;

					var a = {
						title : addProject.find('>section[desc="title"]>input').value,
						color : addProject.find('>section[desc="color"] button.selected').get("colormark", "attr"),
						desc : addProject.find('>footer textarea').value,
						users : addProject.userManagementList.getAllUsers()
					};

					CallServer.open("addProject", {
						title : addProject.find('>section[desc="title"]>input').value,
						colormark : addProject.find('>section[desc="color"] button.selected').get("colormark", "attr"),
						desc : addProject.find('>footer textarea').value,
						users : addProject.userManagementList.getAllUsers()
					}, function(data){
						// todo : 添加数据
						Global.history.go("project");
					}, true);
				};
			}
		});

		this.userManagementList.appendTo(this.find(">header")[0]);
	};
	AddProject = new NonstaticClass(AddProject, "Bao.Page.Index.Secondary.AddProject", PagePanel.prototype);

	AddProject.override({
		isNoTraces : true,
		restore : function(){
			// 还原标题
			this.find(">section input").value = "";
			// 清空已选择的用户
			this.userManagementList.clearUsers();
			// 还原颜色
			this.find('>section[desc="color"] dd').innerHTML = this.colorHtml.render();
			// 清空错误
			this.colorValidation.clearError();
			this.titleValidation.clearError();
			// 清空文本框
			this.find(">footer textarea").value = "";
		},
		title : "添加项目",
		tools : [{ urlname : "javascript:void(0);", action : "submit" }]
	});

	AddProject.properties({
		colorHtml : undefined,
		colorValidation : undefined,
		titleValidation : undefined,
		userManagementList : undefined
	});

	return AddProject.constructor;
}(
	Bao.Global,
	Bao.API.DOM.Validation,
	Bao.UI.Control.List.UserManagementList
));

this.BusinessCard = (function(Global, LoadingBar, clickAvatarEvent){
	function ClickUserAvatar(){
		///	<summary>
		///	点击用户头像。
		///	</summary>
		jQun(document.body).attach({
			userclick : function(e){
				var avatarPanel = jQun(e.target).between('[class*="AvatarPanel"]');

				if(avatarPanel.length === 0)
					return;

				clickAvatarEvent.setEventAttrs({
					userId : avatarPanel.get("userid", "attr")
				});
				clickAvatarEvent.trigger(e.target);
			},
			clickavatar : function (e){
				Global.history.go("businessCard").fillUser(e.userId);
			}
		});
	};
	ClickUserAvatar = new StaticClass(ClickUserAvatar);


	function BusinessCard(selector, userInfoHtml){
		///	<summary>
		///	个人名片。
		///	</summary>
		/// <param name="selector" type="string">对应的元素选择器</param>
		/// <param name="userInfoHtml" type="jQun.HTML">用户信息模板</param>
		this.assign({
			userInfoHtml : userInfoHtml
		});

		this.onclickavatar = function(e){
			e.stopPropagation();
		};
	};
	BusinessCard = new NonstaticClass(BusinessCard, "Bao.Page.Index.Secondary.BusinessCard", PagePanel.prototype);

	BusinessCard.override({
		isNoTraces : true,
		restore : function(){
			this.find(">section>dl").innerHTML = "";
		},
		title : "个人名片"
	});

	BusinessCard.properties({
		fillUser : function(id){
			///	<summary>
			///	填充用户。
			///	</summary>
			/// <param name="id" type="string">用户id</param>
			var businessCard = this;

			CallServer.open("getUser", { id : id }, function(data){
				businessCard.find(">section>dl").innerHTML = businessCard.userInfoHtml.render(data);	
			});
		},
		userInfoHtml : undefined
	});

	return BusinessCard.constructor;
}(
	Bao.Global,
	Bao.UI.Control.Wait.LoadingBar,
	// clickAvatarEvent
	new jQun.Event("clickavatar", function(){
		this.attachTo("*");
	})
));

this.SystemOption = (function(AnchorList, anchorData){
	function SystemOption(selector){
		new AnchorList(anchorData).appendTo(this.find(">section")[0]);
	};
	SystemOption = new NonstaticClass(SystemOption, "Bao.Page.Index.Secondary.SystemOption", PagePanel.prototype);

	SystemOption.override({
		title : "设置"
	});

	return SystemOption.constructor;
}(
	Bao.UI.Control.List.AnchorList,
	// anchorData
	[
		{ key : "globalSearch", title : "搜索全部" },
		{ key : "account", title : "我的账户" },
		{ key : "accountConnection", title : "连接账户" },
		{ key : "qrCode", title : "我的二维码" },
		{ key : "file", title : "查看归档" },
		{ key : "aboutBaoPiQi", title : "关于暴脾气" }
	]
));

this.SingleProject = (function(Global){
	function SingleProject(selector, infoHtml){
		this.assign({
			infoHtml : infoHtml
		});

		this.fill(1);
		console.log(this);
	};
	SingleProject = new NonstaticClass(SingleProject, "Bao.Page.Index.Secondary.SingleProject", PagePanel.prototype);

	SingleProject.override({
		title : "单个项目"
	});

	SingleProject.properties({
		fill : function(id){
			var singleProject = this;

			CallServer.open("getSingleProject", { id : id }, function(project){
				Global.titleBar.resetTitle(project.title);
				singleProject.find(">header>dl").innerHTML = singleProject.infoHtml.render(project);
			});
		},
		infoHtml : undefined
	});

	return SingleProject.constructor;
}(
	Bao.Global
));

Secondary.members(this);
}.call(
	{},
	Bao.Page.Index.Secondary,
	jQun.NonstaticClass,
	jQun.StaticClass,
	Bao.API.DOM.PagePanel,
	Bao.CallServer
));