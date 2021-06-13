/**
 * jspsych-resample-learning-2obj
 * Martin Zettersten
 */

jsPsych.plugins['resample-learning-2obj'] = (function() {

  var plugin = {};
  
  var context = new AudioContext();
  
  jsPsych.pluginAPI.registerPreload('resample-learning-2obj', ['images'], 'image');
  jsPsych.pluginAPI.registerPreload('resample-learning-2obj', 'audio', 'audio');
  jsPsych.pluginAPI.registerPreload('resample-learning-2obj', 'audioTrill', 'audio');
  

  plugin.trial = function(display_element, trial) {
	  
      // default values
      trial.canvas_size = trial.canvas_size || [1024,650];
      trial.image_size = trial.image_size || [150,150];
	  trial.condition = trial.condition || "active";
	  trial.location = trial.location || 0;
	  trial.images = trial.images || ["stims/penguin.png", "stims/monkey.png"];
	  trial.standardIm = trial.standardIm || ["stims/Bear_Smile.png"];
	  trial.standardImTalk = trial.standardImTalk || ["stims/Bear_Talk.png"];
	  trial.rocket = trial.rocket || ["stims/rocketship.png"]
	  trial.rocket_counter = trial.rocket_counter || 0;
	  trial.add_rocket = trial.add_rocket || false;
	  trial.num_rockets = trial.num_rockets ||  4;
	  trial.audio = trial.audio || ["stims/norm_it_penguin.m4a","stims/norm_it_monkey.m4a"];
	  trial.audioDur = trial.audioDur || 1300;
	  trial.audioTrill = trial.audioTrill || "stims/trill.wav";
	  trial.onsetWait = trial.onsetWait || 0;
	  trial.targetIndex = trial.targetIndex || 0;
	  trial.endTrialPause = trial.endTrialPause || 500;
	  trial.input = trial.input || "click";
	  trial.timing_post_trial = typeof trial.timing_post_trial == 'undefined' ? 0 : trial.timing_post_trial;
	  
	  
	  
      // if any trial variables are functions
      // this evaluates the function and replaces
      // it with the output of the function
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
	  
      display_element.append($("<svg id='jspsych-resample-learning-canvas' width=" + trial.canvas_size[0] + " height=" + trial.canvas_size[1] + "></svg>"));

      var s = Snap("#jspsych-resample-learning-canvas");
	  
	  var rectFill = "#FFFFFF";
	  if (trial.condition=="passive") {
		  rectFill = "#FF3333";
	  };
	  
	  var rect = s.rect(300,325, 200, 200,10,10);
	  rect.attr({
		  fill: rectFill,
		  stroke: "#000",
		  strokeWidth: 5
	  });
				  
	  var bigCircle1 = s.circle(150, 425, 105);
	  bigCircle1.attr({
		  fill: "#FFFFFF",
		  stroke: "#000",
		  strokeWidth: 5
	  });
	  
	  var bigCircle2 = s.circle(650, 425, 105);
	  bigCircle2.attr({
		  fill: "#FFFFFF",
		  stroke: "#000",
		  strokeWidth: 5
	  });
	  
	  var imageLocations = [
		  [75, 350],
		  [575, 350]
	  ];
	  
	  var centerLocation=[325,350];
	  
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
	  
	//function to play audio
	  function playSound(buffer) {
	    var source = context.createBufferSource(); // creates a sound source
	    source.buffer = jsPsych.pluginAPI.getAudioBuffer(buffer);                    // tell the source which sound to play
	    source.connect(context.destination);       // connect the source to the context's destination (the speakers)
	    source.start(0);                           // play the source now
	  }

	  // var audio1 = new Audio(trial.audio[0]);
	  // var audio2 = new Audio(trial.audio[1]);
	  // var audio3 = new Audio(trial.audio[2]);
	  // var audio4 = new Audio(trial.audio[3]);
	  // var audioTrill = new Audio(trial.audioTrill);
	  
	  var start_time = (new Date()).getTime();
	  
	  //var standard = s.image(trial.standardIm,311,55,179,258);
	  
	  var image1 = s.image(trial.images[0], imageLocations[0][0], imageLocations[0][1], trial.image_size[0],trial.image_size[1]);
	  var image2 = s.image(trial.images[1], imageLocations[1][0], imageLocations[1][1], trial.image_size[0],trial.image_size[1]);
	  
	  image1.attr({
		  opacity: "1"
	  });
	  image2.attr({
		  opacity: "1"
	  });
	  var rt = 0;
	  var choice = 0;
	  
	  if (trial.condition=="active") {
		  if (trial.input == "touch") {
			//rect.touchstart(function() {
			//	rect.untouchstart();
			//	rect.animate({
			//		fill: "#FFFFFF"
			//	}, 300,mina.linear, function() {
	  			  image1.touchstart(function() {
	  				  inputEvent(image1,trial.audio[0],image2,0);
	  			  });
	  			  image2.touchstart(function() {
	  				  inputEvent(image2,trial.audio[1],image1,1);
	  			  });
			//	});
			//});
		  } else {
  			//rect.click(function() {
  			//	rect.unclick();
  			//	rect.animate({
  			//		fill: "#FFFFFF"
  			//	}, 300,mina.linear, function() {
	  			  image1.click(function() {
	  				  inputEvent(image1,trial.audio[0],image2,0);
	  			  });
	  			  image2.click(function() {
	  				  inputEvent(image2,trial.audio[1],image1,1);
	  			  });
			//  });
		  //});
	  };
  } else if (trial.condition=="passive") {
		  if (trial.input == "touch") {
			rect.touchstart(function() {
				rect.untouchstart();
				rect.animate({
					fill: "#FFFFFF"
				}, 300,mina.linear, function() {
				  	if (trial.targetIndex==0) {
				  		var imTarget=image1;
				  		var audioTarget=trial.audio[0];
				  		var im1=image2;
				  	}
	
				  	setTimeout(function() {
				  		if (trial.targetIndex==0) {
				  			inputEvent(image1,trial.audio[0],image2,trial.targetIndex);
				  		} else {
				  			inputEvent(image2,trial.audio[3],image1,trial.targetIndex);
				  		};
		
				  	}, trial.onsetWait);
				});
			});
		} else {
  			rect.click(function() {
  				rect.unclick();
  				rect.animate({
  					fill: "#FFFFFF"
  				}, 300,mina.linear, function() {
				  	if (trial.targetIndex==0) {
				  		var imTarget=image1;
				  		var audioTarget=trial.audio[0];
				  		var im1=image2;
				  	} else if (trial.targetIndex==1) {
				  		var imTarget=image2;
				  		var audioTarget=trial.audio[1];
				  		var im2=image1;
				  	}
	
				  	setTimeout(function() {
				  		if (trial.targetIndex==0) {
				  			inputEvent(image1,trial.audio[0],image2,trial.targetIndex);
				  		} else {
				  			inputEvent(image2,trial.audio[1],image1,trial.targetIndex);
				  		};
		
				  	}, trial.onsetWait);
				});
			});
			  
		  };
	  };
	  
	  function inputEvent(im,audio,im1,imChoice) {
		if (trial.input=="click") {
			image1.unclick();
			image2.unclick();
		} else {
			image1.untouchstart();
			image2.untouchstart();
		};
		var end_time = (new Date()).getTime();
		rt = end_time - start_time;
		choice = imChoice;
		var t = new Snap.Matrix();
		var imCenterX = imageLocations[imChoice][0]+trial.image_size[0]/2;
		var imCenterY = imageLocations[imChoice][1]+trial.image_size[1]/2;
		//audioTrill.play();
		playSound(trial.audioTrill);
		t.rotate(10,imCenterX,imCenterY);
		im.animate({transform: im.transform(t)},50,mina.easeinout, function() {
			t.rotate(-20,imCenterX,imCenterY);
			im.animate({transform: im.transform(t)},100,mina.easeinout, function() {
				t.rotate(20,imCenterX,imCenterY);
				im.animate({transform: im.transform(t)},100,mina.easeinout, function() {
					t.rotate(-10,imCenterX,imCenterY);
					im.animate({transform: im.transform(t)},50,mina.easeinout,function() {
				        //im.animate({ transform: "r10," + bbox.cx + ',' + bbox.cy}, 100, mina.easeinout,function() {
						//	im.animate({ transform: "r-20," + bbox.cx + ',' + bbox.cy}, 200,mina.easeinout,function() {
						//		im.animate({ transform: "r10," + bbox.cx + ',' + bbox.cy}, 100,mina.easeinout, function() {
										im.animate({
											x: centerLocation[0],
											y: centerLocation[1]
										},1000,mina.easeinout,function() {
											// standard.attr({
// 												href: trial.standardImTalk
// 											});
											//audio.play();
											playSound(audio);
											setTimeout(function() {
											//	audioTrill.play();
											//	t.rotate(10,centerLocation[0]+trial.image_size[0]/2,centerLocation[1]+trial.image_size[1]/2);
											//	im.animate({transform: im.transform(t)},50,mina.easeinout, function() {
											//		t.rotate(-20,centerLocation[0]+trial.image_size[0]/2,centerLocation[1]+trial.image_size[1]/2);
											//		im.animate({transform: im.transform(t)},100,mina.easeinout, function() {
											//			t.rotate(20,centerLocation[0]+trial.image_size[0]/2,centerLocation[1]+trial.image_size[1]/2);
											//			im.animate({transform: im.transform(t)},100,mina.easeinout, function() {
											//				t.rotate(-10,centerLocation[0]+trial.image_size[0]/2,centerLocation[1]+trial.image_size[1]/2);
											//				im.animate({transform: im.transform(t)},50,mina.easeinout,function() {
																setTimeout(function() {
																	endTrial();
																}, trial.endTrialPause);
											//				});
											//			});
											//		});
											//	});
											      }, trial.audioDur);
										});
						//	});
						//});
						//});
										
		
										bigCircle1.animate({
											fill: "lightblue"
										}, 1000);
										bigCircle2.animate({
											fill: "lightblue"
										}, 1000);
		
										im1.animate({
												opacity: "0"
											},300);
					});
				});
			});
		});
	};
	  
      function endTrial() {
		  var trial_data = {
			  "image1": trial.images[0],
			  "image2": trial.images[1],
			  "audio1": trial.audio[0],
			  "audio2": trial.audio[1],
			  "rt": rt,
			  "choice": choice,
			  "choiceImage": trial.images[choice],
			  "choiceAudio": trial.audio[choice]
		  }; 
	      // clear the display
	      display_element.html('');
		  
		  jsPsych.finishTrial(trial_data);
	  };
  };	  
		
		return plugin;
})();