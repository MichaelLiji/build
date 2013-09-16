(function(DummyData, StaticClass){
var Common,

	Index = DummyData.Index,
	
	Generate = DummyData.Generate,
	
	Number = Generate.Number,
	
	String = Generate.String;

this.Common = Common = (function(){
	function Common(){};
	Common = new StaticClass(null, "Bao.Test.DummyData.Common");

	Common.properties({
		getUser : function(){
			var name = String.random(5), firstLetter = name.substring(0, 1);

			return {
				id : Number.id(),
				name : name,
				pinyin : firstLetter.match(/[A-Za-z]/) ? firstLetter : isNaN(firstLetter - 0) ? "z" : "a", // 这里只返回拼音首字母
				avatar : "../../test/image/avatar/" + Number.random(16) + ".jpg",
				company : String.random(10),
				companyAdress : String.random(30),
				position : String.random(4),
				phoneNum : Number.random(14000000000),
				email : String.random(8) + "@BaoPiQi.com",
				adress : String.random(30),
				QRCode : "../../test/image/avatar/" + Number.random(16) + ".jpg"
			};
		},
		getUsers : function(_len){
			var users = [];

			if(_len == undefined){
				_len = Number.random(100);
			}

			for(var i = 0;i < _len;i++){
				users.push(this.getUser());
			}

			return users;
		},
		myInformation : function(){
			return this.getUser();
		}
	});

	return Common;
}());

this.SPP = (function(){
	function SPP(){};
	SPP = new StaticClass(null, "Bao.Test.DummyData.Test");

	SPP.properties({
		getPartnerGroups : function(){
			var groups = [], length = Number.random(15);

			for(var i = 0;i < length;i++){
				groups.push({
					name : String.random(6),
					id : Number.random(10000)
				});
			}

			return groups;
		},
		getPartners : function(name){
			return {
				partners : Common.getUsers(),
				letter : ["a", "b", "c"]
			};
		},
		getSingleProject : function(){
			return {
				id : Number.id(),
				level : Number.random(3),
				title : String.random(),
				color : Number.random(5),
				users : Common.getUsers(Number.random(20)),
				lastMessage : String.random(),
				creator : Common.getUser(),
				creationTime : new Date().getTime(),
				unread : Number.random(2) > 1 ? 0 : Number.random(),
				desc : String.random(1000),
				attachments : []
			};
		},
		getProjects : function(_len){
			var projects = [];

			if(!_len){
				_len = Number.random(30);
			}

			for(var i = 0;i < _len;i++){
				projects.push(this.getSingleProject());
			}

			return projects;
		},
		getSchedules : function(date, last, next){
			var endDate, schedule = [],
			
				beginDate = new Date(date.getTime());

			beginDate.setMonth(beginDate.getMonth() - 1, 1);
			beginDate.setHours(0, 0, 0, 0);

			endDate = new Date(beginDate.getTime());
			endDate.setMonth(beginDate.getMonth() + 3, 0);

			for(var j = endDate.getTime();beginDate.getTime() < j;){
				schedule.push({
					time : beginDate.setDate(beginDate.getDate() + 1),
					projects : this.getProjects(Number.random(5))
				});
			}

			return schedule;
		}
	});

	return SPP;
}());

Index.members(this);
}.call(
	{},
	Bao.Test.DummyData,
	jQun.StaticClass
));