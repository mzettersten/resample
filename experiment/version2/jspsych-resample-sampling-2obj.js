/**
 * jspsych-resample-sampling-2obj
 * Martin Zettersten
 */

jsPsych.plugins['resample-sampling-2obj'] = (function() {

  var plugin = {};
  
  var context = new AudioContext();
  
  jsPsych.pluginAPI.registerPreload('resample-sampling-2obj', ['images'], 'image');
  jsPsych.pluginAPI.registerPreload('resample-sampling-2obj', 'audio', 'audio');
  jsPsych.pluginAPI.registerPreload('resample-sampling-2obj', 'audioTrill', 'audio');
  

  plugin.trial = function(display_element, trial) {
	  
      // default values
      trial.canvas_size = trial.canvas_size || [1024,650];
      trial.image_size = trial.image_size || [150,150];
	  trial.condition = trial.condition || "active";
	  trial.location = trial.location || 0;
	  trial.images = trial.images || ["stims/monkey.png",  "stims/penguin.png"];
	  trial.whichImages=trial.whichImages || [0,1];
	  trial.standardIm = trial.standardIm || ["stims/Bear_Smile.png"];
	  trial.standardImTalk = trial.standardImTalk || ["stims/Bear_Talk.png"];
	  trial.standardIm2 = trial.standardIm2 || ["stims/space_helmet.png"];
	  trial.audio = trial.audio || ["stims/norm_it_monkey.m4a","stims/norm_it_penguin.m4a"];
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
	  
      display_element.append($("<svg id='jspsych-resample-sampling-canvas' width=" + trial.canvas_size[0] + " height=" + trial.canvas_size[1] + "></svg>"));

      var s = Snap("#jspsych-resample-sampling-canvas");
	  
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
	  
	//function to play audio
	  function playSound(buffer) {
	    var source = context.createBufferSource(); // creates a sound source
	    source.buffer = jsPsych.pluginAPI.getAudioBuffer(buffer);                    // tell the source which sound to play
	    source.connect(context.destination);       // connect the source to the context's destination (the speakers)
	    source.start(0);                           // play the source now
	  }
	  
	  var start_time = (new Date()).getTime();
	  
	  var standardTalk = s.image(trial.standardImTalk,311,55,179,258);
	  var standardBack = s.image(trial.standardIm,311,55,179,258);
	  var standard2 = s.image(trial.standardIm2,288,17,230,210);
	  var standard = s.image(trial.standardIm,311,55,179,258);
	  standard.attr({opacity:0});
	  
	  var image1 = s.image(trial.images[trial.whichImages[0]], imageLocations[trial.whichImages[0]][0], imageLocations[trial.whichImages[0]][1], trial.image_size[0],trial.image_size[1]);
	  var image2 = s.image(trial.images[trial.whichImages[1]], imageLocations[trial.whichImages[1]][0], imageLocations[trial.whichImages[1]][1], trial.image_size[0],trial.image_size[1]);
	  
	  
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
	  			  	  				  inputEvent(image1,trial.audio[trial.whichImages[0]],image2,trial.whichImages[0]);
	  			  });
	  			  image2.touchstart(function() {
	  			  	  				  inputEvent(image2,trial.audio[trial.whichImages[1]],image1,trial.whichImages[1]);
	  			  });
	  			  // image3.touchstart(function() {
	  			  // 	  				  inputEvent(image3,trial.audio[2],image2,image1,image4,2);
	  			  // });
	  			  // image4.touchstart(function() {
	  			  // 	  				  inputEvent(image4,trial.audio[3],image2,image3,image1,3);
	  			  // });
			//	});
			//});
		  } else {
  			//rect.click(function() {
  			//	rect.unclick();
  			//	rect.animate({
  			//		fill: "#FFFFFF"
  			//	}, 300,mina.linear, function() {
  			  image1.click(function() {
  			  	  				  inputEvent(image1,trial.audio[trial.whichImages[0]],image2,trial.whichImages[0]);
  			  });
  			  image2.click(function() {
  			  	  				  inputEvent(image2,trial.audio[trial.whichImages[1]],image1,trial.whichImages[1]);
  			  });
	  			  // image3.click(function() {
	  			  // 	  				  inputEvent(image3,trial.audio[2],image2,image1,image4,2);
	  			  // });
	  			  // image4.click(function() {
	  			  // 	  				  inputEvent(image4,trial.audio[3],image2,image3,image1,3);
	  			  // });
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
				  	// if (trial.targetIndex==trial.whichImages[0]) {
				  	// 	var imTarget=image1;
				  	// 	var audioTarget=trial.audio[trial.whichImages[0]];
				  	// 	var im1=image2;
				  	// }
	
				  	setTimeout(function() {
				  		if (trial.targetIndex==trial.whichImages[0]) {
				  			inputEvent(image1,trial.audio[trial.whichImages[0]],image2,trial.targetIndex);
				  		} else if (trial.targetIndex==trial.whichImages[1]) {
				  			inputEvent(image2,trial.audio[trial.whichImages[1]],image1,trial.targetIndex);
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
				  	// if (trial.targetIndex==0) {
				  	// 	var imTarget=image1;
				  	// 	var audioTarget=trial.audio[0];
				  	// 	var im1=image2;
				  	// 	var im2=image3;
				  	// 	var im3=image4;
				  	// }
	
				  	setTimeout(function() {
				  		if (trial.targetIndex==trial.whichImages[0]) {
				  			inputEvent(image1,trial.audio[trial.whichImages[0]],image2,trial.targetIndex);
				  		} else if (trial.targetIndex==trial.whichImages[1]) {
				  			inputEvent(image2,trial.audio[trial.whichImages[1]],image1,trial.targetIndex);
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
			// image3.unclick();
			// image4.unclick();
		} else {
			image1.untouchstart();
			image2.untouchstart();
			// image3.untouchstart();
			// image4.untouchstart();
		};
		var end_time = (new Date()).getTime();
		rt = end_time - start_time;
		choice = imChoice;
		var t = new Snap.Matrix();
		console.log(imChoice);
		var imCenterX = imageLocations[imChoice][0]+trial.image_size[0]/2;
		var imCenterY = imageLocations[imChoice][1]+trial.image_size[1]/2;
		//audioTrill.play();
		//playSound(trial.audioTrill);
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
											standard.attr({
												href: trial.standardImTalk
											});
											//audio.play();
											standardBack.attr({opacity: 0});
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
			  "availableImage1": trial.images[trial.whichImages[0]],
			  "availableImage2": trial.images[trial.whichImages[1]],
			  "option1": trial.whichImages[0],
			  "option2": trial.whichImages[1],
			  "image1": trial.images[0],
			  "image2": trial.images[1],
			  "audio1": trial.audio[0],
			  "audio2": trial.audio[1],
			  "rt": rt,
			  "audio1": trial.audio[0],
			  "audio2": trial.audio[1],
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