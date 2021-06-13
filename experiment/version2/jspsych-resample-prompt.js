/**
 * resample- learning - prompt
 * plugin for learning trials in active word learning study resample
 * Martin Zettersten
 */

jsPsych.plugins['resample-prompt'] = (function() {

  var plugin = {};
  
  var context = new AudioContext();

  plugin.trial = function(display_element, trial) {
	  
      // default values
      trial.canvas_size = trial.canvas_size || [1024,700];
	  trial.standardIm = trial.standardIm || ["stims/Bear_Smile.png"];
	  trial.timing_post_trial = typeof trial.timing_post_trial == 'undefined' ? 0 : trial.timing_post_trial;
	  trial.endTrialPause = trial.endTrialPause || 500;
	  trial.standardIm2 = trial.standardIm2 || ["stims/space_helmet.png"];
	  trial.rocket = trial.rocket || ["stims/rocketship.png"];
	  trial.rocket_counter = trial.rocket_counter || 0;
	  trial.add_rocket = trial.add_rocket || false;
	  trial.num_rockets = trial.num_rockets ||  4;
	  trial.audio = trial.audio || "stims/bleep.wav";
	  trial.responseKind = trial.responseKind || "click";
	  
      // if any trial variables are functions
      // this evaluates the function and replaces
      // it with the output of the function
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
	  
	//function to play audio
	  function playSound(buffer) {
	    var source = context.createBufferSource(); // creates a sound source
	    source.buffer = jsPsych.pluginAPI.getAudioBuffer(buffer);                    // tell the source which sound to play
	    source.connect(context.destination);       // connect the source to the context's destination (the speakers)
	    source.start(0);                           // play the source now
	  }
	  
	  display_element.append($("<svg id='jspsych-training-canvas' width=" + trial.canvas_size[0] + " height=" + trial.canvas_size[1] + "></svg>"));

      var paper = Snap("#jspsych-training-canvas");
	  
	  var standardBack = paper.image(trial.standardIm,311,225,179,258);
	  var standard2 = paper.image(trial.standardIm2,288,187,230,210);
	  var standard = paper.image(trial.standardIm,311,225,179,258);
	  standard.attr({opacity:0});
	  
	  if (trial.add_rocket) {
	  
		  var rocket1 = paper.image(trial.rocket,900,475,75,150);
		  var rocket2 = paper.image(trial.rocket,900,320,75,150);
		  var rocket3 = paper.image(trial.rocket,900,165,75,150);
		  var rocket4 = paper.image(trial.rocket,900,10,75,150);
	  
		  rocket1.attr({
			  opacity: "0"
		  });
		  rocket2.attr({
			  opacity: "0"
		  });
		  rocket3.attr({
			  opacity: "0"
		  });
		  rocket4.attr({
			  opacity: "0"
		  });
		  
		  if (trial.num_rockets>0)  {
			  rocket1.attr({
				  opacity: "0.25"
			  });
		  }
		  
		  if (trial.num_rockets>1)  {
			  rocket2.attr({
				  opacity: "0.25"
			  });
		  }
		  
		  if (trial.num_rockets>2)  {
			  rocket3.attr({
				  opacity: "0.25"
			  });
		  }
		  if (trial.num_rockets>3)  {
			  rocket4.attr({
				  opacity: "0.25"
			  });
		  }
		  
		  if (trial.rocket_counter>0) {
			  rocket1.attr({
				  opacity: "1"
			  });
		  }
		  if (trial.rocket_counter>1) {
			  rocket2.attr({
				  opacity: "1"
			  });
		  }
		  if (trial.rocket_counter>2) {
			  rocket3.attr({
				  opacity: "1"
			  });
		  }
		  if (trial.rocket_counter>3) {
			  rocket4.attr({
				  opacity: "1"
			  });
		  }
	  }
	  
	  var rt = "NA";
	  var start_time = (new Date()).getTime();
	    
	  var trial_data={};
	  if (trial.responseKind == "touch") {
		  standard.touchstart(function() {
			  standard.untouchstart();
	  		var end_time = (new Date()).getTime();
	  		rt = end_time - start_time;
			playSound(trial.audio);
			setTimeout(function() {
				endTrial();
			}, trial.endTrialPause);
		});
	  } else {
		  standard.click(function() {
			  standard.unclick();
	  		var end_time = (new Date()).getTime();
	  		rt = end_time - start_time;
			playSound(trial.audio);
			setTimeout(function() {
				endTrial();
			}, trial.endTrialPause);
		});
	  }


		
		


	  
	  
      function endTrial() {
		//var audioFeedback = new Audio(trial.audioFeedback);
		//audioFeedback.play();
        var trial_data = {
			"rt": rt
		};
		display_element.html('');
		jsPsych.finishTrial(trial_data);
		
      };
  };	  
		
		return plugin;
})();