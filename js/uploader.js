/**
 * 上传文件
 * 
 * 基于http://fex.baidu.com/webuploader的0.1.5，在使用前先引入/js/webuploader-0.1.5/webuploader.min.js
 * 
 * 调用示例
 * 	uploadFile('image', 'uploadFile', {
 * 		btnTxt: '上传按钮文字', // 默认：请选择
 * 		fileExt: '文件格式', // 默认：xls,xlsx,xlsm,xlsb,xltx
 * 		formData: '上传文件额外参数', // 默认：{ } 
 * 		fileSize: '上传文件大小', // 默认：4M
 * 		fileNum: '上传文件个数', // 默认：1
 * 		fileVal: '上传表单名，后端接收使用', // 默认：file
 * 	}, function(data, file) {
 * 		console.log(data);
 * 		console.log(file);
 * 	});
 * 
 * @author wangjunjie <1252547929@qq.com>
 * @version 0.0.1
 * @date 2020-11-18
 */
(function (win, doc) {
	/**
	 * 上传文件
	 * 
	 * @param string type 上传文件类型
	 * 	file：文件，如：xls、xlsx、xlsm、xlsb、xltx……
	 * 	image：图片，如：png、gif、jpg、jpeg……
	 * 	video：视频，如：mp4、flv、avi、swf、wmv……
	 * @param string id 上传按钮元素id
	 * @param object config 参数配置
	 * @param Function callback 回调方法
	 */
	win.uploadFile = function (type, id, config, callback) {
		// 选择文件按钮文字
		var btnTxt = config.btnTxt ? config.btnTxt : '请选择';
		// 上传文件限制
		var acceptTitle = 'Images';
		var acceptExtensions = 'png,gif,jpg,jpeg';
		var acceptMimeTypes = 'image/jpg,image/jpeg,image/png,image/gif';
		// 文件上传请求的参数
		var formData = config.formData ? config.formData : {};
		// 单个文件大小限制4M
		var fileSize = config.fileSize ? Number(config.fileSize) * 1024 * 1024 : 4194304;
		// 上传文件数量限制
		var fileNum = config.fileNum ? config.fileNum : 1;
		// 设置文件上传域的name
		var fileVal = config.fileVal ? config.fileVal : 'file';
		// 图片压缩配置参数
		var compress = false;
		switch (type) {
			// 文件
			case 'file':
				acceptTitle = 'file';
				acceptExtensions = 'xls,xlsx,xlsm,xlsb,xltx';
				acceptMimeTypes = 'file/*';
				compress = false;
				break;
			// 图片
			case 'image':
				acceptTitle = 'Images';
				acceptExtensions = 'png,gif,jpg,jpeg';
				acceptMimeTypes = 'image/jpg,image/jpeg,image/png,image/gif';
				compress = {
					width: config.width ? config.width : 230,
					height: config.height ? config.height : 30,
					// 图片质量，只有type为image/jpeg的时候才有效。
					quality: 100,
					// 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
					allowMagnify: false,
					// 是否允许裁剪。
					crop: false,
					// 是否保留头部meta信息。
					preserveHeaders: true,
					// 如果发现压缩后文件大小比原来还大，则使用原来图片
					// 此属性可能会影响图片自动纠正功能
					noCompressIfLarger: false,
					// 单位字节，如果图片大小小于此值，不会采用压缩。
					compressSize: 0
				};
				break;
			// 视频
			case 'video':
				acceptTitle = 'video';
				acceptExtensions = 'mp4,flv,avi,swf,wmv';
				acceptMimeTypes = 'video/*';
				compress = false;
				break;
			default:
				break;
		}
		var uploader = WebUploader.create({
			// 是否允许重复的文件
			duplicate: false,
			// 选完文件后，是否自动上传
			auto: true,
			// swf文件路径
			swf: 'https://www.xuefangedu.cn/plugins/webuploader-0.1.5/Uploader.swf',
			// 文件接收服务端
			server: 'https://www.xuefangedu.cn/plugins/webuploader-0.1.5/uploadify-file.php',
			// 选择文件的按钮
			pick: {
				id: '#' + id,
				innerHTML: btnTxt,
			},
			// 限定文件选择类型
			accept: {
				title: acceptTitle,
				extensions: config.fileExt ? config.fileExt : acceptExtensions,
				mimeTypes: acceptMimeTypes
			},
			// 是否要分片处理大文件上传
			chunked: true,
			// 分片上传，每片2M，默认是5M
			chunkSize: 2 * 1024 * 1024,
			// 文件上传请求的参数
			formData: formData,
			// 线程数
			threads: 1,
			// 单个文件大小限制4M
			fileSingleSizeLimit: fileSize,
			// 上传文件数量限制
			fileNumLimit: fileNum,
			// 设置文件上传域的name
			fileVal: fileVal,
			// 图片压缩配置参数
			compress: compress
		});
		// 当有一批文件加载进队列时触发事件
		uploader.on('filesQueued', function () { });
		// 文件校验不通过时
		uploader.on('error', function (type) {
			var msgText = '选择错误，';
			switch (type) {
				case 'Q_TYPE_DENIED':
					msgText += "文件格式只能是：xls、xlsx、xlsm、xlsb、xltx";
					break;
				case 'Q_EXCEED_SIZE_LIMIT':
					msgText += "文件大小不能超过4M";
					break;
				case 'F_DUPLICATE':
					msgText += "重复选择视频";
					break;
				case 'Q_EXCEED_NUM_LIMIT':
					msgText += "每次做多只能上传一个文件";
					break;
				default:
					msgText += "上传出错！请检查后重新上传！错误代码" + type;
					break;
			}
			alert(msgText);
		});
		// 单个文件开始上传
		uploader.on("uploadStart", function () { });
		// 单个文件上传过程中
		uploader.on("uploadProgress", function () { });
		// 上传出错时
		uploader.on("uploadError", function () { });
		// 单个文件上传成功
		uploader.on("uploadSuccess", function (file, data) {
			if (!data.success) {
				alert(data.msg);
				return false;
			}
			callback(data, file);
			// 移除文件
			uploader.removeFile(file);
		});
		// 所有文件上传结束
		uploader.on("uploadFinished", function () {
			uploader.reset();//清空上传队列
		});
	};
})(window, document);