var ps = require('ps-node'),
	os = require('os'),
	exec = require('child_process').exec,
	util = require('util'),
	async = require('async'),
	getMostRecentFilenameFromFolder = require('./getMostRecentFilenameFromFolder'),
	settings = require('./settings'),
  kue = require('kue'),
  queue = kue.createQueue({
    port: 1234,
    host: 'home.codejutsu.se'
  });

kue.app.listen(3000);

function isProcessRunning(options, cb) {
	ps.lookup(options, function(err, resultList ) {
		if (err) {
			throw new Error( err );
		}

		//console.log(err,resultList, options);

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

function render(demoFilename, callback) {
	isRenderingDemo(function(isRendering) {

		if (isRendering) {
			return callback(new Error('Already busy performing rendering.'));
		}

    // TODO: Check if file exists on disc

		console.log('started rendering of: ', demoFilename);
		var renderDemoCommand = util.format(settings.renderDemoCommandFormat, settings.WOLFCAM_HOME, settings.WOLFCAM_CMD, settings.WOLFCAM_HOME, demoFilename);
		console.log('Executing:', renderDemoCommand);

		exec(renderDemoCommand, function (a, b, c) {
      var renderOutputPath = util.format("%s/%s", settings.videosFolder, getMostRecentFilenameFromFolder(settings.videosFolder));
      console.log(renderOutputPath);
      console.log(demoFilename);
      callback(null, demoFilename, renderOutputPath);
		});

	});

}

function transcode(demoFilename, renderOutputPath, callback) {
	isTranscodingVideo(function (isTranscoding) {
		if(isTranscoding) {
			return callback(new Error("Already busy transcoding"));
		}

		console.log('start transcoding of:', demoFilename);
    console.log(renderOutputPath);

      var transcodeOutputFullPath = util.format(settings.transcodeVideoOutputFullpathFormat, settings.videosFolder, demoFilename);
			transcodeDemoCommand = util.format(settings.transcodeVideoCommandFormat, renderOutputPath, transcodeOutputFullPath);

    console.log(transcodeOutputFullPath);
    console.log('Exec:', transcodeDemoCommand);

		exec(transcodeDemoCommand, function (a, b, c) {
			console.log('Finished handbrake');
			callback(null, demoFilename, renderOutputPath, transcodeOutputFullPath);
		});
	});
}

function removeRenderOutputFile(demoFilename, renderOutputPath, transcodeOutputFullPath, callback) {
		exec('rm -rf ' + renderOutputPath, function () {
			console.log('Removed outputfile', renderOutputPath);
			callback(null, transcodeOutputFullPath);
		});
}

queue.process('render-demo', function (job, done) {

  function init(callback) {
    callback(null, job.data.demofile);
  }

  async.waterfall([
    init,
    render,
    transcode,
    removeRenderOutputFile], function(err, result) {
    console.log('Rendering is finished. See result: ', result);
    console.log('Job done');
    done && done();
  });

});

var job = queue.create('render-demo', {
  demofile: 'inl(POV)-vs-JoXmeister-sinister-2015_05_24-23_45_45.dm_90'
}).attempts(1000).backoff({ delay: 3000, type: 'fixed' }).save(function (err) {
  if (!err) {
    console.log(job.id);
  }
});



// handbroke renderDemoCommand to render output
//