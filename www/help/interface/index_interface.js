(function(CallServer, Text){
with(window.index_dataStructure){ // from ../dataStructure/index_dataStructure.js
	/*
		CallServer.save([
			"getUser",  // ajax name
			new Text("url?id={userid}"), // ajax url and url params, and the params will be automatically replace by params
			"", // ajax type, "get" or "post"
			true // cacheable
		]);

		{
			params : {
				userid : 1000
			},
			return : {
				DS_user
			}
		};
	*/

	CallServer.save([
		/*
			{
				params : {
					id : 1 // number
				},
				return : DS_user
			};
		*/
		["getUser",				new Text("url?id={id}"),					"", true],
		/*
			{
				params : null,
				return : [
					DS_group,
					...,
					DS_group
				]
			}
		*/
		["getPartnerGroups",			"url",								"", true],
		/*
			{
				params : {
					groupId : 1 // number
				},
				return : DS_users
			}
		*/
		["getPartners",			new Text("url?groupId={groupId}"),			"", true],
		/*
			{
				params : null,
				return : data = {
					projects : DS_project,
					pageIndex : 1, // number
					pageMax : 1, // number
					pageSize : 15, // number
					emptyFolders : 3 // number
				}
			}
		*/
		["getProjects",			"url",										"", true],
		/*
			undefined
		*/
		["getSchedules",		new Text("url?last={last}&next={next}"),	"", true],
		/*
			{
				params : {
					title : "", // string
					color : 0, // number : from 0 to 5
					desc : "" // string : descript
					users : "1,2,3,4,5" // string : "id,id,id,id"
				},
				return : 1 // number : return an id of the project
			}
		*/
		["addProject",			new Text("url?title={title}&color={color}&desc={desc}&users={users}"), "POST"],
		/*
			{
				params : null,
				return : DS_user
			}
		*/
		["myInformation",		"url",										"", true],
		/*
			{
				params : null,
				return : {
					count : 123456, // number : get the count of all users which they are used the app
					validationImage : "javascript:void(0);" // string : url of validation image
				}
			}
		*/
		["getLoginInfo",		"url"]
	]);
}
}(
	Bao.CallServer,
	jQun.Text
));