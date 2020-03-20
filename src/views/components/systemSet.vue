<!-- 
	系统管理
 -->

<template>
  <div>
		<div class="system-container">
			<div class="left-tabs-box">
				<div class="tabs-cotent-box">
					<div class="box-title">对照表</div>
					<el-form :inline="true" :model="formInline" class="demo-form-inline">
						<el-form-item label="参数类型">
							<el-select v-model="formInline.parameter" clearable placeholder="参数">
								<el-option
									v-if="typeList"
									v-for="item in typeList"
									:key="item.id"
									:label="item.name"
									:value="item.id"
									>
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="关键词：">
							<el-input v-model="formInline.key" placeholder="对照表的中文值" clearable></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="searchSys" icon="el-icon-search">搜索</el-button>
						</el-form-item>
					</el-form>
					<div class="add-btn">
						<el-button-group class="marl15">
							<el-button type="primary" icon="el-icon-plus" size="small" @click="addParam('addParam')">添加对照参数类型</el-button>
							<el-button type="danger" icon="el-icon-delete" size="small" @click="delParam('delParam')">删除对照参数类型</el-button>
						</el-button-group>
						<el-button type="primary" icon="el-icon-circle-plus" size="small" @click="add('addSys')" class="marr20">添加关键词</el-button>
					</div>
					<el-table
						v-loading='loading'
						v-if="systemList"
						:data="systemList"
						border
						stripe
						max-height="540"
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
							prop="code"
							label="编码"
							header-align="center"
							align="center"
							width="">
						</el-table-column>
						<el-table-column
							prop="c_name"
							label="中文值"
							header-align="center"
							align="center"
							width="">
						</el-table-column>
						<el-table-column
							prop="remarks"
							label="注释"
							header-align="center"
							align="center"
							width="">
						</el-table-column>
						<el-table-column
							prop="cur_status"
							label="状态"
							header-align="center"
							align="center"
							width="">
						</el-table-column>
						<el-table-column 
							label="操作" 
							width="250"  
							fixed="right" 
							header-align="center" 
							align="center">
							<template slot-scope="scope">
								<el-button type="primary" size="small" @click.stop="edit('editSys',scope.row)">编辑</el-button>
								<el-button type="danger" icon="" size="small" @click.stop="del(scope.row)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="page page-fixed_">
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
							:current-page="elementPageData.pageNum"
							:page-sizes="elementPageData.defaultData.pageSizes"
							:page-size="elementPageData.defaultData.pageSizeDefault"
							background
							small
							layout="total, sizes, prev, pager, next, jumper"
							:total="systemListTotal">
						</el-pagination>
					</div>
				</div>
			</div>
		</div>
		<!-- 
			添加和编辑弹框
		-->
		<el-dialog :title="dialogTitleType=='addSys'?'添加关键词':'编辑信息'" :visible.sync="dialogAddEditFormVisible" width="650px" center>
			<el-form :model="sysform" ref="sysform" :rules="sysrules" label-width="80px" class="demo-ruleForm" v-loading='loading_'>
				<el-form-item label="编码" prop="code">
					<el-input v-model="sysform.code"></el-input>
				</el-form-item>
				<el-form-item label="中文值" prop="name">
					<el-input v-model="sysform.name"></el-input>
				</el-form-item>
				<el-form-item label="参数类型" prop="type">
					<el-select v-model="sysform.type" placeholder="请选择参数">
						<el-option
							v-if="typeList"
							v-for="item in typeList"
							:key="item.id"
							:label="item.name"
							:value="item.id"
							>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="注释" prop="remarks">
					<el-input v-model.number="sysform.remarks"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="addForm('sysform')" v-if="dialogTitleType=='addSys'">添 加</el-button>
				<el-button type="primary" @click="editForm('sysform')" v-if="dialogTitleType=='editSys'">保 存</el-button>
				<el-button @click="resetForm('sysform')">重 置</el-button>
				<el-button @click="dialogAddEditFormVisible = false">取 消</el-button>
			</div>
		</el-dialog>
		<!-- 编辑对照参数类型弹框-->
		<el-dialog
			:title="typeParamsTitle=='delParam'?'删除对照参数类型':'添加对照参数类型'"
			:visible.sync="paramDialogVisible"
			width="650px">
			<el-form :model="paramForm" ref="paramForm" label-width="150px" class="demo-dynamic" size="middle" v-if="typeParamsTitle=='addParam'">
				<el-form-item
					prop="name"
					label="对照参数类型："
					:rules="[{ required: true, message: '请输入对照参数类型', trigger: 'blur' },]">
					<el-input v-model="paramForm.name"></el-input>
				</el-form-item>
			</el-form>
			<div v-if="typeParamsTitle=='delParam'" v-loading='loading_'>
				<el-table v-if="typeList" :data="typeList" border stripe max-height="560" style="width: 100%">
					<el-table-column
						type="index"
						label="序号"
						fixed
						align="center"
						header-align="center"
						width="50">
					</el-table-column>
					<el-table-column
						prop="name"
						label="对照表参数类型"
						header-align="center"
						align="center"
						width="">
					</el-table-column>
					<el-table-column 
						label="操作" 
						width="120"  
						fixed="right" 
						header-align="center" 
						align="center">
						<template slot-scope="scope">
							<el-button type="danger" icon="" size="small" @click.stop="del_(scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<span slot="footer" class="dialog-footer" v-if="typeParamsTitle=='addParam'">
				<el-button @click="paramDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addParamForm('paramForm')">添 加</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<style>
	
