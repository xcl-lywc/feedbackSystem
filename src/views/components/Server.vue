<!-- 
	服务器
 -->

<template>
  <div>
		<div class="container-box-block">
		<!-- 服务器菜单与新建按钮 -->
  	<div class="server-menu">
			<div class="fl" v-if="selectBox">
				<el-select v-model="defaultServer" filterable placeholder="请选择服务器" @change="handleSelect($event)" size="">
			    <el-option
			    	v-if="servertList"
			      v-for="(item,index) in servertList"
			      :key="item.id"
			      :label="item.name"
			      :value="item.id">
			      <div @mouseover=" tempAtId = item.id " @mouseout="tempAtId = null" style="position:relative;">
			      	<span slot="title">{{item.name}}</span>
			      	<el-button v-if="tempAtId == item.id" type="danger" icon="el-icon-delete" circle class="close-icon-css_" size="mini" @click.stop="delServer(item.name,item.id)"></el-button>
						</div>
			    </el-option>
			  </el-select>
			</div>
		  <!-- 新建服务器按钮 -->
			<div class="btn-box fl marr10" id="btn-box_">
				<el-button type="primary" :icon="icon" size="" @click="builtServer">{{buildText}}</el-button>
			</div>
		</div>

		<el-row class="server-container">
			<el-col :span="24">
				<!-- 新建服务器 -->
				<div class="right-tabs-box" v-show="isShowBuilt">
					<div class="new-box tabs-cotent-box">
						<div class="box-title">新建服务器</div>
						<el-row class="top-content">
							<el-form ref="serverForm" label-width="120px" :model="serverForm" label-position="" :rules="rules">
								<el-form-item label="服务器名称：" prop="name">
									<el-input v-model="serverForm.name"></el-input>
								</el-form-item>
								<el-form-item label="服务器编号：" prop="ser_number">
									<el-input v-model="serverForm.ser_number"></el-input>
								</el-form-item>
								<el-form-item label="服务器位置：" prop="position">
									<el-input type="textarea" v-model="serverForm.position" :rows="5"></el-input>
								</el-form-item>
								<el-form-item label="服务器IP：" prop="ser_ip">
									<el-input v-model="serverForm.ser_ip"></el-input>
								</el-form-item>
								<el-form-item label="系统版本：" prop="sys_version">
									<el-input v-model="serverForm.sys_version"></el-input>
								</el-form-item>
								<el-form-item label="硬件配置：" prop="configure">
									<el-input type="textarea" v-model="serverForm.configure" :rows="5"></el-input>
								</el-form-item>
							</el-form>
						</el-row>
						<el-row class="bottom-content">
							<el-button type="primary" @click="submitForm('serverForm')">立即创建</el-button>
							<el-button @click="resetForm('serverForm')">重 置</el-button>
							<el-button @click="cancel">取 消</el-button>
						</el-row>
					</div>
				</div>
				<!-- tabs-详情、数据库、redis、端口 、nginx  -->
				<div class="right-tabs-box" v-show="!isShowBuilt">
					<el-tabs tab-position="right" v-model="activeName" @tab-click="handleClick" v-if="serverPages">
						<el-tab-pane
							:key="item"
							v-for="(item, index) in serverPages"
							:label="common.convertPageName(item)"
							:name="item"
						>
							<!-- 详情 -->
							<div ref="server-detail" v-if="item=='server_detail'" class="details-box tabs-cotent-box" v-loading="loading_detail">
								<div class="box-title">
									<p>服务器详情</p>
									<el-button v-if='serverDetail' size="small" class="mart10" type="primary" icon="el-icon-edit"  @click="editDetail">编辑</el-button>
								</div>
								<div class="text-center-middle" v-if="serverDetail==null">暂无数据</div>
								<el-form ref="form" label-width="100px" label-position="" v-if="serverDetail">
									<el-form-item label="服务器编号：">
										<span>{{serverDetail.ser_number}}</span>
									</el-form-item>
									<el-form-item label="位置：">
										<span class="line-feed">{{serverDetail.position}}</span>
									</el-form-item>
									<el-form-item label="IP地址：">
										<span>{{serverDetail.ser_ip}}</span>
									</el-form-item>
									<el-form-item label="系统版本：">
										<span>{{serverDetail.sys_version}}</span>
									</el-form-item>
									<el-form-item label="硬件配置：">
										<span class="line-feed">{{serverDetail.configure}}</span>
									</el-form-item>
								</el-form>
							</div>
							<!-- 数据库 -->
							<div ref="server-databases" v-if="item=='server_databases'" class="data-base-box tabs-cotent-box">
								<div class="box-title" v-show="!isShowDataDetail">
									<p>数据库服务列表</p>
									<el-button size="small" class="mart10" type="primary" icon="el-icon-circle-plus"  @click="addDataBasesOne('5',item.id)">添加</el-button>
								</div>
								<!-- 数据库列表 -->
								<el-row :gutter="20" v-show="!isShowDataDetail" v-loading="loading_databases">
									<div v-if="serverDatabases" v-for="item in serverDatabases">
										<el-col :span="6" >
											<div @click="showDataDetail(item.id)">
												<el-row class="data-base-item">
													<i class="el-icon-delete delete-btn-position" @click.stop="del(item.id,'databses_server_list','')"></i>
													<i class="el-icon-edit edit-btn-position" @click.stop="edit(item,'8','')"></i>
													<el-col :span="14" class="data-info">
														<el-form ref="form" label-width="55px" label-position="" class="data-info">
															<el-form-item label="库名：">
																<span>{{item.name}}</span>
															</el-form-item>
															<el-form-item label="账户：">
																<span>{{item.account}}</span>
															</el-form-item>
															<el-form-item label="密码：">
																<span>{{item.password}}</span>
															</el-form-item>
															<el-form-item label="端口：">
																<span>{{item.port_code}}</span>
															</el-form-item>
															<el-form-item label="参数：">
																<span>{{item.parameters}}</span>
															</el-form-item>
															<el-form-item label="简介：">
																<!-- <span class="brief">{{item.description}}</span> -->
																<el-input type="textarea" v-model="item.description" rows="3" disabled></el-input>
															</el-form-item>
															<div class="h40"></div>
														</el-form>
													</el-col>
													<el-col :span="10" class="data-img">
														<img src="../../assets/img/database.jpg" alt="">
													</el-col>
												</el-row>
											</div>
										</el-col>
									</div>
								</el-row>
								<div class="text-center-middle" v-if="serverDatabases==null">暂无数据</div>
								<!-- 数据库详情 -->
								<el-row v-show="isShowDataDetail" class="data-detail" v-loading="loading_databases_detail">
									<el-breadcrumb separator-class="el-icon-arrow-right" class="box-title">
										<el-breadcrumb-item :to="{ path: '/home' }">
											<span @click="isShowDataDetail=false">数据库服务列表</span>
										</el-breadcrumb-item>
										<el-breadcrumb-item>详情</el-breadcrumb-item>
									</el-breadcrumb>
									<!-- 详情 -->
									<div v-if="serverDatabasesDetail">
										<el-row class="data-detail-content">
											<el-row>
												<el-col :span="4" class="data-detail-img">
													<img src="../../assets/img/database.jpg" alt="">
												</el-col>
												<el-col :span="20" class="">
													<el-form ref="form" label-width="55px" label-position="" class="data-info">
														<el-form-item label="库名：">
															<span>{{serverDatabasesDetail.name}}</span>
														</el-form-item>
														<el-form-item label="账户：">
															<span>{{serverDatabasesDetail.account}}</span>
														</el-form-item>
														<el-form-item label="密码：">
															<span>{{serverDatabasesDetail.password}}</span>
														</el-form-item>
														<el-form-item label="参数：">
															<span>{{serverDatabasesDetail.parameters}}</span>
														</el-form-item>
														<el-form-item label="端口：">
															<span>{{serverDatabasesDetail.port_code}}</span>
														</el-form-item>
													</el-form>
												</el-col>
											</el-row>
											<el-form>
												<el-form-item label="简述：" label-width="95px"><span class="line-feed">{{serverDatabasesDetail.description}}</span></el-form-item>
												<el-form-item label="数据库列表："></el-form-item>
												<el-row :gutter="20">
													<div v-for="val in serverDatabasesList">
														<el-col :span="6">
															<el-form class="detail-item-box" style="position: relative;">
																<el-form-item label="名称：" label-width="85px">
																	<span>{{val.name}}</span>
																</el-form-item>
																<el-form-item label="用途：" label-width="85px">
																	<!-- <span class="line-feed">{{val.purpose}}</span> -->
																	<el-input type="textarea" v-model="val.purpose" rows="2" disabled></el-input>
																</el-form-item>
																<el-form-item label="建表sql：" label-width="85px">
																	<a style="display:block;" v-if="val.creat_sql" :href="common.basePicPath+''+val.creat_sql" :download="val.creat_sql.split('public')[0]=='/'?val.creat_sql.split('/').reverse()[0]:val.creat_sql.split('\\').reverse()[0]">点击下载</a>
																</el-form-item>
																<div class="h40"></div>
																<i class="el-icon-delete delete-btn-position" @click.stop="del(val.id,'databses_list',serverDatabasesDetail.id)"></i>
																<i class="el-icon-edit edit-btn-position" @click.stop="edit(val,'9',serverDatabasesDetail.id)"></i>
															</el-form>
														</el-col>
													</div>
													<div v-if="serverDatabasesList==null" class="text-center-middle">暂无数据</div>
													<el-col :span="6" class="plus-btn">
														<i class="el-icon-circle-plus" @click="addDataBases('0',serverDatabasesDetail.id)"></i>
													</el-col>
												</el-row>
											</el-form>
										</el-row>
									</div>
									<div class="text-center-middle" v-if="serverDatabasesDetail==null">暂无数据</div>
								</el-row>
							</div>
							<!-- redis -->
							<div ref="server-redis" v-if="item=='server_redis'" class="redis-box tabs-cotent-box">
								<div class="box-title" v-show="!isShowRedisDetail">
									<p>redis服务列表</p>
									<el-button size="small" class="mart10" type="primary" icon="el-icon-circle-plus" @click="addRedisOne('6',item.id)">添加</el-button>
								</div>
								<!-- 列表 -->
								<el-row :gutter="20" v-show="!isShowRedisDetail" v-loading="loading_redis">
									<div v-if="serverRedis" v-for="item in serverRedis">
										<el-col :span="6">
											<div class="redis-item" @click="showRedisDetail(item.id)">
												<el-row class="redis-item-img"><img src="../../assets/img/redis.jpg" alt=""></el-row>
												<el-row class="redis-item-info">
													<i class="el-icon-delete delete-btn-position" @click.stop="del(item.id,'redis_server_list','')"></i>
													<i class="el-icon-edit edit-btn-position" @click.stop="edit(item,'10','')"></i>
													<el-form ref="form" label-width="90px" label-position="">
														<el-form-item label="名称：">
															<span>{{item.name}}</span>
														</el-form-item>
														<el-form-item label="端口号：">
															<span>{{item.port_code}}</span>
														</el-form-item>
														<el-form-item label="参数：">
															<span>{{item.parameters}}</span>
														</el-form-item>
														<el-form-item label="描述：">
															<!-- <span class="line-feed">{{item.description}}</span> -->
															<el-input type="textarea" v-model="item.description" rows="3" disabled></el-input>
														</el-form-item>
														<div class="h40"></div>
													</el-form>
												</el-row>
											</div>
										</el-col>
									</div>
								</el-row>
								<div class="text-center-middle" v-if="serverRedis==null">暂无数据</div>
								<!-- redis详情 -->
								<el-row v-show="isShowRedisDetail" class="nginx-detail" v-loading="loading_redis_detail">
									<el-breadcrumb separator-class="el-icon-arrow-right" class="box-title">
										<el-breadcrumb-item :to="{ path: '/home' }">
											<span @click="isShowRedisDetail=false">redis服务列表</span>
										</el-breadcrumb-item>
										<el-breadcrumb-item>详情</el-breadcrumb-item>
									</el-breadcrumb>
									<!-- 详情 -->
									<div v-if="serverRedisDetail">
										<el-row class="nginx-detail-content">
											<el-form  label-width="80px" label-position="">
												<el-form-item label="名称：">{{serverRedisDetail.name}}</el-form-item>
												<el-form-item label="端口号：">{{serverRedisDetail.port_code}}</el-form-item>
												<el-form-item label="参数：">{{serverRedisDetail.parameters}}</el-form-item>
												<el-form-item label="描述：">
													<span class="line-feed">{{serverRedisDetail.description}}</span>
												</el-form-item>
												<el-form-item label="数据页："></el-form-item>
												<el-row :gutter="20">
													<div v-for="val in serverRedisList">
														<el-col :span="6">
															<el-form class="detail-item-box" style="position: relative;">
																<el-form-item label="编号：" label-width="55px">
																	<span>{{val.index}}</span>
																</el-form-item>
																<el-form-item label="描述：" label-width="55px">
																	<!-- <span class="line-feed">{{val.description}}</span> -->
																	<el-input type="textarea" v-model="val.description" rows="2" disabled></el-input>
																</el-form-item>
																<div class="h40"></div>
																<i class="el-icon-delete delete-btn-position" @click.stop="del(val.id,'redis_list',serverRedisDetail.id)"></i>
																<i class="el-icon-edit edit-btn-position" @click.stop="edit(val,'11',serverRedisDetail.id)"></i>
															</el-form>
														</el-col>
													</div>
													<div v-if="serverRedisList==null" class="text-center-middle">暂无数据</div>
													<el-col :span="6" class="plus-btn">
														<i class="el-icon-circle-plus" @click="addRedis('1',serverRedisDetail.id)" style="font-size:72px;"></i>
													</el-col>
												</el-row>
											</el-form>
										</el-row>
									</div>
									<div class="text-center-middle" v-if="serverRedisDetail==null">暂无数据</div>
								</el-row>
							</div>
							<!-- nginx -->
							<div ref="server-nginx" v-if="item=='server_ngnix'" class="nginx-box tabs-cotent-box">
								<div class="box-title" v-show="!isShowNginxDetail">
									<p>nginx服务列表</p>
									<el-button size="small" class="mart10" type="primary" icon="el-icon-circle-plus" @click="addNgnixOne('3',item.id)">添加</el-button>
								</div>
								<!-- nginx列表 -->
								<el-row :gutter="20" v-show="!isShowNginxDetail" v-loading="loading_ngnix">
									<div v-if="serverNginx" v-for="item in serverNginx">
										<el-col :span="6">
											<div class="redis-item" @click="showNginxDetail(item.id)" style="position: relative;">
												<i class="el-icon-delete delete-btn-position" @click.stop="del(item.id,'nginx_server_list','')"></i>
												<i class="el-icon-edit edit-btn-position" @click.stop="edit(item,'12','')"></i>
												<el-row class="redis-item-img"><img src="../../assets/img/nginx.jpg" alt=""></el-row>
												<el-row class="redis-item-info">
													<el-form ref="form" label-width="85px" label-position="">
														<el-form-item label="名称：">
															<span>{{item.name}}</span>
														</el-form-item>
														<el-form-item label="端口号：">
															<span>{{item.port_code}}</span>
														</el-form-item>
														<el-form-item label="配置代码：">
															<!-- <span>{{item.config_code}}</span> -->
															<el-input type="textarea" v-model="item.config_code" rows="3" disabled></el-input>
														</el-form-item>
														<el-form-item label="描述：" class='mart10'>
															<!-- <span>{{item.description}}</span> -->
															<el-input type="textarea" v-model="item.description" rows="3" disabled></el-input>
														</el-form-item>
														<div class="h40"></div>
													</el-form>
												</el-row>
											</div>
										</el-col>
									</div>
								</el-row>
								<div class="text-center-middle" v-if="serverNginx==null">暂无数据</div>
								<!-- nginx详情 -->
								<el-row v-show="isShowNginxDetail" class="nginx-detail" v-loading="loading_ngnix_detail">
									<el-breadcrumb separator-class="el-icon-arrow-right" class="box-title">
										<el-breadcrumb-item :to="{ path: '/home' }">
											<span @click="isShowNginxDetail=false">nginx服务列表</span>
										</el-breadcrumb-item>
										<el-breadcrumb-item>详情</el-breadcrumb-item>
									</el-breadcrumb>
									<!-- 详情 -->
									<div v-if="serverNgnixDetail">
										<el-row class="nginx-detail-content">
											<el-form label-width="110px" label-position="">
												<el-form-item label="名称：">
													{{serverNgnixDetail.name}}
												</el-form-item>
												<el-form-item label="端口：">
													{{serverNgnixDetail.port_code}}
												</el-form-item>
												<el-form-item label="配置代码：">
													<span class="line-feed">{{serverNgnixDetail.config_code}}</span>
												</el-form-item>
												<el-form-item label="描述：">
													<span class="line-feed">{{serverNgnixDetail.description}}</span>
												</el-form-item>
												<el-form-item label="location列表："></el-form-item>
												<el-row :gutter="20">
													<div v-for="val in serverNgnixList">
														<el-col :span="6">
															<el-form class="detail-item-box" style="position: relative;">
																<i class="el-icon-delete delete-btn-position" @click.stop="del(val.id,'ngnix_list',serverNgnixDetail.id)"></i>
																<i class="el-icon-edit edit-btn-position" @click.stop="edit(val,'13',serverNgnixDetail.id)"></i>
																<el-form-item label="匹配条件：" label-width="85px">
																	<span>{{val.match}}</span>
																</el-form-item>
																<el-form-item label="代理配置：" label-width="85px">
																	<!-- <span class="line-feed">{{val.agent}}</span> -->
																	<el-input type="textarea" v-model="val.agent" rows="2" disabled></el-input>
																</el-form-item>
																<el-form-item label="作用：" label-width="85px" class="mart10">
																	<!-- <span class="line-feed">{{val.effect}}</span> -->
																	<el-input type="textarea" v-model="val.effect" rows="2" disabled></el-input>
																</el-form-item>
																<div class="h40"></div>
															</el-form>
														</el-col>
													</div>
													<div v-if="serverNgnixList==null" class="text-center-middle">暂无数据</div>
													<el-col :span="6" class="plus-btn">
														<i class="el-icon-circle-plus" @click="addNgnix('2',serverNgnixDetail.id)"></i>
													</el-col>
												</el-row>
											</el-form>
										</el-row>
									</div>
									<div class="text-center-middle" v-if="serverNgnixDetail==null">暂无数据</div>
								</el-row>
							</div>
							<!-- 端口 -->
							<div ref="server-port" v-if="item=='server_port'" class="port-box tabs-cotent-box" v-loading="loading_port">
								<div class="box-title">
									<p>端口列表</p>
									<el-button size="small" class="mart10" type="primary" icon="el-icon-circle-plus" @click="addPortOne('7',item.id)">添加</el-button>
								</div>
								<el-row :gutter="20">
									<div v-if="serverPort" v-for="item in serverPort">
										<el-col :span="6">
											<el-form ref="form" label-width="90px" label-position="" class="port-box-item" style="position: relative;">
												<i class="el-icon-delete delete-btn-position" @click.stop="del(item.id,'port_server_list','')"></i>
												<i class="el-icon-edit edit-btn-position" @click.stop="edit(item,'14','')"></i>
												<el-form-item label="端口：">
													<span>{{item.port}}</span>
												</el-form-item>
												<el-form-item label="占用原因：">
													<!-- <span class="line-feed">{{item.occupy_title}}</span> -->
													<el-input type="textarea" v-model="item.occupy_title" rows="3" disabled></el-input>
												</el-form-item>
												<div class="h40"></div>
											</el-form>
										</el-col>
									</div>
								</el-row>
								<div class="text-center-middle" v-if="serverPort==null">暂无数据</div>
							</div>
						</el-tab-pane>
					</el-tabs>
				</div>
			</el-col>
		</el-row>
		</div>
		<!-- 添加与编辑弹框 -->
		<el-dialog
			:title="addTitleArr[addTypeDialog]"
			:visible.sync="addDialogVisible"
			width="650px">
			<el-form :model="addForm" ref="addForm" label-width="100px" class="demo-dynamic" size="middle" v-loading='loading_edit'>
				<div v-if="addTypeDialog=='0'||addTypeDialog=='9'"><!-- 数据库详情处 -->
					<el-form-item
						prop="name"
						label="名称："
						:rules="[{ required: true, message: '请输入库名', trigger: 'blur' },]">
						<el-input v-model="addForm.name"></el-input>
					</el-form-item>
					<el-form-item
						prop="databases_deploy_id"
						label="部署主键：">
						<el-input v-model="addForm.databases_deploy_id" disabled></el-input>
					</el-form-item>
					<el-form-item
						prop="purpose"
						label="用途："
						:rules="[{ required: true, message: '请输入用途', trigger: 'blur' },]">
						<el-input type="textarea" v-model="addForm.purpose"></el-input>
					</el-form-item>
					<el-form-item
						prop="creat_sql"
						label="建表sql："
						:rules="[{ required: true, message: '请上传sql文件', trigger: 'blur' },]">
						<!-- <el-input v-model="addForm.creat_sql"></el-input> -->
						<el-upload
							class="upload-demo"
							:action="`${common.basePath}/file/uplode`"
							:show-file-list="false"
							:auto-upload="true"
							multiple
							:limit="9999"
							:before-upload="beforeUpload"
							:http-request="uploadSqlFile">
							<el-button size="small" type="primary">点击上传</el-button>
  						<span slot="tip" class="el-upload__tip marl10">只能上传.sql格式文件</span>
  						<a style="display:block;" v-if="addForm.creat_sql" :href="common.basePicPath+''+addForm.creat_sql" :download="addForm.creat_sql.split('public')[0]=='/'?addForm.creat_sql.split('/').reverse()[0]:addForm.creat_sql.split('\\').reverse()[0]" title="点击下载" slot="tip">{{addForm.creat_sql.split('public')[0]=='/'?addForm.creat_sql.split('/').reverse()[0]:addForm.creat_sql.split('\\').reverse()[0]}}</a>
							</span>
						</el-upload>
					</el-form-item>
				</div>
				<div v-if="addTypeDialog=='1'||addTypeDialog=='11'"><!-- redis详情处 -->
					<el-form-item
						prop="index"
						label="编号："
						:rules="[{ required: true, message: '请输入编号', trigger: 'blur' },{	pattern: /^[0-9]{1,16}$/, message: '编号请输入1-16位的阿拉伯数字' },]">
						<el-input v-model="addForm.index"></el-input>
					</el-form-item>
					<el-form-item
						prop="description"
						label="描述："
						:rules="[{ required: true, message: '请输入用途', trigger: 'blur' },]">
						<el-input type="textarea" v-model="addForm.description"></el-input>
					</el-form-item>
				</div>
				<div v-if="addTypeDialog=='2'||addTypeDialog=='13'"><!-- ngnix详情处 -->
					<el-form-item
						prop="match"
						label="匹配条件："
						:rules="[{ required: true, message: '请输入匹配条件', trigger: 'blur' },]">
						<el-input v-model="addForm.match"></el-input>
					</el-form-item>
					<el-form-item
						prop="agent"
						label="代理配置："
						:rules="[{ required: true, message: '请输入代理配置', trigger: 'blur' },]">
						<el-input type="textarea" v-model="addForm.agent"></el-input>
					</el-form-item>
					<el-form-item
						prop="effect"
						label="作用："
						:rules="[{ required: true, message: '请输入作用', trigger: 'blur' },]">
						<el-input type="textarea" v-model="addForm.effect"></el-input>
					</el-form-item>
				</div>
				<div v-if="addTypeDialog=='3'||addTypeDialog=='12'"><!-- ngnix列表处 -->
					<el-form-item
						prop="ngnix_one_name"
						label="名称："
						:rules="[{ required: true, message: '请输入名称', trigger: 'blur' },]">
						<el-input v-model="addForm.ngnix_one_name"></el-input>
					</el-form-item>
					<el-form-item
						prop="ngnix_port_code"
						label="端口号："
						:rules="[{ required: true, message: '请输入端口号', trigger: 'blur' },
					{	pattern: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/, message: '端口号不符合要求' },]">
						<el-input v-model="addForm.ngnix_port_code"></el-input>
					</el-form-item>
					<el-form-item
						prop="config_code"
						label="配置代码："
						:rules="[{ required: true, message: '请输入配置代码', trigger: 'blur' },]">
						<el-input type="textarea" v-model="addForm.config_code"></el-input>
					</el-form-item>
					<el-form-item
						prop="ngnix_one_description"
						label="描述："
						:rules="[{ required: true, message: '请输入描述', trigger: 'blur' },]">
						<el-input type="textarea" v-model="addForm.ngnix_one_description"></el-input>
					</el-form-item>
				</div>
				<div v-if="addTypeDialog=='5'||addTypeDialog=='8'"><!-- 数据库列表处 -->
					<el-form-item
						prop="databasers_list_name"
						label="库名："
						:rules="[{ required: true, message: '请输入库名', trigger: 'blur' },]">
						<el-input v-model="addForm.databasers_list_name"></el-input>
					</el-form-item>
					<el-form-item
						prop="account"
						label="账户："
						:rules="[{ required: true, message: '请输入账户', trigger: 'blur' },]">
						<el-input v-model="addForm.account"></el-input>
					</el-form-item>
					<el-form-item
						prop="password"
						label="密码："
						:rules="[{ required: true, message: '请输入密码', trigger: 'blur' },]">
						<el-input v-model="addForm.password"></el-input>
					</el-form-item>
					<el-form-item
						prop="port_code"
						label="端口号："
						:rules="[{ required: true, message: '请输入端口号', trigger: 'blur' },{	pattern: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/, message: '端口号不符合要求' },]">
						<el-input v-model="addForm.port_code"></el-input>
					</el-form-item>
					<el-form-item
						prop="parameters"
						label="参数："
						:rules="[{ required: true, message: '请输入参数', trigger: 'blur' },]">
						<el-input v-model="addForm.parameters"></el-input>
					</el-form-item>
					<el-form-item
						prop="databses_list_description"
						label="描述："
						:rules="[{ required: true, message: '请输入数据库说明', trigger: 'blur' },]">
						<el-input type="textarea" v-model="addForm.databses_list_description"></el-input>
					</el-form-item>
				</div>
				<div v-if="addTypeDialog=='6'||addTypeDialog=='10'"><!-- redis列表处 -->
					<el-form-item
						prop="redis_list_name"
						label="名称："
						:rules="[{ required: true, message: '请输入名称', trigger: 'blur' },]">
						<el-input v-model="addForm.redis_list_name"></el-input>
					</el-form-item>
					<el-form-item
						prop="redis_port_code"
						label="端口号："
						:rules="[{ required: true, message: '请输入端口号', trigger: 'blur' },{	pattern: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/, message: '端口号不符合要求' },]">
						<el-input v-model="addForm.redis_port_code"></el-input>
					</el-form-item>
					<el-form-item
						prop="redis_list_parameters"
						label="参数："
						:rules="[{ required: true, message: '请输入参数', trigger: 'blur' },]">
						<el-input v-model="addForm.redis_list_parameters"></el-input>
					</el-form-item>
					<el-form-item
						prop="redis_list_description"
						label="描述："
						:rules="[{ required: true, message: '请输入内容', trigger: 'blur' },]">
						<el-input type="textarea" v-model="addForm.redis_list_description"></el-input>
					</el-form-item>
				</div>
				<div v-if="addTypeDialog=='7'||addTypeDialog=='14'"><!-- 端口列表处 -->
					<el-form-item
						prop="port"
						label="端口号："
						:rules="[{ required: true, message: '请输入端口号', trigger: 'blur' },{	pattern: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/, message: '端口号不符合要求' },]">
						<el-input v-model="addForm.port"></el-input>
					</el-form-item>
					<el-form-item
						prop="occupy_title"
						label="占用原因："
						:rules="[{ required: true, message: '请输入占用原因', trigger: 'blur' },]">
						<el-input type="textarea" v-model="addForm.occupy_title"></el-input>
					</el-form-item>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" v-if="Number(addTypeDialog)>=8" @click="editSubmitForm('addForm',addTypeDialog)">保 存</el-button>
				<el-button type="primary" v-if="Number(addTypeDialog)<8" @click="addSubmitForm('addForm',addTypeDialog)">添 加</el-button>
				<el-button @click="resetForm('addForm')">重 置</el-button>
				<el-button @click="addDialogVisible = false">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 编辑服务器详情 -->
		<el-dialog
			title="编辑服务器"
			:visible.sync="editDetailDialogVisible"
			width="750px">
			<el-form ref="serverForm" label-width="120px" :model="serverForm" label-position="" :rules="rules">
				<el-form-item label="服务器名称：" prop="name">
					<el-input v-model="serverForm.name"></el-input>
				</el-form-item>
				<el-form-item label="服务器编号：" prop="ser_number">
					<el-input v-model="serverForm.ser_number"></el-input>
				</el-form-item>
				<el-form-item label="服务器位置：" prop="position">
					<el-input type="textarea" v-model="serverForm.position" :rows="5"></el-input>
				</el-form-item>
				<el-form-item label="服务器IP：" prop="ser_ip">
					<el-input v-model="serverForm.ser_ip"></el-input>
				</el-form-item>
				<el-form-item label="系统版本：" prop="sys_version">
					<el-input v-model="serverForm.sys_version"></el-input>
				</el-form-item>
				<el-form-item label="硬件配置：" prop="configure">
					<el-input type="textarea" v-model="serverForm.configure" :rows="5"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDetailDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editDetailForm('serverForm')">保 存</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<style>
	/* 展示的文本框样式修改 */
	.port-box-item .el-textarea{
		margin-top: 12px;
	}
	.port-box-item .el-textarea.is-disabled .el-textarea__inner{
		background-color: #fcfdf6;
		border-color: #e4e7ed;
    color: #606266;
    cursor: default;
	}
	.redis-item .el-textarea{
		margin-top: 12px;
	}
	.redis-item .el-textarea.is-disabled .el-textarea__inner{
		background-color: #fcfdf6;
		border-color: #e4e7ed;
    color: #606266;
    cursor: pointer;
	}
	.data-base-item .el-textarea{
		margin-top: 12px;
	}
	.data-base-item .el-textarea.is-disabled .el-textarea__inner{
		background-color: #fcfdf6;
		border-color: #e4e7ed;
    color: #606266;
    cursor: pointer;
	}
	.detail-item-box .el-textarea{
		margin-top: 12px;
	}
	.detail-item-box .el-textarea.is-disabled .el-textarea__inner{
		background-color: #fcfdf6;
		border-color: #e4e7ed;
    color: #606266;
    cursor: default;
	}
