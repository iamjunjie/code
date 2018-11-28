/**
 * 通用方法
 *
 * 1、基于jquery
 * 2、基于layer-v1.9.0
 *
 * @author wangjunjie <1252547929@qq.com>
 * @date 2015-4-26
 */
(function(win, doc){
	//通用方法
	var commFunc = win.commFunc = {
		//标题
		title:'温馨提示',
		/**
		 * 提示
		 * 
		 * @param boolean  success  true成提示，false失败提示
		 * @param string   message  消息内容
		 * @param function callback 回调函数
		 * @param mixed    param    回调函数参数
		 */
		tip:function(success, message, callback, param){
			layer.open({
				type:0, title:commFunc.title, content:message, icon:(success ? 1 : 5), closeBtn:false,
				yes:function(index){
					layer.close(index);
					callback && (typeof(callback)=='function') && callback(param);
				}
			});
		},
		/**
		 * 询问
		 * 
		 * @param  string   lang     询问语
		 * @param  function callback 回调函数
		 */
		ask:function(lang, callback){
			layer.confirm(lang, {icon:4, title:commFunc.title}, function(index){
				layer.close(index);
				callback();
			});
		},
		/**
		 * 弹出层
		 * 
		 * @param  object config 配置
		 */
		open:function(config){
			layer.open({
				type:2, shade:0.1, title:config.title, content:config.url, moveOut:true,
				area:[config.width ? config.width + 'px' : 'auto', config.height ? config.height + 'px' : 'auto']
			});
		},
		/**
		 * 发送POST请求
		 * 
		 * @param string   url      请求地址
		 * @param object   data     请求数据
		 * @param function callback 回调函数
		 */
		post:function(url, data, callback){
			jQuery.post(url, data, function(responseData){
				commFunc.tip(responseData.success, responseData.msg, callback, responseData);
			}, 'json');
		},
		/**
		 * 删除
		 * 
		 * @param string   url      请求地址
		 * @param object   data     请求数据
		 * @param function callback 回调函数
		 */
		del:function(url, data, callback){
			commFunc.ask('确定要删除？', function(){
				commFunc.post(url, data, callback);
			});
		},
		/**
		 * 退出
		 * 
		 * @param string   url      请求地址
		 * @param function callback 回调函数
		 */
		quit:function(url, callback){
			commFunc.ask('确定要退出？', function(){
				commFunc.post(url, null, callback);
			});
		},
		/**
		 * 设置
		 * 
		 * @param string   url      请求地址
		 * @param mixed    id       数据ID
		 * @param string   field    字段名
		 * @param mixed	   value    字段值
		 * @param function callback 回调函数
		 */
		set:function(url, id, field, value, callback){
			commFunc.post(url, {'id':id, 'field':field, 'value':value}, callback);
		},
		/**
		 * 刷新
		 */
		refresh:function(){
			win.location.reload();
		},
		/**
		 * 搜索
		 *
		 * @param int pageNumber 页码
		 */
		search:function(pageNumber, pageSize){
			jQuery('#searchForm > #pageNumber').val(pageNumber);
			if (typeof(pageSize) != 'undefined') {
				jQuery('#searchForm > #customPageSize').val(pageSize);
			}
			jQuery('#searchForm').submit();
		},
		/**
		 * 判断是否在数组中
		 * 
		 * @param  array array 数组
		 * @param  mixed value 值
		 * @return boolean true存在，false不存在
		 */
		inArray:function(array, value){
			for(var i in array){
				if(array[i] == value){
					return true;
				}
			}
			return false;
		},
		/**
		 * 星期
		 * 
		 * @param  string 日期字符串
		 * @return object
		 */
		week:function(str){
			var date = new Date(str);
			var name = ['日','一','二','三','四','五','六'];
			var week = date.getDay();
			return {'week':week, 'name':name[week]};
		},
		/**
		 * 设置操作人
		 */
		setOperator:function(){
			var tds = jQuery('td[data-operator="true"],span[data-operator="true"]');
			if(!tds.length){
				return false;
			}
			var ids = [];
			jQuery.each(tds, function(i, o){
				var id = jQuery(o).attr('data-operator-id');
				if(!commFunc.inArray(ids, id)){
					ids.push(id);
				}
			});
			jQuery.post('/Ajaxs/readOperator', {'ids':ids.join(',')}, function(data){
				for(var i in data){
					jQuery('td[data-operator-id="' + data[i]['id'] + '"],span[data-operator-id="' + data[i]['id'] + '"]').text(data[i]['name']);
				}
			}, 'json');
		},
		
		/**
		 * 图片裁剪
		 * 
		 * @param  string   path     图片路径
		 * @param  object   config   配置
		 * @param  Function callback 回调
		 */
		cutImage:function(path, config, callback){
			commFunc.open({
				width:(config.win_width ? config.win_width : 700),
				height:(config.win_height ? config.win_height : 560),
				title:'图片裁剪',
				url:'/CutImages/index?cut_width=' + config.cut_width + '&cut_height=' + config.cut_height + '&win_width=' + config.win_width + '&win_height=' + config.win_height + '&path=' + encodeURIComponent(path) + '&callback=' + callback
			});
		},
		/**
		 * 上传文件
		 * 
		 * @param  string   id       元素ID
		 * @param  object   config   配置
		 * @param  Function callback 回调
		 */
		uploadFile:function(id, config, callback){
			jQuery('#' + id).uploadify({
				'removeTimeout':1,
				'fileObjName':'file',
				'fileSizeLimit':'4MB',
				'successTimeout':7200,
				'overrideEvents':['onDialogClose'],
				'swf':'/js/uploadify-v3.2.1/uploadify.swf',
				'width':(config.width ? config.width : 230),
				'height':(config.height ? config.height : 30),
				'fileTypeExts':'*.xls; *.xlsx; *.xlsm; *.xlsb; *.xltx',
				'multi':(config.multi ? config.multi : false),
				'formData':(config.formData ? config.formData : {}),
				'uploader':'/js/uploadify-v3.2.1/uploadify-file.php',
				'buttonText':(config.buttonText ? config.buttonText : ''),
				'buttonClass':(config.buttonClass ? config.buttonClass : 'file_inp'),
				'queueID':'some_file_queue',
				'onFallback':function(){
					commFunc.tip(false, '您未安装FLASH控件，无法上传文件，请安装FLASH控件后再试。');
				},
				'onUploadSuccess':function(file, data, response){
					var data = eval('(' + data + ')');
					if(data.success){
						callback(data, file);
					}else{
						commFunc.tip(data.success, data.msg);
					}
				},
				'onSelectError':function(file, errorCode, errorMsg){
					var msgText = '选择错误，';
					switch (errorCode) {
						case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
							msgText += "每次只能上传" + this.settings.queueSizeLimit + '个文件';
							break;
						case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
							msgText += '文件大小不能超过：' + this.settings.fileSizeLimit;
							break;
						case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
							msgText += "文件大小为：0KB";
							break;
						case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
							msgText += "文件格式只能是：<br />" + this.settings.fileTypeExts;
							break;
						default:
							msgText += "系统忙，请稍后再试";
					}
					commFunc.tip(false, msgText);
				},
				'onUploadError':function(file, errorCode, errorMsg, errorString){
					
				}
			});
		},
		/**
		 * 上传图片
		 * 
		 * @param  string   id       元素ID
		 * @param  object   config   配置
		 * @param  Function callback 回调
		 */
		uploadImage:function(id, config, callback){
			jQuery('#' + id).uploadify({
				'removeTimeout':1,
				'fileObjName':'file',
				'fileSizeLimit':(config.fileSizeLimit ? config.fileSizeLimit : "2MB"),
				'successTimeout':3600,
				'overrideEvents':['onDialogClose'],
				'swf':'/js/uploadify-v3.2.1/uploadify.swf',
				'width':(config.width ? config.width : 230),
				'height':(config.height ? config.height : 30),
				'fileTypeExts':(config.fileTypeExts ? config.fileTypeExts : "*.png; *.gif; *.jpg; *.jpeg; *.xls"),
				'multi':(config.multi ? config.multi : false),
				'formData':(config.formData ? config.formData : {}),
				'uploader':'/js/uploadify-v3.2.1/uploadify-image.php',
				'buttonText':(config.buttonText ? config.buttonText : ''),
				'buttonClass':(config.buttonClass ? config.buttonClass : ''),
				'queueID':'some_file_queue',
				'onFallback':function(){
					commFunc.tip(false, '您未安装FLASH控件，无法上传图片，请安装FLASH控件后再试。');
				},
				'onUploadSuccess':function(file, data, response){
					var data = eval('(' + data + ')');
					if(data.success){
						callback(data, file);
					}else{
						commFunc.tip(data.success, data.msg);
					}
				},
				'onSelectError':function(file, errorCode, errorMsg){
					var msgText = '选择错误，';
					switch (errorCode) {
						case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
							msgText += "每次只能上传" + this.settings.queueSizeLimit + '张图片';
							break;
						case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
							msgText += '图片大小不能超过：' + this.settings.fileSizeLimit;
							break;
						case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
							msgText += "图片大小为：0KB";
							break;
						case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
							msgText += "文件格式错误，请重新选择";
							break;
						default:
							msgText += "系统忙，请稍后再试";
					}
					commFunc.tip(false, msgText);
				},
				'onUploadError':function(file, errorCode, errorMsg, errorString){
					//手工取消不弹出提示
					// if (errorCode == SWFUpload.UPLOAD_ERROR.FILE_CANCELLED || errorCode == SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED) {
					// 	return false;
					// }
					// var msgText = "上传失败\n";
					// switch (errorCode) {
					// 	case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
					// 		msgText += "HTTP 错误\n" + errorMsg;
					// 		break;
					// 	case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:
					// 		msgText += "上传文件丢失，请重新上传";
					// 		break;
					// 	case SWFUpload.UPLOAD_ERROR.IO_ERROR:
					// 		msgText += "IO错误";
					// 		break;
					// 	case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
					// 		msgText += "安全性错误\n" + errorMsg;
					// 		break;
					// 	case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
					// 		msgText += "每次最多上传 " + this.settings.uploadLimit + "个";
					// 		break;
					// 	case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
					// 		msgText += errorMsg;
					// 		break;
					// 	case SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND:
					// 		msgText += "找不到指定文件，请重新操作";
					// 		break;
					// 	case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
					// 		msgText += "参数错误";
					// 		break;
					// 	default:
					// 		msgText += "文件:" + file.name + "\n错误码:" + errorCode + "\n"
					// 				+ errorMsg + "\n" + errorString;
					// }
					// commFunc.tip(false, msgText);
				}
			});
		},
		/**
		 * 上传视频
		 * 
		 * @param  string   id       元素ID
		 * @param  object   config   配置
		 * @param  Function callback 回调
		 */
		uploadVideo:function(id, config, callback){
			jQuery('#' + id).uploadify({
				'removeTimeout':1,
				'fileObjName':'file',
				'successTimeout':3600,
				'fileSizeLimit':'20MB',
				'overrideEvents':['onDialogClose'],
				'swf':'/js/uploadify-v3.2.1/uploadify.swf',
				'width':(config.width ? config.width : 230),
				'height':(config.height ? config.height : 30),
				'multi':(config.multi ? config.multi : false),
				// 'fileTypeExts':'*.mp4; *.flv; *.avi; *.swf; *.wmv',
				'formData':(config.formData ? config.formData : {}),
				'uploader':'/js/uploadify-v3.2.1/uploadify-video.php',
				'buttonText':(config.buttonText ? config.buttonText : '请选择'),
				'buttonClass':(config.buttonClass ? config.buttonClass : ''),
				'queueID':'some_file_queue',
				'onFallback':function(){
					commFunc.tip(false, '您未安装FLASH控件，无法上传图片，请安装FLASH控件后再试。');
				},
				'onUploadSuccess':function(file, data, response){
					var data = eval('(' + data + ')');
					if(data.success){
						callback(data, file);
					}else{
						commFunc.tip(data.success, data.msg);
					}
				},
				'onSelectError':function(file, errorCode, errorMsg){
					var msgText = '选择错误，';
					switch (errorCode) {
						case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
							msgText += "每次只能上传" + this.settings.queueSizeLimit + '个视频';
							break;
						case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
							msgText += '视频大小不能超过：' + this.settings.fileSizeLimit;
							break;
						case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
							msgText += "视频大小为：0KB";
							break;
						case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
							msgText += "视频格式只能是：<br />" + this.settings.fileTypeExts;
							break;
						default:
							msgText += "系统忙，请稍后再试";
					}
					commFunc.tip(false, msgText);
				}
			});
		}
	};
})(window, document);
 