<template>
  <div id="wapper">
		<div class="header-wrap">
			<img src="../assets/img/10.jpg" alt="" class="fl logo">
			<h2 class="fl title">项目维护系统</h2>
			<!--用户 -->
			<div class="user">
				<el-dropdown class="fl" trigger="click"  @command="handleCommand">
					<span class="el-dropdown-link username-style" v-if="userData">
						{{userData.name}}<i class="el-icon-arrow-down el-icon--right"></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<!-- <el-dropdown-item  command="home"><i class="fa fa-home" aria-hidden="true"></i> 首&nbsp; 页 </el-dropdown-item> -->
						<el-dropdown-item  command="personal">个人资料</el-dropdown-item>
						<el-dropdown-item  command="resetPass">重置密码</el-dropdown-item>
						<el-dropdown-item divided  command="signOutLogin">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<img alt="头像" class="head-image fl" @click="" src="../assets/img/03.png"/>
			</div>
		</div>
		<el-row v-loading="loading" class="content-wrap">
			<router-view></router-view>
		</el-row>
		<el-dialog
			title="个人资料"
			:visible.sync="personnalDialogVisible"
			width="500px"
			center>
			<el-form v-if="userData" label-width="0px" class="personal-box">
				<el-form-item label="">{{" &nbsp;&nbsp;&nbsp;&nbsp;账 &nbsp;&nbsp;户：&nbsp;&nbsp;"+userData.account}}</el-form-item>
				<el-form-item label="" class="el-form-item-bg">{{" &nbsp;&nbsp;&nbsp;&nbsp;姓 &nbsp;&nbsp;名：&nbsp;&nbsp;"+userData.name}}</el-form-item>
				<el-form-item label="">{{" &nbsp;&nbsp;&nbsp;&nbsp;电 &nbsp;&nbsp;话：&nbsp;&nbsp;"+userData.phone}}</el-form-item>
				<el-form-item label="" class="el-form-item-bg">
					<span class="fl"> &nbsp;&nbsp;&nbsp;&nbsp;角 &nbsp;&nbsp;色：&nbsp;&nbsp;</span>
					<span v-for="item in userData.roleIds" class="marr10 line-feed fl">{{item.name+","}}</span>
				</el-form-item>
			</el-form>
		</el-dialog>
		<el-dialog
			title="修改密码"
			:visible.sync="pwdlDialogVisible"
			width="500px"
			center>
			<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="旧密码：" prop="oldPass">
					<el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="新密码：" prop="pass">
					<el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="确认新密码：" prop="checkPass">
					<el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
					<el-button @click="resetForm('ruleForm')">重 置</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
  </div>
</template>

