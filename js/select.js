/**
 * 操作下拉列表
 *
 * 1、参数是select元素id属性值
 * 
 * @author wangjunjie <1252547929@qq.com>
 * @version 1.0.0
 * @date 2015-04-09
 */
(function(win, doc){
	var Select = win.Select = function(id){
		//当前对象
		var obj = this;

		//操作的select对象
		obj.select = doc.getElementById(id);

		/**
		 * 添加选择项
		 * 
		 * @param string text  文本
		 * @param mixed  value 值
		 */
		obj.addItem = function(text, value){
			obj.select.options.add(new Option(text, value));
		};

		/**
		 * 添加多项选择项
		 * 
		 * @param array  data		对象数组
		 * @param string textField	文本字段名
		 * @param string valueField 值字段名
		 */
		obj.addItems = function(data, textField, valueField){
			for(var i=0,j=data.length; i<j; i++){
				obj.addItem(data[i][textField], data[i][valueField]);
			}
		};

		/**
		 * 设置选中项的值
		 * 
		 * @param mixed value 值
		 */
		obj.setValue = function(value){
			obj.select.value = value;
		};

		/**
		 * 设置选中项的索引
		 * 
		 * @param int index 索引
		 */
		obj.setIndex = function(index){
			obj.select.selectedIndex = index;
		};

		/**
		 * 获取选择中项的值
		 * 
		 * @return mixed
		 */
		obj.getValue = function(){
			return obj.select.value;
		};

		/**
		 * 获取选择中项的索引
		 * 
		 * @return int
		 */
		obj.getIndex = function(){
			return obj.select.selectedIndex;
		};

		/**
		 * 获取选择中项的文本
		 * 
		 * @return string
		 */
		obj.getText = function(){
			return obj.select.options[obj.getIndex()].text;
		};

		/**
		 * 移除指定索引的选择项
		 * 
		 * @param int index 索引
		 */
		obj.removeItem = function(index){
			obj.select.options.remove(index);
		};

		/**
		 * 剩余多少选择项
		 * 
		 * @param int length 长度
		 */
		obj.laveItems = function(length){
			obj.select.options.length = length;
		};
	};
})(window, document);