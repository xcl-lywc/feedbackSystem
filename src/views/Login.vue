<template>
	<div class="login-container">
		<div class="background-wrap">
			<div class="login-background"></div>
		</div>
		<div class="login-box">
			<div class="box-title">
				项目维护系统
			</div>
			<div class="box-form">
				<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm" size="middle">
					<el-form-item prop="username">
					<el-input type="text" v-model="ruleForm.username" autocomplete="off"  palcehoder="请输入用户名">
						<i slot="prefix" class="el-input__icon fa fa-user"></i>
					</el-input>
					</el-form-item>
					<el-form-item prop="password">
					<el-input type="password" v-model.number="ruleForm.password" autocomplete="off" palcehoder="请输入密码">
						<i slot="prefix" class="el-input__icon fa fa-lock"></i>
					</el-input>
					</el-form-item>
					<el-form-item>
						<el-checkbox v-model="checked" @change="rememberClick"><span class="text-dark-blue">记住密码</span></el-checkbox>
					</el-form-item>
					<el-form-item>
						<el-button :loading="buttonLoading" @click="submitForm('ruleForm')" class="fill-width" type="primary">
							{{buttonLoading ? '登录中' : '登录'}}
						</el-button>
					</el-form-item>
					<el-form-item>
						<el-button :disabled="buttonLoading" @click="resetForm('ruleForm')" class="fill-width">重置</el-button>
					</el-form-item>
					
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	import qs    from "qs"; //需要传表单时, 引用此包
	export default {
		data() {
			return {
				checked: false,
				buttonLoading: false,
				ruleForm: {
          password: null,
          username: null,
        },
				rules: {
					username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            {	pattern: /^[a-zA-Z0-9_-]{1,16}$/, message: '账号不符合要求' },
          ],
					password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
						{	pattern: /^[\a-zA-Z0-9_-]{3,16}$/, message: '密码不符合要求' },
          ],
        }
			};
		},
		mounted() {
			var self = this;
			self._remember();
			//按下回车键登录
			/* document.onkeydown = function(event){ 
				if(event.keyCode === 13){
						self.login();
				}
			}; */
		},
		methods:{
			submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.login();
          } else {
            this.$message.error('账号或密码未填写!!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
			
			//登录
			login() {
				this.buttonLoading = true;
				this.axios.post(this.common.basePath + '/login/in',qs.stringify(this.ruleForm)).then( (response) => {
					if(response.data.meta.code === 0){
						//登录成功储存token 
						this.axios.defaults.headers.common['Authorization'] = response.headers.authorization;
						//session中存储获取用户信息
						sessionStorage.setItem('userData',JSON.stringify(response.data.data));
						//session中存储用于图片和文件上传
						sessionStorage.setItem('token',JSON.stringify(response.headers.authorization.split(' ')[1]));
						//session存储assignee、Access-Key
						sessionStorage.setItem("assignee",response.data.data.id)
						sessionStorage.setItem('Access-Key',JSON.stringify(response.data.data.id));
						this.$router.push({path: '/home'});
					}else{
						this.$message.error(response.data.meta.message, 20);  
						this.buttonLoading = false;
					}
				}).catch( (error) => {
					this.$message.error('登录失败!!!');
					this.buttonLoading = false;
				});
			},
			
			//点击按钮记住账号密码
			rememberClick() {
				console.log(this.checked)
				this.checked? localStorage.setItem("remember",'true') : localStorage.setItem("remember",'false')
				localStorage.setItem("username", this.ruleForm.username);
				localStorage.setItem("password", this.ruleForm.password);
			},
			//记住账号密码
			_remember: function() {
				if(localStorage.getItem("remember") === "true") { 
					if(localStorage.getItem("username") && localStorage.getItem("password")) {
						this.ruleForm.username = localStorage.getItem("username");
						this.ruleForm.password = localStorage.getItem("password");
						this.checked = true;
					}
				}
			},
		},
	}
</script>

<style lang="less" scoped>
	@darkBlue: #114275;
	@keyframes scaleBackground {
		0% {transform:scale(1, 1);background-image: url("../assets/img/1.jpg");}
		50% {transform:scale(1.08, 1.08);background-image: url("../assets/img/2.jpg");}
		100% {transform:scale(1, 1);background-image: url("../assets/img/1.jpg");}
	}
	.background-wrap {
		overflow: hidden;
		.login-background {
			width: 100vw;
			height: 100vh;
			background-position: center;
			background-size:cover;
			animation: scaleBackground 15s infinite;
			transition-timing-function: ease-in-out;
		}
	}
	.text-dark-blue {
		color: @darkBlue;
	}
	.login-container{
		width: 100vw;
		height: 100vh;
		.login-box{
			position: absolute;
			top: 50%;
			right: 20vw;
			width: 500px;
			overflow: hidden;
			margin: -200px auto 0 auto;
			padding: 30px 10px;
			box-sizing: border-box;
			border-radius: 10px;
			background-color: rgba(255, 255, 255, 1);
			box-shadow: 0 0 10px #ebeef5;
			color: #333;
			opacity: 0.9;
			-webkit-box-sizing: border-box;
			background-color: #d4d4d496;
			border-radius: 8px;
			box-shadow: 5px 5px 10px #171717b8;
			.box-title{
				color: @darkBlue;
				text-align: center;
				font-size: 22px;
				font-weight: bold;
				padding-bottom: 15px;
				margin-bottom: 20px;
				border-bottom: 1px solid @darkBlue;
			}
			.box-form{
				padding: 0 20px;
			}
		}
	}
</style>
