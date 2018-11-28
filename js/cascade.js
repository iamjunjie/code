/**
 * 级联选择
 *
 * 1、参数是对象数组
 * 2、基于jQuery
 * 3、示例
 * 	  var cascade = new Cascade();
 *		  cascade.init([
 *	   		 {
 *	   		 	'sid':'province',
 *	   		 	'rid':'city',
 *	   		 	'url':'http://test.com.cn/test.php?m=city&pid=',
 *	   		 	'txt':'name',
 *	   		 	'val':'id',
 *	   		 	'sub':{'city':1,'community':1},
 *	   		 	'cal':function(){
 *	   		 		
 *	   		 	}
 *	   		 },
 *	      	 {
 *	      	 	'sid':'city',
 *	      	 	'rid':'community',
 *	      	 	'url':'http://test.com.cn/test.php?m=community&pid=',
 *	      	 	'txt':'title',
 *	      	 	'val':'id',
 *	      	 	'sub':{'community':1}
 *	      	 }
 *		  ]);
 *		  
 *		  sid：选择元素ID
 *		  rid：绑定数据元素ID
 *		  url：读取数据地址，规则：地址 + 参数 + '='即可，如http://test.com.cn/test.php?m=city&pid=
 *		  txt：文本字段名
 *		  val：值字段名
 *		  sub：对象，键：子元素ID，值：保留的数据项
 *		  cal：回调函数
 *		  
 * @author wangjunjie <1252547929@qq.com>
 * @version 1.0.0
 * @date 2015-09-17
 */
(function(win, doc){
	var Cascade = win.Cascade = function(){
		
		//当前对象
		var obj = this;

		//初始化
		obj.init = function(config){
			for(var i in config){
				(function(item){
					jQuery('#' + item['sid']).change(function(){
						//移除子选择框数据项
						
						for(var i in item['sub']){
							var select = doc.getElementById(i);
								select.options.length = item['sub'][i];
						}
						//绑定数据
						var url = item['url'] + this.value;
						obj.bindData(item['rid'], url, item['txt'], item['val'], item['cal']);
					});
				})(config[i]);
			}
		};

		/**
		 * 绑定数据
		 *
		 * @param  string   id         元素ID
		 * @param  string   url        读取数据地址
		 * @param  string   textField  文本字段名
		 * @param  string   valueField 值字段名
		 * @param  function callback   回调函数
		 */
		obj.bindData = function(id, url, textField, valueField, callback){
			jQuery.getJSON(url, function(data){
				if(data.length){
					var select = doc.getElementById(id);
					for(var i=0,j=data.length; i<j; i++){
						select.options.add(new Option(data[i][textField], data[i][valueField]));
					}
				}
				//执行回调函数
				if(callback){ callback(); }
			});
		};
	};
})(window, document);