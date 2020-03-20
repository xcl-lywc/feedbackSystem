import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Feedback from '@/views/Feedback.vue'
Vue.use(Router)

export default new Router({
  routes: [
		//登录
		{
			path: '/login',
			name: 'Login',
			navName: '登录',
			component: Login,
			meta: {
				showNav: false
			},
		},
		//首页
		{
			path: '/home',
			name: 'Home',
			navName: '首页',
			component: Home,
			meta: {
				showNav: true
			},
		},
		{
			path: '/feed_back/:id',
			name: 'Feedback',
			navName: '新建反馈',
			component: Feedback,
			meta: {
				showNav: true
			}
		},
  ]
})
