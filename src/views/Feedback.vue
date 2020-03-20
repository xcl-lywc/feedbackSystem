
<!-- 
	新建反馈
 -->
<template>
	<div>
		<h3 class="build-title">新建反馈</h3>
		<div class="build-form">
			<el-row :gutter="20">
				<el-col :span="14">
					<div class="form-box">
						<el-form :model="buildForm" ref="buildForm" label-width="120px" class="demo-dynamic" size="middle">
							<el-form-item
								prop="name"
								label="标题："
								:rules="[{ required: true, message: '请输入标题', trigger: 'blur' },]">
								<el-input v-model="buildForm.name"></el-input>
							</el-form-item>
							<el-form-item
								prop="picture"
								label="截图："
								:rules="[{ required: true, message: '请输入截图', trigger: 'blur' },]">
								<el-upload
									class="avatar-uploader"
									:action="`${common.basePath}/project_manage/enclosure`"
									:show-file-list="false"
									:auto-upload="true"
									multiple
									:limit="9999"
									:before-upload="beforeAvatarUpload"
									:http-request="uploadFile">
									<img v-if="buildForm.picture" :src="'http://'+buildForm.picture" class="avatar">
									<i v-else class="el-icon-plus avatar-uploader-icon"></i>
								</el-upload>
							</el-form-item>
							<el-form-item
								prop="desc"
								label="问题描述："
								:rules="[{ required: true, message: '请输入问题描述的内容', trigger: 'blur' },]">
								<el-input type="textarea" v-model="buildForm.desc"></el-input>
							</el-form-item>
							<el-form-item
								prop="tel"
								label="你的手机："
								:rules="[{ required: true, message: '请输入你的手机号码', trigger: 'blur' },{ min: 11, max: 11, message: '手机号码为11个字符', trigger: 'blur' },{	pattern: /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/, message: '手机号码不符合规范' }]">
								<el-input v-model="buildForm.tel"></el-input>
							</el-form-item> 
						</el-form>
					</div>
				</el-col>
				<el-col :span="10">
					<div class="function-box">
						<el-form class="function-box-title"><el-form-item label="发生位置：" class="is-required"></el-form-item></el-form>
						<el-tree
							:data="projectFunctionList"
							show-checkbox
							default-expand-all
							node-key="id"
							ref="tree"
							highlight-current
							:props="defaultFunctionProps">
						</el-tree>
					</div>
				</el-col>
			</el-row>
			<div class="build-btns">
				<el-button @click="resetForm('buildForm')">重置</el-button>
				<el-button @click="$router.push({path: '/home'})">取 消</el-button>
				<el-button type="primary" @click="submitForm('buildForm')" class="marr20">提 交</el-button>
			</div>
		</div>
	</div>
</template>

<script>
  export default {
		data(){
			return{
				buildForm: {//新建框表单
					picture: null,
					desc: null,
					tel: null,
					name: null,
				},
				function:null,//发生位置的id数组
				
				projectFunctionList:null,//功能列表
				defaultFunctionProps: {
					children: 'childrenMenu',
					label: 'name'
				},
			};
		},
		mounted() {
			/* 
			GET  查询--根据项目id查询项目功能列表
			*/
			this.getProjectFunctionList();
		},
		methods:{
			
			/* 
				上传文件前，限制用户上传的文件格式
			 */
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isPNG = file.type === 'image/png';
	
				if (!isJPG&&!isPNG) {
					this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
				}
				return isJPG || isPNG;
			},
			
			/* 
				自定义文件上传
			*/
			uploadFile(param){
				var fileObj = param.file;
				// FormData 对象
				var form = new FormData();
				// 文件对象
				form.append("data", fileObj);
				this.axios.post(`${this.common.basePath}/project_manage/enclosure`,form,{ headers: { 'Content-Type': 'multipart/form-data' } }).then((response) => {
					this.buildForm.picture = response.data.data;
				}).catch((error) => {
					this.$message.error(error);
				});
			},
			
			/* 
			GET  查询--根据项目id查询项目功能列表
			*/
			getProjectFunctionList(){
				this.axios.get(`${this.common.basePath}/project_manage/project_tree`,this._functionListParams()).then( (response) => {
					if(response.data.meta.code === 0){
						if(JSON.stringify(response.data.data)=='[]'){
							this.projectFunctionList = null;//项目---功能列表
						}else{
							this.projectFunctionList = response.data.data;//项目---功能列表
						}
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
				}).catch( (error) => {
					this.$message.error(error);
				});
			},
			_functionListParams(){
				return {
					params: {
						proj_id:this.$route.params.id,
					}
				}
			},
			
			/* 
			 获取发生位置的id数组 
			 */
			getCheckedKeys() {
				this.function = this.$refs.tree.getCheckedKeys()
			},
			
			/* 
			 清空发生位置的选择项
			 */
			resetChecked() {
				this.$refs.tree.setCheckedKeys([]);
			},
			
			/* 
				提交
			 */
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.getCheckedKeys();//获取发生位置的id数组
						if(this.function.length!=0){
							this.buildFeedBack();
						}else{
							this.$message.error("新建反馈信息的发生位置未选择！！！");
						}
						
					} else {
						this.$message.error("新建反馈信息为填写完整！！！");
						return false;
					}
				});
			},
			resetForm(formName) {
				this.resetChecked();//清空发生位置的选择项
				this.$refs[formName].resetFields();//清空表单信息
			},
			
			/* 
			 新建反馈信息
			 */
			buildFeedBack(){
				let form = {
					title:this.buildForm.name,
					picture:this.buildForm.picture,
					detailed:this.buildForm.desc,
					phone:this.buildForm.tel,
					function:this.function.join(","),
					deploy_id:1,
				}
				this.axios.post(`${this.common.basePath}/project_manage/add_feed_backs`,form).then( (response) => {
					if(response.data.meta.code === 0){
						
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
				}).catch( (error) => {
					this.$message.error(error);
				});
			},
		},
  }
</script>

<style scoped lang="less">
	.build-title{
		margin: 20px;
    border-bottom: 1px solid #999;
    padding: 0 0 10px 20px;
    color: #333;
    font-size: 16px;
	}
	.build-form{
		border: 1px solid #ddd;
    padding: 20px;
    box-sizing: border-box;
    width: 98%;
    margin: 0 auto;
    border-radius: 5px;
		.form-box{
			.avatar-uploader .el-upload {
				border: 1px dashed #d9d9d9;
				border-radius: 6px;
				cursor: pointer;
				position: relative;
				overflow: hidden;
			}
			.avatar-uploader .el-upload:hover {
				border-color: #409EFF;
			}
			.avatar-uploader-icon{
				font-size: 28px;
				color: #8c939d;
				width: 150px;
				height: 150px;
				line-height: 150px;
				text-align: center;
				border: 1px dashed #d9d9d9;
				border-radius: 6px;
				cursor: pointer;
			}
			.avatar-uploader-icon:hover{
				border-color: #409EFF;
			}
			.avatar {
				width: 150px;
				height: 150px;
				display: block;
			}
		}
		.function-box{
			border-left: 1px solid #ddd;
			padding-left: 20px;
			box-sizing: border-box;
			.function-box-title{
				.el-form-item{
					margin-bottom: 0;
				}
			}
		}
	}
	.build-btns{
		margin: 10px auto 0;
    text-align: right;
    border-top: 1px solid #ddd;
    padding-top: 10px;
	}
</style>