<!-- 
	首页
 -->

<template>
  <div>
		<!-- 头部 -->
		<div class="header">
			<div 
				v-loading="loading" 
				style="height: 100vh;width: 100vw;position:fixed;top:0;"
				element-loading-text="拼命加载中..."
		    element-loading-spinner="el-icon-loading">
		  </div>
			<div class="tab-page" v-if="tabOnePages">
				<el-tabs v-model="activeName" type="border-card" @tab-click="handleClick" tab-position="top">
					<el-tab-pane
						:key="item"
						v-for="(item, index) in tabOnePages"
						:label="common.convertPageName(item)"
						:name="item"
					>
						<span slot="label" class="tabs-btn">
							{{common.convertPageName(item)}}
						</span>
						<project ref="project" v-if="item=='project'" v-bind:tabTwoPages="tabTwoPages"></project>
						<server ref="server" v-if="item=='server'" v-bind:tabTwoPages="tabTwoPages"></server>
						<user-management ref="user" v-if="item=='user_manager'" v-bind:tabTwoPages="tabTwoPages"></user-management>
						<system-set ref="system" v-if="item=='syetem_set'" v-bind:tabTwoPages="tabTwoPages"></system-set>
						<log-management ref="log" v-if="item=='log_manage'" v-bind:tabTwoPages="tabTwoPages"></log-management>
					</el-tab-pane>
				</el-tabs>
			</div>
		</div>
	</div>
</template>
<style>
	.el-tabs__item.is-disabled{
		height: 28px;
		width: 200px;
	}
	.el-tabs__item{
		height: 50px;
		line-height: 50px;
	}
	.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active .tabs-btn{
		color: #000;
    background-color: #fff;
    border-right-color: #dcdfe6;
    border-left-color: #dcdfe6;
    /* font-style: normal; */
	}
</style>

<style lang="less" scoped>
	.header{
		.tab-page{
			.el-tabs{
				background: #66CDAA;
			}
			.tabs-btn{
				background:rgba(255,255,255,0.5);
			  // border: 1px solid #585151;
		    padding: 3px 24px;
		    border-radius: 5px;
		    // font-style: oblique;
			}
			.logo-img{
				height: 38px;
				img{
					width: 80%;
					margin: 0 auto;
					display: block;
					height: 100%;
				}
			}
		}
	}
</style>

