(function(Bao, StaticClass){
this.Global = (function(Fixed, Management, HTML){
	function Global(){
		///	<summary>
		///	全局类，用于存储页面中的一些全局属性。
		///	</summary>
		var Global = this;

		jQun(window).attach({
			load : function(){
				//jQun("body").set("zoom", window.screen.width / 640, "css");
			
				// 初始化历史记录
				var history = new Management.History();

				Global.assign({
					history :　history,
					mask : new Fixed.Mask("#mask"),
					// 初始化标题栏
					titleBar : new Fixed.TitleBar(
						"#titleBar",
						history,
						new HTML("title_tools_html", true)
					)
				});

				// 首先要登录才会用登录用户的数据
				history.go("login");

//				SERVER.SESION.get("user_email") === "igorizr1@gmail.com" ? history.go("login").login("igorizr1@gmail.com","qwerty123") : history.go("login");
			},
			login : function(e){
				Global.loginUser = e.loginUser;
			}
		});
	};
	Global = new StaticClass(Global, "Bao.Global", {
		history : undefined,
		// 当前登录用户的数据
		loginUser : undefined,
		titleBar : undefined
	});

	return Global;
}(
	Bao.UI.Fixed,
	Bao.API.Management,
	jQun.HTML
));

Bao.members(this);
}.call(
	{},
	Bao,
	jQun.StaticClass
));