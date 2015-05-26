var kue = require('kue'),
    queue = kue.createQueue({
      port: 1234,
      host: 'home.codejutsu.se'
    });

kue.app.listen(3000);

var job = queue.create('render-demo', {
  demofile: 'inl(POV)-vs-JoXmeister-sinister-2015_05_24-23_45_45.dm_90'
}).attempts(1000).backoff({ delay: 3000, type: 'fixed' }).save(function (err) {
  if (!err) {
    console.log(job.id);
  }
});

//queue.process('render-demo', function (job, done) {
//  var err = new Error('purposely fail job');
//  job.failed().error(err);
//  done && done(err);
//  console.log('Failed the job');
//});