var os = require('os');

module.exports = {
  wolfcam_home: process.env.WOLFCAM_HOME,
  wolfcam_executable: (function () {
    return {
      'linux':  'wolfcamql.i386',
      'darwin': 'wolfcamqlmac',
      'windows': 'wolfcamql.exe'
    }[os.platform()];
  })(),
  videosFolder: process.env.WOLFCAM_HOME + '/wolfcam-ql/videos/',
  renderDemoCommandFormat: '%s/%s set fs_homepath "%s" +demo "%s"  +set cl_aviCodec "huffyuv" +set cl_aviFrameRate "60" +set nextdemo quit +video',
  transcodeVideoCommandFormat: 'HandBrakeCLI -i "%s" -o "%s.mp4" --preset "High Profile" --x264-preset ultrafast'
};
