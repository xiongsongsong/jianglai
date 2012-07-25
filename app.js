/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 12-7-24
 * Time: 下午7:51
 * To change this template use File | Settings | File Templates.
 */


var exec = require('child_process').exec;
var jade = require('jade');

var fileArr = [];
var htmlObj = [];

var fs = require('fs');

var resource = __dirname + '\\pic';
var files = fs.readdirSync(resource);
files.sort();
var pic = 0;
files.forEach(function (name) {
    var dir = __dirname + '\\pic\\' + name;
    if (fs.statSync(dir).isDirectory()) {
        var files = fs.readdirSync(dir);
        var arr = files.filter(function (item) {
            if (/(jpg|jpeg|gif|png)/gi.test(item)) {
                pic++;
                return item;
            }
        });
        fileArr.push(arr);
    }
});
console.log('发现' + files.length + "个文件夹");
console.log('共' + pic + "张图片");
exec('del upload demo.html /Q', {cwd:__dirname}, function (err) {
    convertImage(fileArr);
});

function convertImage(fileArr) {

    var index = 0;

    function _convert(arr) {
        var _index = 0;
        var html = {};
        html.title = files[index];
        html.data = [];
        function convert(file) {
            console.log('正在生成缩略图:' + file);
            var filename = Date.now().toString() + parseInt(Math.random() * 100000000, 10) + '.jpg';
            var filePath = __dirname + '\\upload\\' + filename;
            exec('convert -auto-orient "' + file + '" -resize 192 ' + filePath, {
                cwd:'c:/jianglai/pic/' + files[index]
            }, function (err) {
                _index++;
                if (!err) {
                    exec('identify ' + filePath, {
                            cwd:'c:/jianglai/pic/' + files[index]
                        }, function (err, stdout) {
                            if (!err) {
                                var offset = stdout.match(/JPEG (\d+)x(\d+)/);
                                if (offset !== null && offset[1] && offset[2]) {
                                    html.data.push({
                                        filename:filename,
                                        height:offset[2]
                                    });
                                }
                            }
                            if (arr[_index] !== undefined) {
                                convert(arr[_index]);
                            } else {
                                htmlObj.push(html);
                                index++;
                                if (fileArr[index] !== undefined) {
                                    _convert(fileArr[index]);
                                } else {
                                    createHtml(htmlObj);
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

function createHtml(htmlObj) {
    var fs = require('fs');
    var fn = jade.compile(fs.readFileSync('./node_modules/index.jade'));
    var html = fn({htmlObj:htmlObj});
    console.log('正在写入文件');
    fs.writeFileSync('demo.html', html);
    console.log('操作已经完成，可以FTP上传了');
}