<script>
  import NavBar from "../components/NavBar.vue"
  export default {
    data() {
    	var validatePass1 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入旧密码'));
        } else if (value !== this.oldPassword) {
          callback(new Error('旧密码输入错误!'));
        } else {
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
				loading:false,
				personnalDialogVisible:false,//个人资料
				pwdlDialogVisible:false,//重置密码
				userData:JSON.parse(sessionStorage.getItem("userData"))?JSON.parse(sessionStorage.getItem("userData")):null,
				ruleForm: {
					oldPass:'',
          pass: '',
          checkPass: '',
        },
				assignee:sessionStorage.getItem("assignee")?sessionStorage.getItem("assignee"):null,
        rules: {
        	oldPass: [
            { validator: validatePass1, trigger: 'blur' }
          ],
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
        },
        oldPassword:null,
      };
    },
    components: {
      "nav-bar": NavBar,
    },
    watch: {
			
    },
    created () {
      
    },
    mounted(){
			
    },
    methods: {
      handleCommand(command) {
				if(command == 'signOutLogin'){//退出登录
					this.loginOut();
				}else if(command == 'personal'){ //个人资料
					this.personnalDialogVisible = true;
				}else if(command == 'resetPass'){//重置密码
					this.getOldPassword();
					this.pwdlDialogVisible = true;
					if(this.$refs['ruleForm']){
						this.$refs['ruleForm'].resetFields();
					}
				}else if(command == 'home'){//回到首页
					this.$router.push({path: '/home'})
				}
      },
			
			/* 
			退出登录请求
			*/
			loginOut(){
				let self = this
				self.axios.get(this.common.basePath + '/login/out',{params: {}}).then( (response) => {
					sessionStorage.removeItem("userData")
					sessionStorage.removeItem("token")
					sessionStorage.removeItem("assignee")
				}).catch( (error) => {});
				
				self.$router.push({path: '/login'});
			},
			
			/* 
			 修改密码
			 */
			submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let editUserForm = {
            	password: this.ruleForm.pass,
            }
            this.axios.patch(`${this.common.basePath}/user_manage/${this.assignee}`,editUserForm).then( (response) => {
            	if(response.data.meta.code === 0){
								this.$message.success("重置密码成功！", 20);  
            		this.pwdlDialogVisible = false;
            	}else{
            		this.$message.error(response.data.meta.message, 20);   
            	}
            }).catch( (error) => {
            	this.$message.error(error);
            });
          } else {
            // this.$message.error("新密码密码未填写！！！", 20); 
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

      /*
      	通过用户id查询旧密码
       */
     	getOldPassword(){
     		this.axios.get(`${this.common.basePath}/user_manage/${this.assignee}`,{params: {}}).then( (response) => {
					if(response.data.meta.code === 0){
						this.oldPassword = response.data.data.password;
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

<style>
	.personal-box .el-form-item{
		padding: 10px 0;
    border-bottom: 1px solid #ddd;
    margin-bottom:0;
	}
	.personal-box .el-form-item.el-form-item-bg{
		background:#fcfdf6;
	}
</style>

<style scoped lang="less">
  #wapper {
		background-color: rgb(255,255,255);
		background-size: 800px;
		background-position: -200px;
    .header-wrap{
			z-index: 99;
			position: relative;
			height: 60px;
			background: rgba(30,144,240,1);
			box-shadow: 0 -2px 10px #e4e4e4;
			background-image: url(../assets/img/a2.jpg);
			background-attachment: fixed;
			background-repeat: no-repeat;
			background-size: cover;
			background-position: center bottom;
			.logo,.title{
				display: inline-block;
				margin: 0;
				height: 60px;
				vertical-align: middle;
				line-height: 60px;
				font-style:italic;
			}
			.logo{
				height: 46px;
				width: 46px;
				margin: 7px 15px 0 15px;
				border: 1px solid #3a8ee6;
				border-radius: 50%;
				background: #fff;
			}
			.logo:hover {
				cursor: pointer;
			}
			.title{
				color: rgb(255,255,255);
				font-size: 24px;
				font-weight: normal;
			}
			.user{
				float: right;
				height: 60px;
				margin-right: 10px;
				line-height: 60px;
				.username-style{
					color: #fff;
					font-size: 16px;
					font-weight: 400;
				}
				.username-style:before{
					content:"|";
					margin-right: 8px;
				}
				.icon-button {
					padding: 5px;
					color: #fff;
					background: #555;
					border-color: #555!important;
				}
				.el-dropdown {
					margin-right: 10px;
					cursor: pointer;
					height: 30px;
				}
				.head-image{
					width: 40px;
					height: 40px;
					box-sizing: border-box;
					border-radius: 50%;
					border: 2px solid #fff;
					margin-top: 10px;
				}
    }
		}
		.content-wrap{
			.nav-bg{
				background: url(../assets/img/1.jpg);
				background-position: center center;
				background-repeat: no-repeat;
				background-size: cover;
				.content-wrap-nav{
					height: calc( 100vh - 60px );
				}
			}
		}
		.personal-box{
			border:1px solid #ddd;
			border-radius:5px;
			
		}
  }
</style>
