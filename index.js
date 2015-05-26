var ps = require('ps-node'),
	os = require('os'),
	exec = require('child_process').exec,
	util = require('util'),
	getMostRecentFilenameFromFolder = require('./getMostRecentFilenameFromFolder'),
	settings = require('./settings'),
	demoFile = 'inl(POV)-vs-JoXmeister-sinister-2015_05_24-23_45_45.dm_90';

function isProcessRunning(options, cb) {
	ps.lookup(options, function(err, resultList ) {
		if (err) {
			throw new Error( err );
		}

		console.log(err,resultList, options);

		cb(resultList.length > 0);
	});

}

function isRenderingDemo(cb) {
	isProcessRunning({
		command: 'wolfcamqlmac',
		arguments: 'video'
	}, cb);
}

function isTranscodingVideo(cb) {
	isProcessRunning({
		command: 'HandBrakeCLI'
	}, cb);
}





isRenderingDemo(function(isRendering) {

	if (isRendering) {
			return console.log('Already busy performing rendering.');
	}

	console.log('started rendering of: ', demoFile);
	var renderDemoCommand = util.format(settings.renderDemoCommandFormat, settings.wolfcam_home, settings.wolfcam_executable, settings.wolfcam_home,  demoFile);
	console.log(renderDemoCommand);

	exec(renderDemoCommand, function (a, b, c) {
		isTranscodingVideo(function (isTranscoding) {

			if(isTranscoding) {
				return console.log("Already busy transcoding");
			}
			console.log('start transcoding of:', demoFile);
			var demoOutputFile = settings.videosFolder + getMostRecentFilenameFromFolder(settings.videosFolder),
				transcodeDemoCommand = util.format(settings.transcodeVideoCommandFormat, demoOutputFile, settings.videosFolder + demoFile);

			console.log(transcodeDemoCommand);


			exec(transcodeDemoCommand, function (a, b, c) {
				console.log('Finished handbrake');
				exec('rm -rf ' + demoOutputFile, function () {
					console.log('Removed outputfile', demoOutputFile);
				});
			});

		});
	});


});


// handbroke renderDemoCommand to render output
//