/**
 * 异步加载
 *
 * 1、参数是对象
 * 2、基于jQuery
 * 3、示例
 * 	  var asyncLoad = new AsyncLoad({
 * 	      tip:1,
 * 	      url:'http://test.com.cn/test.php?m=data&page=',
 * 	      type:'post',
 * 	      data:{'name':'语文'},
 * 	      callback:function(data){
 * 	      	
 * 	      }
 * 	  });
 * 	  //下一页
 * 	  asyncLoad.load(1);
 * 	  //下一页
 * 	  asyncLoad.load(-1);
 *
 *    tip：加载提示样式
 *    url：读取数据地址，规则：地址 + 参数 + '='即可，如http://test.com.cn/test.php?m=data&page=
 *    type：请求方式
 *    data：请求参数
 *    callback：回调函数
 * 
 * @author wangjunjie <1252547929@qq.com>
 * @version 1.0.0
 * @date 2015-09-25
 */
(function(win, doc){
	var AsyncLoad = win.AsyncLoad = function(config){

		//当前对象
		var obj = this;

		//页码
		obj.pageNum   = config.pageNumber;

		//总页数
		obj.totalPage = 2147483647;

		//true：正在加载，false：未加载
		obj.isLoading = false;

		//cdn文件路径
		config.cdnUrl;

		//加载数据提示
		obj.tips = function(isTip){
			var id = 'loadTip';
			if(!isTip){ jQuery('#' + id).remove(); return false; }
			switch(config.tip){
				case 1:
					var attr = '';
					attr += '<div class="loading_zone_tip" id="'+ id +'">';
							attr += '<img src="'+ config.cdnUrl +'img/loading_section.gif" alt="" />';
							attr += '<p class="loading_tip">拼命加载中~~</p>';
						attr += '</div>';
					jQuery('.single_link').find(".once_record").eq(0).before(attr);
					break;
			}
		};

		/**
		 * 加载数据
		 * 
		 * @param  int num 1:下一页，-1:上一页
		 */
		obj.load = function(num){
			if(obj.isLoading){ return false; }
			obj.pageNum = parseInt(obj.pageNum, 10) + parseInt(num, 10);
			//重置成第一页
			if(obj.pageNum < 1){ obj.pageNum = 1; return false; }
			//重置成尾一页
			if(obj.pageNum > obj.totalPage){ obj.pageNum = obj.totalPage; return false; }
			config.data.pageNumber = obj.pageNum;
			$.ajax({
				url:'/Ajaxs/getCommuniteList',
				dataType:'json', 
				data:config.data,
				type:config.type ? config.type : 'post',
				beforeSend:function(){
					obj.tips(true);
					obj.isLoading = true;
				},
				success:function(data){
					obj.tips(false);
					obj.totalPage = data.total_page;
					config.callback(data);
					obj.isLoading = false;
				},
				error:function(msg){
					console.log(msg);
				}
			});
		};
	};
})(window, document);