</style>

<style src="../../assets/style/server.less" scoped lang="less"></style>

<script>
	
export default {
	props:{
		tabTwoPages:{
			type:Array,
			required:true,
		},
	},
	methods: {

		//-------------------------------------------------------------------------------------上传与下载文件
		/* 
			上传文件前，限制用户上传的文件格式
		 */
		beforeUpload(file) {
			const isSQL = file.name.split('.')[1] === 'sql';
			if (!isSQL) {
				this.$message.error('上传文件只能是 .sql 格式的文件!');
			}
			return isSQL;
		},	
		/* 
			自定义文件上传
		*/
		uploadSqlFile(param){
			var fileObj = param.file;
			// FormData 对象
			var form = new FormData();
			// 文件对象
			form.append("file", fileObj);
			this.axios.post(`${this.common.basePath}/file/uplode`,form,{ headers: { 'Content-Type': 'multipart/form-data' } }).then((response) => {
				this.$message.success("文件上传成功！！", 20);
				this.addForm.creat_sql = response.data.data.path;
			}).catch((error) => {
				this.$message.error(error);
			});
		},
		/*
			下载文件
		 */
		download_(path){
			window.open("http://192.168.31.9:8081/file/download");
		},
		download(path){
			/*let form = {
				path:path,
			}*/
			let form = new URLSearchParams()
			form.append('path', path)
			this.axios.post(`${this.common.basePath}/file/download`,form,{ headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((response) => {
				this.$message.success("文件下载成功！！", 20);
			}).catch((error) => {
				this.$message.error(error);
			});
		},

		//-------------------------------------------------------------------------------------tab切换与下拉选择服务器
		/* 
			点击服务器列表,切换不同的服务器id
		*/
		handleSelect(key) {
			this.activeIndex = String(key);
			if(this.activeName=='server_detail'){//详情
				this.getServerDetail();
			}else if(this.activeName=='server_databases'){//数据库
				this.getServerDatabases();
			}else if(this.activeName=='server_redis'){//redis
				this.getServerRedis();
			}else if(this.activeName=='server_port'){//端口
				this.getServerPort();
			}else if(this.activeName=='server_ngnix'){//nginx
				this.getServerNginx();
			}
		},
		/* 
			右侧的tab切换
		*/
		handleClick(tab, event) {
			if(tab.name=='server_detail'){//详情
				/* 
				GET  查询--根据服务器id查询服务器详情
				*/
				this.getServerDetail();
			}else if(tab.name=='server_databases'){//数据库
				/* 
					GET  查询--根据服务器id查询服务器数据库
				*/
				this.isShowDataDetail = false;
				this.getServerDatabases();
			}else if(tab.name=='server_redis'){//redis
				/* 
					GET  查询--根据服务器id查询服务器redis
				*/
				this.isShowRedisDetail = false;
				this.getServerRedis();
			}else if(tab.name=='server_port'){//端口
				/* 
					GET  查询--根根据服务器id查询服务器端口
				*/
				this.getServerPort();
			}else if(tab.name=='server_ngnix'){//nginx
				/* 
					GET  查询--根据服务器id查询服务器nginx
				*/
				this.isShowNginxDetail = false;
				this.getServerNginx();
			}
		},

		//-------------------------------------------------------------------------------------服务器列表
		/* 
			GET  查询--查询服务器列表
		*/
		getServerList(){
			this.loading = true;
			this.axios.get(`${this.common.basePath}/server`,this._params()).then( (response) => {
				if(response.data.meta.code === 0){
					if(JSON.stringify(response.data.data.rows)=='[]'){
						this.servertList = null;//服务器列表
						this.defaultServer = null;//默认服务器
					}else{
						this.servertList = response.data.data.rows;//服务器列表
						this.defaultServer = response.data.data.rows[0].id;//默认服务器
					}
					this.activeIndex = response.data.data.rows?String(response.data.data.rows[0].id):null;//初始服务器id
					if(this.tabTwoPages.indexOf("server_detail")!=-1&&this.activeIndex){
						//获取初始的服务器详情
						this.loading_detail = true;
						this.axios.get(`${this.common.basePath}/server/${this.activeIndex}`,this._params()).then( (response) => {
							if(response.data.meta.code === 0){
								this.serverDetail = response.data.data;//服务器---详情
							}else{
								this.$message.error(response.data.meta.message, 20);   
							}
							this.loading_detail = false;
						}).catch( (error) => {
							this.$message.error(error);
							this.loading_detail = false;
						});
					}
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
				this.loading = false;
			}).catch( (error) => {
				this.$message.error(error);
				this.loading = false;
			});
		},
		_params(){
			return {
				params: {}
			}
		},
		/*
			删除服务器
		 */
		delServer(name,id){
			this.$confirm(`此操作将删除 ${name} , 是否继续?`, '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '放 弃',
        type: 'warning'
      }).then(() => {
      	this.axios.patch(`${this.common.basePath}/server/delete/${id}`,{params:{}}).then( (response) => {
					if(response.data.meta.code === 0){
						this.$message.success("删除成功！！", 20);
						this.getServerList();
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
				}).catch( (error) => {
					this.$message.error(error);
				});
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
		},

		//-------------------------------------------------------------------------------------服务器详情
		/* 
		GET  查询--根据服务器id查询详情
		*/
		getServerDetail(){
			this.axios.get(`${this.common.basePath}/server/${this.activeIndex}`,this._detailParams()).then( (response) => {
				if(response.data.meta.code === 0){
					if(JSON.stringify(response.data.data)=='[]'){
						this.serverDetail = null;//服务器---详情
					}else{
						this.serverDetail = response.data.data;//服务器---详情
					}
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
			}).catch( (error) => {
				this.$message.error(error);
			});
		},
		_detailParams(){
			return {
				params: {}
			}
		},
		/*
			编辑服务器详情
		 */
		editDetail(){
			this.resetForm("serverForm");//清空信息

			// 回显信息
			this.loading_edit = true;
			this.axios.get(`${this.common.basePath}/server/${this.activeIndex}`,{params:{}}).then( (response) => {
				if(response.data.meta.code === 0){
					if(JSON.stringify(response.data.data)=='[]'){
						this.serverForm = null;//服务器详情
					}else{
						this.serverForm = response.data.data;//服务器详情
					}
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
				this.loading_edit = false;
			}).catch( (error) => {
				this.$message.error(error);
				this.loading_edit = false;
			});

			this.editDetailDialogVisible = true;
		},
		/*
			确认编辑服务器详情
		 */
		editDetailForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.axios.patch(`${this.common.basePath}/server/${this.activeIndex}`,this.serverForm).then( (response) => {
						if(response.data.meta.code === 0){
							this.$message.success("编辑成功！！", 20);
							this.editDetailDialogVisible = false;
							this.getServerDetail();
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
					}).catch( (error) => {
						this.$message.error(error);
					});
				} else {
					this.$message.error('信息未填写完整！！！', 20); 
					return false;
				}
			});
		},

		//-------------------------------------------------------------------------------------服务器的数据库、redis、端口、ngnix添加、编辑、删除配置
		/* 
		 确认添加配置
		 */
		addSubmitForm(formName, type){
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if(type=='0'){//数据库详情处配置
						this.addDataBases_();
					}else if(type=='1'){//redis详情处配置
						this.addRedis_();
					}else if(type=='2'){//nginx配置（三级）
						this.addNgnix_();
					}else if(type=='3'){//nginx配置（一级）
						this.addNgnixOne_();
					}else if(type=='5'){//数据库列表处配置
						this.addDataBasesOne_();
					}else if(type=='6'){//redis列表处配置
						this.addRedisOne_();
					}else if(type=='7'){//端口列表处配置
						this.addPortOne_();
					}
				} else {
					this.$message.error('添加配置的信息未填写完整！！！', 20); 
					return false;
				}
			});
		},
		/*
			编辑配置
		 */
		edit(data,type,id){
			// console.log(data)
			//清空id
			this.editId = null;
			this.refushId = null;
			//回显信息
			if(type=='8'){//回显服务器数据库表单详情
				this.loading_edit = true;
				this.axios.get(`${this.common.basePath}/sql/${data.id}`,{params:{}}).then( (response) => {
					if(response.data.meta.code === 0){
						if(JSON.stringify(response.data.data)=='[]'){
							this.addForm = null;//服务器数据库详情
						}else{
							this.addForm = response.data.data;//服务器数据库详情
							this.addForm.databasers_list_name = response.data.data.name;
							this.addForm.databses_list_description = response.data.data.description;
						}
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
					this.loading_edit = false;
				}).catch( (error) => {
					this.$message.error(error);
					this.loading_edit = false;
				});
			}else if(type=='9'){//回显数据库表单详情
				this.loading_edit = true;
				this.axios.get(`${this.common.basePath}/database/${data.id}`,{params:{}}).then( (response) => {
					if(response.data.meta.code === 0){
						if(JSON.stringify(response.data.data)=='[]'){
							this.addForm = null;//数据库详情
						}else{
							this.addForm = response.data.data;//数据库详情
							this.addForm.databases_deploy_id = data.deploy_id;
						}
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
					this.loading_edit = false;
				}).catch( (error) => {
					this.$message.error(error);
					this.loading_edit = false;
				});
			}else if(type=='12'){//回显服务器nginx表单详情
				this.loading_edit = true;
				this.axios.get(`${this.common.basePath}/nginx_server/${data.id}`,{params:{}}).then( (response) => {
					if(response.data.meta.code === 0){
						if(JSON.stringify(response.data.data)=='[]'){
							this.addForm = null;//服务器nginx详情
						}else{
							this.addForm = response.data.data;//服务器nginx详情
							this.addForm.ngnix_one_name = response.data.data.name;
							this.addForm.ngnix_port_code = response.data.data.port_code;
							this.addForm.ngnix_one_description = response.data.data.description;
						}
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
					this.loading_edit = false;
				}).catch( (error) => {
					this.$message.error(error);
					this.loading_edit = false;
				});
			}else if(type=='13'){//回显ngnix表单详情
				this.loading_edit = true;
				this.axios.get(`${this.common.basePath}/nginx_location/${data.id}`,{params:{}}).then( (response) => {
					if(response.data.meta.code === 0){
						if(JSON.stringify(response.data.data)=='[]'){
							this.addForm = null;//ngnix详情
						}else{
							this.addForm = response.data.data;//ngnix详情
						}
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
					this.loading_edit = false;
				}).catch( (error) => {
					this.$message.error(error);
					this.loading_edit = false;
				});
			}else if(type=='10'){//回显服务器redis表单详情
				this.loading_edit = true;
				this.axios.get(`${this.common.basePath}/redis/${data.id}`,{params:{}}).then( (response) => {
					if(response.data.meta.code === 0){
						if(JSON.stringify(response.data.data)=='[]'){
							this.addForm = null;//服务器redis详情
						}else{
							this.addForm = response.data.data;//服务器redis详情
							this.addForm.redis_list_name = response.data.data.name;
							this.addForm.redis_port_code = response.data.data.port_code;
							this.addForm.redis_list_description = response.data.data.description;
							this.addForm.redis_list_parameters = response.data.data.parameters;
						}
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
					this.loading_edit = false;
				}).catch( (error) => {
					this.$message.error(error);
					this.loading_edit = false;
				});
			}else if(type=='11'){//回显redis表单详情
				this.loading_edit = true;
				this.axios.get(`${this.common.basePath}/redis_index/${data.id}`,{params:{}}).then( (response) => {
					if(response.data.meta.code === 0){
						if(JSON.stringify(response.data.data)=='[]'){
							this.addForm = null;//redis详情
						}else{
							this.addForm = response.data.data;//redis详情
						}
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
					this.loading_edit = false;
				}).catch( (error) => {
					this.$message.error(error);
					this.loading_edit = false;
				});
			}else if(type=='14'){//回显服务器端口表单详情
				this.loading_edit = true;
				this.axios.get(`${this.common.basePath}/port/${data.id}`,{params:{}}).then( (response) => {
					if(response.data.meta.code === 0){
						if(JSON.stringify(response.data.data)=='[]'){
							this.addForm = null;//服务器端口详情
						}else{
							this.addForm = response.data.data;//服务器端口详情
						}
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
					this.loading_edit = false;
				}).catch( (error) => {
					this.$message.error(error);
					this.loading_edit = false;
				});
			}

			//编辑id
			this.editId = data.id;

			//查询刷新的id
			this.refushId = id;

			this.addTypeDialog= type;
			this.addDialogVisible= true;

			//清空数据
			if(this.$refs['addForm']){
				this.$refs['addForm'].resetFields();
			}
		},
		/*
			确认编辑配置
		 */
		editSubmitForm(formName, type){
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if(type=='9'){//数据库详情处配置
						this.editDataBases_();
					}else if(type=='11'){//redis详情处配置
						this.editRedis_();
					}else if(type=='13'){//nginx详情处配置
						this.editNgnix_();
					}else if(type=='12'){//nginx列表处配置
						this.editNgnixOne_();
					}else if(type=='8'){//数据库列表处配置
						this.editDataBasesOne_();
					}else if(type=='10'){//redis列表处配置
						this.editRedisOne_();
					}else if(type=='14'){//端口列表处配置
						this.editPortOne_();
					}
				} else {
					this.$message.error('配置信息未填写完整！！！', 20); 
					return false;
				}
			});
		},
		/*
			删除配置
		 */
		del(id,type,sId){
			if(type==="databses_server_list"){//删除服务器数据库列表
				this.$confirm('此操作将删除该数据库, 是否继续?', '提示', {
	        confirmButtonText: '确 定',
	        cancelButtonText: '放 弃',
	        type: 'warning'
	      }).then(() => {
	      	this.axios.patch(`${this.common.basePath}/sql/delete/${id}`,{params:{}}).then( (response) => {
						if(response.data.meta.code === 0){
							this.$message.success("删除成功！！", 20);
							this.getServerDatabases();
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
					}).catch( (error) => {
						this.$message.error(error);
					});
	      }).catch(() => {});
			}else if(type==="databses_list"){//删除数据库列表
				this.$confirm('此操作将删除该数据库, 是否继续?', '提示', {
	        confirmButtonText: '确 定',
	        cancelButtonText: '放 弃',
	        type: 'warning'
	      }).then(() => {
	      	this.axios.patch(`${this.common.basePath}/database/delete/${id}`,{params:{}}).then( (response) => {
						if(response.data.meta.code === 0){
							this.$message.success("删除成功！！", 20);
							this.getServerDatabasesList(sId);
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
					}).catch( (error) => {
						this.$message.error(error);
					});
	      }).catch(() => {});
			}else if(type==="nginx_server_list"){//删除服务器ngnix列表
				this.$confirm('此操作将删除该nginx, 是否继续?', '提示', {
	        confirmButtonText: '确 定',
	        cancelButtonText: '放 弃',
	        type: 'warning'
	      }).then(() => {
	      	this.axios.patch(`${this.common.basePath}/nginx_server/delete/${id}`,{params:{}}).then( (response) => {
						if(response.data.meta.code === 0){
							this.$message.success("删除成功！！", 20);
							this.getServerNginx();
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
					}).catch( (error) => {
						this.$message.error(error);
					});
	      }).catch(() => {});
			}else if(type==="ngnix_list"){//删除ngnix列表
				this.$confirm('此操作将删除该nginx, 是否继续?', '提示', {
	        confirmButtonText: '确 定',
	        cancelButtonText: '放 弃',
	        type: 'warning'
	      }).then(() => {
	      	this.axios.patch(`${this.common.basePath}/nginx_location/delete/${id}`,{params:{}}).then( (response) => {
						if(response.data.meta.code === 0){
							this.$message.success("删除成功！！", 20);
							this.getServerNgnixList(sId);
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
					}).catch( (error) => {
						this.$message.error(error);
					});
	      }).catch(() => {});
			}else if(type==="redis_server_list"){//删除服务器redis列表
				this.$confirm('此操作将删除该redis, 是否继续?', '提示', {
	        confirmButtonText: '确 定',
	        cancelButtonText: '放 弃',
	        type: 'warning'
	      }).then(() => {
	      	this.axios.patch(`${this.common.basePath}/redis/delete/${id}`,{params:{}}).then( (response) => {
						if(response.data.meta.code === 0){
							this.$message.success("删除成功！！", 20);
							this.getServerRedis();
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
					}).catch( (error) => {
						this.$message.error(error);
					});
	      }).catch(() => {});
			}else if(type==="redis_list"){//删除redis列表
				this.$confirm('此操作将删除该redis, 是否继续?', '提示', {
	        confirmButtonText: '确 定',
	        cancelButtonText: '放 弃',
	        type: 'warning'
	      }).then(() => {
	      	this.axios.patch(`${this.common.basePath}/redis_index/delete/${id}`,{params:{}}).then( (response) => {
						if(response.data.meta.code === 0){
							this.$message.success("删除成功！！", 20);
							this.getServerRedisList(sId);
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
					}).catch( (error) => {
						this.$message.error(error);
					});
	      }).catch(() => {});
			}else if(type==="port_server_list"){//删除服务器端口列表
				this.$confirm('此操作将删除该端口, 是否继续?', '提示', {
	        confirmButtonText: '确 定',
	        cancelButtonText: '放 弃',
	        type: 'warning'
	      }).then(() => {
	      	this.axios.patch(`${this.common.basePath}/port/delete/${id}`,{params:{}}).then( (response) => {
						if(response.data.meta.code === 0){
							this.$message.success("删除成功！！", 20);
							this.getServerPort();
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
					}).catch( (error) => {
						this.$message.error(error);
					});
	      }).catch(() => {});
			}
		},
		
		//-------------------------------------------------------------------------------------服务器数据库
		/* 
			GET  查询--根据服务器id查询服务器数据库列表
		*/
		getServerDatabases(){
			this.loading_databases = true;
			this.axios.get(`${this.common.basePath}/sql`,this._databasesParams()).then( (response) => {
				if(response.data.meta.code === 0){
					if(JSON.stringify(response.data.data.rows)=='[]'){
						this.serverDatabases = null;//服务器---数据库
					}else{
						this.serverDatabases = response.data.data.rows;//服务器---数据库
					}
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
				this.loading_databases = false;
			}).catch( (error) => {
				this.$message.error(error);
				this.loading_databases = false;
			});
		},
		_databasesParams(){
			return {
				params: {
					server_id:this.activeIndex?this.activeIndex:null,
				}
			}
		},
		/* 
			GET  查询--根据服务器数据库id查询服务器数据库详情
		*/
		getServerDatabasesDetail(id){
			this.loading_databases_detail = true;
			this.axios.get(`${this.common.basePath}/sql/${id}`,{params:{}}).then( (response) => {
				if(response.data.meta.code === 0){
					if(JSON.stringify(response.data.data)=='[]'){
						this.serverDatabasesDetail = null;//服务器---数据库详情
					}else{
						this.serverDatabasesDetail = response.data.data;//服务器---数据库详情
					}
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
				this.loading_databases_detail = false;
			}).catch( (error) => {
				this.$message.error(error);
				this.loading_databases_detail = false;
			});
		},
		/* 
			GET  查询--根据服务器数据库id查询数据库列表
		*/
		getServerDatabasesList(id){
			this.loading_databases_detail = true;
			this.axios.get(`${this.common.basePath}/database`,{params:{dbserver_id:id,}}).then( (response) => {
				if(response.data.meta.code === 0){
					if(JSON.stringify(response.data.data.rows)=='[]'){
						this.serverDatabasesList = null;//数据库
					}else{
						this.serverDatabasesList = response.data.data.rows;//数据库
					}
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
				this.loading_databases_detail = false;
			}).catch( (error) => {
				this.$message.error(error);
				this.loading_databases_detail = false;
			});
		},
		/* 
			展示数据库详情
		*/
		showDataDetail(id){//数据库
			this.getServerDatabasesDetail(id);
			this.getServerDatabasesList(id);
			this.isShowDataDetail = true;
		},
		/* 
			添加数据库配置
		 */
		//数据库详情处添加
		addDataBases(type,id){
			this.addTypeDialog= type;
			this.addDataBasesId  = id;
			this.addDialogVisible= true;

			//清空数据
			if(this.$refs['addForm']){
				this.$refs['addForm'].resetFields();
			}
		},
		addDataBases_(){
			let addForm = {
				deploy_id:null,
				dbserver_id:this.addDataBasesId,
				name:this.addForm.name,
				purpose:this.addForm.purpose,
				creat_sql:this.addForm.creat_sql,
			};
			this.axios.post(`${this.common.basePath}/database`,addForm).then( (response) => {
				if(response.data.meta.code === 0){
					this.$message.success("添加成功！！", 20);
					this.getServerDatabasesList(this.addDataBasesId);
					this.addDialogVisible = false;
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
			}).catch( (error) => {
				this.$message.error(error);
			});
		},
		//数据库列表处添加
		addDataBasesOne(type,id){
			
			this.addTypeDialog= type;
			// this.addDataBasesId  = id;
			this.addDialogVisible= true;

			//清空数据
			if(this.$refs['addForm']){
				this.$refs['addForm'].resetFields();
			}
		},
		addDataBasesOne_(){
			let addForm = {
				account:this.addForm.account,
				password:this.addForm.password,
				parameters:this.addForm.parameters,
				name:this.addForm.databasers_list_name,
				description:this.addForm.databses_list_description,
			  port_code:this.addForm.port_code,
			  server_id:this.activeIndex,
			};
			this.axios.post(`${this.common.basePath}/sql`,addForm).then( (response) => {
				if(response.data.meta.code === 0){
					this.$message.success("添加成功！！", 20);
					this.getServerDatabases();
					this.addDialogVisible = false;
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
			}).catch( (error) => {
				this.$message.error(error);
			});
		},
		/*
			编辑数据库
		 */
		//数据库详情处编辑
		editDataBases_(){
			let editForm = {
				deploy_id:null,
				dbserver_id:this.addDataBasesId,
				name:this.addForm.name,
				purpose:this.addForm.purpose,
				creat_sql:this.addForm.creat_sql,
			};
			this.axios.patch(`${this.common.basePath}/database/${this.editId}`,editForm).then( (response) => {
				if(response.data.meta.code === 0){
					this.$message.success("编辑成功！！", 20);
					this.getServerDatabasesList(this.refushId);
					this.addDialogVisible = false;
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
			}).catch( (error) => {
				this.$message.error(error);
			});
		},
		//数据库列表处编辑
		editDataBasesOne_(){
			let editForm = {
				account:this.addForm.account,
				password:this.addForm.password,
				parameters:this.addForm.parameters,
				name:this.addForm.databasers_list_name,
				description:this.addForm.databses_list_description,
			  port_code:this.addForm.port_code,
			  server_id:this.activeIndex,
			};
			this.axios.patch(`${this.common.basePath}/sql/${this.editId}`,editForm).then( (response) => {
				if(response.data.meta.code === 0){
					this.$message.success("编辑成功！！", 20);
					this.getServerDatabases();
					this.addDialogVisible = false;
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
			}).catch( (error) => {
				this.$message.error(error);
			});
		},
		
		
		//-------------------------------------------------------------------------------------服务器端口
		/* 
			GET  查询--根据服务器id查询服务器端口
		*/
		getServerPort(){
			this.loading_port = true;
			this.axios.get(`${this.common.basePath}/port`,this._portParams()).then( (response) => {
				if(response.data.meta.code === 0){
					if(JSON.stringify(response.data.data.rows)=='[]'){
						this.serverPort = null;//服务器---端口
					}else{
						this.serverPort = response.data.data.rows;//服务器---端口
					}
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
				this.loading_port = false;
			}).catch( (error) => {
				this.$message.error(error);
				this.loading_port = false;
			});
		},
		_portParams(){
			return {
				params: {
					server_id:this.activeIndex?this.activeIndex:null,
				}
			}
		},
		/* 
			添加端口配置
		 */
		//端口列表处添加
		addPortOne(type,id){
			
			this.addTypeDialog= type;
			// this.addDataBasesId  = id;
			this.addDialogVisible= true;

			//清空数据
			if(this.$refs['addForm']){
				this.$refs['addForm'].resetFields();
			}
		},
		addPortOne_(){
			let addForm = {
			  occupy_title:this.addForm.occupy_title,
			  port:Number(this.addForm.port),
			  server_id:this.activeIndex,
			};
			this.axios.post(`${this.common.basePath}/port`,addForm).then( (response) => {
				if(response.data.meta.code === 0){
					this.$message.success("添加成功！！", 20);
					this.getServerPort();
					this.addDialogVisible = false;
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
			}).catch( (error) => {
				this.$message.error(error);
			});
		},
		/*
			编辑端口
		 */
		//端口列表处编辑
		editPortOne_(){
			let editForm = {
			  occupy_title:this.addForm.occupy_title,
			  port:Number(this.addForm.port),
			  server_id:this.activeIndex,
			};
			this.axios.patch(`${this.common.basePath}/port/${this.editId}`,editForm).then( (response) => {
				if(response.data.meta.code === 0){
					this.$message.success("编辑成功！！", 20);
					this.getServerPort();
					this.addDialogVisible = false;
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
			}).catch( (error) => {
				this.$message.error(error);
			});
		},
		
		//-------------------------------------------------------------------------------------服务器ngnix
		/* 
			GET  查询--根据服务器id查询服务器nginx列表
		*/
		getServerNginx(){
			this.loading_ngnix = true;
			this.axios.get(`${this.common.basePath}/nginx_server`,this._nginxParams()).then( (response) => {
				if(response.data.meta.code === 0){
					if(JSON.stringify(response.data.data.rows)=='[]'){
						this.serverNginx = null;//服务器---nginx
					}else{
						this.serverNginx = response.data.data.rows;//服务器---nginx
					}
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
				this.loading_ngnix = false;
			}).catch( (error) => {
				this.$message.error(error);
				this.loading_ngnix = false;
			});
		},
		_nginxParams(){
			return {
				params: {
					server_id:this.activeIndex?this.activeIndex:null,
				}
			}
		},
		/* 
			GET  查询--根据服务器ngnix的id查询服务器ngnix详情
		*/
		getServerNgnixDetail(id){
			this.loading_ngnix_detail = true;
			this.axios.get(`${this.common.basePath}/nginx_server/${id}`,{params:{}}).then( (response) => {
				if(response.data.meta.code === 0){
					if(JSON.stringify(response.data.data)=='[]'){
						this.serverNgnixDetail = null;//服务器---Ngnix详情
					}else{
						this.serverNgnixDetail = response.data.data;//服务器---Ngnix详情
					}
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
				this.loading_ngnix_detail = false;
			}).catch( (error) => {
				this.$message.error(error);
				this.loading_ngnix_detail = false;
			});
		},
		/* 
			GET  查询--根据服务器ngnix的id查询ngnix列表
		*/
		getServerNgnixList(id){
			this.loading_ngnix_detail = true;
			this.axios.get(`${this.common.basePath}/nginx_location`,{params:{n_server_id:id}}).then( (response) => {
				if(response.data.meta.code === 0){
					if(JSON.stringify(response.data.data.rows)=='[]'){
						this.serverNgnixList = null;//Ngnix
					}else{
						this.serverNgnixList = response.data.data.rows;//Ngnix
					}
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
				this.loading_ngnix_detail = false;
			}).catch( (error) => {
				this.$message.error(error);
				this.loading_ngnix_detail = false;
			});
		},
		/* 
			展示ngnix详情
		*/
		showNginxDetail(id){
			this.getServerNgnixDetail(id);
			this.getServerNgnixList(id);
			this.isShowNginxDetail = true;
		},
		/* 
			添加Ngnix配置
		*/
		//ngnix详情处
		addNgnix(type,id){
			
			this.addTypeDialog= type;
			this.addNgnixId  = id;
			this.addDialogVisible= true;

			//清空信息
			if(this.$refs['addForm']){
				this.$refs['addForm'].resetFields();
			}
		},
		addNgnix_(){
			let addForm = {
				n_server_id:this.addNgnixId,
				match:this.addForm.match,
				agent:this.addForm.agent,
				effect:this.addForm.effect,
			};
			this.axios.post(`${this.common.basePath}/nginx_location`,addForm).then( (response) => {
				if(response.data.meta.code === 0){
					this.$message.success("添加成功！！", 20);
					this.getServerNgnixList(this.addNgnixId);
					this.addDialogVisible = false;
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
			}).catch( (error) => {
				this.$message.error(error);
			});
		},
		//ngnix列表处
		addNgnixOne(type,id){
			this.addTypeDialog= type;
			this.addDialogVisible= true;
			
			//清空信息
			if(this.$refs['addForm']){
				this.$refs['addForm'].resetFields();
			}
		},
		addNgnixOne_(){
			let addForm = {
				description:this.addForm.ngnix_one_description,
				name:this.addForm.ngnix_one_name,
				server_id:this.activeIndex,
				config_code: this.addForm.config_code,
			  port_code:this.addForm.ngnix_port_code,
			};
			this.axios.post(`${this.common.basePath}/nginx_server`,addForm).then( (response) => {
				if(response.data.meta.code === 0){
					this.$message.success("添加成功！！", 20);
					this.getServerNginx();
					this.addDialogVisible = false;
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
			}).catch( (error) => {
				this.$message.error(error);
			});
		},
		/*
			编辑nginx
		 */
		//nginx详情处编辑
		editNgnix_(){
			let editForm = {
				n_server_id:this.addNgnixId,
				match:this.addForm.match,
				agent:this.addForm.agent,
				effect:this.addForm.effect,
			};
			this.axios.patch(`${this.common.basePath}/nginx_location/${this.editId}`,editForm).then( (response) => {
				if(response.data.meta.code === 0){
					this.$message.success("编辑成功！！", 20);
					this.getServerNgnixList(this.refushId);
					this.addDialogVisible = false;
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
			}).catch( (error) => {
				this.$message.error(error);
			});
		},
		//nginx列表处编辑
		editNgnixOne_(){
			let editForm = {
			  description:this.addForm.ngnix_one_description,
				name:this.addForm.ngnix_one_name,
				server_id:this.activeIndex,
				config_code: this.addForm.config_code,
			  port_code:this.addForm.ngnix_port_code,
			};
			this.axios.patch(`${this.common.basePath}/nginx_server/${this.editId}`,editForm).then( (response) => {
				if(response.data.meta.code === 0){
					this.$message.success("编辑成功！！", 20);
					this.getServerNginx();
					this.addDialogVisible = false;
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
			}).catch( (error) => {
				this.$message.error(error);
			});
		},
		
		//-------------------------------------------------------------------------------------服务器redis
		/* 
			GET  查询--根据服务器id查询服务器redis列表
		*/
		getServerRedis(){
			this.loading_redis = true;
			this.axios.get(`${this.common.basePath}/redis`,this._redisParams()).then( (response) => {
				if(response.data.meta.code === 0){
					if(JSON.stringify(response.data.data.rows)=='[]'){
						this.serverRedis = null;//服务器---redis
					}else{
						this.serverRedis = response.data.data.rows;//服务器---redis
					}
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
				this.loading_redis = false;
			}).catch( (error) => {
				this.$message.error(error);
				this.loading_redis = false;
			});
		},
		_redisParams(){
			return {
				params: {
					server_id:this.activeIndex?this.activeIndex:null,
				}
			}
		},
		/* 
			GET  查询--根据服务器redis的id查询服务器Redis详情
		*/
		getServerRedisDetail(id){
			this.loading_redis_detail = true;
			this.axios.get(`${this.common.basePath}/redis/${id}`,{params:{}}).then( (response) => {
				if(response.data.meta.code === 0){
					if(JSON.stringify(response.data.data)=='[]'){
						this.serverRedisDetail = null;//服务器---Redis详情
					}else{
						this.serverRedisDetail = response.data.data;//服务器---Redis详情
					}
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
				this.loading_redis_detail = false;
			}).catch( (error) => {
				this.$message.error(error);
				this.loading_redis_detail = false;
			});
		},
		/* 
			GET  查询--根据服务器redis的id查询服务器Redis列表
		*/
		getServerRedisList(id){
			this.loading_redis_detail = true;
			this.axios.get(`${this.common.basePath}/redis_index`,{params:{redis_id:id}}).then( (response) => {
				if(response.data.meta.code === 0){
					if(JSON.stringify(response.data.data.rows)=='[]'){
						this.serverRedisList = null;//Redis
					}else{
						this.serverRedisList = response.data.data.rows;//Redis
					}
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
				this.loading_redis_detail = false;
			}).catch( (error) => {
				this.$message.error(error);
				this.loading_redis_detail = false;
			});
		},
		/* 
			展示redis详情
		*/
		showRedisDetail(id){//redis
			this.getServerRedisDetail(id);
			this.getServerRedisList(id);
			this.isShowRedisDetail = true;
		},
		/* 
			添加Redis配置
		*/
		//redis详情处
		addRedis(type,id){
			
			this.addTypeDialog= type;
			this.addRedisId  = id;
			this.addDialogVisible= true;

			//清空数据
			if(this.$refs['addForm']){
				this.$refs['addForm'].resetFields();
			}
		},
		addRedis_(){
			let addForm = {
				redis_id:this.addRedisId,
				index:Number(this.addForm.index),
				description:this.addForm.description,
			};
			this.axios.post(`${this.common.basePath}/redis_index`,addForm).then( (response) => {
				if(response.data.meta.code === 0){
					this.$message.success("添加成功！！", 20);
					this.getServerRedisList(this.addRedisId);
					this.addDialogVisible = false;
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
			}).catch( (error) => {
				this.$message.error(error);
			});
		},
		//redis列表处
		addRedisOne(type,id){
			
			this.addTypeDialog= type;
			// this.addRedisId  = id;
			this.addDialogVisible= true;

			//清空数据
			if(this.$refs['addForm']){
				this.$refs['addForm'].resetFields();
			}
		},
		addRedisOne_(){
			let addForm = {
				parameters:this.addForm.redis_list_parameters,
				name:this.addForm.redis_list_name,
				description:this.addForm.redis_list_description,
				port_code:this.addForm.redis_port_code,
				server_id:this.activeIndex,
			};
			this.axios.post(`${this.common.basePath}/redis`,addForm).then( (response) => {
				if(response.data.meta.code === 0){
					this.$message.success("添加成功！！", 20);
					this.getServerRedis();
					this.addDialogVisible = false;
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
			}).catch( (error) => {
				this.$message.error(error);
			});
		},
		/*
			编辑redis
		 */
		//redis详情处编辑
		editRedis_(){
			let editForm = {
				redis_id:this.addRedisId,
				index:Number(this.addForm.index),
				description:this.addForm.description,
			};
			this.axios.patch(`${this.common.basePath}/redis_index/${this.editId}`,editForm).then( (response) => {
				if(response.data.meta.code === 0){
					this.$message.success("编辑成功！！", 20);
					this.getServerRedisList(this.refushId);
					this.addDialogVisible = false;
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
			}).catch( (error) => {
				this.$message.error(error);
			});
		},
		//redis列表处编辑
		editRedisOne_(){
			let editForm = {
			  parameters:this.addForm.redis_list_parameters,
				name:this.addForm.redis_list_name,
				description:this.addForm.redis_list_description,
				port_code:this.addForm.redis_port_code,
				server_id:this.activeIndex,
			};
			this.axios.patch(`${this.common.basePath}/redis/${this.editId}`,editForm).then( (response) => {
				if(response.data.meta.code === 0){
					this.$message.success("编辑成功！！", 20);
					this.getServerRedis();
					this.addDialogVisible = false;
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
			}).catch( (error) => {
				this.$message.error(error);
			});
		},
		
		//-------------------------------------------------------------------------------------服务器新建
		/* 
			新建按钮
		*/
		builtServer(){
			this.resetForm("serverForm");//清空信息
			this.isShowBuilt = !this.isShowBuilt;
			this.icon = this.icon == 'el-icon-plus'?'el-icon-back':'el-icon-plus';
			this.buildText = this.buildText == '新建服务器'?'返回':'新建服务器';
			this.buildText == '返回'?document.getElementById("btn-box_").style.cssFloat = 'right':document.getElementById("btn-box_").style.cssFloat = 'left';
			this.selectBox = !this.selectBox;
		},
		/* 
			取消按钮
		*/
		cancel(){
			this.isShowBuilt = false;
			this.icon = 'el-icon-plus';
			this.buildText = '新建服务器';
			document.getElementById("btn-box_").style.cssFloat = 'left'
			this.selectBox = true;
		},
		/* 
			POST 新建服务器
		*/
		addServer(){
			this.axios.post(`${this.common.basePath}/server`,this.serverForm).then( (response) => {
				if(response.data.meta.code === 0){
					this.$message.success("新建服务器成功！！", 20);

					this.isShowBuilt = false;
					this.icon = 'el-icon-plus';
					this.buildText = '新建服务器';
					document.getElementById("btn-box_").style.cssFloat = 'left'
					this.selectBox = true;

					this.getServerList();
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
			}).catch( (error) => {
				this.$message.error(error);
			});
		},
		/* 
		立即创建
		*/
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.addServer();
				} else {
					this.$message.error('新建服务器的信息未填写完整！！！', 20); 
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
		
	},
	mounted(){ 
		/* 
		处理tabTwoPages
		*/
		let serverPages = [];
		for(var i = 0;i<this.tabTwoPages.length;i++){
			if(this.tabTwoPages[i].split("_")[0]=="server"){
				serverPages.push(this.tabTwoPages[i])
			}
		}
		this.serverPages = serverPages;
		this.activeName = serverPages[0];
		/* 
			GET  查询--查询服务器列表
		*/
		this.getServerList();
	},
	data(){
		return {
			loading:false,//服务器-列表加载
			loading_edit:false,//编辑弹框-加载
			loading_detail:false,//服务器-详情加载
			loading_databases:false,//服务器-数据库加载
			loading_databases_detail:false,//服务器-数据库-详情加载
			loading_redis:false,//服务器-redis加载
			loading_redis_detail:false,//服务器-redis-详情加载
			loading_port:false,//服务器-端口加载
			loading_ngnix:false,//服务器-ngnix加载
			loading_ngnix_detail:false,//服务器-ngnix-详情加载
			tempAtId:null,//当前浮动选中的节点Id
			serverPages:[],//服务器的二级页面数组
			activeName:null,
			activeIndex:null,//初始服务器id
			servertList:null,//服务器列表
			defaultServer:null,//默认服务器
			
			serverDetail:null,//服务器---详情
			serverPort:null,//服务器---端口
			serverDatabases:null,//服务器---数据库
			serverDatabasesDetail:null,//服务器---数据库详情
			serverDatabasesList:null,//数据库
			serverNginx:null,//服务器---nginx
			serverNgnixDetail:null,//服务器---Ngnix详情
			serverNgnixList:null,//Ngnix
			serverRedis:null,//服务器---redis
			serverRedisDetail:null,//服务器---redis详情
			serverRedisList:null,//Redis
			
			editDetailDialogVisible:false,//编辑服务器弹框
			selectBox:true,
			icon:'el-icon-plus',
			buildText:'新建服务器',
			serverForm:{//新建服务器表单
				name:null,
				configure: null,
				position: null,
				ser_ip: null,
				ser_number: null,
				sys_version: null,
			},
			rules:{
				name: [
					{ required: true, message: '请输入服务器名称', trigger: 'blur' },
				],
				ser_ip: [
					{ required: true, message: '请输入服务器IP地址', trigger: 'blur' },
					{	pattern: /^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/, message: 'IP不符合要求' },
				],
				position: [
					{ required: true, message: '请输入服务器位置', trigger: 'blur' },
					{ min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
				],
				ser_number: [
					{ required: true, message: '请输入服务器编号', trigger: 'blur' },
					{ min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' },
					{	pattern: /^[A-Za-z0-9]+$/, message: '服务器编号只能由英文和数字组成' }
				],
				sys_version: [
					{ required: true, message: '请输入系统版本号', trigger: 'blur' },
					{ min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' },
				],
				configure: [
					{ required: true, message: '请输入服务器硬件配置描述', trigger: 'blur' },
					{ min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },
				],
			},
			
			isShowBuilt:false,//新建服务器
			isShowNginxDetail:false,//nginx详情
			isShowRedisDetail:false,//redis详情
			isShowDataDetail:false,//数据库详情
			
			//添加弹框
			editId:null,//编辑id
			refushId:null,//查询刷新的id
			addTitleArr:[
				'添加数据库配置',//0
				'添加redis配置',//1
				'添加nginx配置',//2
				'添加nginx服务器配置',//3
				'添加nginx二级配置',//4
				'添加数据库服务器配置',//5
				'添加redis服务器配置',//6
				'添加端口服务器配置',//7
				'编辑数据库服务器配置',//8
				'编辑数据库配置',//9
				'编辑redis服务器配置',//10
				'编辑redis配置',//11
				'编辑ngnix服务器配置',//12
				'编辑ngnix配置',//13
				'编辑端口服务器配置',//14
			],
			addTypeDialog:null,
			addDialogVisible:false,
			addForm:{
				//数据库详情处
				name:null,
				purpose:null,
				creat_sql:null,
				databases_deploy_id:null,
				//redis详情处
				redis_deploy_id:null,
				index:null,
				description:null,
				//ngnix详情处
				match:null,
				agent:null,
				effect:null,
				//ngnix列表处
				config_code:null,
				ngnix_one_description:null,
				ngnix_one_name:null,
				ngnix_port_code:null,
				//数据库列表处
				account:null,
				password:null,
				parameters:null,
				databasers_list_name:null,
				databses_list_description:null,
				port_code:null,
				//redis列表处
				redis_list_parameters:null,
				redis_list_description:null,
				redis_list_name:null,
				redis_port_code:null,
				//端口列表处
				occupy_title:null,
				port:null,
			},
			addDataBasesId:null,
			addRedisId:null,
			addNgnixId:null,//三级
			
		}
	},
};
</script> 