</style>

<style src="../../assets/style/system.less" scoped lang="less"></style>

<script>
	
export default {
	methods: {
		
		//-------------------------------------------------------------------------------------参数类型列表
		/* 
			GET  查询--查询参数类型列表
		*/
		getTypeList(){
			this.loading_ = true;
			this.axios.get(`${this.common.basePath}/node/selectNodesType`,this._typeParams()).then( (response) => {
				if(response.data.meta.code === 0){
					this.typeList = response.data.data;//参数类型列表
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
				this.loading_ = false;
			}).catch( (error) => {
				this.$message.error(error);
				this.loading_ = false;
			});
		},
		_typeParams(){
			return {
				params: {}
			}
		},
		
		//-------------------------------------------------------------------------------------系统列表（对照表）
		/* 
			通过参数类型或关键词搜索系统列表
		*/
		searchSys(){
			this.elementPageData.pageNum = 1;
			//处理参数类型或关键词为空时，设为null
			if(this.formInline.parameter==''){
				this.formInline.parameter=null;
			}
			if(this.formInline.key==''){
				this.formInline.key=null;
			}
			this.getSystemList();
		},
		/* 
			GET  查询--根据条件查询系统列表
		*/
		getSystemList(){
			this.loading = true;
			this.axios.get(`${this.common.basePath}/node/selectNodesIfo`,this._systemParams()).then( (response) => {
				if(response.data.meta.code === 0){
					this.systemList = response.data.data.list;//系统列表
					this.systemListTotal = response.data.data.total;//系统列表总数
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
				this.loading = false;
			}).catch( (error) => {
				this.$message.error(error);
				this.loading = false;
			});
		},
		_systemParams(){
			return {
				params: {
					pageSize: this.elementPageData.pageSize,
					currentPage:  this.elementPageData.pageNum,
					keys:this.formInline.key,
					type_id:this.formInline.parameter,
				}
			}
		},
		
		//-------------------------------------------------------------------------------------分页功能
		/*
		* 改变当前页码触发此事件
		* @param {number} val 当前页码
		*/
		handleCurrentChange(val){
			this.elementPageData.pageNum = val;
			this.getSystemList();
		},
		/*
		* 改变每页条数触发此事件
		* @param {number} val 当前数据
		*/
		handleSizeChange(val){
			this.elementPageData.pageSize = val;
			this.getSystemList();
		},
		
		//-------------------------------------------------------------------------------------添加、编辑、删除对照表
		/* 
			新增
		 */
		add(type){
			//清空信息
			this.editId = null;
			//dialogTitleType
			this.dialogTitleType = type;
			//dialogAddEditFormVisible
			this.dialogAddEditFormVisible = true;

			//清空表单信息
			if(this.$refs['sysform']){
				this.$refs['sysform'].resetFields();
			} 
		},
		/* 
		确认添加
		*/
		addForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					let addSysForm = {
						code:this.sysform.code,
						name:this.sysform.name,
						type_id:this.sysform.type,
						remarks:this.sysform.remarks,
					};
					this.axios.post(`${this.common.basePath}/node`,addSysForm).then( (response) => {
						if(response.data.meta.code === 0){
							this.$message.success("添加成功！！", 20);
							this.dialogAddEditFormVisible = false
							this.getSystemList();
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
					}).catch( (error) => {
						this.$message.error(error);
					});
				} else {
					this.$message.error('添加的信息未填写完整！！！', 20); 
					return false;
				}
			});
		},
		/* 
			编辑
		*/
		edit(type,colData){
			//清空信息
			this.editId = null;
			//dialogTitleType
			this.dialogTitleType = type;
			//回显信息
			this.loading_ = true;
			this.axios.get(`${this.common.basePath}/node/${colData.c_id}`,this._typeParams()).then( (response) => {
				if(response.data.meta.code === 0){
					this.sysform = response.data.data;
					this.$set(this.sysform,"type", response.data.data.type_id);
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
				this.loading_ = false;
			}).catch( (error) => {
				this.$message.error(error);
				this.loading_ = false;
			});
			this.editId = colData.c_id;
			//dialogAddEditFormVisible
			this.dialogAddEditFormVisible = true;

			//清空表单信息
			if(this.$refs['sysform']){
				this.$refs['sysform'].resetFields();
			} 
		},
		/* 
			确认编辑
		*/
		editForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					// var typeId = '';
					// for(var i = 0;i<this.typeList.length;i++){//匹配参数类型名称对应的type_id
					// 	if(this.typeList[i].id===this.sysform.type){
					// 		typeId = this.typeList[i].id
					// 	}
					// }
					// this.sysform.type = typeId;
					let editSysForm = {
						code:this.sysform.code,
						name:this.sysform.name,
						type_id:this.sysform.type,
						remarks:this.sysform.remarks,
					};
					this.axios.patch(`${this.common.basePath}/node/${this.editId}`,editSysForm).then( (response) => {
						if(response.data.meta.code === 0){
							this.$message.success("编辑成功！！", 20);
							this.dialogAddEditFormVisible = false
							this.getSystemList();
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
					}).catch( (error) => {
						this.$message.error(error);
					});
				} else {
					this.$message.error('编辑的信息未填写完整！！！', 20); 
					return false;
				}
			});
		},
		/* 
			重置
		*/
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},
		/* 
			删除
		*/
		del(colData){
			this.$confirm('是否确定删除？？？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.axios.patch(`${this.common.basePath}/node/delete/${colData.c_id}`,{}).then( (response) => {
					if(response.data.meta.code === 0){
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
						this.getSystemList();
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
				}).catch( (error) => {
					this.$message.error(error);
				});
			}).catch(() => {});
		},
		
		//-------------------------------------------------------------------------------------删除、添加对照表参数类型
		/* 
			添加对照表参数类型
		 */
		addParam(type){
			this.typeParamsTitle = type;
			this.paramDialogVisible = true;
			
			if(this.$refs['paramForm']){
				this.$refs['paramForm'].resetFields();
			}
		},
		/* 
			确认添加对照表参数类型
		 */
		addParamForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.axios.post(`${this.common.basePath}/node/addNodesType`,this.paramForm).then( (response) => {
						if(response.data.meta.code === 0){
							this.$message.success("添加对照表参数类型成功！！", 20);
							this.paramDialogVisible = false
							this.getTypeList();
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
					}).catch( (error) => {
						this.$message.error(error);
					});
				} else {
					return false;
				}
			});
		},
		/* 
			删除对照表参数类型
		*/
		delParam(type){
			this.getTypeList();
			this.typeParamsTitle = type;
			this.paramDialogVisible = true;
		},
		/* 
		 确认删除对照表参数类型
		 */
		del_(colData){
			this.$confirm('是否确定删除该参数类型？？？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.axios.get(`${this.common.basePath}/node/deleteNodesType`,{params:{id:colData.id}}).then( (response) => {
					if(response.data.meta.code === 0){
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
						this.paramDialogVisible = false
						this.getTypeList();
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
				}).catch( (error) => {
					this.$message.error(error);
				});
			}).catch(() => {});
		},
	
	},
	mounted(){ 
		/* 
			GET  查询--根据条件查询系统列表
		*/
		this.getSystemList();
		
		/* 
			GET  查询--查询参数类型列表
		*/
		this.getTypeList();
	},
	data(){
		return {
			loading:false,//对照表的加载
			loading_:false,//弹框回显信息时的加载
			dialogTitleType:null,//添加和编辑弹框标题类型
			dialogAddEditFormVisible:false,//添加和编辑弹框
			editId:null,//编辑id
			sysform:{//添加与编辑表单
				code:null,
				name:null,
				type:null,
				remarks:null,
			},
			sysrules:{
				code: [
					{ required: true, message: '请输入编码', trigger: 'blur' },
				],
				name: [
					{ required: true, message: '请输入中文值', trigger: 'blur' },
				],
				type: [
					{ required: true, message: '请选择参数类型', trigger: 'change' }
				],
			},
			
			typeList:null,//参数类型列表
			elementPageData: {               
				//分页需要的数据
				defaultData:  this.common.elementPagination,
				pageNum:      this.common.elementPagination.pageNumDefault,
				pageSize:     this.common.elementPagination.pageSizeDefault,
			},
			formInline: {
				key:null,
				parameter:null,
			},
			systemList:null,//系统列表
			systemListTotal:null,//系统列表总数
			
			typeParamsTitle:null,//添加与删除参数类型的弹框标题
			paramDialogVisible:false,//编辑对照参数类型弹框
			paramForm:{//添加对照参数表单
				name:null,
			}
		}
	},
};
</script> 