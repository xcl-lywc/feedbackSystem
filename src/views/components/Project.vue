<!-- 
	产品
 -->

<template>
  <div>
		<div class="container-box-block">
			
		<!-- 产品菜单与新建按钮 -->
		<div class="project-menu">
			<div class="fl" v-if="selectBox">
				<el-select v-model="defaultProject" filterable placeholder="请选择产品" @change="handleSelect($event)" size="">
			    <el-option
			    	v-if="projectList"
			      v-for="(item,index) in projectList"
			      :key="item.id"
			      :label="item.project"
			      :value="item.id">
			      <div @mouseover=" tempAtId = item.id " @mouseout="tempAtId = null" style="position:relative;">
			      	<span slot="title">{{item.project}}</span>
			      	<el-button v-if="tempAtId == item.id" type="danger" icon="el-icon-delete" circle class="close-icon-css_" size="mini" @click.stop="delProject(item.project,item.id)"></el-button>
						</div>
			    </el-option>
			  </el-select>
			</div>
		  <!-- 新建项目按钮 -->
			<div class="fl marr10" id="btn-box">
				<el-button type="primary" :icon="icon" size="" @click="builtProject">{{buildText}}</el-button>
			</div>
		</div>

		<el-row class="project-container">
			<el-col :span="24">
				<!-- 新建产品 -->
				<div class="right-tabs-box" v-show="isShowBuilt">
					<div class="new-box tabs-cotent-box">
						<div class="box-title">新建产品</div>
						<el-form ref="projectForm" :model="projectForm" :rules="rules">
							<el-row :gutter="20" class="top-content">
								<el-col :span="4" :offset="1" class="picture-box">
									<el-form-item prop="pci">
										<el-upload
											class="avatar-uploader"
											:action="`${common.basePath}/file/uplode`"
											:show-file-list="false"
											:auto-upload="true"
											multiple
											:limit="9999"
											:before-upload="beforeAvatarUpload"
											:http-request="uploadFile_">
											<img v-if="imageUrl" :src="common.basePicPath+''+imageUrl" class="avatar">
											<i v-else class="el-icon-plus avatar-uploader-icon"></i>
										</el-upload>
									</el-form-item>
								</el-col>
								<el-col :span="18" :offset="1">
									<el-form-item label="产品名称：" prop="project" label-width="120px">
										<el-input v-model="projectForm.project"></el-input>
									</el-form-item>
									<el-form-item label="产品编号：" prop="pronumber" label-width="120px">
										<el-input v-model="projectForm.pronumber"></el-input>
									</el-form-item>
									<el-form-item label="负责人：" prop="present" label-width="120px">
										<el-input v-model="projectForm.present"></el-input>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row class="middle-content">
								<el-form-item label="产品简介：" prop="description">
									<el-input type="textarea" v-model="projectForm.description" :rows="5"></el-input>
								</el-form-item>
							</el-row>
						</el-form>
						<el-row class="bottom-content">
							<el-button type="primary" @click="submitForm('projectForm')">立即创建</el-button>
							<el-button @click="resetForm('projectForm')">重 置</el-button>
							<el-button @click="cancel">取 消</el-button>
						</el-row>
					</div>
				</div>
				<!-- tabs-详情、功能列表、说明书、反馈 、实施/部署 -->
				<div class="right-tabs-box" v-show="!isShowBuilt">
					<el-tabs tab-position="right" v-model="activeName" @tab-click="handleClick" v-if="projectPages" type="">
						<el-tab-pane
							:key="item"
							v-for="(item, index) in projectPages"
							:label="common.convertPageName(item)"
							:name="item"
						>
							<!-- 详情 -->
							<div ref="project-detail" v-if="item=='project_detail'" class="detail-box tabs-cotent-box" v-loading="loading_detail">
								<div class="box-title">
									<p>产品详情</p>
									<el-button v-if='projectDetail' size="small" class="mart10" type="primary" icon="el-icon-edit"  @click="editDetail">编辑</el-button>
								</div>
								<div class="text-center-middle" v-if="projectDetail==null">暂无数据</div>
								<el-row :gutter="20" class="top-content" v-if="projectDetail">
									<el-col :span="4" :offset="1" class="picture-box">
										<!-- <img src="../../assets/img/01.png" alt="图片" class="picture"> -->
										<img :src="common.basePicPath+''+projectDetail.pci" alt="图片" class="picture">
									</el-col>
									<el-col :span="18" :offset="1">
										<el-form ref="form" :model="projectDetail" label-width="100px">
											<el-form-item label="产品名称：">
												<span>{{projectDetail.project}}</span>
											</el-form-item>
											<el-form-item label="产品编号：">
												<span>{{projectDetail.pronumber}}</span>
											</el-form-item>
											<el-form-item label="负责人：">
												<span>{{projectDetail.present}}</span>
											</el-form-item>
										</el-form>
									</el-col>
								</el-row>
								<el-row class="bottom-content" v-if="projectDetail">
									<el-form ref="form" :model="projectDetail" label-width="100px">
										<el-form-item label="产品简介：">
											<span class="line-feed">{{projectDetail.description}}</span>
										</el-form-item>
									</el-form>
								</el-row>
							</div>
							<!-- 功能列表 -->
							<div ref="project-function" v-if="item=='project_function'" class="function-box tabs-cotent-box" v-loading="loading_function">
								<div class="box-title">
									<p>功能列表</p>
									<el-button size="small" class="mart10" type="primary" icon="el-icon-circle-plus" @click="addFunction_(3,'123')">添加</el-button>
								</div>
								<el-tree
									:data="projectFunctionList"
									:props="defaultFunctionProps"
									node-key="id"
									accordion
									class="tree-box">
									<!-- <span class="custom-tree-node" slot-scope="{ node, data }">
										<span>
											<i :class="node.icon"></i>{{node.label}}
										</span>              
									</span> -->
									<span class="custom-tree-node my_custom-tree-node" slot-scope="{ node, data }" @mouseover=" tempAtId = data.id " @mouseout="tempAtId = null">
										<!-- <span>
											<i :class="node.icon"></i>
											{{node.label}}
										</span> -->
										<el-popover
										  placement="right-start"
										  :title="data.name"
										  width="600"
										  trigger="hover"
										  popper-class='functionCard'>
										  <el-form ref="functionHoverForm" label-width="100px" class="functionHoverForm">
												<el-form-item label="功能名称：">
													<span>{{data.name}}</span>
												</el-form-item>
												<el-form-item label="前台负责人：">
													<span>{{data.front_person}}</span>
												</el-form-item>
												<el-form-item label="后台负责人：">
													<span>{{data.after_person}}</span>
												</el-form-item>
												<el-form-item label="描述：">
													<span>{{data.describe}}</span>
												</el-form-item>
												<el-form-item label="备注：">
													<span v-if="data.remarks">{{data.remarks}}</span>
													<span v-else>暂无备注</span>
												</el-form-item>
												<el-form-item label="操作：">
													<el-button
														type="primary"
														size="mini"
														@click="addFunction(0,data)">
														添加子功能
													</el-button>
													<el-button
														type="success"
														size="mini"
														@click="editFunction(1,data)">
														编辑
													</el-button>
													<el-button
														type="danger"
														size="mini"
														@click="delFunction(2,data)">
														删除
													</el-button>
													<el-button
														type="info"
														size="mini"
														@click="viewInfo(data)">
														查看反馈信息
													</el-button>
												</el-form-item>  
											</el-form>
											 <div slot="reference" style="width:100%">{{node.label}}</div>
										</el-popover>
										<!-- <span v-if="tempAtId == data.id" class="tree-right-operate">
											<el-button
												type="primary"
												size="mini"
												@click="addFunction(0,data)">
												添加子功能
											</el-button>
											<el-button
												type="success"
												size="mini"
												@click="editFunction(1,data)">
												编辑
											</el-button>
											<el-button
												type="danger"
												size="mini"
												@click="delFunction(2,data)">
												删除
											</el-button>
											<el-button
												type="info"
												size="mini"
												@click="viewInfo(data)">
												查看反馈信息
											</el-button>
										</span> -->
									</span>
								</el-tree>
							</div>
							<!-- 说明书 -->
							<div ref="project-instructions" v-if="item=='project_instructions'" class="instructions-box tabs-cotent-box">
								<div class="box-title">
									<p>说明书</p>
									<el-button v-if='preview' size="small" class="mart10" type="primary" icon="el-icon-edit"  @click="editInstructions">编辑</el-button>
									<el-button v-if='edit' size="small" class="mart10" type="primary" icon="el-icon-view"  @click="previewInstructions">预览</el-button>
								</div>
								<!-- 预览状态下的markdown -->
								<div id="editormd2" v-if="preview">
									<mavon-editor ref="md_" :toolbarsFlag="false" :subfield="false" defaultOpen="preview" v-model="value" :navigation="navigation" style="height:100vh;"/>
								</div>
								<!-- 预览和编辑状态下的markdown -->
								<div id="editormd1" v-if="edit">
									<mavon-editor ref="md" v-model="value" @imgAdd="$imgAdd" :navigation="navigation" style="height:59vh;" @save="save"/>
								</div>
							</div>
							<!-- 反馈 -->
							<div ref="project-feedback" v-if="item=='project_feedback'" class="feedback-box tabs-cotent-box" v-loading="loading_feedback">
								<div>
									<div class="box-title">反馈信息</div>
									<div>
										<el-form :inline="true" :model="formInline" class="demo-form-inline">
											<el-form-item label="状态：" class="fl">
												<el-select v-model="formInline.state" clearable placeholder="请选择" @change="someItemChange">
													<el-option label="新问题" value="1"></el-option>
													<el-option label="待解决" value="10"></el-option>
													<el-option label="已解决" value="0"></el-option>
													<el-option label="已丢弃" value="20"></el-option>
												</el-select>
											</el-form-item>
											<el-form-item label="产生时间：" class="fr">
												<el-date-picker
													v-model="formInline.date"
													type="daterange"
													align="right"
													unlink-panels
													range-separator="至"
													start-placeholder="开始日期"
													end-placeholder="结束日期"
													:picker-options="pickerOptions"
													@change="changeDate">
												</el-date-picker>
											</el-form-item>
										</el-form>
									</div>
									<div style="overflow: hidden;margin-bottom: 15px;border-bottom: 1px solid #dbd7d7;padding-bottom: 10px;">
										<el-button icon="el-icon-circle-plus" type="primary" size="small" @click="buildFeedBackInfo" class="marr10">新建反馈</el-button>
									</div>
								</div>
								<div class="tabs-cotent-box tabs-cotent-box_">
									<div class="text-center-middle" v-if="projectFeedbackDetail==null">暂无数据</div>
									<el-row :gutter="20">
										<div v-if="projectFeedbackDetail" v-for="item in projectFeedbackDetail">
											<el-col :span="6">
												<div class="feedback-content-item" style="position:relative;">
													<div class="fl img" v-if="item.enclosure">
														<img :src="common.basePicPath+''+item.enclosure" alt="" v-if="item.enclosure.split('')[0]=='/'"/>
														<img src="../../assets/img/feedback.jpg" alt="" v-if="item.enclosure.split('')[0]=='1'"/>
													</div>
													<div class="fl img" v-else>
														<img src="../../assets/img/feedback.jpg" alt=""/>
													</div>
													<div class="fl btns" v-if="item.cur_status==1"><!-- 新问题 -->
														<p><el-button type="" size="small" @click='goToSolved("10",item.id)'>去解决</el-button></p>
														<p><el-button type="" size="small" @click='discarding("20",item.id)'>&nbsp;丢&nbsp;&nbsp;弃&nbsp;</el-button></p>
														<p><el-button type="" size="small" @click='solved("0",item.id)'>&nbsp;解&nbsp;&nbsp;决&nbsp;</el-button></p>
													</div>
													<div class="fl btns" v-if="item.cur_status==0"><!-- 已解决 -->
														<p><el-button type="info" size="small" @click='' disabled>已解决</el-button></p>
													</div>
													<div class="fl btns" v-if="item.cur_status==10"><!-- 待解决 -->
														<p><el-button type="" size="small" @click='discarding("20",item.id)'>丢 弃</el-button></p>
														<p><el-button type="" size="small" @click='solved("0",item.id)'>解 决</el-button></p>
													</div>
													<div class="fl btns" v-if="item.cur_status==20"><!-- 已丢弃 -->
														<p><el-button type="info" size="small" @click='' disabled>已丢弃</el-button></p>
													</div>
													<div class="clearfix"></div>
													<el-form ref="form" label-width="100px" label-position="">
														<el-form-item label="标题：">
															<span>{{item.title}}</span>
														</el-form-item>
														<el-form-item label="出错位置：">
															<div v-if="item.functionName" class="error-box">
																<span v-for="items in item.functionName">{{items+" "}}&nbsp;</span>
															</div>
														</el-form-item>
														<el-form-item label="问题描述：">
															<!-- <span class="line-feed">{{item.detailed}}</span> -->
															<el-input type="textarea" v-model="item.detailed" rows="3" disabled></el-input>
														</el-form-item>
													</el-form>
												</div>
											</el-col>
										</div>
									</el-row>
									<div class="fr" v-if="projectFeedbackDetail!=null&&feedbackInfoTotall>=10">
										<el-pagination @size-change="handleSizeChange($event)" @current-change="handleCurrentChange($event)"
											:current-page="elementPageData.pageNum"
											:page-sizes="elementPageData.defaultData.pageSizes_"
											:page-size="elementPageData.defaultData.pageSizeDefault_"
											background
											small
											layout="total, sizes, prev, pager, next, jumper"
											:total="feedbackInfoTotall">
										</el-pagination>
									</div>
								</div>
							</div>
							<!-- 部署 -->
							<div ref="project-deploy" v-if="item=='project_deploy'" class="deploy-box tabs-cotent-box" v-loading="loading_deploy">
								<div class="box-title" v-show="!isShowDetail">
									<p>部署列表</p>
									<el-button size="small" class="mart10" type="primary" icon="el-icon-circle-plus" @click="addDeploy(5,item)">添加</el-button>
								</div>
								<!-- 部署列表 -->
								<el-row :gutter="20" v-show="!isShowDetail">
									<div v-if="projectDeployList" v-for="item in projectDeployList" >
										<el-col :span="6">
											<div class="deploy-content-item" @click="showDetail(item.id)" style="position: relative;">
												<el-form ref="form" label-width="100px" label-position="">
													<i class="el-icon-delete delete-btn-position" @click.stop="delDeploy(item.id,'deploy','')"></i>
													<i class="el-icon-edit edit-btn-position" @click.stop="editDeploy(item,6,'')"></i>
													<div class="fl images"><img src="../../assets/img/deploy.jpg" alt=""></div>
													<div class="fl why">
														<el-form-item label="部署描述："></el-form-item>
														<el-form-item label-width="0px">
															<el-input type="textarea" v-model="item.describe" rows="3" disabled style="margin-top: 0px;min-height: 80px"></el-input>
														</el-form-item>
													</div>
													<div class="clearfix"></div>
													<el-form-item label="自定义配置：" class="mart10">
														<span>{{item.custom}}</span>
													</el-form-item>
													<el-form-item label="关键词：">
														<span>{{item.keyt}}</span>
													</el-form-item>
													<el-form-item label="位置：">
														<span>{{item.position}}</span>
													</el-form-item>
													<el-form-item label="结构描述：">
														<!-- <span class="line-feed">{{item.structure}}</span> -->
														<el-input type="textarea" v-model="item.structure" rows="3" disabled></el-input>
													</el-form-item>
													<div class="h40"></div>
												</el-form>
											</div>
										</el-col>
									</div>
								</el-row>
								<div class="text-center-middle" v-if="projectDeployList==null">暂无数据</div>
								<!-- 部署详情 -->
								<el-row class="detail" v-show="isShowDetail">
									<el-breadcrumb separator-class="el-icon-arrow-right" class="box-title">
										<el-breadcrumb-item :to="{ path: '/home' }">
											<span @click="isShowDetail=false">部署列表</span>
										</el-breadcrumb-item>
										<el-breadcrumb-item>详情</el-breadcrumb-item>
									</el-breadcrumb>
									<div v-if="projectDeployDetail">
										<!-- 部署原因 -->
										<el-row class="deployment-why">
											<el-form>
												<el-form-item label="部署描述："  class="deployment-why-title" label-width="120px">
													<span class="line-feed">{{projectDeployDetail.describe?projectDeployDetail.describe:'暂无数据'}}</span>
												</el-form-item>
												<el-form-item label="自定义配置："  class="deployment-why-title" label-width="120px">
													<span class="line-feed">{{projectDeployDetail.custom?projectDeployDetail.custom:'暂无数据'}}	</span>
												</el-form-item>
											</el-form>
										</el-row>
										<!-- 数据库 -->
										<el-row>
											<div class="detail-title">
												<span class="fl">数据库</span>
												<i class="el-icon-circle-plus-outline fr pointer" @click="addDatabasesDetail(0,projectDeployDetail)"></i>
											</div>
											<div class="text-center-middle" v-if="projectDeployDatabasesList==null">暂无数据</div>
											<el-row :gutter="20">
												<div v-if="projectDeployDatabasesList" v-for="itemChild in projectDeployDatabasesList">
													<el-col :span="6">
														<el-form class="detail-item-box" style="position: relative;">
															<i class="el-icon-delete delete-btn-position" @click.stop="delDeploy(itemChild.id,'deploy_database',projectDeployDetail.id)"></i>
															<i class="el-icon-edit edit-btn-position" @click.stop="editDeploy(itemChild,7,projectDeployDetail.id)"></i>
															<el-form-item label="数据库：" label-width="90px">
																<span>{{itemChild.database_id}}</span>
															</el-form-item>
															<el-form-item label="说明：" label-width="90px">
																<!-- <span class="line-feed">{{itemChild.description}}</span> -->
																<el-input type="textarea" v-model="itemChild.description" rows="2" disabled></el-input>
															</el-form-item>
															<div class="h40"></div>
														</el-form>
													</el-col>
												</div>
											</el-row>
										</el-row>
										<!-- redis -->
										<el-row>
											<div class="detail-title">
												<span class="fl">redis</span>
												<i class="el-icon-circle-plus-outline fr pointer" @click="addRedisDetail(1,projectDeployDetail)"></i>
											</div>
											<div class="text-center-middle" v-if="projectDeployRedisList==null">暂无数据</div>
											<el-row :gutter="20">
												<div v-if="projectDeployRedisList" v-for="itemChild in projectDeployRedisList">
													<el-col :span="6">
														<el-form class="detail-item-box" style="position: relative;">
															<i class="el-icon-delete delete-btn-position" @click.stop="delDeploy(itemChild.id,'deploy_redis',projectDeployDetail.id)"></i>
															<i class="el-icon-edit edit-btn-position" @click.stop="editDeploy(itemChild,8,projectDeployDetail.id)"></i>
															<el-form-item label="redis：" label-width="90px">
																<span>{{itemChild.index_id}}</span>
															</el-form-item>
															<el-form-item label="说明：" label-width="90px">
																<!-- <span class="line-feed">{{itemChild.description}}</span> -->
																<el-input type="textarea" v-model="itemChild.description" rows="2" disabled></el-input>
															</el-form-item>
															<div class="h40"></div>
														</el-form>
													</el-col>
												</div>
											</el-row>
										</el-row>
										<!-- 端口号 -->
										<el-row>
											<div class="detail-title">
												<span class="fl">端口号</span>
												<i class="el-icon-circle-plus-outline fr pointer" @click="addPortDetail(2,projectDeployDetail)"></i>
											</div>
											<div class="text-center-middle" v-if="projectDeployPortList==null">暂无数据</div>
											<el-row :gutter="20">
												<div v-if="projectDeployPortList" v-for="itemChild in projectDeployPortList">
													<el-col :span="6">
														<el-form class="detail-item-box" style="position: relative;">
															<i class="el-icon-delete delete-btn-position" @click.stop="delDeploy(itemChild.id,'deploy_port',projectDeployDetail.id)"></i>
															<i class="el-icon-edit edit-btn-position" @click.stop="editDeploy(itemChild,10,projectDeployDetail.id)"></i>
															<el-form-item label="端口：" label-width="90px">
																<span>{{itemChild.port_id}}</span>
															</el-form-item>
															<el-form-item label="说明：" label-width="90px">
																<!-- <span class="line-feed">{{itemChild.description}}</span> -->
																<el-input type="textarea" v-model="itemChild.description" rows="2" disabled></el-input>
															</el-form-item>
															<div class="h40"></div>
														</el-form>
													</el-col>
												</div>
											</el-row>
										</el-row>
										<!-- nginx配置 -->
										<el-row>
											<div class="detail-title">
												<span class="fl">nginx配置</span>
												<i class="el-icon-circle-plus-outline fr pointer" @click="addNgnixDetail(3,projectDeployDetail)"></i>
											</div>
											<div class="text-center-middle" v-if="projectDeployNginxList==null">暂无数据</div>
											<el-row :gutter="20">
												<div v-if="projectDeployNginxList" v-for="itemChild in projectDeployNginxList">
													<el-col :span="6">
														<el-form class="detail-item-box" style="position: relative;">
															<i class="el-icon-delete delete-btn-position" @click.stop="delDeploy(itemChild.id,'deploy_nginx',projectDeployDetail.id)"></i>
															<i class="el-icon-edit edit-btn-position" @click.stop="editDeploy(itemChild,9,projectDeployDetail.id)"></i>
															<el-form-item label="nginx：" label-width="90px">
																<span>{{itemChild.location_id}}</span>
															</el-form-item>
															<el-form-item label="说明：" label-width="90px">
																<!-- <span class="line-feed">{{itemChild.description}}</span> -->
																<el-input type="textarea" v-model="itemChild.description" rows="2" disabled></el-input>
															</el-form-item>
															<div class="h40"></div>
														</el-form>
													</el-col>
												</div>
											</el-row>
										</el-row>
										<!-- 自定义配置 -->
										<!-- <el-row>
											<div class="detail-title">
												<span class="fl">自定义配置</span>
												<i class="el-icon-circle-plus-outline fr pointer" @click="addUserDefinedDetail(4,item)"></i>
											</div>
											<el-row class="user-defined-box"></el-row>
										</el-row> -->
									</div>
									<div class="text-center-middle" v-if="projectDeployDetail==null">暂无数据</div>
								</el-row>
							</div>
						</el-tab-pane>
					</el-tabs>
				</div>
			</el-col>
		</el-row>
		</div>
		<!-- 添加或者编辑功能树 -->
		<el-dialog
			:title="functionTitleArr[functionTypeDialog]"
			:visible.sync="functionDialogVisible"
			width="650px">
			<el-form :model="functionForm" ref="functionForm" label-width="150px" class="demo-dynamic" size="middle" v-loading="loading_edit">
				<div v-if='functionTypeDialog===0||functionTypeDialog===1'><!-- 添加子节点或编辑 -->
					<el-form-item
						prop="name"
						label="功能名称："
						:rules="[{ required: true, message: '请输入功能名称', trigger: 'blur' },]">
						<el-input v-model="functionForm.name"></el-input>
					</el-form-item>
					<el-form-item
						prop="front_person"
						label="前台负责人："
						:rules="[{ required: true, message: '请输入前台负责人', trigger: 'blur' },]">
						<el-input v-model="functionForm.front_person"></el-input>
					</el-form-item>
					<el-form-item
						prop="after_person"
						label="后台负责人："
						:rules="[{ required: true, message: '请输入后台负责人', trigger: 'blur' },]">
						<el-input v-model="functionForm.after_person"></el-input>
					</el-form-item>
					<el-form-item
						prop="describe"
						label="描述："
						:rules="[{ required: true, message: '请输入描述内容', trigger: 'blur' },{ min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
						<el-input type="textarea" v-model="functionForm.describe"></el-input>
					</el-form-item>
					<el-form-item
						prop="remarks"
						label="备注：">
						<el-input type="textarea" v-model="functionForm.remarks"></el-input>
					</el-form-item> 
				</div>
				<div v-if='functionTypeDialog===3'><!-- 添加根节点 -->
					<el-form-item
						prop="name"
						label="功能名称："
						:rules="[{ required: true, message: '请输入功能名称', trigger: 'blur' },]">
						<el-input v-model="functionForm.name"></el-input>
					</el-form-item>
					<el-form-item
						prop="front_person"
						label="前台负责人："
						:rules="[{ required: true, message: '请输入前台负责人', trigger: 'blur' },]">
						<el-input v-model="functionForm.front_person"></el-input>
					</el-form-item>
					<el-form-item
						prop="after_person"
						label="后台负责人："
						:rules="[{ required: true, message: '请输入后台负责人', trigger: 'blur' },]">
						<el-input v-model="functionForm.after_person"></el-input>
					</el-form-item>
					<el-form-item
						prop="describe"
						label="描述："
						:rules="[{ required: true, message: '请输入描述内容', trigger: 'blur' },{ min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
						<el-input type="textarea" v-model="functionForm.describe"></el-input>
					</el-form-item>
					<el-form-item
						prop="remarks"
						label="备注：">
						<el-input type="textarea" v-model="functionForm.remarks"></el-input>
					</el-form-item> 
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="functionDialogVisible = false">取 消</el-button>
				<el-button v-if="functionTypeDialog==0||functionTypeDialog==3" type="primary" @click="addSubmitForm('functionForm',functionTypeDialog)">添 加</el-button>
				<el-button v-if="functionTypeDialog==1" type="success" @click="editSubmitForm_('functionForm')">保 存</el-button>
			</span>
		</el-dialog>
		<!-- 添加部署信息 -->
		<el-dialog
			:title="deployTitleArr[deployIndexDialog]"
			:visible.sync="deployDialogVisible"
			width="60%">
			<el-form :model="deployForm" ref="deployForm" label-width="120px" class="demo-dynamic" size="middle">
				<!-- 数据库 -->
				<div v-if="deployIndexDialog===0||deployIndexDialog===7" v-loading="loading_add_deploy">
					<el-form-item
						v-if="isShowTextBox"
						prop="database_id"
						label="数据库：">
						<span>{{idConversionNameD+' '}}&nbsp;&nbsp;&nbsp;&nbsp;</span><el-button type="info" size="mini" @click="resetDeploy">重 选</el-button>
					</el-form-item>
					<el-form-item
						v-if="isShowSelectBox"
						prop="database_id"
						label="数据库："
						:rules="[{ required: true, message: '请选择数据库', trigger: 'blur' }]">
						<el-select v-model="deployForm.database_id__" placeholder="请选择server" v-if='oneSelect'>
					    <el-option
					      v-for="item in serverOptions"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id"
					      @click.native="changeOptions(item.id,'database')">
					    </el-option>
					  </el-select>
					  <el-select v-model="deployForm.database_id_" placeholder="请选择sql" v-if='twoSelect'>
					    <el-option
					      v-for="item in serverOptions_"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id"
					      @click.native="changeOptions_(item.id,'database')">
					    </el-option>
					  </el-select>
					  <el-select v-model="deployForm.database_id" placeholder="请选择database" v-if='threeSelect'>
					    <el-option
					      v-for="item in serverOptions__"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					  </el-select>
					</el-form-item>
					<el-form-item
						prop="description"
						label="说明："
						:rules="[{ required: true, message: '请输入说明内容', trigger: 'blur' },
						{ min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
						<el-input type="textarea" v-model="deployForm.description" rows="5"></el-input>
					</el-form-item>
				</div>
				
				<!-- redis -->
				<div v-if="deployIndexDialog===1||deployIndexDialog===8" v-loading="loading_add_deploy">
					<el-form-item
						v-if="isShowTextBox"
						prop="index_id"
						label="redis：">
						<span>{{idConversionNameR+' '}}&nbsp;&nbsp;&nbsp;&nbsp;</span><el-button type="info" size="mini" @click="resetDeploy">重 选</el-button>
					</el-form-item>
					<el-form-item
						v-if="isShowSelectBox"
						prop="index_id"
						label="redis："
						:rules="[{ required: true, message: '请选择redis', trigger: 'blur' }]">
						<el-select v-model="deployForm.index_id__" placeholder="请选择server" v-if='oneSelect'>
					    <el-option
					      v-for="item in serverOptions"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id"
					      @click.native="changeOptions(item.id,'redis')">
					    </el-option>
					  </el-select>
					  <el-select v-model="deployForm.index_id_" placeholder="请选择redis" v-if='twoSelect'>
					    <el-option
					      v-for="item in serverOptions_"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id"
					      @click.native="changeOptions_(item.id,'redis')">
					    </el-option>
					  </el-select>
					  <el-select v-model="deployForm.index_id" placeholder="请选择redis_index" v-if='threeSelect'>
					    <el-option
					      v-for="item in serverOptions__"
					      :key="item.id"
					      :label="item.index"
					      :value="item.id">
					    </el-option>
					  </el-select>
					</el-form-item>
					<el-form-item
						prop="description"
						label="说明："
						:rules="[{ required: true, message: '请输入说明内容', trigger: 'blur' },{ min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }]">
						<el-input type="textarea" v-model="deployForm.description" rows="5"></el-input>
					</el-form-item>
				</div>
				
				<!-- port -->
				<div v-if="deployIndexDialog===2||deployIndexDialog===10" v-loading="loading_add_deploy">
					<el-form-item
						v-if="isShowTextBox"
						prop="port_id"
						label="端口：">
						<span>{{idConversionNameP+' '}}&nbsp;&nbsp;&nbsp;&nbsp;</span><el-button type="info" size="mini" @click="resetDeploy">重 选</el-button>
					</el-form-item>
					<el-form-item
						v-if="isShowSelectBox"
						prop="port_id"
						label="端口："
						:rules="[{ required: true, message: '请选择端口', trigger: 'blur' }]">
						<el-select v-model="deployForm.port_id_" placeholder="请选择server" v-if='oneSelect'>
					    <el-option
					      v-for="item in serverOptions"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id"
					      @click.native="changeOptions(item.id,'port')">
					    </el-option>
					  </el-select>
					  <el-select v-model="deployForm.port_id" placeholder="请选择port" v-if='twoSelect'>
					    <el-option
					      v-for="item in serverOptions_"
					      :key="item.id"
					      :label="item.port"
					      :value="item.id">
					    </el-option>
					  </el-select>
					</el-form-item>
					<el-form-item
						prop="description"
						label="说明："
						:rules="[{ required: true, message: '请输入说明内容', trigger: 'blur' },{ min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }]">
						<el-input type="textarea" v-model="deployForm.description" rows="5"></el-input>
					</el-form-item>
				</div>
				
				<!-- nginx -->
				<div v-if="deployIndexDialog===3||deployIndexDialog===9" v-loading="loading_add_deploy">
					<el-form-item
						v-if="isShowTextBox"
						prop="location_id"
						label="nginx：">
						<span>{{idConversionNameN+' '}}&nbsp;&nbsp;&nbsp;&nbsp;</span><el-button type="info" size="mini" @click="resetDeploy">重 选</el-button>
					</el-form-item>
					<el-form-item
						v-if="isShowSelectBox"
						prop="location_id"
						label="nginx："
						:rules="[{ required: true, message: '请选择nginx', trigger: 'blur' }]">
						<el-select v-model="deployForm.location_id__" placeholder="请选择server" v-if='oneSelect'>
					    <el-option
					      v-for="item in serverOptions"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id"
					      @click.native="changeOptions(item.id,'nginx')">
					    </el-option>
					  </el-select>
					  <el-select v-model="deployForm.location_id_" placeholder="请选择nginx" v-if='twoSelect'>
					    <el-option
					      v-for="item in serverOptions_"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id"
					      @click.native="changeOptions_(item.id,'nginx')">
					    </el-option>
					  </el-select>
					  <el-select v-model="deployForm.location_id" placeholder="请选择nginx_location" v-if='threeSelect'>
					    <el-option
					      v-for="item in serverOptions__"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					  </el-select>
					</el-form-item>
					<el-form-item
						prop="description"
						label="说明："
						:rules="[{ required: true, message: '请输入说明内容', trigger: 'blur' },{ min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }]">
						<el-input type="textarea" v-model="deployForm.description" rows="5"></el-input>
					</el-form-item>
				</div>
				
				<!-- 自定义配置 -->
				<div v-if="deployIndexDialog===4" v-loading="loading_add_deploy">
					<el-form-item
						prop="custom"
						label="自定义配置："
						:rules="[{ required: true, message: '请输入内容', trigger: 'blur' },]">
						<el-input v-model="deployForm.custom"></el-input>
					</el-form-item>
					<el-form-item
						prop="describe"
						label="描述："
						:rules="[{ required: true, message: '请输入描述内容', trigger: 'blur' },{ min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }]">
						<el-input type="textarea" v-model="deployForm.describe"></el-input>
					</el-form-item>
					<el-form-item
						prop="keyt"
						label="关键词："
						:rules="[{ required: true, message: '请输入关键词', trigger: 'blur' },]">
						<el-input v-model="deployForm.keyt"></el-input>
					</el-form-item>
					<el-form-item
						prop="position"
						label="位置："
						:rules="[{ required: true, message: '请输入位置', trigger: 'blur' },]">
						<el-input v-model="deployForm.position"></el-input>
					</el-form-item>
					<el-form-item
						prop="structure"
						label="结构："
						:rules="[{ required: true, message: '请输入结构描述', trigger: 'blur' },]">
						<el-input type="textarea" v-model="deployForm.structure"></el-input>
					</el-form-item>
				</div>

				<!-- 产品部署 -->
				<div v-if="deployIndexDialog===5||deployIndexDialog===6" v-loading="loading_add_deploy">
					<el-form-item
						prop="custom"
						label="自定义配置："
						:rules="[{ required: true, message: '请输入内容', trigger: 'blur' },]">
						<el-input v-model="deployForm.custom"></el-input>
					</el-form-item>
					<el-form-item
						prop="describe"
						label="描述："
						:rules="[{ required: true, message: '请输入描述内容', trigger: 'blur' },{ min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }]">
						<el-input type="textarea" v-model="deployForm.describe"></el-input>
					</el-form-item>
					<el-form-item
						prop="keyt"
						label="关键词："
						:rules="[{ required: true, message: '请输入关键词', trigger: 'blur' },]">
						<el-input v-model="deployForm.keyt"></el-input>
					</el-form-item>
					<el-form-item
						prop="position"
						label="位置："
						:rules="[{ required: true, message: '请输入位置', trigger: 'blur' },]">
						<el-input v-model="deployForm.position"></el-input>
					</el-form-item>
					<el-form-item
						prop="structure"
						label="结构："
						:rules="[{ required: true, message: '请输入结构描述', trigger: 'blur' },]">
						<el-input type="textarea" v-model="deployForm.structure"></el-input>
					</el-form-item>
				</div>
			
			</el-form>
			<span slot="footer" class="dialog-footer" v-if="deployIndexDialog<6">
				<el-button @click="deployDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addDeployForm('deployForm',deployIndexDialog)">添 加</el-button>
			</span>
			<span slot="footer" class="dialog-footer" v-if="deployIndexDialog>=6">
				<el-button @click="deployDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editSubmitForm('deployForm',deployIndexDialog)">保 存</el-button>
			</span>
		</el-dialog>
		<!-- 新建反馈信息 -->
		<el-dialog
			title="新建反馈信息"
			:visible.sync="feedbackDialogVisible"
			width="60%"
			center>
			<div class="build-form">
				<el-row :gutter="20">
					<el-col :span="14">
						<div class="form-box">
							<el-form :model="buildForm" ref="buildForm" label-width="95px" class="demo-dynamic" size="middle">
								<el-form-item
									prop="deploy_id"
									label="部署："
									:rules="[{ required: true, message: '请选择该产品的部署', trigger: 'blur' },]">
									<!-- <el-input v-model="buildForm.deploy_id"></el-input> -->
									<el-select v-model="buildForm.deploy_id" placeholder="请选择该产品的部署">
								    <el-option
								      v-for="item in projectDeployList"
								      :key="item.id"
								      :label="item.id"
								      :value="item.id">
								    </el-option>
								  </el-select>
								</el-form-item>
								<el-form-item
									prop="name"
									label="标题："
									:rules="[{ required: true, message: '请输入标题', trigger: 'blur' },]">
									<el-input v-model="buildForm.name"></el-input>
								</el-form-item>
								<el-form-item
									prop="enclosure"
									label="图片："
									:rules="[{ required: true, message: '请上传图片', trigger: 'blur' },]">
									<el-upload
										class="avatar-uploader"
										:action="`${common.basePath}/file/uplode`"
										:show-file-list="false"
										:auto-upload="true"
										multiple
										:limit="9999"
										:before-upload="beforeAvatarUpload"
										:http-request="uploadFile">
										<img v-if="buildForm.enclosure" :src="common.basePicPath+''+buildForm.enclosure" class="avatar">
										<i v-else class="el-icon-plus avatar-uploader-icon"></i>
									</el-upload>
								</el-form-item>
								<el-form-item
									prop="desc"
									label="问题描述："
									:rules="[{ required: true, message: '请输入问题描述的内容', trigger: 'blur' },{ min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
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
								node-key="id"
								ref="tree"
								highlight-current
								:props="defaultFunctionProps">
							</el-tree>
						</div>
					</el-col>
				</el-row>
				<div class="build-btns">
					<el-button @click="resetForm_('buildForm')">重 置</el-button>
					<el-button @click="feedbackDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="submitForm_('buildForm')" class="marr20">提 交</el-button>
				</div>
			</div>
		</el-dialog>
		<!-- 编辑产品详情 -->
		<el-dialog
			title="编辑产品"
			:visible.sync="editDetailDialogVisible"
			width="750px">
			<el-form ref="projectForm" :model="projectForm" :rules="rules" class="edit-project" v-loading="loading_edit">
				<el-row :gutter="20" class="top-content">
					<el-col :span="4" :offset="1" class="picture-box">
						<el-form-item  prop="pci">
							<el-upload
								class="avatar-uploader"
								:action="`${common.basePath}/file/uplode`"
								:show-file-list="false"
								:auto-upload="true"
								multiple
								:limit="9999"
								:before-upload="beforeAvatarUpload"
								:http-request="uploadFile_">
								<img v-if="imageUrl" :src="common.basePicPath+''+imageUrl" class="avatar">
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
						</el-form-item>
					</el-col>
					<el-col :span="18" :offset="1">
						<el-form-item label="产品名称：" prop="project" label-width="120px">
							<el-input v-model="projectForm.project"></el-input>
						</el-form-item>
						<el-form-item label="产品编号：" prop="pronumber" label-width="120px">
							<el-input v-model="projectForm.pronumber"></el-input>
						</el-form-item>
						<el-form-item label="负责人：" prop="present" label-width="120px">
							<el-input v-model="projectForm.present"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="middle-content">
					<el-form-item label="产品简介：" prop="description">
						<el-input type="textarea" v-model="projectForm.description" :rows="5"></el-input>
					</el-form-item>
				</el-row>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDetailDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editDetailForm('projectForm')">保 存</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<style>
	.functionCard.el-popover.el-popper{
		left: 50vw !important;
	}
	/* 
		功能列表弹出框样式
	 */
	.functionHoverForm .el-form-item{
		margin-bottom: 0;
	}
	/* 
		预览模式markdown样式修改
	 */
	#editormd2 .v-note-show.single-show{
		width: calc(100vw - 458px);
    position: absolute;
    height: 100vh;
    right: 0px;
	} 
	#editormd2 .v-note-navigation-wrapper.shadow{
		position: absolute;
    left: 0;
    display: block !important;
	overflow-y: scroll;
	}
	#editormd2 .v-note-navigation-wrapper.shadow .v-note-navigation-close{
		display: none;
	}
	
	/* 产品下拉选择框 */
	.project-menu .el-select-dropdown.el-popper{
		min-width: 360px !important;
	}

	
	/* 展示的文本框样式修改 */
	.feedback-content-item .el-textarea{
		margin-top: 12px;
	}
	.feedback-content-item .el-textarea.is-disabled .el-textarea__inner{
		background-color: #fcfdf6;
		border-color: #e4e7ed;
    color: #606266;
    cursor: default;
	}
	.deploy-content-item .el-textarea{
		margin-top: 12px;
	}
	.deploy-content-item .el-textarea.is-disabled .el-textarea__inner{
		background-color: #fcfdf6;
		border-color: #e4e7ed;
    color: #606266;
    cursor: pointer;
	}
	.detail .el-textarea{
		margin-top: 12px;
	}
	.detail .el-textarea.is-disabled .el-textarea__inner{
		background-color: #fcfdf6;
		border-color: #e4e7ed;
    color: #606266;
    cursor: default;
	}
