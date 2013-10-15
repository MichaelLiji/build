(function(Media, NonstaticClass, StaticClass){
this.Voice = (function(Panel, Models){
	function Voice(){};
	Voice = new StaticClass(Voice, "Bao.API.Media");

	Voice.properties({
		pause : function(){
			if(!Models.VoiceMessage)
				return;

			Models.VoiceMessage.pause();
		},
		play : function(id, type){
			if(!Models.VoiceMessage)
				return;

			Models.VoiceMessage.play(id, type);
		},
		recordStart : function(){
			if(!Models.VoiceMessage)
				return;

			var Voice = this;

			Models.VoiceMessage.record_start(function(src){
				Voice.src = src;
			});
		},
		recordStop : function(target){
			if(Models.VoiceMessage){
				Models.VoiceMessage.record_stop();
			}

			return this.src;
		},
		save : function(){
			if(!Models.VoiceMessage)
				return;

			Models.VoiceMessage.save();
		},
		src : "",
		stop : function(){
			if(!Models.VoiceMessage)
				return;

			Models.VoiceMessage.stop();
		}
	});

	return Voice;
}(
	Bao.API.DOM.Panel,
	window.Models || {}
));

Media.members(this);
}.call(
	{},
	Bao.API.Media,
	jQun.NonstaticClass,
	jQun.StaticClass
));