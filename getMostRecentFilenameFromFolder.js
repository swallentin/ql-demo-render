var fs = require('fs'),
  path = require('path'),
  _ = require('underscore'),
  ignoreFiles = ['.DS_Store'];

// Return only base file name without dir
function getMostRecentFileName(dir) {
  var files = fs.readdirSync(dir);

  files = files.filter(function(file) {
    return ignoreFiles.indexOf(file);
  });

  // use underscore for max()
  return _.max(files, function (f) {
    var fullpath = path.join(dir, f);

    // ctime = creation time is used
    // replace with mtime for modification time
    return fs.statSync(fullpath).ctime;
  });
}

module.exports = getMostRecentFileName;

