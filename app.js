/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-7-24
 * Time: 下午7:51
 * To change this template use File | Settings | File Templates.
 */


var exec = require('child_process').exec;
var map = require('./js/routes');

var fileArr = [];


map.导航名称.forEach(function (item, index) {
    exec('dir /D /B', {
        cwd:'c:/jianglai/test/' + map.文件夹名称[index]
    }, function (error, stdout) {
        var arr = stdout.split(/\r\n/).filter(function (item) {
            if (item.length > 1 && /(jpg|jpeg)/gi.test(item)) {
                return item;
            }
        });

        fileArr.push(arr);
        if (index + 1 === map.导航名称.length) {
            convertImage(fileArr);
        }
    });
});

function convertImage(fileArr) {

    var index = 0;

    function _convert(arr) {
        var _index = 0;

        function convert(file) {
            console.log('正在转换图片:' + file);
            var filename = __dirname + '\\photo\\' + Date.now().toString() + parseInt(Math.random() * 100000000, 10) + '.jpg';
            exec('convert -auto-orient "' + file + '" -resize 192 ' + filename, {
                cwd:'c:/jianglai/test/' + map.文件夹名称[index]
            }, function (err, stdout) {
                _index++;
                if (!err) {
                    exec('identify ' + filename, {
                            cwd:'c:/jianglai/test/' + map.文件夹名称[index]
                        }, function (err, stdout) {
                            if (!err) {
                                var offset = stdout.match(/JPEG (\d+)x(\d+)/);
                                if (offset !== null && offset[1] && offset[2]) {
                                    if (arr[_index] !== undefined) {
                                        convert(arr[_index]);
                                    } else {
                                        index++;
                                        if (fileArr[index] !== undefined) {
                                            _convert(fileArr[index]);
                                        }
                                    }
                                }
                            }
                        }
                    );
                }
            });
        }

        convert(arr[_index]);
    }

    _convert(fileArr[index]);
}