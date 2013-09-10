(function(Bao, StaticClass){
this.Global = (function(Fixed, Management, HTML){
	function Global(){
		///	<summary>
		///	全局类，用于存储页面中的一些全局属性。
		///	</summary>
		var Global = this;

		window.onload = function(){
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

			// 跳转到指定页
			history.go("globalSearch");
		};
	};
	Global = new StaticClass(Global, "Bao.Global", {
		history : undefined,
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