(function(Guidance, NonstaticClass, Panel, PagePanel){
this.Login = (function(ValidationList, OverflowPanel, CallServer){
	function Login(selector){
		var sectionEl = this.find(">section"),
		
			validationList = new ValidationList();

		sectionEl.find("input").forEach(function(input, i){
			validationList.addValidation(jQun(input), function(el, Validation){
				return Validation.result(el.value, el.get("vtype", "attr"));
			});
		});

		sectionEl.attach({
			userclick : function(e){
				var targetEl = jQun(e.target);

				if(targetEl.between("button", this).length > 0){
					var htmlStr = targetEl.innerHTML;

					if(htmlStr === "登录"){
						validationList[1].validate();
						validationList[2].validate();
						return;
					}

					if(htmlStr === "返回登录"){
						sectionEl.classList.remove("register");
						targetEl.innerHTML = "登录";
						return;
					}

					sectionEl.find("button:first-child").innerHTML = "返回登录";
					sectionEl.classList.add("register");
					return;
				}
			}
		});

		new OverflowPanel(this[0]);
		this.getInfo();
	};
	Login = new NonstaticClass(Login, "Bao.Page.Index.Guidance.Login", PagePanel.prototype);

	Login.properties({
		getInfo : function(){
			var login = this;

			CallServer.open("getLoginInfo", null, function(data){
				login.find(">header>span").innerHTML = data.count.toLocaleString();
			});
		}
	});

	Login.override({
		showTitleBar : false
	});

	return Login.constructor;
}(
	Bao.API.DOM.ValidationList,
	Bao.API.DOM.OverflowPanel,
	Bao.CallServer
));

this.Self = (function(){
	function Self(){
		
	};
	Self = new NonstaticClass(Self, "Bao.Page.Index.Guidance.Self", Panel.prototype);

	return Self.constructor;
}());

Guidance.members(this);
}.call(
	{},
	Bao.Page.Index.Guidance,
	jQun.NonstaticClass,
	Bao.API.DOM.Panel,
	Bao.API.DOM.PagePanel
));