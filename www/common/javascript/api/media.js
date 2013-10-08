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
			if(!VoiceMessage){
				recordCompleteEvent.trigger(target);
				return;
			}

			voiceMessage.record_start(function(){
				recordCompleteEvent.trigger(target);
			});
		},
		recordStop : function(){
			if(!VoiceMessage)
				return;

			voiceMessage.record_stop();
		},
		save : function(){
			if(!VoiceMessage)
				return;

			voiceMessage.save();
		},
		stop : function(){
			if(!VoiceMessage)
				return;

			voiceMessage.stop();
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