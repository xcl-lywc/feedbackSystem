<!-- 
	日志管理
 -->

<template>
  <div>
		<div class="log-container">
			<div class="left-tabs-box">
				<el-tabs tab-position="right" v-model="activeName" @tab-click="handleClick" v-if="logPages">
					<el-tab-pane
						:key="item"
						v-for="(item, index) in logPages"
						:label="common.convertPageName(item)"
						:name="item"
					>
						<div ref="log-security" v-if="item=='log_manage_security'" class="tabs-cotent-box" v-loading="loading">
							<div class="box-title">安全日志</div>
							<el-form :inline="true" :model="formInline" class="demo-form-inline">
								<el-form-item label="时间：">
									<el-date-picker
										v-model="formInline.date"
										type="daterange"
										align="right"
										unlink-panels
										range-separator="至"
										start-placeholder="开始日期"
										end-placeholder="结束日期"
										:picker-options="pickerOptions">
									</el-date-picker>
								</el-form-item>
								<el-form-item label="关键词：">
									<el-input v-model="formInline.key" placeholder="安全日志的用户、类型"></el-input>
									<!-- <el-select v-model="formInline.key" placeholder="请选择类型" @visible-change="selsectLogKey($event,'Security')" clearable>
										<div v-loading='loading_'>
											<el-option
									      v-for="item in securityLogKeyList"
									      :key="item"
									      :label="item"
									      :value="item">
									      <p @click="selsectLogKey_(item,'Security')">{{item}}</p>
									    </el-option>
										</div>
								  </el-select> -->
								</el-form-item>
								<el-form-item>
									<el-button type="primary" @click="searchLog('Security')" icon="el-icon-search">搜索</el-button>
								</el-form-item>
							</el-form>
							<el-table
								v-if="securityLogList"
								:data="securityLogList"
								border
								stripe
								max-height="570"
								style="width: 100%">
								<el-table-column
									type="index"
									label="序号"
									fixed
									align="center"
									header-align="center"
									width="50">
								</el-table-column>
								<el-table-column
									prop="creattime"
									label="时间"
									header-align="center"
									align="center"
									width="">
									<template slot-scope="scope">
										<span  class="name-style">
											{{scope.row.creattime.split('T')[0]}}
										</span>
									</template>
								</el-table-column>
								<el-table-column
									prop="name"
									label="用户"
									header-align="center"
									align="center"
									width="">
								</el-table-column>
								<el-table-column
									prop="type_name"
									label="类型"
									header-align="center"
									align="center"
									width="">
								</el-table-column>
								<el-table-column
									prop="info"
									label="信息"
									header-align="center"
									align="center"
									width="800px">
								</el-table-column>
							</el-table>
							<div class="page page-fixed">
								<el-pagination @size-change="handleSizeChange($event,'Security')" @current-change="handleCurrentChange($event,'Security')"
									:current-page="elementPageData.pageNum"
									:page-sizes="elementPageData.defaultData.pageSizes"
									:page-size="elementPageData.defaultData.pageSizeDefault"
									background
									small
									layout="total, sizes, prev, pager, next, jumper"
									:total="securityLogListTotal">
								</el-pagination>
							</div>
						</div>
						<div ref="log-abnormal" v-if="item=='log_manage_abnormal'" class="tabs-cotent-box" v-loading="loading">
							<div class="box-title">异常日志</div>
							<el-form :inline="true" :model="formInline" class="demo-form-inline">
								<el-form-item label="时间：">
									<el-date-picker
										v-model="formInline.date"
										type="daterange"
										align="right"
										unlink-panels
										range-separator="至"
										start-placeholder="开始日期"
										end-placeholder="结束日期"
										:picker-options="pickerOptions">
									</el-date-picker>
								</el-form-item>
								<el-form-item label="关键词：">
									<el-input v-model="formInline.key" placeholder="异常日志的用户、类型、信息"></el-input>
									<!-- <el-select v-model="formInline.key" placeholder="请选择类型" @visible-change="selsectLogKey($event,'Abnormal')" clearable>
								    <div v-loading='loading_'>
								    	<el-option
									      v-for="item in abnormalLogKeyList"
									      :key="item"
									      :label="item"
									      :value="item">
									      <p @click="selsectLogKey_(item,'Abnormal')">{{item}}</p>
									    </el-option>
								    </div>
								  </el-select> -->
								</el-form-item>
								<el-form-item>
									<el-button type="primary" @click="searchLog('Abnormal')" icon="el-icon-search">搜索</el-button>
								</el-form-item>
							</el-form>
							<el-table
								v-if="abnormalLogList"
								:data="abnormalLogList"
								border
								stripe
								max-height="570"
								style="width: 100%">
								<el-table-column
									type="index"
									label="序号"
									fixed
									align="center"
									header-align="center"
									width="50">
								</el-table-column>
								<el-table-column
									prop="creattime"
									label="时间"
									header-align="center"
									align="center"
									width="">
									<template slot-scope="scope">
										<span  class="name-style">
											{{scope.row.creattime.split('T')[0]}}
										</span>
									</template>
								</el-table-column>
								<el-table-column
									prop="name"
									label="用户"
									header-align="center"
									align="center"
									width="">
								</el-table-column>
								<el-table-column
									prop="type"
									label="类型"
									header-align="center"
									align="center"
									width="">
								</el-table-column>
								<el-table-column
									prop="info"
									label="信息"
									header-align="center"
									align="center"
									width="800px">
								</el-table-column>
								<el-table-column
									prop="route"
									label="路径"
									header-align="center"
									align="center"
									width="">
								</el-table-column>
							</el-table>
							<div class="page page-fixed">
								<el-pagination @size-change="handleSizeChange($event,'Abnormal')" @current-change="handleCurrentChange($event,'Abnormal')"
									:current-page="elementPageData.pageNum"
									:page-sizes="elementPageData.defaultData.pageSizes"
									:page-size="elementPageData.defaultData.pageSizeDefault"
									background
									small
									layout="total, sizes, prev, pager, next, jumper"
									:total="abnormalLogListTotal">
								</el-pagination>
							</div>
						</div>
						<div ref="log-operation" v-if="item=='log_manage_operation'" class="tabs-cotent-box" v-loading="loading">
							<div class="box-title">操作日志</div>
							<el-form :inline="true" :model="formInline" class="demo-form-inline">
								<el-form-item label="时间：">
									<el-date-picker
										v-model="formInline.date"
										type="daterange"
										align="right"
										unlink-panels
										range-separator="至"
										start-placeholder="开始日期"
										end-placeholder="结束日期"
										:picker-options="pickerOptions">
									</el-date-picker>
								</el-form-item>
								<el-form-item label="关键词：">
									<el-input v-model="formInline.key" placeholder="操作日志的用户、信息"></el-input>
									<!-- <el-select v-model="formInline.key" placeholder="请选择类型" @visible-change="selsectLogKey($event,'Operation')" clearable>
										<div v-loading='loading_'>
											<el-option
									      v-for="item in operationLogKeyList"
									      :key="item"
									      :label="item"
									      :value="item">
									      <p @click="selsectLogKey_(item,'Operation')">{{item}}</p>
									    </el-option>
										</div>
								  </el-select> -->
								</el-form-item>
								<el-form-item>
									<el-button type="primary" @click="searchLog('Operation')" icon="el-icon-search">搜索</el-button>
								</el-form-item>
							</el-form>
							<el-table
								v-if="operationLogList"
								:data="operationLogList"
								border
								stripe
								max-height="570"
								style="width: 100%">
								<el-table-column
									type="index"
									label="序号"
									fixed
									align="center"
									header-align="center"
									width="50">
								</el-table-column>
								<el-table-column
									prop="creattime"
									label="时间"
									header-align="center"
									align="center"
									width="">
									<template slot-scope="scope">
										<span  class="name-style">
											{{scope.row.creattime.split('T')[0]}}
										</span>
									</template>
								</el-table-column>
								<el-table-column
									prop="name"
									label="用户"
									header-align="center"
									align="center"
									width="">
								</el-table-column>
								<el-table-column
									prop="datatypename"
									label="数据类型"
									header-align="center"
									align="center"
									width="">
								</el-table-column>
								<el-table-column
									prop="opertypename"
									label="操作类型"
									header-align="center"
									align="center"
									width="">
									<!-- <template slot-scope="scope">
										{{ common.convertOperationLogName(scope.row.opertype) }}
									</template> -->
								</el-table-column>
								<el-table-column
									prop="info"
									label="信息"
									header-align="center"
									align="center"
									width="800px">
									<template slot-scope="scope">
										{{ scope.row.info?scope.row.info:'暂无数据' }}
									</template>
								</el-table-column>
							</el-table>
							<div class="page page-fixed">
								<el-pagination @size-change="handleSizeChange($event,'Operation')" @current-change="handleCurrentChange($event,'Operation')"
									:current-page="elementPageData.pageNum"
									:page-sizes="elementPageData.defaultData.pageSizes"
									:page-size="elementPageData.defaultData.pageSizeDefault"
									background
									small
									layout="total, sizes, prev, pager, next, jumper"
									:total="operationLogListTotal">
								</el-pagination>
							</div>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>
		</div>
	</div>
