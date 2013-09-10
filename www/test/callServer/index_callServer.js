(function(Bao, JSON, Text, Index){
this.CallServer = (function(CallServer, Wait, open, allHandlers){
	CallServer.setResponseType("json");
	// 开始测试
	CallServer.beginTesting();

	// 重写open方法
	CallServer.override({
		open : function(name, params, _complete, _isUpload){
			var LoadingBar = Wait.LoadingBar;

			LoadingBar.show(_isUpload ? "正在上传数据.." : null);

			open.call(CallServer, name, params, function(data, isCache, isSuccess){
				if(isCache){
					LoadingBar.hide();
					_complete(data);
					return;
				}

				// 测试延迟设置
				setTimeout(function(){
					if(!isSuccess){
						LoadingBar.error((_isUpload ? "上传" : "加载") + "数据失败..");
						return;
					}

					LoadingBar.hide();
					_complete(data);
				}, 1000);
			});
		}
	});

	CallServer.save([
		["getUser",				new Text("url?id={id}"),					"", true],
		["getPartnerGroups",			"url",								"", true],
		["getPartners",			new Text("url?groupId={groupId}"),			"", true],
		["getProjects",			"url",										"", true],
		["getSchedules",		new Text("url?last={last}&next={next}"),	"", true],
		["addProject",			new Text("url?title={title}&color={color}&desc={desc}&users={users}"), "POST"],
		["myInformation",		"url",										"", true],
		["globalSearch",		new Text("url?search={search}"),				"", true]
	], allHandlers);

	return CallServer;
}(
	jQun.Ajax,
	Bao.UI.Control.Wait,
	jQun.Ajax.open,
	// allHandlers
	{
		getPartnerGroups : function(data){
			data = Index.SPP.getPartnerGroups();

			return {
				groups : data
			};
		},
		getPartners : function(data){
			var userListCollection = [], letters = {},
				forEach = jQun.forEach, charCodeAt = "".charCodeAt;

			forEach("ABCDEFGHIJKLMNOPQRSTUVWXYZ", function(l){
				letters[l] = -1;
			});

			data = Index.Common.getUsers(30);

			forEach(data, function(user){
				var firstLetter = user.pinyin.substring(0, 1).toUpperCase(),
						
					idx = letters[firstLetter];

				if(idx === -1){
					letters[firstLetter] = userListCollection.length;
					userListCollection.push({
						firstLetter : firstLetter,
						users : [user]
					});

					return;
				}

				userListCollection[idx].users.push(user);
			});

			userListCollection.sort(function(i, n){
				return charCodeAt.call(i.firstLetter) - charCodeAt.call(n.firstLetter);
			});

			return {
				letters : letters,
				userListCollection : userListCollection
			};
		},
		getProjects : function(data){
			data = {
				projects : Index.SPP.getProjects(3),
				pageIndex : 1,
				pageMax : 1,
				pageSize : 15,
				emptyFolders : 3
			};

			data.projects.forEach(function(pro){
				pro.status = 1;
			});

			return data;
		},
		getSchedules : function(data){
			data = Index.SPP.getSchedules(new Date(Date.now()), 2, 2);

			data.forEach(function(d){
				var localDate = new Date(d.time);

				jQun.set(d, {
					localeDateString : localDate.toLocaleDateString(),
					date : localDate.getDate()
				});

				d.projects.forEach(function(pro){
					pro.key = pro.id;
				});
			});

			return {
				schedules : data
			};
		},
		getUser : function(data){
			data = Index.Common.getUser();

			return data;
		},
		myInformation : function(data){
			data = Index.Common.myInformation();

			return data;
		},
		addProject : function(data){
			data = { id : Bao.Test.DummyData.Generate.Number.random(6) };
			
			return data;
		},
		globalSearch : function(data){
			var result = [], random = Bao.Test.DummyData.Generate.Number.random;

			data = {
				projects : Index.SPP.getProjects(random(10)),
				todo : [],
				comments : [],
				partners : Index.Common.getUsers(random(10))
			};

			return data;
		}
	}
));

Bao.members(this);
}.call(
	{},
	Bao,
	jQun.JSON,
	jQun.Text,
	// 以下为测试用的类
	Bao.Test.DummyData.Index
));