</style>

<style src="../../assets/style/project.less" scoped lang="less"></style>

<script>
	export default {
		props:{
			tabTwoPages:{
				type:Array,
				required:true,
			},
		},
		methods: {

			//-------------------------------------------------------------------------------------产品说明书
			/*
				编辑说明书
			 */
			editInstructions(){
				this.navigation = true;
				this.preview = false;
				this.edit = true;
			},
			/*
				预览说明书
			 */
			previewInstructions(){
				this.navigation = true;
				this.preview = true;
				this.edit = false;
			},
			/*
				保存（编辑说明书）
			 */
			save(value,render){
				let form = {
					instructions:value,
				}
				this.axios.patch(`${this.common.basePath}/project/${this.activeIndex}`,form).then( (response) => {
					if(response.data.meta.code === 0){
						this.$message.success("编辑产品说明书成功！！", 20);
						this.preview = true;
						this.edit = false;
						// this.getProjectList();
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
				}).catch( (error) => {
					this.$message.error(error);
				});
			},

			// 绑定@imgAdd event
      $imgAdd(pos, $file){
				// 第一步.将图片上传到服务器.
				var formdata = new FormData();
				formdata.append('file', $file);
				this.axios({
				  url: `${this.common.basePath}/file/uplode`,
				  method: 'post',
				  data: formdata,
				  headers: { 'Content-Type': 'multipart/form-data' },
				}).then((url) => {
				  // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
			   /**
			   * $vm 指为mavonEditor实例，可以通过如下两种方式获取
			   * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
			   * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
			   */
				  this.$refs.md[0].$img2Url(pos, this.common.basePicPath+''+url.data.data.path);
				})
      },

			//-------------------------------------------------------------------------------------上传文件
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
			uploadFile_(param){
				var fileObj = param.file;
				// FormData 对象
				var form = new FormData();
				// 文件对象
				form.append("file", fileObj);
				this.axios.post(`${this.common.basePath}/file/uplode`,form,{ headers: { 'Content-Type': 'multipart/form-data' } }).then((response) => {
					this.$message.success("文件上传成功！！", 20);
					this.imageUrl = response.data.data.path;
				}).catch((error) => {
					this.$message.error(error);
				});
			},

			//-------------------------------------------------------------------------------------tab切换与下拉选择产品
			/* 
			 	点击项目列表,切换不同的项目id
			 */
			handleSelect(key) {
				this.activeIndex = String(key);
				if(this.activeName=='project_detail'){//详情
					this.getProjectDetail();
				}else if(this.activeName=='project_function'){//功能列表
					this.getProjectFunctionList();
				}else if(this.activeName=='project_instructions'){//说明书
					this.value = '';
					this.preview = true;
					this.edit = false;
					this.getProjectDetail();
				}else if(this.activeName=='project_feedback'){//反馈
					// this.deployId = null;
					this.functionId = null;
					this.formInline.date=null;
					this.formInline.state=null
					this.elementPageData.pageNum = 1;
					this.getProjectFeedbackDetail();
				}else if(this.activeName=='project_deploy'){//实施或部署
					this.getProjectDeployList();
				}
			},
			/* 
			 右侧的tab切换
			 */
			handleClick(tab, event) {
				if(tab.name=='project_detail'){//详情
					/* 
					GET  查询--根据项目id查询项目详情
					*/
					this.getProjectDetail();
				}else if(tab.name=='project_function'){//功能列表
					/* 
					GET  查询--根据项目id查询项目功能列表
					*/
					this.getProjectFunctionList();
				}else if(tab.name=='project_instructions'){//说明书
					/* 
						GET  查询--根据项目id查询项目的说明书
					*/
					this.value = '';
					this.preview = true;
					this.edit = false;
					this.getProjectDetail();
				}else if(tab.name=='project_feedback'){//反馈
					/* 
						GET  查询--根据项目id查询项目反馈信息
					*/
					// this.deployId = null;
					this.functionId = null;
					this.formInline.date=null;
					this.formInline.state=null
					this.elementPageData.pageNum = 1;
					this.getProjectFeedbackDetail();
				}else if(tab.name=='project_deploy'){//实施或部署
					/* 
						GET  查询--根据项目id查询部署列表
					*/
					this.isShowDetail = false;
					this.getProjectDeployList();
				}
			},

			//-------------------------------------------------------------------------------------产品列表
			/* 
				GET  查询--查询项目列表
			 */
			getProjectList(){
				this.loading = true;
				this.axios.get(`${this.common.basePath}/project`,this._params()).then( (response) => {
					if(response.data.meta.code === 0){
						if(JSON.stringify(response.data.data.rows)=='[]'){
							this.projectList = null;//项目列表
							this.defaultProject = null;//默认项目
						}else{
							this.projectList = response.data.data.rows;//项目列表
							this.defaultProject = response.data.data.rows[0].id;//默认项目
						}
						this.activeIndex = response.data.data.rows?String(response.data.data.rows[0].id):null;//初始项目id
						if(this.tabTwoPages.indexOf("project_detail")!=-1&&this.activeIndex){
							//获取初始的项目详情
							this.loading_detail = true;
							this.axios.get(`${this.common.basePath}/project/${this.activeIndex}`,this._params()).then( (response) => {
								if(response.data.meta.code === 0){
									this.projectDetail = response.data.data;//项目---详情
								}else{
									this.$message.error(response.data.meta.message, 20);   
								}
								this.loading_detail = false;
							}).catch( (error) => {
								this.$message.error(error);
								this.loading_detail = false;
							});
						}
						this.loading = false;
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
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
				删除产品
			 */
			delProject(name,id){
				this.$confirm(`此操作将删除 ${name} , 是否继续?`, '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '放 弃',
          type: 'warning'
        }).then(() => {
          this.axios.patch(`${this.common.basePath}/project/delete/${id}`,{params:{}}).then( (response) => {
						if(response.data.meta.code === 0){
							this.$message.success("删除成功！！", 20);
							this.getProjectList();
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

			//-------------------------------------------------------------------------------------产品详情
			/* 
			GET  查询--根据项目id查询项目详情
			*/
			getProjectDetail(){
				this.loading_detail = true;
				this.axios.get(`${this.common.basePath}/project/${this.activeIndex}`,this._detailParams()).then( (response) => {
					if(response.data.meta.code === 0){
						if(JSON.stringify(response.data.data)=='[]'){
							this.projectDetail = null;//项目---详情
							this.value = '';//产品---说明书
						}else{
							this.projectDetail = response.data.data;//项目---详情
							this.value = response.data.data.instructions?response.data.data.instructions:'';//产品---说明书
						}
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
					this.loading_detail = false;
				}).catch( (error) => {
					this.$message.error(error);
					this.loading_detail = false;
				});
			},
			_detailParams(){
				return {
					params: {}
				}
			},
			/*
				编辑产品详情
			 */
			editDetail(){
				this.imageUrl = null;//清空图片
				this.resetForm("projectForm");//清空信息

				// 回显信息
				this.loading_edit = true;
				this.axios.get(`${this.common.basePath}/project/${this.activeIndex}`,{params:{}}).then( (response) => {
					if(response.data.meta.code === 0){
						if(JSON.stringify(response.data.data)=='[]'){
							this.projectForm = null;//产品详情
						}else{
							this.projectForm = response.data.data;//产品详情
						}
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
					this.loading_edit = false;
				}).catch( (error) => {
					this.$message.error(error);
					this.loading_edit = false;
				});

				//回显图片
				this.imageUrl = this.projectDetail.pci;

				this.editDetailDialogVisible = true;
			},
			/*
				确认编辑产品详情
			 */
			editDetailForm(formName) {
				this.projectForm.pci = this.imageUrl;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.axios.patch(`${this.common.basePath}/project/${this.activeIndex}`,this.projectForm).then( (response) => {
							if(response.data.meta.code === 0){
								this.$message.success("编辑成功！！", 20);
								this.editDetailDialogVisible = false;
								this.getProjectDetail();
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

			//-------------------------------------------------------------------------------------产品功能
			/* 
			GET  查询--根据项目id查询项目功能列表
			*/
			getProjectFunctionList(){
				this.loading_function = true;
				this.axios.get(`${this.common.basePath}/function/tree`,this._functionListParams()).then( (response) => {
					if(response.data.meta.code === 0){
						if(JSON.stringify(response.data.data)=='[]'){
							this.projectFunctionList = null;//项目---功能列表
						}else{
							this.projectFunctionList = response.data.data;//项目---功能列表
						}
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
					this.loading_function = false;
				}).catch( (error) => {
					this.$message.error(error);
					this.loading_function = false;
				});
			},
			_functionListParams(){
				return {
					params: {
						project_id:this.activeIndex?this.activeIndex:null,
					}
				}
			},
			/*
				添加功能树
			 */
			//添加功能树根节点
			addFunction_(type,data){
				//清空信息
				// this.addId = null;

				// this.addId = data.id;//添加功能树ID
				this.functionTypeDialog = type;
				this.functionDialogVisible = true;

				//清空信息
				if(this.$refs['functionForm']){
					this.$refs['functionForm'].resetFields();
				}
			},
			//添加功能树子节点
			addFunction(type,data){
				//清空信息
				this.addId = null;

				this.addId = data.id;//添加功能树ID
				this.functionTypeDialog = type;
				this.functionDialogVisible = true;

				//清空信息
				if(this.$refs['functionForm']){
					this.$refs['functionForm'].resetFields();
				}
			},
			//确认添加功能树
			addSubmitForm(formName,type) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if(type===0){//添加子节点
							var form = {
								parent_id:this.addId,
								project_id:this.activeIndex,
								name:this.functionForm.name,
								after_person:this.functionForm.after_person,
								front_person:this.functionForm.front_person,
								describe:this.functionForm.describe,
								remarks:this.functionForm.remarks, 
							}
							this.axios.post(`${this.common.basePath}/function`,form).then( (response) => {
								if(response.data.meta.code === 0){
									this.$message.success("添加成功！！", 20);
									this.getProjectFunctionList();
									this.functionDialogVisible = false;
								}else{
									this.$message.error(response.data.meta.message, 20);   
								}
							}).catch( (error) => {
								this.$message.error(error);
							});
						}else if(type===3){//添加根节点
							var form = {
								// parent_id:this.addId,
								project_id:this.activeIndex,
								name:this.functionForm.name,
								after_person:this.functionForm.after_person,
								front_person:this.functionForm.front_person,
								describe:this.functionForm.describe,
								remarks:this.functionForm.remarks, 
							}
							this.axios.post(`${this.common.basePath}/function`,form).then( (response) => {
								if(response.data.meta.code === 0){
									this.$message.success("添加成功！！", 20);
									this.getProjectFunctionList();
									this.functionDialogVisible = false;
								}else{
									this.$message.error(response.data.meta.message, 20);   
								}
							}).catch( (error) => {
								this.$message.error(error);
							});
						}
					} else {
						this.$message.error('添加功能树的信息未填写完整！！！', 20); 
						return false;
					}
				});
			},
			/* 
				删除功能树节点
			*/
			delFunction(type,data){
				this.$confirm('此操作将删除该功能, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.patch(`${this.common.basePath}/function/delete/${data.id}`,{}).then( (response) => {
						if(response.data.meta.code === 0){
							this.$message.success("删除成功！！", 20);
							this.getProjectFunctionList();
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
					}).catch( (error) => {
						this.$message.error(error);
					});
				}).catch(() => {});
			},
			/* 
				编辑功能树
			*/
			editFunction(type,data){
				//清空信息
				this.editId = null;
				
				this.editId = data.id;//编辑功能树ID

				//回显信息
				this.loading_edit = true;
				this.axios.get(`${this.common.basePath}/function/${data.id}/tree`,{params:{}}).then( (response) => {
					if(response.data.meta.code === 0){
						if(JSON.stringify(response.data.data)=='[]'){
							this.functionForm = null;//功能详情
						}else{
							this.functionForm = response.data.data;//功能详情
						}
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
					this.loading_edit = false;
				}).catch( (error) => {
					this.$message.error(error);
					this.loading_edit = false;
				});

				this.functionTypeDialog = type;
				this.functionDialogVisible = true;

				//清空信息
				if(this.$refs['functionForm']){
					this.$refs['functionForm'].resetFields();
				}
			},
			/* 
			 确认编辑功能树
			 */
			editSubmitForm_(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						var form = {
							project_id:this.activeIndex,
							name:this.functionForm.name,
							after_person:this.functionForm.after_person,
							front_person:this.functionForm.front_person,
							describe:this.functionForm.describe,
							remarks:this.functionForm.remarks,
						}
						this.axios.patch(`${this.common.basePath}/function/${this.editId}`,form).then( (response) => {
							if(response.data.meta.code === 0){
								this.$message.success("编辑成功！！", 20);
								this.getProjectFunctionList();
								this.functionDialogVisible = false;
							}else{
								this.$message.error(response.data.meta.message, 20);   
							}
						}).catch( (error) => {
							this.$message.error(error);
						});
					} else {
						this.$message.error('编辑功能树的信息未填写完整！！！', 20); 
						return false;
					}
				});
			},
			/* 
				通过功能id查看反馈信息
			 */
			viewInfo(data){
				this.functionId = data.id;
				// this.deployId = 1;
				this.activeName = "project_feedback";
				this.getProjectFeedbackDetail();
			},

			//-------------------------------------------------------------------------------------产品反馈
			/* 
				通过选择状态，筛选该项目信息
			*/
			someItemChange(val){
				if(val == ''){this.formInline.state=null}
				this.getProjectFeedbackDetail();
			},
			/* 
				通过产生时间，筛选该项目反馈信息
			*/
			changeDate(val){
				this.getProjectFeedbackDetail();
			},
			/* 
			GET  查询--根据项目id查询项目反馈信息
			*/
			getProjectFeedbackDetail(){
				this.loading_feedback = true;
				this.axios.get(`${this.common.basePath}/feedback`,this._feedbackDetailParams()).then( (response) => {
					if(response.data.meta.code === 0){
						if(JSON.stringify(response.data.data.rows)=='[]'){
							this.projectFeedbackDetail = null;//项目---反馈信息
						}else{
							this.projectFeedbackDetail = response.data.data.rows;//项目---反馈信息
						}
						this.feedbackInfoTotall = response.data.data.total;//项目---反馈信息总条数
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
					this.loading_feedback = false;
				}).catch( (error) => {
					this.$message.error(error);
					this.loading_feedback = false;
				});
			},
			_feedbackDetailParams(){
				return {
					params: {
						project_id:this.activeIndex?this.activeIndex:null,
						startTime:this.formInline.date?this.formInline.date[0].getTime():null,
						stopTime:this.formInline.date?this.formInline.date[1].getTime():null,
						cur_status:this.formInline.state,
						function:this.functionId,
						pageSize: this.elementPageData.pageSize,
						pageNum: this.elementPageData.pageNum,
					}
				}
			},
			/*
				反馈分页功能
			 */
			//改变当前页码触发此事件
			handleCurrentChange(val){
				this.elementPageData.pageNum = val;
				this.getProjectFeedbackDetail();
			},
			//改变每页条数触发此事件
			handleSizeChange(val){
				this.elementPageData.pageSize = val;
				this.getProjectFeedbackDetail();
			},
			/* 
				更改反馈信息状态
			 */
			goToSolved(states,id){//去解决
				this.$confirm('是否确认去解决该反馈信息?', '提示', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					this.axios.patch(`${this.common.basePath}/feedback/${id}`,{cur_status:states}).then( (response) => {
						if(response.data.meta.code === 0){
							this.$message({
								type: 'success',
								message: '已确认去解决该反馈信息，状态更改为待解决...'
							});
							this.getProjectFeedbackDetail();
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
					}).catch( (error) => {
						this.$message.error(error);
					});
				}).catch(() => {});
			},
			solved(states,id){//解决
				this.$confirm('是否确认解决该反馈信息?', '提示', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					this.axios.patch(`${this.common.basePath}/feedback/${id}`,{cur_status:states}).then( (response) => {
						if(response.data.meta.code === 0){
							this.$message({
								type: 'success',
								message: '已解决该反馈信息，状态更改为已解决！'
							});
							this.getProjectFeedbackDetail();
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
					}).catch( (error) => {
						this.$message.error(error);
					});
				}).catch(() => {});
			},
			discarding(states,id){//丢弃、删除
				this.$confirm('是否确认丢弃该反馈信息?', '提示', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					this.axios.patch(`${this.common.basePath}/feedback/delete/${id}`,{}).then( (response) => {
						if(response.data.meta.code === 0){
							this.$message({
								type: 'success',
								message: '已丢弃该反馈信息，状态更改为已丢弃！'
							});
							this.getProjectFeedbackDetail();
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
					}).catch( (error) => {
						this.$message.error(error);
					});
				}).catch(() => {});
			},
			/*
				新建反馈信息
			 */
			//弹出新建反馈弹框
			buildFeedBackInfo(){
				this.feedbackDialogVisible = true;
				this.getProjectDeployList();
				this.getProjectFunctionList();

				//清空信息
				if(this.$refs['buildForm']){
					this.$refs['buildForm'].resetFields();
				}
			},
			//上传反馈的图片
			uploadFile(param){
				var fileObj = param.file;
				// FormData 对象
				var form = new FormData();
				// 文件对象
				form.append("file", fileObj);
				this.axios.post(`${this.common.basePath}/file/uplode`,form,{ headers: { 'Content-Type': 'multipart/form-data' } }).then((response) => {
					this.$message.success("图片上传成功！！", 20);
					this.buildForm.enclosure = response.data.data.path;
				}).catch((error) => {
					this.$message.error(error);
				});
			},
			//获取发生位置的id数组
			getCheckedKeys() {
				this.function = this.$refs.tree.getCheckedKeys()
			},
			//清空发生位置的选择项
			resetChecked() {
				this.$refs.tree.setCheckedKeys([]);
			},
			//提交新建反馈信息
			submitForm_(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.getCheckedKeys();//获取发生位置的id数组
						if(this.function.length!=0){
							this.buildFeedBack();
						}else{
							this.$message.error("新建反馈信息的发生位置未选择！！！");
						}
					} else {
						this.$message.error("新建反馈信息未填写完整！！！");
						return false;
					}
				});
			},
			resetForm_(formName) {
				this.resetChecked();//清空发生位置的选择项
				this.$refs[formName].resetFields();//清空表单信息
			},
			/* 
			 新建反馈信息
			 */
			buildFeedBack(){
				let form = {
					title:this.buildForm.name,
					enclosure:this.buildForm.enclosure,
					detailed:this.buildForm.desc,
					phone:this.buildForm.tel,
					function:this.function.join(","),
					project_id:this.activeIndex?this.activeIndex:null,
					deploy_id:this.buildForm.deploy_id,
					/*"backcontent": "string",
				  "checktime": "2019-01-10T09:18:15.648Z",
				  "content": "string",*/
				  /*"deploy_id": 0,
				  "functionName": [
				    "string"
				  ],*/
				}
				this.axios.post(`${this.common.basePath}/feedback`,form).then( (response) => {
					if(response.data.meta.code === 0){
						this.getProjectFeedbackDetail();
						this.feedbackDialogVisible = false;
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
				}).catch( (error) => {
					this.$message.error(error);
				});
			},
			
			//-------------------------------------------------------------------------------------产品新建
			/* 
				新建按钮
			*/
			builtProject(){
				this.imageUrl = null;//清空图片
				this.resetForm("projectForm");//清空信息
				this.isShowBuilt = !this.isShowBuilt;
				this.icon = this.icon == 'el-icon-plus'?'el-icon-back':'el-icon-plus';
				this.buildText = this.buildText == '新建产品'?'返回':'新建产品';
				this.buildText == '返回'?document.getElementById("btn-box").style.cssFloat = 'right':document.getElementById("btn-box").style.cssFloat = 'left';
				this.selectBox = !this.selectBox;

			},
			/* 
			取消按钮
			*/
			cancel(){
				this.isShowBuilt = false;
				this.icon = 'el-icon-plus';
				this.buildText = '新建产品';
				document.getElementById("btn-box").style.cssFloat = 'left'
				this.selectBox = true;
			},
			/* 
				POST 新建项目
			 */
			addProject(){
				this.axios.post(`${this.common.basePath}/project`,this.projectForm).then( (response) => {
					if(response.data.meta.code === 0){
						this.$message.success("新建产品成功！！", 20);
						
						this.isShowBuilt = false;
						this.icon = 'el-icon-plus';
						this.buildText = '新建产品';
						document.getElementById("btn-box").style.cssFloat = 'left'
						this.selectBox = true;

						this.getProjectList();
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
				this.projectForm.pci = this.imageUrl;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if(this.projectForm.pci==null){
							this.$message.error('未上传产品图片！！！', 20);
							return; 
						}
						this.addProject();
					} else {
						// this.$message.error('新建项目的信息未填写完整！！！', 20); 
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
			
			//-------------------------------------------------------------------------------------产品部署
			/* 
			 GET  查询--根据项目id查询部署列表
			 */
			getProjectDeployList(){
				this.loading_deploy = true;
				this.axios.get(`${this.common.basePath}/deploy`,this._deployListParams()).then( (response) => {
					if(response.data.meta.code === 0){
						if(JSON.stringify(response.data.data.rows)=='[]'){
							this.projectDeployList = null;//项目---部署列表
						}else{
							this.projectDeployList = response.data.data.rows;//项目---部署列表
						}
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
					this.loading_deploy = false;
				}).catch( (error) => {
					this.$message.error(error);
					this.loading_deploy = false;
				});
			},
			_deployListParams(){
				return {
					params: {
						proj_id:this.activeIndex?this.activeIndex:null,
					}
				}
			},
			/* 
			 GET  查询--根据部署列表id查询部署详情
			 */
			getProjectDeployDetail(id){
				this.loading_deploy = true;
				this.axios.get(`${this.common.basePath}/deploy/${id}`,{params:{}}).then( (response) => {
					if(response.data.meta.code === 0){
						if(JSON.stringify(response.data.data)=='[]'){
							this.projectDeployDetail = null;//项目---部署详情
						}else{
							this.projectDeployDetail = response.data.data;//项目---部署详情
						}
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
					this.loading_deploy = false;
				}).catch( (error) => {
					this.$message.error(error);
					this.loading_deploy = false;
				});
			},
			/* 
			 GET  查询--根据部署列表id查询数据库部署列表
			 */
			getProjectDeployDatabasesList(id){
				this.loading_deploy = true;
				this.axios.get(`${this.common.basePath}/deploy/database`,{params:{deploy_id:id}}).then( (response) => {
					if(response.data.meta.code === 0){
						if(JSON.stringify(response.data.data.rows)=='[]'){
							this.projectDeployDatabasesList = null;//部署数据库列表
						}else{
							this.projectDeployDatabasesList = response.data.data.rows;//部署数据库列表
						}
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
					this.loading_deploy = false;
				}).catch( (error) => {
					this.$message.error(error);
					this.loading_deploy = false;
				});
			},
			/* 
			 GET  查询--根据部署列表id查询redis部署列表
			 */
			getProjectDeployRedisList(id){
				this.loading_deploy = true;
				this.axios.get(`${this.common.basePath}/deploy/redis`,{params:{deploy_id:id}}).then( (response) => {
					if(response.data.meta.code === 0){
						if(JSON.stringify(response.data.data.rows)=='[]'){
							this.projectDeployRedisList = null;//部署redis列表
						}else{
							this.projectDeployRedisList = response.data.data.rows;//部署redis列表
						}
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
					this.loading_deploy = false;
				}).catch( (error) => {
					this.$message.error(error);
					this.loading_deploy = false;
				});
			},
			/* 
			 GET  查询--根据部署列表id查询nginx部署列表
			 */
			getProjectDeployNginxList(id){
				this.loading_deploy = true;
				this.axios.get(`${this.common.basePath}/deploy/nginx`,{params:{deploy_id:id}}).then( (response) => {
					if(response.data.meta.code === 0){
						if(JSON.stringify(response.data.data.rows)=='[]'){
							this.projectDeployNginxList = null;//部署nginx列表
						}else{
							this.projectDeployNginxList = response.data.data.rows;//部署nginx列表
						}
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
					this.loading_deploy = false;
				}).catch( (error) => {
					this.$message.error(error);
					this.loading_deploy = false;
				});
			},
			/* 
			 GET  查询--根据部署列表id查询端口部署列表
			 */
			getProjectDeployPortList(id){
				this.loading_deploy = true;
				this.axios.get(`${this.common.basePath}/deploy/port`,{params:{deploy_id:id}}).then( (response) => {
					if(response.data.meta.code === 0){
						if(JSON.stringify(response.data.data.rows)=='[]'){
							this.projectDeployPortList = null;//部署端口列表
						}else{
							this.projectDeployPortList = response.data.data.rows;//部署端口列表
						}
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
					this.loading_deploy = false;
				}).catch( (error) => {
					this.$message.error(error);
					this.loading_deploy = false;
				});
			},
			/* 
			展示详情(部署详情)
			*/
			showDetail(id){
				this.getProjectDeployDetail(id);
				this.getProjectDeployDatabasesList(id);
				this.getProjectDeployRedisList(id);
				this.getProjectDeployNginxList(id);
				this.getProjectDeployPortList(id);
				this.isShowDetail = true;
			},
			/*
				重新部署
			 */
			resetDeploy(){
				this.isShowTextBox = false;
				this.isShowSelectBox = true;
				this.oneSelect = true;
				this.twoSelect = false;
				this.threeSelect = false;
				this.getServerList();
			},
			/*
				编辑部署
			 */
			editDeploy(data,type,rId){
				this.isShowTextBox = true;
				this.isShowSelectBox = false;

				//清空id
				this.editDeployId = null;
				this.rId = null;
				
				//回显信息
				if(type===6){//回显产品部署详情

					this.loading_add_deploy = true;
					this.axios.get(`${this.common.basePath}/deploy/${data.id}`,{params:{}}).then( (response) => {
						if(response.data.meta.code === 0){
							if(JSON.stringify(response.data.data)=='[]'){
								this.deployForm = null;//产品部署详情
							}else{
								this.deployForm = response.data.data;//产品部署详情
							}
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
						this.loading_add_deploy = false;
					}).catch( (error) => {
						this.$message.error(error);
						this.loading_add_deploy = false;
					});
				}else if(type===7){//回显数据库详情
					this.threeSelect = true;

					this.loading_add_deploy = true;
					this.axios.get(`${this.common.basePath}/deploy/database/${data.id}`,{params:{}}).then( (response) => {
						if(response.data.meta.code === 0){
							if(JSON.stringify(response.data.data)=='[]'){
								this.deployForm = null;//数据库详情
							}else{
								this.deployForm = response.data.data;//数据库详情

								//id转化未为name
								this.axios.get(`${this.common.basePath}/database/${response.data.data.database_id}`,{params:{}}).then( (response) => {
									if(response.data.meta.code === 0){
										if(JSON.stringify(response.data.data)=='[]'){
											this.idConversionNameD = null;//name
										}else{
											this.idConversionNameD = response.data.data.name;//name
										}
									}else{
										this.$message.error(response.data.meta.message, 20);   
									}
								}).catch( (error) => {this.$message.error(error);});

							}
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
						this.loading_add_deploy = false;
					}).catch( (error) => {
						this.$message.error(error);
						this.loading_add_deploy = false;
					});
				}else if(type===8){//回显redis详情
					this.threeSelect = true;

					this.loading_add_deploy = true;
					this.axios.get(`${this.common.basePath}/deploy/redis/${data.id}`,{params:{}}).then( (response) => {
						if(response.data.meta.code === 0){
							if(JSON.stringify(response.data.data)=='[]'){
								this.deployForm = null;//redis详情
							}else{
								this.deployForm = response.data.data;//redis详情

								//id转化未为name
								this.axios.get(`${this.common.basePath}/redis_index/${response.data.data.index_id}`,{params:{}}).then( (response) => {
									if(response.data.meta.code === 0){
										if(JSON.stringify(response.data.data)=='[]'){
											this.idConversionNameR = null;//name
										}else{
											this.idConversionNameR = response.data.data.index;//name
										}
									}else{
										this.$message.error(response.data.meta.message, 20);   
									}
								}).catch( (error) => {this.$message.error(error);});

							}
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
						this.loading_add_deploy = false;
					}).catch( (error) => {
						this.$message.error(error);
						this.loading_add_deploy = false;
					});
				}else if(type===9){//回显nginx详情
					this.threeSelect = true;

					this.loading_add_deploy = true;
					this.axios.get(`${this.common.basePath}/deploy/nginx/${data.id}`,{params:{}}).then( (response) => {
						if(response.data.meta.code === 0){
							if(JSON.stringify(response.data.data)=='[]'){
								this.deployForm = null;//nginx详情
							}else{
								this.deployForm = response.data.data;//nginx详情

								//id转化未为name
								this.axios.get(`${this.common.basePath}/nginx_location/${response.data.data.location_id}`,{params:{}}).then( (response) => {
									if(response.data.meta.code === 0){
										if(JSON.stringify(response.data.data)=='[]'){
											this.idConversionNameN = null;//name
										}else{
											this.idConversionNameN = response.data.data.match;//name
										}
									}else{
										this.$message.error(response.data.meta.message, 20);   
									}
								}).catch( (error) => {this.$message.error(error);});

							}
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
						this.loading_add_deploy = false;
					}).catch( (error) => {
						this.$message.error(error);
						this.loading_add_deploy = false;
					});
				}else if(type===10){//回显端口详情
					this.twoSelect = true;

					this.loading_add_deploy = true;
					this.axios.get(`${this.common.basePath}/deploy/port/${data.id}`,{params:{}}).then( (response) => {
						if(response.data.meta.code === 0){
							if(JSON.stringify(response.data.data)=='[]'){
								this.deployForm = null;//端口详情
							}else{
								this.deployForm = response.data.data;//端口详情

								//id转化未为name
								this.axios.get(`${this.common.basePath}/port/${response.data.data.port_id}`,{params:{}}).then( (response) => {
									if(response.data.meta.code === 0){
										if(JSON.stringify(response.data.data)=='[]'){
											this.idConversionNameP = null;//name
										}else{
											this.idConversionNameP = response.data.data.port;//name
										}
									}else{
										this.$message.error(response.data.meta.message, 20);   
									}
								}).catch( (error) => {this.$message.error(error);});

							}
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
						this.loading_add_deploy = false;
					}).catch( (error) => {
						this.$message.error(error);
						this.loading_add_deploy = false;
					});
				}

				this.editDeployId = data.id;//编辑部署id
				this.rId = rId;//部署详情刷新列表的id

				this.deployIndexDialog = type;
				this.deployDialogVisible= true;

				//清空数据
				if(this.$refs['deployForm']){
					this.$refs['deployForm'].resetFields();
				}
			},
			//确认编辑
			editSubmitForm(formName, type){
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if(type===6){//编辑产品部署
							let editForm = {
							  custom:this.deployForm.custom,
							  describe:this.deployForm.describe,
							  keyt:this.deployForm.keyt,
							  position:this.deployForm.position,
							  structure:this.deployForm.structure,
							  proj_id:this.activeIndex,
							  ser_id:null,
							};
							this.axios.patch(`${this.common.basePath}/deploy/${this.editDeployId}`,editForm).then( (response) => {
								if(response.data.meta.code === 0){
									this.$message.success("编辑成功！！", 20);
									this.getProjectDeployList();
									this.deployDialogVisible = false;
								}else{
									this.$message.error(response.data.meta.message, 20);   
								}
							}).catch( (error) => {
								this.$message.error(error);
							});
						}else if(type===7){//编辑数据库的部署
							//判断该数据库是否已有
							if(this.projectDeployDatabasesList){
								for(var i = 0;i<this.projectDeployDatabasesList.length;i++){
									if(this.projectDeployDatabasesList[i].database_id===this.deployForm.database_id){
										this.$message.error("该数据库已有，不能重复添加！！", 20);
										return;
									}
								}
							}
							let editForm = {
								description:this.deployForm.description,
								database_id:this.deployForm.database_id,
							};
							this.axios.patch(`${this.common.basePath}/deploy/database/${this.editDeployId}`,editForm).then( (response) => {
								if(response.data.meta.code === 0){
									this.$message.success("编辑成功！！", 20);
									this.getProjectDeployDatabasesList(this.rId);
									this.deployDialogVisible = false;
								}else{
									this.$message.error(response.data.meta.message, 20);   
								}
							}).catch( (error) => {
								this.$message.error(error);
							});
						}else if(type===8){//编辑redis的部署
							//判断该redis是否已有
							if(this.projectDeployRedisList){
								for(var i = 0;i<this.projectDeployRedisList.length;i++){
									if(this.projectDeployRedisList[i].index_id===this.deployForm.index_id){
										this.$message.error("该redis已有，不能重复添加！！", 20);
										return;
									}
								}
							}
							let editForm = {
								description:this.deployForm.description,
								index_id:this.deployForm.index_id,
							};
							this.axios.patch(`${this.common.basePath}/deploy/redis/${this.editDeployId}`,editForm).then( (response) => {
								if(response.data.meta.code === 0){
									this.$message.success("编辑成功！！", 20);
									this.getProjectDeployRedisList(this.rId);
									this.deployDialogVisible = false;
								}else{
									this.$message.error(response.data.meta.message, 20);   
								}
							}).catch( (error) => {
								this.$message.error(error);
							});
						}else if(type===9){//编辑nginx的部署
							//判断该nginx是否已有
							if(this.projectDeployNginxList){
								for(var i = 0;i<this.projectDeployNginxList.length;i++){
									if(this.projectDeployNginxList[i].location_id===this.deployForm.location_id){
										this.$message.error("该nginx已有，不能重复添加！！", 20);
										return;
									}
								}
							}
							let editForm = {
								description:this.deployForm.description,
								location_id:this.deployForm.location_id,
							};
							this.axios.patch(`${this.common.basePath}/deploy/nginx/${this.editDeployId}`,editForm).then( (response) => {
								if(response.data.meta.code === 0){
									this.$message.success("编辑成功！！", 20);
									this.getProjectDeployNginxList(this.rId);
									this.deployDialogVisible = false;
								}else{
									this.$message.error(response.data.meta.message, 20);   
								}
							}).catch( (error) => {
								this.$message.error(error);
							});
						}else if(type===10){//编辑端口的部署
							//判断该port是否已有
							if(this.projectDeployPortList){
								for(var i = 0;i<this.projectDeployPortList.length;i++){
									if(this.projectDeployPortList[i].port_id===this.deployForm.port_id){
										this.$message.error("该port已有，不能重复添加！！", 20);
										return;
									}
								}
							}
							let editForm = {
								description:this.deployForm.description,
								port_id:this.deployForm.port_id,
							};
							this.axios.patch(`${this.common.basePath}/deploy/port/${this.editDeployId}`,editForm).then( (response) => {
								if(response.data.meta.code === 0){
									this.$message.success("编辑成功！！", 20);
									this.getProjectDeployPortList(this.rId);
									this.deployDialogVisible = false;
								}else{
									this.$message.error(response.data.meta.message, 20);   
								}
							}).catch( (error) => {
								this.$message.error(error);
							});
						}
					} else {
						this.$message.error('信息未填写完整！！！', 20); 
						return false;
					}
				});
			},
			/*
				删除部署
			 */
			delDeploy(id,type,rId){
				if(type==="deploy"){//删除产品部署列表
					this.$confirm('此操作将删除该部署, 是否继续?', '提示', {
		        confirmButtonText: '确 定',
		        cancelButtonText: '放 弃',
		        type: 'warning'
		      }).then(() => {
		      	this.axios.patch(`${this.common.basePath}/deploy/delete/${id}`,{params:{}}).then( (response) => {
							if(response.data.meta.code === 0){
								this.$message.success("删除成功！！", 20);
								this.getProjectDeployList();
							}else{
								this.$message.error(response.data.meta.message, 20);   
							}
						}).catch( (error) => {
							this.$message.error(error);
						});
		      }).catch(() => {});
				}else if(type==="deploy_database"){//删除数据库部署列表
					this.$confirm('此操作将删除该数据库, 是否继续?', '提示', {
		        confirmButtonText: '确 定',
		        cancelButtonText: '放 弃',
		        type: 'warning'
		      }).then(() => {
		      	this.axios.delete(`${this.common.basePath}/deploy/database/${id}`,{params:{}}).then( (response) => {
							if(response.data.meta.code === 0){
								this.$message.success("删除成功！！", 20);
								this.getProjectDeployDatabasesList(rId);
							}else{
								this.$message.error(response.data.meta.message, 20);   
							}
						}).catch( (error) => {
							this.$message.error(error);
						});
		      }).catch(() => {});
				}else if(type==="deploy_redis"){//删除redis部署列表
					this.$confirm('此操作将删除该redis, 是否继续?', '提示', {
		        confirmButtonText: '确 定',
		        cancelButtonText: '放 弃',
		        type: 'warning'
		      }).then(() => {
		      	this.axios.delete(`${this.common.basePath}/deploy/redis/${id}`,{params:{}}).then( (response) => {
							if(response.data.meta.code === 0){
								this.$message.success("删除成功！！", 20);
								this.getProjectDeployRedisList(rId);
							}else{
								this.$message.error(response.data.meta.message, 20);   
							}
						}).catch( (error) => {
							this.$message.error(error);
						});
		      }).catch(() => {});
				}else if(type==="deploy_nginx"){//删除nginx部署列表
					this.$confirm('此操作将删除该nginx, 是否继续?', '提示', {
		        confirmButtonText: '确 定',
		        cancelButtonText: '放 弃',
		        type: 'warning'
		      }).then(() => {
		      	this.axios.delete(`${this.common.basePath}/deploy/nginx/${id}`,{params:{}}).then( (response) => {
							if(response.data.meta.code === 0){
								this.$message.success("删除成功！！", 20);
								this.getProjectDeployNginxList(rId);
							}else{
								this.$message.error(response.data.meta.message, 20);   
							}
						}).catch( (error) => {
							this.$message.error(error);
						});
		      }).catch(() => {});
				}else if(type==="deploy_port"){//删除端口部署列表
					this.$confirm('此操作将删除该端口, 是否继续?', '提示', {
		        confirmButtonText: '确 定',
		        cancelButtonText: '放 弃',
		        type: 'warning'
		      }).then(() => {
		      	this.axios.delete(`${this.common.basePath}/deploy/port/${id}`,{params:{}}).then( (response) => {
							if(response.data.meta.code === 0){
								this.$message.success("删除成功！！", 20);
								this.getProjectDeployPortList(rId);
							}else{
								this.$message.error(response.data.meta.message, 20);   
							}
						}).catch( (error) => {
							this.$message.error(error);
						});
		      }).catch(() => {});
				}
			},
			/* 
				添加部署
			 */
			getServerList(){//请求获取一级serverOptions
				this.loading_add_deploy = true;
				this.axios.get(`${this.common.basePath}/server`,this._params()).then( (response) => {
					if(response.data.meta.code === 0){
						if(JSON.stringify(response.data.data.rows)=='[]'){
							this.serverOptions = null;//一级选择框的值
						}else{
							this.serverOptions = response.data.data.rows;//一级选择框的值
						}
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
					this.loading_add_deploy = false;
				}).catch( (error) => {
					this.$message.error(error);
					this.loading_add_deploy = false;
				});
			},
			changeOptions(val,type){//请求获取二级serverOptions
				this.oneSelect = true;
				this.twoSelect = true;
				this.threeSelect = false;

				this.loading_add_deploy = true;
				
				if(type=="database"){
					this.axios.get(`${this.common.basePath}/sql`,{params:{server_id:val}}).then( (response) => {
						if(response.data.meta.code === 0){
							if(JSON.stringify(response.data.data.rows)=='[]'){
								this.serverOptions_ = null;//二级选择框的值
							}else{
								this.serverOptions_ = response.data.data.rows;//二级选择框的值
							}
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
						this.loading_add_deploy = false;
					}).catch( (error) => {
						this.$message.error(error);
						this.loading_add_deploy = false;
					});
				}else if(type=="redis"){
					this.axios.get(`${this.common.basePath}/redis`,{params:{server_id:val}}).then( (response) => {
						if(response.data.meta.code === 0){
							if(JSON.stringify(response.data.data.rows)=='[]'){
								this.serverOptions_ = null;//二级选择框的值
							}else{
								this.serverOptions_ = response.data.data.rows;//二级选择框的值
							}
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
						this.loading_add_deploy = false;
					}).catch( (error) => {
						this.$message.error(error);
						this.loading_add_deploy = false;
					});
				}else if(type=="nginx"){
					this.axios.get(`${this.common.basePath}/nginx_server`,{params:{server_id:val}}).then( (response) => {
						if(response.data.meta.code === 0){
							if(JSON.stringify(response.data.data.rows)=='[]'){
								this.serverOptions_ = null;//二级选择框的值
							}else{
								this.serverOptions_ = response.data.data.rows;//二级选择框的值
							}
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
						this.loading_add_deploy = false;
					}).catch( (error) => {
						this.$message.error(error);
						this.loading_add_deploy = false;
					});
				}else if(type=="port"){
					this.axios.get(`${this.common.basePath}/port`,{params:{server_id:val}}).then( (response) => {
						if(response.data.meta.code === 0){
							if(JSON.stringify(response.data.data.rows)=='[]'){
								this.serverOptions_ = null;//二级选择框的值
							}else{
								this.serverOptions_ = response.data.data.rows;//二级选择框的值
							}
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
						this.loading_add_deploy = false;
					}).catch( (error) => {
						this.$message.error(error);
						this.loading_add_deploy = false;
					});
				}
			},
			changeOptions_(val,type){//请求获取三级serverOptions
				this.oneSelect = true;
				this.twoSelect = true;
				this.threeSelect = true;

				this.loading_add_deploy = true;
				
				if(type=="database"){
					this.axios.get(`${this.common.basePath}/database`,{params:{dbserver_id:val}}).then( (response) => {
						if(response.data.meta.code === 0){
							if(JSON.stringify(response.data.data.rows)=='[]'){
								this.serverOptions__ = null;//三级选择框的值
							}else{
								this.serverOptions__ = response.data.data.rows;//三级选择框的值
							}
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
						this.loading_add_deploy = false;
					}).catch( (error) => {
						this.$message.error(error);
						this.loading_add_deploy = false;
					});
				}else if(type=="redis"){
					this.axios.get(`${this.common.basePath}/redis_index`,{params:{redis_id:val}}).then( (response) => {
						if(response.data.meta.code === 0){
							if(JSON.stringify(response.data.data.rows)=='[]'){
								this.serverOptions__ = null;//三级选择框的值
							}else{
								this.serverOptions__ = response.data.data.rows;//三级选择框的值
							}
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
						this.loading_add_deploy = false;
					}).catch( (error) => {
						this.$message.error(error);
						this.loading_add_deploy = false;
					});
				}else if(type=="nginx"){
					this.axios.get(`${this.common.basePath}/nginx_location`,{params:{n_server_id:val}}).then( (response) => {
						if(response.data.meta.code === 0){
							if(JSON.stringify(response.data.data.rows)=='[]'){
								this.serverOptions__ = null;//三级选择框的值
							}else{
								this.serverOptions__ = response.data.data.rows;//三级选择框的值
							}
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
						this.loading_add_deploy = false;
					}).catch( (error) => {
						this.$message.error(error);
						this.loading_add_deploy = false;
					});
				}
			},
			//数据库
			addDatabasesDetail(index,data){
				this.isShowTextBox = false;
				this.isShowSelectBox = true;
				this.oneSelect = true;
				this.twoSelect = false;
				this.threeSelect = false;
				this.getServerList();

				//清空id
				this.addDataBasesId = null;
				
				//添加数据库deploy_id
				this.addDataBasesId = data.id;

				this.deployIndexDialog = index;
				this.deployDialogVisible = true;
				
				//清空信息
				if(this.$refs['deployForm']){
					this.$refs['deployForm'].resetFields();
				}
			},
			//redis
			addRedisDetail(index,data){
				this.isShowTextBox = false;
				this.isShowSelectBox = true;
				this.oneSelect = true;
				this.twoSelect = false;
				this.threeSelect = false;
				this.getServerList();

				//清空id
				this.addDataBasesId = null;
				
				//添加redis的deploy_id
				this.addDataBasesId = data.id;

				this.deployIndexDialog = index;
				this.deployDialogVisible = true;
				
				//清空信息
				if(this.$refs['deployForm']){
					this.$refs['deployForm'].resetFields();
				}
			},
			//端口号
			addPortDetail(index,data){
				this.isShowTextBox = false;
				this.isShowSelectBox = true;
				this.oneSelect = true;
				this.twoSelect = false;
				this.threeSelect = false;
				this.getServerList();

				//清空id
				this.addDataBasesId = null;
				
				//添加端口的deploy_id
				this.addDataBasesId = data.id;

				this.deployIndexDialog = index;
				this.deployDialogVisible = true;
				
				//清空信息
				if(this.$refs['deployForm']){
					this.$refs['deployForm'].resetFields();
				}
			},
			//nginx配置
			addNgnixDetail(index,data){
				this.isShowTextBox = false;
				this.isShowSelectBox = true;
				this.oneSelect = true;
				this.twoSelect = false;
				this.threeSelect = false;
				this.getServerList();

				//清空id
				this.addDataBasesId = null;
				
				//添加ngnix的deploy_id
				this.addDataBasesId = data.id;

				this.deployIndexDialog = index;
				this.deployDialogVisible = true;
				
				//清空信息
				if(this.$refs['deployForm']){
					this.$refs['deployForm'].resetFields();
				}
			},
			//自定义配置
			addUserDefinedDetail(index,data){
				// this.addId = null;

				this.deployIndexDialog = index;
				this.deployDialogVisible = true;
				//清空信息
				if(this.$refs['deployForm']){
					this.$refs['deployForm'].resetFields();
				}
			},
			//添加产品部署
			addDeploy(index,data){
				// this.addId = null;

				this.deployIndexDialog = index;
				this.deployDialogVisible = true;
				//清空信息
				if(this.$refs['deployForm']){
					this.$refs['deployForm'].resetFields();
				}
			},
			/* 
				确认添加部署
			*/
			addDeployForm(formName,type) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if(type===0){//添加数据库
							//判断该数据库是否已有
							if(this.projectDeployDatabasesList){
								for(var i = 0;i<this.projectDeployDatabasesList.length;i++){
									if(this.projectDeployDatabasesList[i].database_id===this.deployForm.database_id){
										this.$message.error("该数据库已有，不能重复添加！！", 20);
										return;
									}
								}
							}
							let form = {
								deploy_id:this.addDataBasesId,
								description:this.deployForm.description,
								database_id:this.deployForm.database_id,
							}
							this.axios.post(`${this.common.basePath}/deploy/database`,form).then( (response) => {
								if(response.data.meta.code === 0){
									this.$message.success("添加成功！！", 20);
									this.deployDialogVisible = false;
									this.getProjectDeployDatabasesList(this.addDataBasesId);
								}else{
									this.$message.error(response.data.meta.message, 20);   
								}
							}).catch( (error) => {
								this.$message.error(error);
							});
						}else if(type===1){//添加redis
							//判断该redis是否已有
							if(this.projectDeployRedisList){
								for(var i = 0;i<this.projectDeployRedisList.length;i++){
									if(this.projectDeployRedisList[i].index_id===this.deployForm.index_id){
										this.$message.error("该redis已有，不能重复添加！！", 20);
										return;
									}
								}
							}
							let form = {
								deploy_id:this.addDataBasesId,
								description:this.deployForm.description,
								index_id:this.deployForm.index_id,
							}
							this.axios.post(`${this.common.basePath}/deploy/redis`,form).then( (response) => {
								if(response.data.meta.code === 0){
									this.$message.success("添加成功！！", 20);
									this.deployDialogVisible = false;
									this.getProjectDeployRedisList(this.addDataBasesId);
								}else{
									this.$message.error(response.data.meta.message, 20);   
								}
							}).catch( (error) => {
								this.$message.error(error);
							});
						}else if(type===3){//添加ngnix
							//判断该nginx是否已有
							if(this.projectDeployNginxList){
								for(var i = 0;i<this.projectDeployNginxList.length;i++){
									if(this.projectDeployNginxList[i].location_id===this.deployForm.location_id){
										this.$message.error("该nginx已有，不能重复添加！！", 20);
										return;
									}
								}
							}
							let form = {
								deploy_id:this.addDataBasesId,
								description:this.deployForm.description,
								location_id:this.deployForm.location_id,
							}
							this.axios.post(`${this.common.basePath}/deploy/nginx`,form).then( (response) => {
								if(response.data.meta.code === 0){
									this.$message.success("添加成功！！", 20);
									this.deployDialogVisible = false;
									this.getProjectDeployNginxList(this.addDataBasesId);
								}else{
									this.$message.error(response.data.meta.message, 20);   
								}
							}).catch( (error) => {
								this.$message.error(error);
							});
						}else if(type===2){//添加port
							//判断该port是否已有
							if(this.projectDeployPortList){
								for(var i = 0;i<this.projectDeployPortList.length;i++){
									if(this.projectDeployPortList[i].port_id===this.deployForm.port_id){
										this.$message.error("该port已有，不能重复添加！！", 20);
										return;
									}
								}
							}
							let form = {
								deploy_id:this.addDataBasesId,
								description:this.deployForm.description,
								port_id:this.deployForm.port_id,
							}
							this.axios.post(`${this.common.basePath}/deploy/port`,form).then( (response) => {
								if(response.data.meta.code === 0){
									this.$message.success("添加成功！！", 20);
									this.deployDialogVisible = false;
									this.getProjectDeployPortList(this.addDataBasesId);
								}else{
									this.$message.error(response.data.meta.message, 20);   
								}
							}).catch( (error) => {
								this.$message.error(error);
							});
						}else if(type===4){//添加自定义
							let addForm = {
								custom:this.deployForm.custom,
							  describe:this.deployForm.describe,
							  keyt:this.deployForm.keyt,
							  position:this.deployForm.position,
							  structure:this.deployForm.structure,
							  proj_id:this.activeIndex,
							  // ser_id:1,
							};
							this.axios.post(`${this.common.basePath}/project_manage/addDeployOther`,addForm).then( (response) => {
								if(response.data.meta.code === 0){
									this.$message.success("添加成功！！", 20);
									this.deployDialogVisible = false;
									this.getProjectDeployDetail();
								}else{
									this.$message.error(response.data.meta.message, 20);   
								}
							}).catch( (error) => {
								this.$message.error(error);
							});
						}else if(type===5){//添加产品部署
							let addForm = {
								custom:this.deployForm.custom,
							  describe:this.deployForm.describe,
							  keyt:this.deployForm.keyt,
							  position:this.deployForm.position,
							  structure:this.deployForm.structure,
							  proj_id:this.activeIndex,
							  ser_id:null,
							};
							this.axios.post(`${this.common.basePath}/deploy`,addForm).then( (response) => {
								if(response.data.meta.code === 0){
									this.$message.success("添加成功！！", 20);
									this.deployDialogVisible = false;
									this.getProjectDeployList();
								}else{
									this.$message.error(response.data.meta.message, 20);   
								}
							}).catch( (error) => {
								this.$message.error(error);
							});
						}
					} else {
						this.$message.error('信息未填写完整！！！', 20); 
						return false;
					}
				});
			},
			
	  },
		mounted(){ 
			/* 
			处理tabTwoPages
			*/
			let projectPages = [];
			for(var i = 0;i<this.tabTwoPages.length;i++){
				if(this.tabTwoPages[i].split("_")[0]=="project"){
					projectPages.push(this.tabTwoPages[i])
				}
			}
			this.projectPages = projectPages;
			this.activeName = projectPages[0];
			
			/* 
				GET  查询--查询项目列表
			 */
			this.getProjectList();
			
		},
		data(){
			return {
				loading:false,//产品-列表加载
				loading_edit:false,//编辑加载
				loading_detail:false,//产品-详情的加载
				loading_function:false,//产品-详情的加载
				loading_deploy:false,//产品-部署的加载
				loading_add_deploy:false,//产品-部署-添加的加载
				loading_feedback:false,//产品-反馈的加载
				value:"",//产品-说明书
				preview:true,
				edit:false,
				navigation:true,
				projectPages:[],//产品的二级页面数组
				activeName:null,//tab切换的name
				activeIndex:null,//初始项目id
				projectList:null,//项目列表
				defaultProject:null,//默认项目
				
				elementPageData: {               
					//分页需要的数据
					defaultData:  this.common.elementPagination,
					pageNum:      this.common.elementPagination.pageNumDefault,
					pageSize:     this.common.elementPagination.pageSizeDefault_,
				},
				projectDetail:null,//项目---详情
				projectFunctionList:null,//项目---功能列表
				formInline: {
					date: null,//项目---反馈信息--产生时间
					state: null,//项目---反馈信息--状态
				},
				functionId:null,
				deployId:null,
				projectFeedbackDetail:null,//项目---反馈信息
				feedbackInfoTotall:0,//项目---反馈信息总条数
				projectDeployList:null,//项目---部署列表
				projectDeployDetail:null,//项目---部署详情
				projectDeployDatabasesList:null,//项目---数据库部署列表
				projectDeployRedisList:null,//项目---redis部署列表
				projectDeployNginxList:null,//项目---nginx部署列表
				projectDeployPortList:null,//项目---端口部署列表
				
				editDetailDialogVisible:false,//编辑产品详情弹框
				selectBox:true,
				icon:'el-icon-plus',
				buildText:'新建产品',
				projectForm:{//新建项目表单
					project: null,
					pronumber: null,
					present :null,
					description:null,
				},
				imageUrl: null,
				imageUrl_:null,
				myHeaders: {Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem("token"))},
				rules:{
					/*pci: [
						{ required: true, message: '请上传产品图片', trigger: 'blur' },
					],*/
					project: [
						{ required: true, message: '请输入产品名称', trigger: 'blur' },
						{ min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
					],
					pronumber: [
						{ required: true, message: '请输入产品编号', trigger: 'blur' },
						{ min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' },
						{	pattern: /^[A-Za-z0-9-]+$/, message: '产品编号只能由英文、中划线和数字组成' }
					],
					present: [
						{ required: true, message: '请输入产品负责人', trigger: 'blur' },
						{ min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' },
					],
					description: [
						{ required: true, message: '请输入产品简介', trigger: 'blur' },
						{ min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },
					],
				},
				
				isShowBuilt:false,//新建项目
				isShowDetail:false,//部署详情
				
				
				projectFunctionList:null,//项目---功能列表
				defaultFunctionProps: {
					children: 'childrens',
					label: 'name'
				},
				functionDialogVisible:false,//添加或者编辑功能树弹框
				functionTitleArr:['添加功能树子节点','编辑功能树节点','','添加功能树根节点',],
				functionTypeDialog:null,//弹框类型、名称
				tempAtId:null,//当前浮动选中的节点Id
				functionForm: {//功能树弹框表单
					after_person: null,
					describe: null,
					front_person: null,
					name: null,
					remarks: null,
				},
				addId:null,//添加功能树ID
				editId:null,//编辑功能树ID
				
				editDeployId:null,//编辑部署的id
				rId:null,//部署详情刷新列表的id
				deployDialogVisible:false,//添加部署详情弹框
				deployTitleArr:[
					'添加数据库',//0
					'添加redis',//1
					'添加端口号',//2
					'添加ngnix配置',//3
					'添加自定义配置',//4
					'添加产品部署',//5
					'编辑产品部署',//6
					'编辑数据库',//7
					'编辑redis',//8
					'编辑nginx',//9
					'编辑端口',//10
				],
				deployIndexDialog:null,//添加部署序号
				deployForm:{//添加部署弹框表单
					//自定义
					custom:null,
				  describe:null,
				  keyt:null,
				  position:null,
				  structure:null,
				  description:null,

				  database_id__:null,
				  database_id_:null,
				  database_id:null,

				  index_id:null,
				  index_id_:null,
				  index_id__:null,

				  location_id:null,
				  location_id_:null,
				  location_id__:null,

				  port_id:null,
				  port_id_:null,
				},
				serverOptions:null,//一级选择框的值
				serverOptions_:null,//二级选择框的值
				serverOptions__:null,//三级选择框的值
				oneSelect:true,
				twoSelect:false,
				threeSelect:false,
				isShowTextBox:false,
				isShowSelectBox:true,
				idConversionNameD:null,
				idConversionNameR:null,
				idConversionNameN:null,
				idConversionNameP:null,
				addDataBasesId:null,//添加部署-数据库、redis,port,ngnix的id
				
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

				//新建反馈信息
				feedbackDialogVisible:false,
				buildForm: {//新建框表单
					enclosure: null,
					desc: null,
					tel: null,
					name: null,
					deploy_id:null,
				},
				function:null,//发生位置的id数组

			}
		},
	};
</script> 