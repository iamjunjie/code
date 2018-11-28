/**
 * 数据验证
 *
 * 1、参数是一个对象
 * 2、创建对象时必须提供vid(被验证元素ID)，rid(错误信息提示元素ID)，rule(验证规则，对象)
 * 3、创建对象时可选提供tip(输入提示信息)、success(成功提示信息)
 * 4、提供empty(非空)、maxLength(最大长度)、minLength(最小长度)、regExp(正则)、compare(比较)、ajax(同步)验证
 * 5、对象result方法返回验证结果，true通过验证，false未通过验证
 * 6、基于jQuery
 * 7、实例
 * 	  var name = new window.Validate({
 * 		  vid:'name',
 * 		  rid:'name_tip',
 *        rule:{
 *           empty:{
 *           	error:'名字不能为空'
 *           },
 *           maxLength:{
 *           	length:10,
 *           	error:'最大长度不能超过10个字符'
 *           },
 *           minLength:{
 *           	length:5,
 *           	error:'最小长度不能小于5个字符'
 *           },
 * 			 regExp:{
 *				regExp:'[a-z]+',
 *			 	attribute:'i',
 *				error:'名字中必须有数字'
 *			 },
 *			 compare:{
 *				compareTo:'name2',
 *				operator:'==',
 *				error:'名字要一致'
 *			 },
 *			 ajax:{
 *				url:'?s=test&m=ajax&o=json',
 *				param:'name',
 *				error:'用户名已经存在'
 *			 },
 *			 checkbox:{
 *				name:'type',
 *				error: '请选择票据类型使用业务范围'
 *			 }
 *        },
 *        tip:'亲,名字不能为空',
 *		  success:'亲,名字可以使用,一旦使用不能修改'
 *    });
 *    name.result();
 *
 * @author wangjunjie <1252547929@qq.com>
 * @version 1.3.0
 * @date 2015-04-14
 */