</template>

<style>
	
</style>

<style src="../../assets/style/log.less" scoped lang="less"></style>

<script>
	
export default {
	props:{
		tabTwoPages:{
			type:Array,
			required:true,
		},
	},
	methods: {
		
		//-------------------------------------------------------------------------------------tab切换
		/* 
		左侧的tab切换
		*/
		handleClick(tab, event) {
			if(tab.name=='log_manage_security'){//安全日志
				/* 
					GET  查询--根据条件查询安全日志
				*/
				this.formInline.key=null;
				this.formInline.date=null;
				this.elementPageData.pageNum = 1;
				this.getSecurityLogList();
			}else if(tab.name=='log_manage_abnormal'){//异常日志
				/* 
					GET  查询--根据条件查询异常日志
				*/
				this.formInline.key=null;
				this.formInline.date=null;
				this.elementPageData.pageNum = 1;
				this.getAbnormalLogList();
			}else if(tab.name=='log_manage_operation'){//操作日志
				/* 
					GET  查询--根据条件查询操作日志
				*/
				this.formInline.key=null;
				this.formInline.date=null;
				this.elementPageData.pageNum = 1;
				this.getOperationLogList();
			}
		},
		
		//-------------------------------------------------------------------------------------搜索查询日志列表
		/*
			选择日志关键词
		 */
		selsectLogKey(val,type){
			if(type=='Security'&&val===true){
				this.loading_=true;
				this.axios.get(`${this.common.basePath}/log/searchSecurity`,{params:{currentPage:1,pageSize:10}}).then( (response) => {
					if(response.data.meta.code === 0){
						this.securityType(response.data.data.total)
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
				}).catch( (error) => {this.$message.error(error);this.loading_=false;});
			}else if(type=='Abnormal'&&val===true){
				this.loading_=true;
				this.axios.get(`${this.common.basePath}/log/searchAbnormal`,{params:{currentPage:1,pageSize:10}}).then( (response) => {
					if(response.data.meta.code === 0){
						this.abnormalType(response.data.data.total)
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
				}).catch( (error) => {this.$message.error(error);this.loading_=false;});
			}else if(type=='Operation'&&val===true){
				this.loading_=true;
				this.axios.get(`${this.common.basePath}/log/searchOperation`,{params:{currentPage:1,pageSize:10}}).then( (response) => {
					if(response.data.meta.code === 0){
						this.operationType(response.data.data.total)//289
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
				}).catch( (error) => {this.$message.error(error);this.loading_=false;});
			}
		},
		securityType(total){
			this.axios.get(`${this.common.basePath}/log/searchSecurity`,{params:{currentPage:1,pageSize:total}}).then( (response) => {
				if(response.data.meta.code === 0){
					let array = response.data.data.list;
					var temp = []; //一个新的临时数组
					if(JSON.stringify(array)!='[]'){
						for(var i = 0; i < array.length; i++){
			        if(temp.indexOf(array[i].type_name) == -1){
			          temp.push(array[i].type_name);
			        }
				    }
					}
					this.securityLogKeyList = temp;//安全日志关键词列表
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
				this.loading_=false;
			}).catch( (error) => {this.$message.error(error);this.loading_=false;});
		},
		abnormalType(total){
			this.axios.get(`${this.common.basePath}/log/searchAbnormal`,{params:{currentPage:1,pageSize:total}}).then( (response) => {
				if(response.data.meta.code === 0){
					let array = response.data.data.list;
					var temp = []; //一个新的临时数组
					if(JSON.stringify(array)!='[]'){
						for(var i = 0; i < array.length; i++){
			        if(temp.indexOf(array[i].type) == -1){
			          temp.push(array[i].type);
			        }
				    }
					}
					this.abnormalLogKeyList = temp;//异常日志关键词列表
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
				this.loading_=false;
			}).catch( (error) => {this.$message.error(error);this.loading_=false;});
		},
		operationType(total){
			this.axios.get(`${this.common.basePath}/log/searchOperation`,{params:{currentPage:1,pageSize:total}}).then( (response) => {
				if(response.data.meta.code === 0){
					let array = response.data.data.list;
					var temp = []; //一个新的临时数组
					if(JSON.stringify(array)!='[]'){
						for(var i = 0; i < array.length; i++){
			        if(temp.indexOf(array[i].opertypename) == -1){
			          temp.push(array[i].opertypename);
			        }
				    }
					}
					this.operationLogKeyList = temp;//操作日志关键词列表
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
				this.loading_=false;
			}).catch( (error) => {this.$message.error(error);this.loading_=false;});
		},
		selsectLogKey_(val,type){
			if(type=='Security'){
				this.formInline.key=val;
			}else if(type=='Abnormal'){
				this.formInline.key=val;
			}else if(type=='Operation'){
				this.formInline.key=val;
			}
		},
		/* 
			通过时间或关键词搜索日志列表
		*/
		searchLog(type){
			this.elementPageData.pageNum = 1;
			//处理时间或关键词为空时，设为null
			if(this.formInline.date==''){
				this.formInline.date=null;
			}
			if(this.formInline.key==''){
				this.formInline.key=null;
			}
			//
			if(type=="Security"){
				this.getSecurityLogList();
			}else if(type=="Abnormal"){
				this.getAbnormalLogList();
			}else if(type=="Operation"){
				this.getOperationLogList();
			}
		},
		
		//-------------------------------------------------------------------------------------安全日志列表
		/* 
			GET  查询--根据条件查询安全日志列表
		*/
		getSecurityLogList(){
			this.loading = true;
			this.axios.get(`${this.common.basePath}/log/searchSecurity`,this._logParams()).then( (response) => {
				if(response.data.meta.code === 0){
					this.securityLogList = response.data.data.list;//安全日志列表
					this.securityLogListTotal = response.data.data.total;//安全日志列表总数
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
				this.loading = false;
			}).catch( (error) => {
				this.$message.error(error);
				this.loading = false;
			});
		},
		
		//-------------------------------------------------------------------------------------操作日志列表
		/* 
			GET  查询--根据条件查询操作日志列表
		*/
		getOperationLogList(){
			this.loading = true;
			this.axios.get(`${this.common.basePath}/log/searchOperation`,this._logParams()).then( (response) => {
				if(response.data.meta.code === 0){
					this.operationLogList = response.data.data.list;//操作日志列表
					this.operationLogListTotal = response.data.data.total;//操作日志列表总数
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
				this.loading = false;
			}).catch( (error) => {
				this.$message.error(error);
				this.loading = false;
			});
		},
		
		//-------------------------------------------------------------------------------------异常日志列表
		/* 
			GET  查询--根据条件查询异常日志列表
		*/
		getAbnormalLogList(){
			this.loading = true;
			this.axios.get(`${this.common.basePath}/log/searchAbnormal`,this._logParams()).then( (response) => {
				if(response.data.meta.code === 0){
					this.abnormalLogList = response.data.data.list;//异常日志列表
					this.abnormalLogListTotal = response.data.data.total;//异常日志列表总数
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
				this.loading = false;
			}).catch( (error) => {
				this.$message.error(error);
				this.loading = false;
			});
		},
		
		_logParams(){
			return {
				params: {
					pageSize: this.elementPageData.pageSize,
					currentPage:  this.elementPageData.pageNum,
					stime:this.formInline.date?this.formInline.date[0].getTime():null,
					etime:this.formInline.date?this.formInline.date[1].getTime():null,
					keyWords:this.formInline.key,
				}
			}
		},
		
		//-------------------------------------------------------------------------------------分页功能
		/*
		* 改变当前页码触发此事件
		* @param {number} val 当前页码
		*/
		handleCurrentChange(val,type){
			this.elementPageData.pageNum = val;
			if(type=="Security"){
				this.getSecurityLogList();
			}else if(type=="Abnormal"){
				this.getAbnormalLogList();
			}else if(type=="Operation"){
				this.getOperationLogList();
			}
		},
		/*
		* 改变每页条数触发此事件
		* @param {number} val 当前数据
		*/
		handleSizeChange(val,type){
			this.elementPageData.pageSize = val;
			if(type=="Security"){
				this.getSecurityLogList();
			}else if(type=="Abnormal"){
				this.getAbnormalLogList();
			}else if(type=="Operation"){
				this.getOperationLogList();
			}
		},
		
  },
	mounted(){ 
		/* 
		处理tabTwoPages
		*/
		let logPages = [];
		for(var i = 0;i<this.tabTwoPages.length;i++){
			if(this.tabTwoPages[i].split("_")[0]=="log"){
				logPages.push(this.tabTwoPages[i])
			}
		}
		this.logPages = logPages;
		this.activeName = logPages[0];
		
		/* 
			GET  查询--根据条件查询安全日志列表
		*/
		this.getSecurityLogList();
	},
	data(){
		return {
			loading:false,//日志表格的加载
			loading_:false,//日志关键词下拉框的加载

			logPages:[],//日志的二级页面数组
			activeName:null,
			elementPageData: {               
				//分页需要的数据
				defaultData:  this.common.elementPagination,
				pageNum:      this.common.elementPagination.pageNumDefault,
				pageSize:     this.common.elementPagination.pageSizeDefault,
			},
			formInline: {
				date:null,
				key:null,
			},
			securityLogList:null,//安全日志列表
			securityLogKeyList:null,//安全日志关键词列表
			securityLogListTotal:null,//安全日志列表总数
			operationLogList:null,//操作日志列表
			operationLogKeyList:null,//操作日志关键词列表
			operationLogListTotal:null,//操作日志列表总数
			abnormalLogList:null,//异常日志列表
			abnormalLogKeyList:null,//异常日志关键词列表
			abnormalLogListTotal:null,//异常日志列表总数
			pickerOptions: {
				shortcuts: [{
					text: '最近一周',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
						picker.$emit('pick', [start, end]);
					}
				}, {
					text: '最近一个月',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
						picker.$emit('pick', [start, end]);
					}
				}, {
					text: '最近三个月',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
						picker.$emit('pick', [start, end]);
					}
				}]
			},
		}
	},
};
</script> 