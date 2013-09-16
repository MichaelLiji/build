(function(){
with(this){
	this.DS_user = {
		id : 1, // number
		name : "mj", // string
		pinyin : "a", // string : the first letter of the user's name
		avatar : "../../image/avatar.png", // string
		company : "北京视宽加速有限公司", // string
		companyAdress : "beijing", // string
		position : "coder", // string : job title ?
		phoneNum : "010-12345678", // string
		email : "mj@BaoPiQi.com", // string
		adress : "beijing", // string : home adress
		QRCode : "../../image/qrcode" // string
	};

	this.DS_users = [
		DS_user,
		// ...
		DS_user
	];

	this.DS_group = {
		id : 1, // number
		name : "group's name" // string
	};

	this.DS_project = {
		id : 1, // number
		level : 1, // number : from 1 to 3
		title : "my title", // string
		color : 1, // number : from 0 to 5(0 : orange, 1 : tan, 2 : cyan, 3 : blue, 4 : henna, 5 : purple)
		users : DS_users,
		creator : DS_user,
		creationTime : new Date().getTime(), // number : the milliseconds since 1970/01/01
		lastMessage : "oh, thanks!", // string
		unread : 66, // number : the max is 99
		desc : "abc" // string : description of the project
	};
}
window.index_dataStructure = this;
}.call({}));