﻿(function(Namespace, NonstaticClass, StaticClass){
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
			}),
			Media : new Namespace().members({ // api/media.js
				Voice : null
			})
		}),
		CallServer : null, // callServer.js
		Global : null, // global.js
		Page : new Namespace().members({
			Index : new Namespace().members({ // ../../directoy/javascript/index
				Deep : new Namespace({ // ../../directoy/javascript/index/deep.js
					AboutBaoPiQi : null,
					Account : null,
					Archive : null,
					ArchivedProjectView : null,
					ProjectManagement : null,
					QRCode : null,
					Todo : null
				}),
				Guidance : new Namespace({ // ../../directory/javascript/index/guidance.js
					CreateFirstProject : null,
					Footer : null,
					Invitation : null,
					Login : null,
					LoginInfoManagement : null
				}),
				SPP : new Namespace({ // ../../directoy/javascript/index/home.js
					Partner : null,
					Project : null,
					Schedule : null,
					Self : null,
					Tab : null
				}),
				Secondary : new Namespace({ // ../../directoy/javascript/index/secondary.js
					AddProject : null,
					BusinessCard : null,
					SingleProject : null,
					SystemContacts : null,
					SystemOption : null
				}),
				SingleProject : new Namespace({ // ../../directoy/javascript/index/singleProject.js
					Discussion : null,
					Header : null,
					Self : null,
					TodoList : null
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
				Chat : new Namespace().members({ // ui/control/chat.js
					Attachment : null,
					ChatInput : null,
					ChatListContent : null,
					ImageBox : null,
					Message : null,
					MessageGroup : null,
					MessageList : null
				}),
				Drag : new Namespace().members({ // ui/control/drag.js
					Navigator : null,
					Scroll : null
				}),
				List : new Namespace().members({ // ui/control/list.js
					AnchorList : null,
					ChatList : null,
					LevelAnchorList : null,
					UserAnchorList : null,
					UserIndexList : null,
					UserList : null,
					UserManagementList : null,
					UserSelectionList : null
				}),
				Time : new Namespace().members({ // ui/control/time.js
					Calendar : null,
					DateTable : null
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