(function(win, doc){
	var Validate = win.Validate = function(config){

		//当前对象
		var obj = this;

        //被验证对象
        obj.vObj =  (config.vid && typeof config.vid == "string") ? jQuery('#' + config.vid) : config.vid;

        //消息提示对象--错误提示
        obj.rObj = (config.rid && typeof config.rid == "string") ? jQuery("#" + config.rid) : config.rid;

		//自定义一的弹窗提示--2017-07-4 by 高同檩
        //消息提示对象--正确提示(非必填)
        obj.rObjOk = jQuery("#" + config.rid_ok);
        obj.call_result = config.call_result; //result验证方法后面执行的回调
        // end

		//验证规则
		obj.rule = config.rule;

		//自定义一的弹窗提示--2017-06-15 by 高同檩
		obj.defindTip = config.defindTip;
		//是否焦点提示--2017-06-29 by 高同檩
		obj.notBlurCheck = config.notBlurCheck || false;
		
        /**
         * 英文数字
         *
         * @return boolean true通过，false未通过
         */
		obj.eNum = function () {
            var pattern = /^[0-9a-zA-Z]*$/g;
            return obj.regExp(pattern);
        }
		/**
		 * 获取被验证对象数据
		 *
		 * 1、去除左右两端空格
		 * 
		 * @return string
		 */
		obj.getValue = function(){
			return jQuery.trim(obj.vObj.val());
		};

		/**
		 * 非空验证
		 * 
		 * @return boolean true通过，false未通过
		 */
		obj.empty = function(){
			return obj.getValue() != '';
		};

		/**
		 * 正则验证
		 * 
		 * @param  string  pattern   正则表达式
		 * @param  string  attribute 可选，值为[g(全局)、i(区分大小写)、m(多行)匹配]
		 * @return boolean true通过，false未通过
		 */
		obj.regExp = function(pattern, attribute){
			var val = obj.getValue();
			if(val.length){
				var regExp = (attribute ? new RegExp(pattern, attribute) : new RegExp(pattern));
				return regExp.test(val);
			}
			return true;
		};

		/**
		 * 邮箱验证
		 *
		 * @return boolean true通过，false未通过
		 */
		obj.email = function(){
			var pattern = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
			return obj.regExp(pattern);
		};

		/**
		 * URL验证
		 *
		 * @return boolean true通过，false未通过
		 */
		obj.url = function(){
			var pattern = /((^http)|(^https)|(^ftp)):\/\/([A-Za-z0-9]+\.[A-Za-z0-9]+)+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/
			return obj.regExp(pattern);
		};

		/**
		 * 英文验证
		 *
		 * @return boolean true通过，false未通过
		 */
		obj.english = function(){
			var pattern = /^[a-zA-Z]*$/;
			return obj.regExp(pattern);
		};

		/**
		 * 中文验证
		 *
		 * @return boolean true通过，false未通过
		 */
		obj.chinese = function(){
			var pattern = /^[\u4E00-\u9FA5]+$/;
			return obj.regExp(pattern);
		};
		
		/**
		 * 电话验证[固话、手机]
		 * 
		 * @return boolean true通过，false未通过
		 */
		obj.phone = function(){
			return obj.tel() || obj.mobile();
		};
		
		/**
		 * 固话验证
		 * 
		 * @return boolean true通过，false未通过
		 */
		obj.tel = function(){
			var pattern = /(^[0-9]{3,4}\-[0-9]{7,8}$)|(^[0-9]{7,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)|(13\d{9}$)|(15[0135-9]\d{8}$)|(18[267]\d{8}$)/;
			return obj.regExp(pattern);
		};
		
		/**
		 * 手机验证
		 * 
		 * @return boolean true通过，false未通过
		 */
		obj.mobile = function(){
			var pattern = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
			return obj.regExp(pattern);
		};

		/**
		 * QQ验证
		 * 
		 * @return boolean true通过，false未通过
		 */
		obj.qq = function(){
			//var pattern = /^\d{4,}$/;
			var pattern = /^\d{5,11}$/;
			return obj.regExp(pattern);
		};

		/**
		 * 微信验证
		 * 
		 * @return boolean true通过，false未通过
		 */
		obj.weixin = function(){
			var pattern = /^[A-Za-z0-9]{5,}$/;
			return obj.regExp(pattern);
		};
		
		/**
		 * 身份证验证
		 * 
		 * @return boolean true通过，false未通过
		 */
		obj.idCard = function(){
			var pattern = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
			return obj.regExp(pattern);
		};
		
		/**
		 * 金额验证
		 * 
		 * @return boolean true通过，false未通过
		 */
		obj.money = function(){
			var pattern = /^(0|[1-9]\d*)(\.\d{1,})?$/;
			var flag    =  obj.regExp(pattern);
			var val     = obj.getValue();
			if(flag && val.length){
				val = parseFloat(val);
				obj.vObj.val(val.toFixed(2));
			}
			return flag;
		};

		/**
		 * 金额验证(金额需要大于0)
		 *
		 * @return boolean true通过，false未通过
		 */
		obj.moneyGreater = function(){
			var pattern = /^(0|[1-9]\d*)(\.\d{1,})?$/;
			var flag    =  obj.regExp(pattern);
			var val     = obj.getValue();
			if(flag && val.length){
				val = parseFloat(val);
				if (val <= parseFloat(0)) {
					return false;
				}
				obj.vObj.val(val.toFixed(2));
			}
			return flag;
		};

		/**
		 * 正整数验证
		 * 
		 * @return boolean true通过，false未通过
		 */
		obj.posInt = function(){
			var pattern = /^[1-9][0-9]*$/;
			return obj.regExp(pattern);
		};

		/**
		 * 正整数验证
		 *
		 * @return boolean true通过，false未通过
		 */
		obj.exceptZero = function(){
			var pattern = /^[0-9][0-9]*$/;
			return obj.regExp(pattern);
		};

        /**
         * 非负浮点数验证
         *
         * @return boolean true通过，false未通过
         */
        obj.nonNegFloat = function(){
            var pattern = /^[0-9]+(\.{0,1}[0-9]+){0,1}$/;
            if (obj.regExp(pattern)) {
                return (obj.getValue() <= 0 || obj.getValue() > 5) ? false : true;

            } else {
                return obj.regExp(pattern);
            }
        };

        /**
         * 成绩验证
         *
         * @return boolean true通过，false未通过
         */
        obj.scoreFloat = function(){
            var pattern = /^[1-9]+\d{0,2}([.]\d)?$/;
            return obj.regExp(pattern);
        };

		/**
		 * 最大正整数验证
		 * 
		 * @return boolean true通过，false未通过
		 */
		obj.maxInt = function(maxInt){
			return obj.getValue() <= maxInt;
		};

		/**
		 * 非负整数验证
		 * 
		 * @return boolean true通过，false未通过
		 */
		obj.nonnegInt = function(){
			var pattern = /^(0|([1-9][0-9]*))$/;
			return obj.regExp(pattern);
		};

		/**
		 * 最大长度验证
		 *
		 * @param  @int	   length 长度数值
		 * @return boolean true通过，false未通过
		 */
		obj.maxLength = function(length){
			var val = obj.getValue();
			return val.length <= length;
		};

		/**
		 * 最小长度验证
		 *
		 * @param  @int	   length 长度数值
		 * @return boolean true通过，false未通过
		 */
		obj.minLength = function(length){
			var val = obj.getValue();
			return val.length >= length;
		};

		/**
		 * 比较验证
		 *
		 * @param  string  operator 	 比较操作符，例如：['=='、'>'、'<'、'>='、'<='、'!=']
		 * @param  string  compareValue  要比较的值
		 * @return boolean true通过，false未通过
		 */
		obj.compare = function(operator, compareValue){
			var val = obj.getValue();
			var exp = '';
			if(!isNaN(val) && !isNaN(compareValue)){
				exp = parseFloat(val) + operator + parseFloat(compareValue);
			}else{
				exp = "'" + val + "'" + operator + "'" + compareValue + "'";
			}
			return eval(exp);
		};
		
		/**
		 * 复选框验证
		 *
		 * @param  string  name 元素的name属性
		 * @return boolean true通过，false未通过
		 */
		obj.checkbox = function(name){
			var result = false;
			var checkboxs = jQuery("input[type='checkbox'][name='" + name + "']");
			if(checkboxs && checkboxs.length){
				jQuery.each(checkboxs, function(i, o){
					if(jQuery(o).attr('checked') == 'checked'){
						result = true;
						return false;
					}
				});
			}
			return result;
		};

		/**
		 * 特殊字符验证
		 *
		 * @return boolean true通过，false未通过
		 */
		obj.specialchar = function(){
			var pattern = /^([\u4E00-\u9FA5]|[a-zA-Z]|[0-9])*$/;
			return obj.regExp(pattern);
		};

        /**
         * 特殊字符验证--可以有空格
         *
         * @return boolean true通过，false未通过
         */
        obj.specialcharSpace = function(){
            var pattern = /^([\u4E00-\u9FA5]|[a-zA-Z]|[0-9]|\s{0,})*$/;
            return obj.regExp(pattern);
        };

		/**
		 * 日期格式验证
		 *
		 * @return boolean true通过，false未通过
		 */
		obj.date = function(){
			var pattern = /^(\d{1,4})(-)(\d{1,2})(-)(\d{1,2})$/;
			return obj.regExp(pattern);
		};

		/**
		 * 同步验证
		 *
		 * 1、请求方式post
		 * 2、程序通过param值来获取参数
		 * 3、程序返回json格式的数据，success:true(可使用)，false(不可使用)
		 * 4、请求失败弹出错误状态值
		 *
		 * @param  string  url   请求地址
		 * @param  string  param 参数名
		 * @return boolean true通过，false未通过
		 */
		obj.ajax = function(url, param){
			var result = false;
			var data = '{' + param + ':' + "'" + obj.getValue() + "'" + '}';
				data = eval('(' + data + ')');
			jQuery.ajax({
				url:url, type:'post', data:data, async:false, dataType:'json',
				success:function(msg){
					result = msg.success;
				},
				error:function(error){
					alert(error.status);
				}
			});
			return result;
		};

        /**
         * 单次课时验证
         *
         * @param  string  operator 	 比较操作符，例如：['=='、'>'、'<'、'>='、'<='、'!=']
         * @param  string  compareValue  要比较的值
         * @return boolean true通过，false未通过
         */
        obj.classHourMinute = function(param){
            if (param.fields[0].val()*param.fields[1].val() > param.max) {
                return false;
            }

            return true;
        };

		/**
		 * 信息提示
		 *
		 * 1、设置消息内容和样式
		 * 2、如果样式有变动修改此方法即可
		 *
		 * @param string msg 信息内容
		 * @param string type 提示类型：error_tip，success_tip，notice_tip
		 */
		obj.tip = function(msg, type){
			// obj.rObj.find('p').text(msg);
            obj.rObj && obj.rObj.text(msg);
			switch(type){
				case 'notice_tip':
					obj.rObj.find('i').attr('class', type);
					break;
				case 'success_tip':
					if(!obj.defindTip){
                        obj.rObj.hide();
                        obj.rObjOk ? obj.rObjOk.show() : null;
					}
					break;				
				case 'error_tip':
					if(obj.defindTip){
                        obj.defindTip(msg);
					}else{
                        obj.rObj.show();
                        obj.rObjOk ? obj.rObjOk.hide() : null;
					}
					break;
				default :
					obj.rObj.find('i').attr('class', (msg.length ? type : ''));
					break;
			}
		};

		/**
		 * 显示错误信息
		 *
		 * @param string err 信息内容
		 */
		obj.error = function(err){
			obj.tip(err, 'error_tip');
		};

		/**
		 * 验证正确，清除错误信息
		 */
		obj.success = function(){
			var msg = (config.success ? config.success : '');
			obj.tip(msg, 'success_tip');
		};
		
		//焦点提示信息
		if(obj.vObj != null){
			// obj.vObj.click(function(){
			// 	if(config.tip){
			// 		obj.tip(config.tip, 'notice_tip');	
			// 	}
			// }).blur(function(){
			// 	obj.result();
			// });
			// 新增加的是否焦点提示
			obj.vObj.click(function(){
				if(config.tip){
					obj.tip(config.tip, 'notice_tip');	
				}
			});

			if(!obj.notBlurCheck){
				obj.vObj.blur(function(){
					obj.result();
				});
			}
		}

		/**
		 * 验证结果
		 *
		 * @return boolean true通过，false未通过
		 */
		obj.result = function(){
			var error   = '';
			var vResult = true;

			for(var i in obj.rule){

				//验证函数
				var vFunc = obj[i];
				//验证规则对象
				var ruleItem = obj.rule[i];

				//错误信息
				error = ruleItem['error'] ? ruleItem['error'] : '';

				switch(i){
					case 'regExp': //正则验证
						vResult = vFunc(ruleItem['regExp'], ruleItem['attribute']);
						break;
					case 'maxLength': //长度验证
					case 'minLength':
						vResult = vFunc(ruleItem['length']);
						break;
					case 'compare': //比较验证
						var compareTo = (ruleItem['compareTo'] && typeof ruleItem['compareTo'] == "string") ? jQuery('#' + ruleItem['compareTo']) : ruleItem['compareTo'];
						var compareValue = jQuery.trim(compareTo.val());
						vResult = vFunc(ruleItem['operator'], compareValue);
						break;
					case 'checkbox': //多选框验证
						vResult = vFunc(ruleItem['name']);
						break;
					case 'ajax': //异步验证
						vResult = vFunc(ruleItem['url'], ruleItem['param']);
						break;
					case 'maxInt': //最大整数验证
						vResult = vFunc(ruleItem['maxInt']);
						break;
                    case 'classHourMinute': //单次课时验证
                        vResult = vFunc(ruleItem);
                        break;
					default:
						vResult = vFunc();
						break;
				}
				if(vResult == false) break;
			}
			vResult ? obj.success() : obj.error(error);
			// 验证的回调函数-by gao 2017-7-5
			obj.call_result && obj.call_result(vResult);
			// end
			return vResult;
		};
	};
})(window, document);