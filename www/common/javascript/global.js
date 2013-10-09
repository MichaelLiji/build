(function(Bao, StaticClass){
this.Global = (function(Fixed, Management, HTML, Browser){
	function Global(){
		///	<summary>
		///	全局类，用于存储页面中的一些全局属性。
		///	</summary>
		var Global = this;

		jQun(window).attach({
			appload : function(){
				// 初始化历史记录
				var history = new Management.History();

				//jQun("body").set("zoom", window.screen.width / 640, "css");
//                                console.log(Browser)
				// iphone ios7标题栏css兼容
//				if(Browser.isMobile && Browser.agent === "iPhone" && Browser.version === "7.0"){
                                if(window.navigator.userAgent.match(/iPhone OS 7/i)){
					jQun(".main").setCSSPropertyValue("top", "20px");
				}
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
	jQun.HTML,
	jQun.Browser
));

Bao.members(this);
}.call(
	{},
	Bao,
	jQun.StaticClass
));