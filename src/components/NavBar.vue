/*********************导航组件***********************/
<template>
	<el-menu
		:default-active="activeIndex"
		class="el-menu-vertical-demo"
		@select="handleSelect"
		text-color="#000"
		active-text-color="rgba(30,144,240,1)"
		router
		v-if="navArray">
		<!-- <el-menu-item v-for="item in navArray" :key="item.path" :index="item.path" :show-timeout="10" :hide-timeout="10">{{ item.navName }}</el-menu-item> -->
		<el-menu-item index="/">首页</el-menu-item>
		<el-menu-item index="/instructions">使用说明书</el-menu-item>
		<el-menu-item index="/feed_back">新建反馈</el-menu-item>
	</el-menu>
</template>

<script>
  export default {
    data () {
      return {
				navArray:this.$router.options.routes?JSON.parse(JSON.stringify(this.$router.options.routes)):null,
        activeIndex: '/',
      }
    },
    props: {
     
    },
    watch: {
			
    },
    created () {
     console.log(JSON.parse(JSON.stringify(this.$router.options.routes)))
    },
    mounted () {
			
    },
    methods: {
			handleSelect(key, keyPath) {
				console.log(key, keyPath);
			}
    }
  }
</script>

<style scoped>
	.el-menu-vertical-demo{
		background-color: rgba(255,255,255,0.6);
	}
	.el-menu-item:focus, .el-menu-item:hover{
		background: rgb(30, 144, 240) !important;
		color: #fff !important;
	}
</style>
