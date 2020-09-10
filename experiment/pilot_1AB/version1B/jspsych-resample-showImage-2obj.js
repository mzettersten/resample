/**
 * jspsych-resample-showImage-2obj
 * Martin Zettersten
 */

jsPsych.plugins['resample-showImage-2obj'] = (function() {

  var plugin = {};
  
  var context = new AudioContext();
  
  jsPsych.pluginAPI.registerPreload('resample-showImage-2obj', 'images', 'image');
  jsPsych.pluginAPI.registerPreload('resample-showImage-2obj', 'audio', 'audio');
  

  plugin.trial = function(display_element, trial) {
	  
      // default values
      trial.canvas_size = trial.canvas_size || [1024,650];
      trial.image_size = trial.image_size || [150,150];
	  trial.location = trial.location || 0;
	  trial.imageOrder = trial.imageOrder || [0,1,2,3];
	  trial.images = trial.images || ["stims/penguin.png","stims/monkey.png"];
	  trial.standardIm = trial.standardIm || ["stims/Bear_Smile.png"];
	  trial.rocket = trial.rocket || ["stims/rocketship.png"]
	  trial.rocket_counter = trial.rocket_counter || 0;
	  trial.num_rockets = trial.num_rockets ||  4;
	  trial.add_rocket = trial.add_rocket || false;
	  trial.audio = trial.audio || "stims/bleep.wav";
	  trial.input = trial.input || "click";
	  trial.timing_post_trial = typeof trial.timing_post_trial == 'undefined' ? 0 : trial.timing_post_trial;
	  
	  
	  
      // if any trial variables are functions
      // this evaluates the function and replaces
      // it with the output of the function
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
	  
      display_element.append($("<svg id='jspsych-resample-showImage-canvas' width=" + trial.canvas_size[0] + " height=" + trial.canvas_size[1] + "></svg>"));

      var s = Snap("#jspsych-resample-showImage-canvas");

				  

	  var rect = s.rect(300,325, 200, 200,10,10);
	  rect.attr({
		  fill: "#FFFFFF",
		  stroke: "#000",
		  strokeWidth: 5
	  });
		  
	var circleLocations = [
		[150, 425],
		[650, 425]
	];
				  
	  var bigCircle1 = s.circle(circleLocations[trial.imageOrder[0]][0],circleLocations[trial.imageOrder[0]][1], 105);
	  bigCircle1.attr({
		  fill: "#FF3333",
		  stroke: "#000",
		  strokeWidth: 5
	  });
	  
	  var bigCircle2 = s.circle(circleLocations[trial.imageOrder[1]][0],circleLocations[trial.imageOrder[1]][1], 105);
	  bigCircle2.attr({
		  fill: "lightblue",
		  stroke: "#000",
		  strokeWidth: 5
	  });
	  
	  var imageLocations = [
		  [75, 350],
		  [575, 350]
	  ];
	  
	  if (trial.add_rocket) {
	  
		  var rocket1 = s.image(trial.rocket,900,475,75,150);
		  var rocket2 = s.image(trial.rocket,900,320,75,150);
		  var rocket3 = s.image(trial.rocket,900,165,75,150);
		  var rocket4 = s.image(trial.rocket,900,10,75,150);
	  
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
	  
	  //var centerLocation=[340,365];
	  
	  var start_time = (new Date()).getTime();
	  
	//function to play audio
	  function playSound(buffer) {
	    var source = context.createBufferSource(); // creates a sound source
	    source.buffer = jsPsych.pluginAPI.getAudioBuffer(buffer);                    // tell the source which sound to play
	    source.connect(context.destination);       // connect the source to the context's destination (the speakers)
	    source.start(0);                           // play the source now
	  }
	  // var audio = new Audio(trial.audio);
	  
	  //var standard = s.image(trial.standardIm,311,55,179,258);
	  
	  var image1 = s.image(trial.images[trial.imageOrder[0]], imageLocations[trial.imageOrder[0]][0], imageLocations[trial.imageOrder[0]][1], 0,0);
	  var image2 = s.image(trial.images[trial.imageOrder[1]], imageLocations[trial.imageOrder[1]][0], imageLocations[trial.imageOrder[1]][1], 0,0);
	  
	  image1.attr({
		  opacity: "0"
	  });
	  image2.attr({
		  opacity: "0"
	  });
	  
	  var rt = [];
	  
	  if (trial.input == "touch") {
    	    bigCircle1.touchstart(function() {
				playSound(trial.audio);
    			inputEvent(image1,bigCircle1,bigCircle2,false);
    			bigCircle2.touchstart(function() {
					playSound(trial.audio);
    				inputEvent(image2,bigCircle2,rect,true);
    				
    			});
    		});
	  } else {
  	    bigCircle1.click(function() {
			playSound(trial.audio);
  			inputEvent(image1,bigCircle1,bigCircle2,false);
  			bigCircle2.click(function() {
				playSound(trial.audio);
  				inputEvent(image2,bigCircle2,rect,true);
  				
  			});
  		});
	  };
	  
	  function inputEvent(im,circle,nextCircle,end) {
		if (trial.input=="click") {
			circle.unclick();
		} else {
			circle.untouchstart();
		};
		var end_time = (new Date()).getTime();
		rt.push(end_time - start_time);
  	  	im.animate({
			opacity: "1",
			width: trial.image_size[0],
			height: trial.image_size[1]
		}, 300,mina.linear,function(){
  			nextCircle.attr({
  				fill: "#FF3333",
  			});
		});
		
		//playSound(trial.audio);
	  	//audio.play();
		circle.animate({
			fill: "#FFFFFF"
		}, 300, function(){
			if (end==true) {
				endTrial();
			}
		});
	};
	  
      function endTrial() {
		  var trial_data = {
			  "image1": trial.images[0],
			  "image2": trial.images[1],
			  "pushImage1": trial.images[trial.imageOrder[0]],
			  "pushImage2": trial.images[trial.imageOrder[1]],
			  "locationIndex1": trial.imageOrder[0],
			  "locationIndex2": trial.imageOrder[1],
			  "rtPush1": rt[0],
			  "rtPush2": rt[1]
		  }; 
	      // clear the display
	      display_element.html('');
		  
		  jsPsych.finishTrial(trial_data);
	  };
  };	  
		
		return plugin;
})();