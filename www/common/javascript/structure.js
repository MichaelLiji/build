(function(Namespace, NonstaticClass, StaticClass){
this.Bao = (function(Bao){
	// 以下路径是相对于本文件的路径
	Bao.members({
		API : new Namespace().members({
			Data : new Namespace().members({ // api/data.js
				BatchLoad : null
			}),
			DOM : new Namespace().members({ // api/dom.js
				EventCollection : null,
				PagePanel : null,
				Panel : null,
				Validation : null,
				ValidationList : null
			}),
			Management : new Namespace().members({ // api/management.js
				History : null,
				IntervalTimer : null,
				Loader : null,
				Timer : null
			})
		}),
		CallServer : null, // callServer.js
		Global : null, // global.js
		Page : new Namespace().members({
			Index : new Namespace().members({ // ../../directoy/javascript/index\
				Deep : new Namespace({ // ../../directoy/javascript/index/deep.js
					AboutBaoPiQi : null,
					Account : null,
					QRCode : null
				}),
				Home : new Namespace({ // ../../directoy/javascript/index/home.js
					Partner : null,
					Project : null,
					SPP : null,
					Schedule : null,
					Tab : null
				}),
				Secondary : new Namespace({ // ../../directoy/javascript/index/secondary.js
					AddProject : null,
					SystemOption : null
				})
			})
		}),
		Test : new Namespace().members({ 
			DummyData : new Namespace().members({ // ../../test/dummyData
				Generate : new Namespace().members({
					Number : null,
					String : null
				}),
				Index : new Namespace().members({
					Common : null,
					SPP : null
				})
			})
		}),
		UI : new Namespace().members({
			Control : new Namespace().members({ // ui/control
				Drag : new Namespace().members({ // ui/control/drag.js
					Navigator : null,
					Scroll : null
				}),
				List : new Namespace().members({ // ui/control/list.js
					AnchorList : null,
					ProjectAnchorList : null,
					UserAnchorList : null,
					UserIndexList : null,
					UserList : null,
					UserSelectionList : null
				}),
				Time : new Namespace().members({ // ui/control/time.js
					Calendar : null
				}),
				Wait : new Namespace().members({ // ui/control/wait.js
					LoadingBar : null
				})
			}),
			Fixed : new Namespace({ // ui/fixed.js
				Mask : null,
				TitleBar : null
			})
		})
	});

	return Bao;
}(
	new Namespace()
));

}.call(
	window,
	jQun.Namespace,
	jQun.NonstaticClass,
	jQun.StaticClass
));