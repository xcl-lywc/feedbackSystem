<!-- 
	用户管理
 -->

<template>
  <div>
		<div class="user-container">
			<div class="left-tabs-box">
				<el-tabs tab-position="right" v-model="activeName" @tab-click="handleClick" v-if="userPages">
					<el-tab-pane
						:key="item"
						v-for="(item, index) in userPages"
						:label="common.convertPageName(item)"
						:name="item"
					>
						<div ref="user-user_" v-if="item=='user_manager_user'" class="tabs-cotent-box" v-loading="loading">
							<div class="box-title">用户列表</div>
							<el-form :inline="true" :model="formInline" class="demo-form-inline">
								<el-form-item label="姓名：">
									<el-input v-model="formInline.username" placeholder="姓名"></el-input>
								</el-form-item>
								<el-form-item label="账号：">
									<el-input v-model="formInline.account" placeholder="账号"></el-input>
								</el-form-item>
								<el-form-item>
									<el-button type="primary" @click="searchUser" icon="el-icon-search">搜索</el-button>
								</el-form-item>
							</el-form>
							<div class="add-btn">
								<el-button type="primary" icon="el-icon-circle-plus" class="marr20" size="small" @click="add('0')">添加</el-button>
							</div>
							<el-table
								v-if="userList"
								:data="userList"
								border
								stripe
								max-height="530"
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
									prop="account"
									label="账号"
									header-align="center"
									align="center"
									width="">
								</el-table-column>
								<el-table-column
									prop="name"
									label="姓名"
									header-align="center"
									align="center"
									width="">
								</el-table-column>
								<el-table-column
									prop="phone"
									label="电话"
									header-align="center"
									align="center"
									width="">
								</el-table-column>
								<el-table-column
									prop="telephone"
									label="手机"
									header-align="center"
									align="center"
									width="">
								</el-table-column>
								<el-table-column
									prop="email"
									label="邮箱"
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
										<el-button type="primary" size="small" @click.stop="edit('4',scope.row)">编辑</el-button>
										<el-button type="danger" icon="" size="small" @click.stop="del('user',scope.row)">删除</el-button>
									</template>
								</el-table-column>
							</el-table>
							<div class="page page-fixed">
								<el-pagination @size-change="handleSizeChange($event,'user')" @current-change="handleCurrentChange($event,'user')"
									:current-page="elementPageData.pageNum"
									:page-sizes="elementPageData.defaultData.pageSizes"
									:page-size="elementPageData.defaultData.pageSizeDefault"
									background
									small
									layout="total, sizes, prev, pager, next, jumper"
									:total="userListTotal">
								</el-pagination>
							</div> 
						</div>
						<div ref="user-role_user" v-if="item=='user_manager_role_user'" class="tabs-cotent-box" v-loading="loading">
							<div class="box-title">角色用户</div>
							<el-form :inline="true" :model="formInline" class="demo-form-inline">
								<el-form-item label="角色">
									<el-select v-model="formInline.role" clearable placeholder="角色" @change="selectRole">
										<el-option
											v-if="roleList"
											v-for="item in roleList"
											:key="item.id"
											:label="item.role"
											:value="item.id"
											>
										</el-option>
									</el-select>
								</el-form-item>
							</el-form>
							<div class="add-btn">
								<el-button type="primary" icon="el-icon-circle-plus" class="marr20" size="small" @click="add('1')">添加</el-button>
							</div>
							<el-table
								v-if="userList"
								:data="userList"
								border
								stripe
								max-height="530"
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
									prop="account"
									label="账号"
									header-align="center"
									align="center"
									width="">
								</el-table-column>
								<el-table-column
									prop="name"
									label="姓名"
									header-align="center"
									align="center"
									width="">
								</el-table-column>
								<el-table-column
									prop="phone"
									label="电话"
									header-align="center"
									align="center"
									width="">
								</el-table-column>
								<el-table-column
									prop="telephone"
									label="手机"
									header-align="center"
									align="center"
									width="">
								</el-table-column>
								<el-table-column
									prop="email"
									label="邮箱"
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
										<el-button type="primary" size="small" @click.stop="editRoleUser('7',scope.row)">授予角色</el-button>
										<el-button type="danger" icon="" size="small" @click.stop="del('user',scope.row)">删除</el-button>
									</template>
								</el-table-column>
							</el-table>
							<div class="page page-fixed">
								<el-pagination @size-change="handleSizeChange($event,'role_user')" @current-change="handleCurrentChange($event,'role_user')"
									:current-page="elementPageData.pageNum"
									:page-sizes="elementPageData.defaultData.pageSizes"
									:page-size="elementPageData.defaultData.pageSizeDefault"
									background
									small
									layout="total, sizes, prev, pager, next, jumper"
									:total="userListTotal">
								</el-pagination>
							</div>
						</div>
						<div ref="user-role" v-if="item=='user_manager_role'" class="tabs-cotent-box" v-loading="loading">
							<div class="box-title">角色管理</div>
							<el-form :inline="true" :model="formInline" class="demo-form-inline">
								<el-form-item label="名称：">
									<el-input v-model="formInline.name" placeholder="名称"></el-input>
								</el-form-item>
								<el-form-item label="编码：">
									<el-input v-model="formInline.code" placeholder="编码"></el-input>
								</el-form-item>
								<el-form-item>
									<el-button type="primary" @click="searchRole" icon="el-icon-search">搜索</el-button>
								</el-form-item>
							</el-form>
							<div class="add-btn">
								<el-button type="primary" icon="el-icon-circle-plus" class="marr20" size="small" @click="add('2')">添加</el-button>
							</div>
							<el-table
								v-if="roleList"
								:data="roleList"
								border
								stripe
								max-height="530"
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
									prop="role"
									label="名称"
									header-align="center"
									align="center"
									width="">
								</el-table-column>
								<el-table-column
									prop="remarks"
									label="备注"
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
										<el-button type="primary" size="small" @click.stop="edit('5',scope.row)">编辑</el-button>
										<el-button type="success" icon="" size="small" @click.stop="authorize(scope.row)">授权</el-button>
										<el-button type="danger" icon="" size="small" @click.stop="del('role',scope.row)">删除</el-button>
									</template>
								</el-table-column>
							</el-table>
							<div class="page page-fixed">
								<el-pagination @size-change="handleSizeChange($event,'role')" @current-change="handleCurrentChange($event,'role')"
									:current-page="elementPageData.pageNum"
									:page-sizes="elementPageData.defaultData.pageSizes"
									:page-size="elementPageData.defaultData.pageSizeDefault"
									background
									small
									layout="total, sizes, prev, pager, next, jumper"
									:total="roleListTotal">
								</el-pagination>
							</div>
						</div>
						<div ref="user-page" v-if="item=='user_manager_page'" class="function-box tabs-cotent-box" v-loading="loading">
							<div class="title">
								<p>页面树</p>
								<el-button size="small" class="mart10" type="primary" icon="el-icon-circle-plus" @click="add('8')">添加</el-button>
							</div>
							<el-tree
								:data="pageResourse"
								:props="defaultPageProps"
								node-key="id"
								accordion
								ref="page"
								class="tree-box">
								<span class="custom-tree-node my_custom-tree-node" slot-scope="{ node, data }" @mouseover=" tempAtId = data.id " @mouseout="tempAtId = null">
									<span>{{ common.convertPageName(data.code) }}</span>
									<span v-if="tempAtId == data.id" class="tree-right-operate">
										<el-button
											type="primary"
											size="mini"
											@click="addPage(data.id)">
											添加子页面
										</el-button>
										<el-button
											type="success"
											size="mini"
											@click="edit('9',data)">
											编辑
										</el-button>
										<el-button
											type="danger"
											size="mini"
											@click="del('page',data)">
											删除
										</el-button>
									</span>
								</span>
							</el-tree>
						</div>
						<div ref="user-power" v-if="item=='user_manager_power'" class="tabs-cotent-box" v-loading="loading">
							<div class="box-title">权限管理</div>
							<el-form :inline="true" :model="formInline" class="demo-form-inline">
								<el-form-item label="名称：">
									<el-input v-model="formInline.author" placeholder="名称"></el-input>
								</el-form-item>
								<el-form-item label="路径：">
									<el-input v-model="formInline.path" placeholder="路径"></el-input>
								</el-form-item>
								<el-form-item>
									<el-button type="primary" @click="searchPower" icon="el-icon-search">搜索</el-button>
								</el-form-item>
							</el-form>
							<div class="add-btn">
								<el-button type="primary" icon="el-icon-circle-plus" class="marr20" size="small" @click="add('3')">添加</el-button>
							</div>
							<el-table
								v-if="powerList"
								:data="powerList"
								border
								stripe
								max-height="530px"
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
									prop="name"
									label="名称"
									header-align="center"
									align="center"
									width="">
								</el-table-column>
								<el-table-column
									prop="url"
									label="路径"
									header-align="center"
									align="center"
									width="">
								</el-table-column>
								<el-table-column
									prop="remarks"
									label="备注"
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
										<el-button type="primary" size="small" @click.stop="edit('6',scope.row)">编辑</el-button>
										<el-button type="danger" icon="" size="small" @click.stop="del('power',scope.row)">删除</el-button>
									</template>
								</el-table-column>
							</el-table>
							<div class="page page-fixed">
								<el-pagination @size-change="handleSizeChange($event,'power')" @current-change="handleCurrentChange($event,'power')"
									:current-page="elementPageData.pageNum"
									:page-sizes="elementPageData.defaultData.pageSizes"
									:page-size="elementPageData.defaultData.pageSizeDefault"
									background
									small
									layout="total, sizes, prev, pager, next, jumper"
									:total="powerListTotal">
								</el-pagination>
							</div>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>
		</div>
		<!-- 
			添加和编辑弹框
		 -->
		<el-dialog :title="dialogTitleIndex?dialogTitleArr[dialogTitleIndex]:''" :visible.sync="dialogAddFormVisible" width="660px" center>
			<div v-if="dialogTitleIndex=='7'" v-loading="loading_role">
				<el-table
					v-if="roleUserList"
					:data="roleUserList"
					stripe
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
						label="角色编码"
						header-align="center"
						align="center"
						width="">
					</el-table-column>
					<el-table-column
						prop="role"
						label="角色名称"
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
							<el-button type="success" icon="" size="small" @click.stop="addRoleUser(scope.row)" v-if="scope.row.status==20">添加角色</el-button>
							<el-button type="danger" icon="" size="small" @click.stop="delRoleUser(scope.row)" v-if="scope.row.status==1">解除角色</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<el-form :model="addform" ref="addform" :rules="addrules" label-width="80px" class="demo-ruleForm" v-loading="loading_">
				<!-- 用户列表和角色用户 -->
				<div v-if="dialogTitleIndex=='0'||dialogTitleIndex=='1'||dialogTitleIndex=='4'">
					<el-form-item label="账号" prop="account">
						<el-input v-model="addform.account"></el-input>
					</el-form-item>
					<el-form-item label="姓名" prop="name">
						<el-input v-model="addform.name"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password">
						<el-input v-model="addform.password"></el-input>
					</el-form-item>
					<el-form-item label="电话" prop="phone">
						<el-input v-model.number="addform.phone"></el-input>
					</el-form-item>
					<el-form-item label="手机" prop="telephone">
						<el-input v-model="addform.telephone"></el-input>
					</el-form-item>
					<el-form-item label="邮箱" prop="email">
						<el-input v-model="addform.email"></el-input>
					</el-form-item>
				</div>
				<!-- 角色管理 -->
				<div v-if="dialogTitleIndex=='2'||dialogTitleIndex=='5'">
					<el-form-item label="角色编码" prop="role_code">
						<el-input v-model="addform.role_code"></el-input>
					</el-form-item>
					<el-form-item label="角色名称" prop="role_name">
						<el-input v-model="addform.role_name"></el-input>
					</el-form-item>
					<el-form-item label="角色备注" prop="role_remarks">
						<el-input type="textarea" v-model="addform.role_remarks"></el-input>
					</el-form-item>
				</div>
				<!-- 权限管理 -->
				<div v-if="dialogTitleIndex=='3'||dialogTitleIndex=='6'">
					<el-form-item label="权限名称" prop="jurisdiction_name">
						<el-input v-model="addform.jurisdiction_name"></el-input>
					</el-form-item>
					<el-form-item label="权限路径" prop="jurisdiction_path">
						<el-input v-model="addform.jurisdiction_path"></el-input>
					</el-form-item>
					<el-form-item label="权限类型" prop="jurisdiction_type">
						<el-select v-model="addform.jurisdiction_type" clearable placeholder="请选择权限类型">
							<el-option label="菜单" value="菜单"></el-option>
							<el-option label="操作" value="操作"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="权限备注" prop="jurisdiction_remarks">
						<el-input type="textarea" v-model="addform.jurisdiction_remarks"></el-input>
					</el-form-item>
				</div>
				<!-- 添加新页面 -->
				<div v-if="dialogTitleIndex=='8'||dialogTitleIndex=='9'">
					<el-form-item label="名称" prop="page_name">
						<el-input v-model="addform.page_name"></el-input>
					</el-form-item>
					<el-form-item label="编码" prop="page_code">
						<el-input v-model="addform.page_code" placeholder="建议编码值输入英文字母"></el-input>
					</el-form-item>
				</div>
			</el-form>
			<div slot="footer" class="dialog-footer"  v-if="dialogTitleIndex!='7'">
				<el-button type="primary" @click="editForm('addform')" v-if="dialogTitleIndex=='4'||dialogTitleIndex=='5'||dialogTitleIndex=='6'||dialogTitleIndex=='9'">保 存</el-button>
				<el-button type="primary" @click="submitForm('addform')" v-if="dialogTitleIndex=='0'||dialogTitleIndex=='1'||dialogTitleIndex=='2'||dialogTitleIndex=='3'||dialogTitleIndex=='8'">添 加</el-button>
				<el-button @click="resetForm('addform')">重 置</el-button>
				<el-button @click="dialogAddFormVisible = false">取 消</el-button>
			</div>
		</el-dialog>
		<!-- 
			授权弹框
		 -->
		<el-dialog
			title="授权"
			:visible.sync="authorizeDialogVisible"
			width="650px"
			center
			custom-class="authorize-dialog">
			<el-tabs v-model="dialogActiveName" @tab-click="dialogHandleClick" v-loading="loading_">
				<el-tab-pane label="功能权限" name="first">
					<span class="text-css">*给该角色授予一定的功能权限：</span>
					<el-tree
						:data="authorizeData"
						default-expand-all
						node-key="id"
						ref="tree"
						style="height: 500px;overflow: auto;"
						highlight-current
						:props="authorizeDefaultProps">
						<!-- <span class="custom-tree-node my_custom-tree-node" slot-scope="{ node, data }" @mouseover=" tempAtId = data.id " @mouseout="tempAtId = null"> -->
						<span class="custom-tree-node my_custom-tree-node" slot-scope="{ node, data }">
							<span class="fl">{{ node.label }}</span>
							<!-- <span v-if="tempAtId == data.id" class="tree-right-operate"> -->
							<span class="tree-right-operate fr">
								<el-button
									type="primary"
									size="mini"
									v-if="powerArr.indexOf(data.id)===-1"
									@click="isPower('1',data)">
									授权
								</el-button>
								<el-button
									type="danger"
									size="mini"
									v-if="powerArr.indexOf(data.id)!=-1"
									@click="isPower('0',data)">
									解除权限
								</el-button>
							</span>
							<span class="fr">{{ data.url }}</span>
						</span>
					</el-tree>
				</el-tab-pane>
				<el-tab-pane label="页面权限" name="second">
					<span class="text-css">*给该角色授予一定的页面权限：</span>
					<el-button size="small" class="save-btn" type="primary" @click="saveResource">保 存 资 源</el-button>
					<el-tree
						:data="authorizeData_"
						node-key="id"
						show-checkbox
						class="page-tree"
						highlight-current
						:default-checked-keys="defaultKeys"
						:default-expanded-keys="defaultKeys"
						ref="tree_"
						style="height: 500px;overflow: auto;"
						highlight-current
						:props="authorizeDefaultProps_">
						<span slot-scope="{ node, data }">
							<span>{{ common.convertPageName(node.label) }}</span>
						</span>
					</el-tree>
				</el-tab-pane>
			</el-tabs>
		</el-dialog>
	
		<!-- 添加子页面 -->
		<el-dialog
			title="添加子页面"
			:visible.sync="addPageDialogVisible"
			width="650px">
			<el-form :model="addPageForm" ref="addPageForm" label-width="150px" class="demo-dynamic" size="middle">
				<el-form-item
					prop="name"
					label="名称："
					:rules="[{ required: true, message: '请输入页面名称', trigger: 'blur' },{ min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' },]">
					<el-input v-model="addPageForm.name"></el-input>
				</el-form-item>
				<el-form-item
					prop="code"
					label="编码："
					:rules="[{ required: true, message: '请输入页面编码', trigger: 'blur' },]">
					<el-input v-model="addPageForm.code" placeholder="建议编码值输入英文字母"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addPageDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitPageForm('addPageForm')">添 加</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<style>
	.authorize-dialog .el-dialog__body{
		margin-top: -20px !important;
	}
	.authorize-dialog .el-tabs__active-bar{
		background-color: #e4e7ed;
	}
	.page-tree .el-tree-node__content>.el-checkbox{
		margin-top: 0px;
	}
