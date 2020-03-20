import vue from 'vue';
const Vue = new vue();

export default {
  basePath: `${window.location.origin}/api`,
  basePicPath: `https://static.crledu.com`,
  elementPagination:{     //elementUi中的分页所需数据
  		pageSizes: [10, 20, 30],
  		pageSizeDefault: 10,   //初始条数
  		pageNumDefault:1,      //初始页码
  		pageSizes_: [12, 24, 36],
  		pageSizeDefault_: 12,   //初始条数
  },
  /*
  * 将时间转换为某年某月某日 00：00：00
  * @params {string/number} timeSetback 时间戳
  * @params {string} format 时间格式
  */
  _convertDate(time, format){
      return time ? new Date(time).Format(format) : '无';
  },
	
	/*
	* 根据code转化为页面名称
	*/
	convertPageName(code){
		switch(code){
			case "project":
				return '产品';
				break;
			case "project_detail":
				return '详情';
				break;
			case "project_function":
				return '功能列表';
				break;
			case "project_instructions":
				return '说明书';
				break;
			case "project_feedback":
				return '反馈';
				break;
			case "project_deploy":
				return '部署';
				break;
			case "server":
				return '服务器';
				break;
			case "server_detail":
				return '详情';
				break;
			case "server_databases":
				return '数据库服务';
				break;
			case "server_port":
				return '端口';
				break;
			case "server_redis":
				return 'Redis服务';
				break;
			case "server_ngnix":
				return 'Nginx服务';
				break;
			case "user_manager":
				return '用户管理';
				break;
			case "user_manager_user":
				return '用户列表';
				break;
			case "user_manager_role_user":
				return '角色用户';
				break;
			case "user_manager_role":
				return '角色管理';
				break;
			case "user_manager_page":
				return '页面管理';
				break;
			case "user_manager_power":
				return '权限管理';
				break;
			case "syetem_set":
				return '系统设置';
				break;
			case "log_manage":
				return '日志管理';
				break;
			case "log_manage_security":
				return '安全日志';
				break;
			case "log_manage_abnormal":
				return '异常日志';
				break;
			case "log_manage_operation":
				return '操作日志';
				break;
			default:
				return '请设置页面名称';
				break;
		};
	},

	/*
	* 根据id转化操作日志的操作类型名称
	*/
	convertOperationLogName(opertype){
		switch(opertype){
			case '1':
				return '新增';
				break;
			case '2':
				return '编辑';
				break;
			case '20':
				return '删除';
				break;
			default:
				return opertype;
				break;
		};
	},
}

/*
*   格式化日期格式
*/
Date.prototype.Format = function (fmt) { 
  var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}