<script>
import  Project from './components/Project.vue';	//产品
import  Server_ from './components/Server.vue';	//服务器
import  UserManagement from './components/userManagement.vue';	//用户管理
import  SystemSet from './components/systemSet.vue';	//系统设置
import  LogManagement from './components/logManagement.vue';	//日志管理
export default {
	components: {
		'project': Project,
		'server': Server_,
		'user-management': UserManagement,
		'system-set': SystemSet,
		'log-management': LogManagement,
	},
	methods: {
		/* 
		 初始化
		 */
		handleClick(tab, event) {
			if(tab.name=='project'){//产品
				this.$refs.project[0].getProjectList();

				this.$refs.project[0].activeName = 'project_detail';
				this.$refs.project[0].isShowBuilt = false;
				this.$refs.project[0].icon = 'el-icon-plus';
				this.$refs.project[0].buildText = '新建产品';
				document.getElementById("btn-box").style.cssFloat = 'left';
				this.$refs.project[0].selectBox = true;
			}else if(tab.name=='server'){//服务器
				this.$refs.server[0].getServerList();
				
				this.$refs.server[0].activeName = 'server_detail';
				this.$refs.server[0].isShowBuilt = false;
				this.$refs.server[0].icon = 'el-icon-plus';
				this.$refs.server[0].buildText = '新建服务器';
				document.getElementById("btn-box_").style.cssFloat = 'left';
				this.$refs.server[0].selectBox = true;
			}else if(tab.name=='user_manager'){//用户管理
				this.$refs.user[0].formInline.username = null;
				this.$refs.user[0].formInline.account = null;
				this.$refs.user[0].elementPageData.pageNum = 1;
				this.$refs.user[0].getUserList();
				this.$refs.user[0].getRoleList();

				this.$refs.user[0].activeName = 'user_manager_user';
			}else if(tab.name=='syetem_set'){//系统设置
				this.$refs.system[0].formInline.key = null;
				this.$refs.system[0].formInline.parameter = null;
				this.$refs.system[0].elementPageData.pageNum = 1;
				this.$refs.system[0].getSystemList();
				this.$refs.system[0].getTypeList();
			}else if(tab.name=='log_manage'){//日志管理
				this.$refs.log[0].formInline.key=null;
				this.$refs.log[0].formInline.date=null;
				this.$refs.log[0].elementPageData.pageNum = 1;
				this.$refs.log[0].getSecurityLogList();
				
				this.$refs.log[0].activeName = 'log_manage_security';
			}
		},
		
		/* 
		 根据角色ID获取该用户已有的页面资源
		 */
		getUserPageTree(){
			let self = this;
			self.loading = true;
			let roleArr = this.userData.roleIds;
			var proArr = [];
			for(var i = 0;i<roleArr.length;i++){
				proArr.push(new Promise(function(resolve, reject) {
					self.axios.get(`${self.common.basePath}/system_manage/select_tree`,{params:{roleId:roleArr[i].id}}).then( (response) => {
						if(response.data.meta.code === 0){
							setTimeout(resolve, 0, response.data.data);
						}else{
							self.$message.error(response.data.meta.message, 20);   
						}
						setTimeout(function(){
							self.loading = false;
						},1500);
					}).catch( (error) => {
						self.$message.error(error);
						self.loading = false;
					});
				}))
			}
			Promise.all(proArr).then(function(values) {
				var arr = values.reduce(function (a, b) { return a.concat(b)} );//二维数组变成一维数组
				var tabs = arr.filter(function(element,index,self){//数组去重
					return self.indexOf(element) === index;
				});
				let tabsArr = [];//该用户所拥有的所有页面
				let twoArr = [];//二级页面组成的数组
				for(var i = 0;i<tabs.length;i++){//循环获取该用户所拥有的一级页面
					
					if(tabs[i].isSelect==true){//该用户所拥有的一级页面
						tabsArr.push("1-"+tabs[i].code)
					}
					
					if(tabs[i].isSelect==false){//处理用户拥有子页面并且父页面为false时，把该子页面的父页面添加进tabsArr里面
						if(tabs[i].childrens.length!=0){
							for(var l = 0;l<tabs[i].childrens.length;l++){
								if(tabs[i].childrens[l].isSelect==true){
									tabsArr.push("1-"+tabs[i].code)
								}
							}
						}
					}
					
					if(tabs[i].childrens.length!=0){//循环获得二级页面
						twoArr.push(tabs[i].childrens)
					}
				}
				
				if(twoArr.length!=0){
					for(var j = 0;j<twoArr.length;j++){//循环获取该用户所拥有的二级页面
						for(var k = 0;k<twoArr[j].length;k++){
							if(twoArr[j][k].isSelect==true){
								tabsArr.push("2-"+twoArr[j][k].code)//该用户所拥有的二级页面
							}
						}
					}
				}
				//tabsArr数组去重
				var tabsArr_ = tabsArr.filter(function(element,index,self){
					return self.indexOf(element) === index;
				});
				tabsArr_.reverse();
				
				self.tabPages = tabsArr_;//该用户所拥有的页面资源
				for(var m= 0;m<tabsArr_.length;m++){
					if(tabsArr_[m].split("-")[0]=="1"){
						self.tabOnePages.push(tabsArr_[m].split("-")[1]);//该用户所拥有的一级页面资源
						self.activeName = self.tabOnePages[0];
					}else if(tabsArr_[m].split("-")[0]=="2"){
						self.tabTwoPages.push(tabsArr_[m].split("-")[1]);//该用户所拥有的二级页面资源
					}
				}
			});
			console.log(self.tabPages);console.log(self.tabOnePages);console.log(self.tabTwoPages)
			
		},
  },
	mounted(){ 
		/* 
		根据角色ID获取该用户已有的页面资源
		*/
		this.getUserPageTree();
	},
	data(){
		return {
			loading: false,
			activeName:null,
			userData:JSON.parse(sessionStorage.getItem("userData"))?JSON.parse(sessionStorage.getItem("userData")):null,
			tabPages:null,//该用户所拥有的页面资源
			tabOnePages:[],//该用户所拥有的一级页面资源
			tabTwoPages:[],//该用户所拥有的二级页面资源
		}
	},
};
</script> 