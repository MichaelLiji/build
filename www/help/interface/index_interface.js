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
				params : {
					name : "1234",
					users : [
						
					]
				}
			}
		*/
		["createGroup",			new Text("url?name={name}&users={users}"),	""],
		
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
			{
				params : {
					last : 111111111, // number : time ticks
					next : 111111111 // number : time ticks
				},
				return [
					projects : [
						DS_project,
						// ...,
						DS_project
					],
					time : 111111, // number : time ticks
				]
			}
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
		["getLoginInfo",		"url"],
		
		/*
			{
				params : {
					name : "name", // string : name
					pwd : "password", // string : password
					email : "what@vision2.com", // string : email
					validation : "1234" // string
				},
				return : {
					error : {
						type : "name", // string : "name", "pwd", "email" or "validation"
						idx : 0, // number : "name" -> 0, "email" -> 1, "pwd" -> 2, "validation" -> 4
						desc : "The name already exist." // string : description of the error
					},
					status : -1 // number : -1 -> error, 0 -> ok; if status is 0 and the error will be undefined, or you can only return an attribute.
				}
			}
		*/
		["register",			new Text("url?name={name}&pwd={password}&email={email}"),	""],

		/*
			{
				params : {
					pwd : "password", // string : password
					email : "what@vision2.com", // string : email
					validation : "1234" // string
				},
				return : {
					error : {
						type : "email", // string : "pwd", "email" or "validation"
						idx : 1, // number : "email" -> 1, "pwd" -> 2, "validation" -> 4
						desc : "The email is not exist." // string : description of the error
					},
					user : DS_user,
					status : -1 // number : -1 -> error, 0 -> ok; if status is 0 and the error will be undefined, or you can only return an attribute.
				}
			}
		*/
		["login",				new Text("url?email={email}&pwd={pwd}"),	""],

		/*
			{
				params : {
					emails : "a@vision2.com,b@vision2.com,c@vision2.com"
				},
				return : null
			}
		*/
		["invitation",		new Text("url?emails={emails}"),				""],

		/*
			{
				params {
					id : "1213"
				},
				return : null
			}
		*/
		["toDoCompleted",		new Text("url?id={id}"),					""],

		/*
			{
				params : {
					title : "sss",
					remind : 0, // number : 0 -> false, 1 -> true
					desc : "sss",
					attachments : [
						DS_attachment,
						// ...
						DS_attachment
					]
				},
				return : {
					id : 1 // the id of todo
				}
			}	
		*/
		["sendToDo",			new Text("url?title={title}&remind={remind}&desc={desc}&attachments={attachments}&date={date}"), "POST"],

		/*
			{
				params : {
					id : 1 // the id of todo
				},
				return : DS_toDoInfo
			}
		*/
		["getToDoInfo",				new Text("url?id={id}"),					"", true],

		/*
			{
				params : {
					id : 1 // the id of project
				},
				return : [
					DS_toDoInfo,
					// ...
					DS_toDoInfo
				]
			}
		*/
		["getToDoList",			new Text("url?id={id}"),					"",	true],


		/*
			{
				params : {
					id : 123, // number : the id of the type(project or todo)
					type : "project" // string : "project" or "todo"
				},
				return : [
					DS_message,
					// ..
					DS_message
				]
			}
		*/
		["getMessages",			new Text("url?id={id}&type={type}"),		"", true],

		/*
			{
				params : {
					projectId : 1234,
					text : "1234",
					type : "text" // string : "text", "image" or "voice",
					attachment : DS_attachment
				},
				return {
					status : 0
				}
			}
		*/
		["addComment",			new Text("url?text={text}&type={type}"),	""]
	]);
}
}(
	Bao.CallServer,
	jQun.Text
));