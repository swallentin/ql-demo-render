var os = require('os');

module.exports = {
  WOLFCAM_HOME: process.env.WOLFCAM_HOME,
  WOLFCAM_CMD: (function () {
    return {
      'linux':  'wolfcamql.i386',
      'darwin': 'wolfcamqlmac',
      'windows': 'wolfcamql.exe'
    }[os.platform()];
  })(),
  videosFolder: process.env.WOLFCAM_HOME + '/wolfcam-ql/videos',
  renderDemoCommandFormat: '%s/%s set fs_homepath "%s" +demo "%s"  +set cl_aviCodec "huffyuv" +set cl_aviFrameRate "60" +set nextdemo quit +video',
  transcodeVideoOutputFullpathFormat: '%s/%s.mp4',
  transcodeVideoCommandFormat: 'HandBrakeCLI -i "%s" -o "%s" --preset "High Profile" --x264-preset ultrafast'
};
