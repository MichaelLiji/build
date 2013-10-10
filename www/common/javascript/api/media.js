(function(Media, NonstaticClass, StaticClass){
this.Voice = (function(Panel, VoiceMessage, recordCompleteEvent){
	function Voice(){};
	Voice = new StaticClass(Voice, "Bao.API.Media");

	Voice.properties({
		pause : function(){
			if(!VoiceMessage)
				return;

			VoiceMessage.pause();
		},
		play : function(id){
			if(!VoiceMessage)
				return;

			VoiceMessage.play(id);
		},
		recordStart : function(target){
            alert("rst")
			if(!VoiceMessage){
				recordCompleteEvent.setEventAttrs({
					src : ""
				});
				recordCompleteEvent.trigger(target);
				return;
			}

			var Voice = this;

			VoiceMessage.record_start(function(src){
                            alert("hello")
                            alert(src)
                                console.log("src")
                                console.log(src)
				recordCompleteEvent.setEventAttrs({
					src : src
				});
				recordCompleteEvent.trigger(target);
			});
		},
		recordStop : function(){
			if(!VoiceMessage)
				return;

			VoiceMessage.record_stop();
		},
		save : function(){
			if(!VoiceMessage)
				return;

			VoiceMessage.save();
		},
		stop : function(){
			if(!VoiceMessage)
				return;

			VoiceMessage.stop();
		}
	});

	return Voice;
}(
	Bao.API.DOM.Panel,
	(window.Models || {}).VoiceMessage,
	// recordCompleteEvent
	new jQun.Event("recordcomplete")
));

Media.members(this);
}.call(
	{},
	Bao.API.Media,
	jQun.NonstaticClass,
	jQun.StaticClass
));