</style>

<style src="../../assets/style/user.less" scoped lang="less"></style>

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
			if(tab.name=='user_manager_user'){//用户列表
				/* 
					GET  查询--根据条件查询用户列表
				*/
				this.formInline.username=null;
				this.formInline.account=null;
				this.elementPageData.pageNum = 1;
				this.getUserList();
			}else if(tab.name=='user_manager_role_user'){//角色用户
				/* 
					GET  查询--根据条件查询用户列表
				*/
				this.formInline.role=null;
				this.rose_id=null;
				this.elementPageData.pageNum = 1;
				this.getUserList();
			}else if(tab.name=='user_manager_role'){//角色管理
				/* 
					GET  查询--根据条件查询角色列表
				*/
				this.formInline.name=null;
				this.formInline.code=null;
				this.elementPageData.pageNum = 1;
				this.getRoleList();
			}else if(tab.name=='user_manager_page'){//页面管理
				/* 
					GET  查询--根据条件查询页面资源
				*/
				this.elementPageData.pageNum = 1;
				this.getPageResourse();
			}else if(tab.name=='user_manager_power'){//权限管理
				/* 
					GET  查询--根根据条件查询权限列表
				*/
				this.formInline.author=null;
				this.formInline.path=null;
				this.elementPageData.pageNum = 1;
				this.getPowerList();
			}
		},
		
		//-------------------------------------------------------------------------------------用户列表
		/* 
			通过姓名或账号搜索用户
		 */
		searchUser(){
			this.elementPageData.pageNum = 1;
			//处理姓名或账号为空时，设为null
			if(this.formInline.username==''){
				this.formInline.username=null;
			}
			if(this.formInline.account==''){
				this.formInline.account=null;
			}
			this.getUserList();
		},
		/* 
			GET  查询--根据条件查询用户列表
		*/
		getUserList(){
			this.loading = true;
			this.axios.get(`${this.common.basePath}/user_manage/searchUser`,this._userParams()).then( (response) => {
				if(response.data.meta.code === 0){
					this.userList = response.data.data.list;//用户列表
					this.userListTotal = response.data.data.total;//用户列表总数
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
				this.loading = false;
			}).catch( (error) => {
				this.$message.error(error);
				this.loading = false;
			});
		},
		_userParams(){
			return {
				params: {
					pageSize: this.elementPageData.pageSize,
					currentPage:  this.elementPageData.pageNum,
					name:this.formInline.username,
					account:this.formInline.account,
					rose_id:this.rose_id,
				}
			}
		},
		
		//-------------------------------------------------------------------------------------角色用户
		/* 
		 根据角色筛选用户
		 */
		selectRole(val){
			this.elementPageData.pageNum = 1;
			this.rose_id = String(val);
			//处理角色id为空时，设为null
			if(val==''){
				this.rose_id=null;
			}
			this.getUserList();
		},
		
		
		//-------------------------------------------------------------------------------------角色管理
		/* 
			通过名称或编码搜索角色
		*/
		searchRole(){
			this.elementPageData.pageNum = 1;
			//处理名称或编码为空时，设为null
			if(this.formInline.name==''){
				this.formInline.name=null;
			}
			if(this.formInline.code==''){
				this.formInline.code=null;
			}
			this.getRoleList();
		},
		/* 
			GET  查询--根据条件查询角色列表
		*/
		getRoleList(){
			this.loading = true;
			this.axios.get(`${this.common.basePath}/user_manage/searchRoles`,this._roleParams()).then( (response) => {
				if(response.data.meta.code === 0){
					this.roleList = response.data.data.list;//角色列表
					this.roleListTotal = response.data.data.total;//角色列表总数
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
				this.loading = false;
			}).catch( (error) => {
				this.$message.error(error);
				this.loading = false;
			});
		},
		_roleParams(){
			return {
				params: {
					pageSize: this.elementPageData.pageSize,
					currentPage:  this.elementPageData.pageNum,
					name:this.formInline.name,
					code:this.formInline.code,
				}
			}
		},
		
		//-------------------------------------------------------------------------------------页面管理
		/* 
			GET  查询--根据条件查询页面资源
		*/
		getPageResourse(){
			this.loading = true;
			this.axios.get(`${this.common.basePath}/system_manage/userPage_List`,{params:{}}).then( (response) => {
				if(response.data.meta.code === 0){
					this.pageResourse = response.data.data;//页面资源
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
				this.loading = false;
			}).catch( (error) => {
				this.$message.error(error);
				this.loading = false;
			});
		},
		
		//-------------------------------------------------------------------------------------权限管理
		/* 
			通过名称或路径搜索权限
		*/
		searchPower(){
			this.elementPageData.pageNum = 1;
			//处理名称或路径为空时，设为null
			if(this.formInline.author==''){
				this.formInline.author=null;
			}
			if(this.formInline.path==''){
				this.formInline.path=null;
			}
			this.getPowerList();
		},
		/* 
			GET  查询--根据条件查询权限列表
		*/
		getPowerList(){
			this.loading = true;
			this.axios.get(`${this.common.basePath}/user_manage/searchPower`,this._powerParams()).then( (response) => {
				if(response.data.meta.code === 0){
					this.powerList = response.data.data.list;//权限列表
					this.powerListTotal = response.data.data.total;//权限列表总数
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
				this.loading = false;
			}).catch( (error) => {
				this.$message.error(error);
				this.loading = false;
			});
		},
		_powerParams(){
			return {
				params: {
					pageSize: this.elementPageData.pageSize,
					currentPage:  this.elementPageData.pageNum,
					name:this.formInline.author,
					url:this.formInline.path,
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
			if(type=="user"){
				this.getUserList();
			}else if(type=="role_user"){
				this.getUserList();
			}else if(type=="role"){
				this.getRoleList();
			}else if(type=="power"){
				this.getPowerList();
			}
		},
		/*
		* 改变每页条数触发此事件
		* @param {number} val 当前数据
		*/
		handleSizeChange(val,type){
			this.elementPageData.pageSize = val;
			if(type=="user"){
				this.getUserList();
			}else if(type=="role_user"){
				this.getUserList();
			}else if(type=="role"){
				this.getRoleList();
			}else if(type=="power"){
				this.getPowerList();
			}
		},
		
		//-------------------------------------------------------------------------------------添加用户、角色、权限、新页面、子页面
		/* 
			添加
		 */
		add(index){
			//清空信息
			this.editId = null;
			
			this.dialogTitleIndex = index;
			this.dialogAddFormVisible = true;
			
			//清空表单信息
			if(this.$refs['addform']){
				this.$refs['addform'].resetFields();
			} 
		},
		/* 
		 确认添加
		 */
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if(this.dialogTitleIndex=="0"||this.dialogTitleIndex=="1"){//添加用户
						let addUserForm = {
							creattime:new Date().getTime(),
							account: this.addform.account,
							email: this.addform.email,
							name: this.addform.name,
							password: this.addform.password,
							phone: this.addform.phone,
							telephone: parseInt(this.addform.telephone),
						};
						this.axios.post(`${this.common.basePath}/user_manage`,addUserForm).then( (response) => {
							if(response.data.meta.code === 0){
								this.$message.success("添加成功！！", 20);
								this.dialogAddFormVisible = false
								this.getUserList();
							}else{
								this.$message.error(response.data.meta.message, 20);   
							}
						}).catch( (error) => {
							this.$message.error(error);
						});
					}else if(this.dialogTitleIndex=="2"){//添加角色
						let addRoleForm = {
							creator:sessionStorage.getItem('assignee'),
							creattime:new Date().getTime(),
							role:this.addform.role_name,
							code:this.addform.role_code,
							remarks:this.addform.role_remarks,
						};
						this.axios.post(`${this.common.basePath}/user_manage/addRoles`,addRoleForm).then( (response) => {
							if(response.data.meta.code === 0){
								this.$message.success("添加成功！！", 20);
								this.dialogAddFormVisible = false
								this.getRoleList();
							}else{
								this.$message.error(response.data.meta.message, 20);   
							}
						}).catch( (error) => {
							this.$message.error(error);
						});
					}else if(this.dialogTitleIndex=="3"){//添加权限
						let addPowerForm = {
							type:this.addform.jurisdiction_type,
							name:this.addform.jurisdiction_name,
							url:this.addform.jurisdiction_path,
							remarks:this.addform.jurisdiction_remarks,
						};
						this.axios.post(`${this.common.basePath}/user_manage/addPower`,addPowerForm).then( (response) => {
							if(response.data.meta.code === 0){
								this.$message.success("添加成功！！", 20);
								this.dialogAddFormVisible = false
								this.getPowerList();
							}else{
								this.$message.error(response.data.meta.message, 20);   
							}
						}).catch( (error) => {
							this.$message.error(error);
						});
					}else if(this.dialogTitleIndex=="8"){//添加新页面
						let addPageForm = {
							name:this.addform.page_name,
							code:this.addform.page_code,
						};
						this.axios.post(`${this.common.basePath}/system_manage/addPage`,addPageForm).then( (response) => {
							if(response.data.meta.code === 0){
								this.$message.success("添加成功！！", 20);
								this.dialogAddFormVisible = false
								this.getPageResourse();
							}else{
								this.$message.error(response.data.meta.message, 20);   
							}
						}).catch( (error) => {
							this.$message.error(error);
						});
					}
				} else {
					this.$message.error('添加的信息未填写完整！！！', 20); 
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
			添加子页面
		*/
		addPage(id){
			
			this.addPageForm.parent_id = id;
			this.addPageDialogVisible = true;
			
			if(this.$refs['addPageForm']){//清空表单信息
				this.$refs['addPageForm'].resetFields();
			}
		},
		/* 
			确认添加子页面
		 */
		submitPageForm(formName){
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.axios.post(`${this.common.basePath}/system_manage/addPage`,this.addPageForm).then( (response) => {
						if(response.data.meta.code === 0){
							this.$message.success("添加成功！！", 20);
							this.addPageDialogVisible = false
							this.getPageResourse();
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
					}).catch( (error) => {
						this.$message.error(error);
					});
				} else {this.$message.error('添加的信息未填写完整！！！', 20);return false;}
			});
		},
		
		//-------------------------------------------------------------------------------------编辑用户、角色、权限、页面
		/* 
			编辑用户、角色、权限、页面
		 */
		edit(index,colData){
			//清空信息
			this.editId = null;
			//dialogTitleIndex
			this.dialogTitleIndex = index;
			//回显信息
			if(index=="4"){//回显用户信息
				this.loading_ = true;
				this.axios.get(`${this.common.basePath}/user_manage/${colData.id}`,{params: {}}).then( (response) => {
					if(response.data.meta.code === 0){
						this.addform.name = response.data.data.name;
						this.addform.account = response.data.data.account;
						this.addform.password = response.data.data.password;
						this.addform.phone = Number(response.data.data.phone);
						this.addform.telephone = response.data.data.telephone;
						this.addform.email = response.data.data.email;
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
					this.loading_ = false;
				}).catch( (error) => {
					this.$message.error(error);
					this.loading_ = false;
				});
			}else if(index=="5"){//回显角色信息
				this.loading_ = true;
				this.axios.get(`${this.common.basePath}/user_manage/searchRolesIfo`,{params: {id:colData.id}}).then( (response) => {
					if(response.data.meta.code === 0){
						this.addform.role_code = response.data.data.code;
						this.addform.role_name = response.data.data.role;
						this.addform.role_remarks = response.data.data.remarks;
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
					this.loading_ = false;
				}).catch( (error) => {
					this.$message.error(error);
					this.loading_ = false;
				});
			}else if(index=="6"){//回显权限信息
				this.loading_ = true;
				this.axios.get(`${this.common.basePath}/user_manage/searchPowerIfo`,{params: {id:colData.id}}).then( (response) => {
					if(response.data.meta.code === 0){
						this.addform.jurisdiction_path = response.data.data.url;
						this.addform.jurisdiction_name = response.data.data.name;
						this.addform.jurisdiction_remarks = response.data.data.remarks;
						this.addform.jurisdiction_type = response.data.data.type;
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
					this.loading_ = false;
				}).catch( (error) => {
					this.$message.error(error);
					this.loading_ = false;
				});
			}else if(index=="9"){//回显页面信息
				this.loading_ = true;
				this.axios.get(`${this.common.basePath}/system_manage/selectPage`,{params: {id:colData.id}}).then( (response) => {
					if(response.data.meta.code === 0){
						this.addform.page_name = colData.name;
						this.addform.page_code = colData.code;
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
					this.loading_ = false;
				}).catch( (error) => {
					this.$message.error(error);
					this.loading_ = false;
				});
			}
			this.editId = colData.id;
			//dialogAddFormVisible
			this.dialogAddFormVisible = true;

			//清空表单信息
			if(this.$refs['addform']){
				this.$refs['addform'].resetFields();
			} 
		},
		/* 
			确认编辑用户、角色、权限、页面
		*/
		editForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if(this.dialogTitleIndex=="4"){//编辑用户
						let editUserForm = {
							email: this.addform.email,
							name: this.addform.name,
							password: this.addform.password,
							phone: this.addform.phone,
							telephone: this.addform.telephone,
							account: this.addform.account,
						}
						this.axios.patch(`${this.common.basePath}/user_manage/${this.editId}`,editUserForm).then( (response) => {
							if(response.data.meta.code === 0){
								this.$message.success("编辑成功！！", 20);
								this.dialogAddFormVisible = false;
								this.getUserList();
							}else{
								this.$message.error(response.data.meta.message, 20);   
							}
						}).catch( (error) => {
							this.$message.error(error);
						});
					}else if(this.dialogTitleIndex=="5"){//编辑角色
						let editUserForm = {
							id:this.editId,
							code: this.addform.role_code,
							role: this.addform.role_name,
							remarks: this.addform.role_remarks,
						}
						this.axios.patch(`${this.common.basePath}/user_manage/updateRoles`,editUserForm).then( (response) => {
							if(response.data.meta.code === 0){
								this.$message.success("编辑成功！！", 20);
								this.dialogAddFormVisible = false
								this.getRoleList();
							}else{
								this.$message.error(response.data.meta.message, 20);   
							}
						}).catch( (error) => {
							this.$message.error(error);
						});
					}else if(this.dialogTitleIndex=="6"){//编辑权限
						let editUserForm = {
							id:this.editId,
							type:this.addform.jurisdiction_type,
							name:this.addform.jurisdiction_name,
							url:this.addform.jurisdiction_path,
							remarks:this.addform.jurisdiction_remarks,
						}
						this.axios.patch(`${this.common.basePath}/user_manage/updatePower`,editUserForm).then( (response) => {
							if(response.data.meta.code === 0){
								this.$message.success("编辑成功！！", 20);
								this.dialogAddFormVisible = false
								this.getPowerList();
							}else{
								this.$message.error(response.data.meta.message, 20);   
							}
						}).catch( (error) => {
							this.$message.error(error);
						});
					}else if(this.dialogTitleIndex=="9"){//编辑页面
						let editPageForm = {
							id:this.editId,
							name:this.addform.page_name,
							code:this.addform.page_code,
						}
						this.axios.patch(`${this.common.basePath}/system_manage/upPage`,editPageForm).then( (response) => {
							if(response.data.meta.code === 0){
								this.$message.success("编辑成功！！", 20);
								this.dialogAddFormVisible = false
								this.getPageResourse();
							}else{
								this.$message.error(response.data.meta.message, 20);   
							}
						}).catch( (error) => {
							this.$message.error(error);
						});
					}
				} else {
					this.$message.error('编辑的信息未填写完整！！！', 20); 
					return false;
				}
			});
		},
		
		//-------------------------------------------------------------------------------------添加角色用户/解除角色用户
		/* 
			添加角色用户/解除角色用户
		 */
		editRoleUser(index,colData){
			this.roleUserListId = null;
			
			this.dialogTitleIndex = index;
			this.dialogAddFormVisible = true;
			this.roleUserListId = colData.id;
			this.loading_role = true;
			this.axios.get(`${this.common.basePath}/user_manage/upUserRoles`,{params: {hr_id:colData.id}}).then( (response) => {
				if(response.data.meta.code === 0){
					this.roleUserList = response.data.data?response.data.data:[];
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
				this.loading_role = false;
			}).catch( (error) => {
				this.$message.error(error);
				this.loading_role = false;
			});
		},
		/* 添加角色用户 */
		addRoleUser(colData){
			this.axios.get(`${this.common.basePath}/user_manage/upUserRoles`,{params: {hr_id:this.roleUserListId,role_id:colData.id,type:1}}).then( (response) => {
				if(response.data.meta.code === 0){
					this.$message.success("添加该角色成功！！", 20);
					this.roleUserList = response.data.data;
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
			}).catch( (error) => {
				this.$message.error(error);
			});
		},
		/* 解除角色用户 */
		delRoleUser(colData){
			this.axios.get(`${this.common.basePath}/user_manage/upUserRoles`,{params: {hr_id:this.roleUserListId,role_id:colData.id,type:20}}).then( (response) => {
				if(response.data.meta.code === 0){
					this.$message.success("解除该角色成功！！", 20);
					this.roleUserList = response.data.data;
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
			}).catch( (error) => {
				this.$message.error(error);
			});
		},

		//-------------------------------------------------------------------------------------删除用户、角色、权限、页面
		/* 
		 删除用户/角色/权限/页面
		 */
		del(type,colData){
			this.$confirm('是否确定删除？？？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				if(type=='user'){//删除用户
					this.axios.delete(`${this.common.basePath}/user_manage/${colData.id}`,{}).then( (response) => {
						if(response.data.meta.code === 0){
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
							this.getUserList();
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
					}).catch( (error) => {
						this.$message.error(error);
					});
				}else if(type=='role'){//删除角色
					this.axios.delete(`${this.common.basePath}/user_manage/deleteRoles/${colData.id}`,{}).then( (response) => {
						if(response.data.meta.code === 0){
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
							this.getRoleList();
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
					}).catch( (error) => {
						this.$message.error(error);
					});
				}else if(type=='power'){//删除权限
					this.axios.delete(`${this.common.basePath}/user_manage/deletePower/${colData.id}`,{}).then( (response) => {
						if(response.data.meta.code === 0){
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
							this.getPowerList();
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
					}).catch( (error) => {
						this.$message.error(error);
					});
				}else if(type=='page'){//删除页面
					console.log(colData)
					this.axios.patch(`${this.common.basePath}/system_manage/deletePage`,colData).then( (response) => {
						if(response.data.meta.code === 0){
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
							this.getPageResourse();
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
					}).catch( (error) => {
						this.$message.error(error);
					});
				}
			}).catch(() => {});
		},
		
		//-------------------------------------------------------------------------------------功能授权、页面授权
		/* 
			授权弹框的tab切换 
		*/
		dialogHandleClick(tab, event) {
			if(tab.name=="first"){//功能授权
				this.loading_ = true;
				this.axios.get(`${this.common.basePath}/user_manage/searchPower`,{params:{}}).then( (response) => {
					if(response.data.meta.code === 0){
						this.authorizeData = response.data.data.list;//功能授权权限列表
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
					this.loading_ = false;
				}).catch( (error) => {
					this.$message.error(error);
					this.loading_ = false;
				});
			}else if(tab.name=="second"){//页面授权
				this._pagePower();
			}
		},
		_pagePower(){
			this.loading_ = true;
			this.axios.get(`${this.common.basePath}/system_manage/select_tree`,{params:{roleId:this.roleId}}).then( (response) => {
				if(response.data.meta.code === 0){
					this.authorizeData_ = response.data.data;//页面授权权限列表
					
					let keysArr = [];
					let arr = [];//二级页面组成的数组
					for(var i = 0;i<response.data.data.length;i++){//循环获取一级页面被选中的节点
						
						if(response.data.data[i].isSelect==true){
							keysArr.push(response.data.data[i].id)//一级页面被选中的节点
						}
						
						if(response.data.data[i].childrens.length!=0){
							arr.push(response.data.data[i].childrens)
						}
					}
					
					if(arr.length!=0){
						for(var j = 0;j<arr.length;j++){//循环获取二级页面被选中的节点
							for(var k = 0;k<arr[j].length;k++){
								if(arr[j][k].isSelect==true){
									keysArr.push(arr[j][k].id)//二级页面被选中的节点
								}
							}
						}
					}
					
					//keysArr数组去重
					var r = keysArr.filter(function(element,index,self){
						return self.indexOf(element) === index;
					});
					this.defaultKeys = r;
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
				this.loading_ = false;
			}).catch( (error) => {
				this.$message.error(error);
				this.loading_ = false;
			});
		},
		/* 
		 给角色进行页面授权
		 */
		saveResource(){
			let form = {
				id:this.$refs.tree_.getCheckedKeys(),
				role_id:this.roleId,
			}
			this.axios.post(`${this.common.basePath}/system_manage/upRolePage/${this.roleId}`,form).then( (response) => {
				if(response.data.meta.code === 0){
					this.$message.success("页面授权成功...前往设置功能权限后,重登或刷新后生效!");
					this._pagePower();
				}else{
					this.$message.error(response.data.meta.message, 20);
				}
			}).catch( (error) => {
				this.$message.error(error);
			});
		},
		/* 
		 给角色进行功能授权
		 */
		authorize(data){
			this.dialogActiveName = "first";
			this.roleId = data.id;//获取该角色id
			this.authorizeDialogVisible = true;
			
			//筛选出该角色已有的权限id
			let powerArr = [];
			for(var i = 0;i<data.power.length;i++){
				powerArr.push(data.power[i].authority_id)
			}
			var powerArr_ = powerArr.filter(function(element,index,self){//去重
				return self.indexOf(element) === index;
			});
			this.powerArr = powerArr_;
			this.loading_ = true;
			this.axios.get(`${this.common.basePath}/user_manage/searchPower`,{params:{}}).then( (response) => {
				if(response.data.meta.code === 0){
					this.authorizeData = response.data.data.list;//功能授权权限列表
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
				this.loading_ = false;
			}).catch( (error) => {
				this.$message.error(error);
				this.loading_ = false;
			});
		},
		/* 
		 是否授予功能权限
		 */
		isPower(type,data){
			this.axios.get(`${this.common.basePath}/user_manage/addRolesPower`,{params:{role_id:this.roleId,type:type,authority_id:data.id}}).then( (response) => {
				if(response.data.meta.code === 0){
					// 刷新
					if(type=='1'){
						this.powerArr.push(data.id);
						var powerArr_ = this.powerArr.filter(function(element,index,self){//去重
							return self.indexOf(element) === index;
						});
						this.powerArr = powerArr_;
						this.$message.success("功能权限授予成功！！");
						this.getRoleList();
					}else if(type=='0'){
						let index = "";
						for(var i = 0;i<this.powerArr.length;i++){//循环得到要删除元素的下标
							if(this.powerArr[i]==data.id){
								index=i
							}
						}
						this.powerArr.splice(index,1);
						this.$message.success("功能权限解除成功！！");
						this.getRoleList();
					}
					
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
			}).catch( (error) => {
				this.$message.error(error);
			});
		},
		
	},
	mounted(){ 
		/* 
		处理tabTwoPages
		*/
		let userPages = [];
		for(var i = 0;i<this.tabTwoPages.length;i++){
			if(this.tabTwoPages[i].split("_")[0]=="user"){
				userPages.push(this.tabTwoPages[i])
			}
		}
		this.userPages = userPages;
		this.activeName = userPages[0];
		
		/* 
			GET  查询--根据条件查询用户列表
		*/
		this.getUserList();
		
		/* 
			GET  查询--根据条件查询角色列表
		*/
		this.getRoleList();
	},
	data(){
		return {
			loading:false,//用户表格的加载
			loading_:false,//编辑时回显信息的加载
			loading_role:false,//编辑用户角色时回显信息的加载

			userPages:[],//用户的二级页面数组
			dialogActiveName:'first',
			activeName:null,
			elementPageData: {               
				//分页需要的数据
				defaultData:  this.common.elementPagination,
				pageNum:      this.common.elementPagination.pageNumDefault,
				pageSize:     this.common.elementPagination.pageSizeDefault,
			},
			formInline: {
				name: null,
				account : null,
				role:null,
				username:null,
				code:null,
				author:null,
				path:null,
			},
			rose_id:null,//角色id
			userList: null,//用户列表
			userListTotal:null,//用户列表总数
			roleList:null,//角色列表
			roleListTotal:null,//角色列表总数
			roleUserList:[],//角色用户列表-所有
			roleUserListId:null,//某角色用户列表id
			powerList:null,//权限列表
			powerListTotal:null,//权限列表总数
			
			dialogAddFormVisible:false,//添加和编辑弹框
			dialogTitleIndex:null,
			dialogTitleArr:['添加用户','添加用户','添加角色','添加权限','编辑用户','编辑角色','编辑权限','用户编辑角色',"添加新页面","编辑页面"],
			editId:null,//编辑id
			addform:{//添加与编辑表单
				account:null,
				name:null,
				password:null,
				phone:null,
				telephone:null,
				email:null,
				role_code:null,
				role_name:null,
				role_remarks:null,
				jurisdiction_name:null,
				jurisdiction_path:null,
				jurisdiction_type:null,
				jurisdiction_remarks:null,
				page_name:null,
				page_code:null,
			},
			addrules:{
				account: [
					{ required: true, message: '请输入账户', trigger: 'blur' },
					{	pattern: /^[a-zA-Z0-9_-]{1,16}$/, message: '账号不符合要求' },
				],
				name: [
					{ required: true, message: '请输入姓名', trigger: 'blur' },
					{	pattern:  /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/, message: '姓名不规范' },
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{	pattern: /^[\a-zA-Z0-9_-]{3,16}$/, message: '密码不符合要求' },
				],
				phone: [
					{ required: true, message: '请输入电话号码', trigger: 'blur' },
					{ type: 'number', message: '电话号码必须为数字值'},
				],
				telephone: [
					{ required: true, message: '请输入手机号码', trigger: 'blur' },
					{ min: 11, max: 11, message: '手机号码为11个字符', trigger: 'blur' },
					{	pattern: /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/, message: '手机号码不符合规范' }
				],
				role_code: [
					{ required: true, message: '请输入角色编码', trigger: 'blur' },
					{ min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' },
				],
				role_name: [
					{ required: true, message: '请输入角色名称', trigger: 'blur' },
					{ min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' },
				],
				jurisdiction_path: [
					{ required: true, message: '请输入权限路径', trigger: 'blur' },
				],
				jurisdiction_type: [
					{ required: true, message: '请选择权限类型', trigger: 'change' }
				],
				jurisdiction_name: [
					{ required: true, message: '请输入权限名称', trigger: 'blur' },
					{ min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' },
				],
				page_name: [
					{ required: true, message: '请输入页面名称', trigger: 'blur' },
					{ min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' },
				],
				page_code: [
					{ required: true, message: '请输入页面编码', trigger: 'blur' },
				],
			},
			addPageDialogVisible:false,//添加子页面弹框
			addPageForm:{//添加子页面表单
				name:null,
				code:null,
				parent_id:null,
			},
			
			authorizeDialogVisible:false,//角色授权
			authorizeData: null,//功能授权权限列表
			authorizeDefaultProps: {
				children: 'children',
				label: 'name'
			},
			authorizeData_: null,//页面授权权限列表
			authorizeDefaultProps_: {
				children: 'childrens',
				label: 'code'
			},
			defaultKeys:[],//初始被选中的节点
			tempAtId:null,//当前浮动选中的节点Id
			powerArr:[],//某角色已有权限id数组
			roleId:null,//角色id
			
			pageResourse:null,//页面资源
			defaultPageProps: {
				children: 'children',
				label: 'name'
			},
		}
	},
};
</script> 