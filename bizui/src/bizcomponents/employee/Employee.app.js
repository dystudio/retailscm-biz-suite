import React from 'react'
import PropTypes from 'prop-types'
import {
  Layout,
  Menu,
  Icon,
  Avatar,
  Dropdown,
  Tag,
  message,
  Spin,
  Breadcrumb,
  AutoComplete,
  Input,Button
} from 'antd'
import DocumentTitle from 'react-document-title'
import { connect } from 'dva'
import { Link, Route, Redirect, Switch } from 'dva/router'
import moment from 'moment'
import groupBy from 'lodash/groupBy'
import { ContainerQuery } from 'react-container-query'
import classNames from 'classnames'
import styles from './Employee.app.less'
import {sessionObject} from '../../utils/utils'

import HeaderSearch from '../../components/HeaderSearch';
import NoticeIcon from '../../components/NoticeIcon';
import GlobalFooter from '../../components/GlobalFooter';


import GlobalComponents from '../../custcomponents';

import PermissionSettingService from '../../permission/PermissionSetting.service'

const  {  filterForMenuPermission } = PermissionSettingService

const isMenuItemForDisplay = (item, targetObject, targetComponent) => {
  return true
}

const filteredMenuItems = (targetObject, targetComponent) => {
    const menuData = sessionObject('menuData')
    const isMenuItemForDisplayFunc = targetComponent.props.isMenuItemForDisplayFunc||isMenuItemForDisplay
    return menuData.subItems.filter(item=>filterForMenuPermission(item,targetObject,targetComponent)).filter(item=>isMenuItemForDisplayFunc(item,targetObject,targetComponent))
}



const { Header, Sider, Content } = Layout
const { SubMenu } = Menu

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
}




class EmployeeBizApp extends React.PureComponent {
  constructor(props) {
    super(props)
    // 把一级 Layout 的 children 作为菜单项
    // this.menus = getNavData().reduce((arr, current) => arr.concat(current.children), [])
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
    }
  }

  componentDidMount() {}
  componentWillUnmount() {
    clearTimeout(this.resizeTimeout)
  }
  onCollapse = (collapsed) => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    })
  }

  getDefaultCollapsedSubMenus = (props) => {
    const currentMenuSelectedKeys = [...this.getCurrentMenuSelectedKeys(props)]
    currentMenuSelectedKeys.splice(-1, 1)
    if (currentMenuSelectedKeys.length === 0) {
      return ['/employee/']
    }
    return currentMenuSelectedKeys
  }
  getCurrentMenuSelectedKeys = (props) => {
    const { location: { pathname } } = props || this.props
    const keys = pathname.split('/').slice(1)
    if (keys.length === 1 && keys[0] === '') {
      return [this.menus[0].key]
    }
    return keys
  }
  
  getNavMenuItems = (targetObject) => {
  

    const menuData = sessionObject('menuData')
    const targetApp = sessionObject('targetApp')
	const {objectId}=targetApp;
  
    return (
      
		  <Menu
             theme="dark"
             mode="inline"
            
             
             onOpenChange={this.handleOpenChange}
            
             defaultOpenKeys={['firstOne']}
             style={{ margin: '16px 0', width: '100%' }}
           >
           

             <Menu.Item key="dashboard">
               <Link to={`/employee/${this.props.employee.id}/dashboard`}><Icon type="dashboard" /><span>仪表板</span></Link>
             </Menu.Item>
             
		 <Menu.Item key="homepage">
               <Link to={"/home"}><Icon type="home" /><span>回到主页</span></Link>
             </Menu.Item>
             
             
         {filteredMenuItems(targetObject,this).map((item)=>(<Menu.Item key={item.name}>
          <Link to={`/${menuData.menuFor}/${objectId}/list/${item.name}/${item.displayName}列表`}>
          <Icon type="bars" /><span>{item.displayName}</span>
          </Link>
        </Menu.Item>))}
       
       <Menu.Item key="preference">
               <Link to={`/employee/${this.props.employee.id}/preference`}><Icon type="setting" /><span>设置</span></Link>
             </Menu.Item>
      
           </Menu>
    )
  }
  



  getEmployeeCompanyTrainingSearch = () => {
    const {EmployeeCompanyTrainingSearch} = GlobalComponents;
    return connect(state => ({
      rule: state.rule,
      name: "员工参与的公司培训",
      role: "employeeCompanyTraining",
      data: state._employee.employeeCompanyTrainingList,
      metaInfo: state._employee.employeeCompanyTrainingListMetaInfo,
      count: state._employee.employeeCompanyTrainingCount,
      currentPage: state._employee.employeeCompanyTrainingCurrentPageNumber,
      searchFormParameters: state._employee.employeeCompanyTrainingSearchFormParameters,
      searchParameters: {...state._employee.searchParameters},
      expandForm: state._employee.expandForm,
      loading: state._employee.loading,
      partialList: state._employee.partialList,
      owner: { type: '_employee', id: state._employee.id, 
      referenceName: 'employee', 
      listName: 'employeeCompanyTrainingList', ref:state._employee, 
      listDisplayName: '员工参与的公司培训列表' }, // this is for model namespace and
    }))(EmployeeCompanyTrainingSearch)
  }
  getEmployeeCompanyTrainingCreateForm = () => {
   	const {EmployeeCompanyTrainingCreateForm} = GlobalComponents;
    return connect(state => ({
      rule: state.rule,
      role: "employeeCompanyTraining",
      data: state._employee.employeeCompanyTrainingList,
      metaInfo: state._employee.employeeCompanyTrainingListMetaInfo,
      count: state._employee.employeeCompanyTrainingCount,
      currentPage: state._employee.employeeCompanyTrainingCurrentPageNumber,
      searchFormParameters: state._employee.employeeCompanyTrainingSearchFormParameters,
      loading: state._employee.loading,
      owner: { type: '_employee', id: state._employee.id, referenceName: 'employee', listName: 'employeeCompanyTrainingList', ref:state._employee, listDisplayName: '员工参与的公司培训列表'}, // this is for model namespace and
    }))(EmployeeCompanyTrainingCreateForm)
  }
  
  getEmployeeCompanyTrainingUpdateForm = () => {
  	const {EmployeeCompanyTrainingUpdateForm} = GlobalComponents;
    return connect(state => ({
      selectedRows: state._employee.selectedRows,
      role: "employeeCompanyTraining",
      currentUpdateIndex: state._employee.currentUpdateIndex,
      owner: { type: '_employee', id: state._employee.id, listName: 'employeeCompanyTrainingList', ref:state._employee, listDisplayName: '员工参与的公司培训列表' }, // this is for model namespace and
    }))(EmployeeCompanyTrainingUpdateForm)
  }

  getEmployeeSkillSearch = () => {
    const {EmployeeSkillSearch} = GlobalComponents;
    return connect(state => ({
      rule: state.rule,
      name: "员工技能",
      role: "employeeSkill",
      data: state._employee.employeeSkillList,
      metaInfo: state._employee.employeeSkillListMetaInfo,
      count: state._employee.employeeSkillCount,
      currentPage: state._employee.employeeSkillCurrentPageNumber,
      searchFormParameters: state._employee.employeeSkillSearchFormParameters,
      searchParameters: {...state._employee.searchParameters},
      expandForm: state._employee.expandForm,
      loading: state._employee.loading,
      partialList: state._employee.partialList,
      owner: { type: '_employee', id: state._employee.id, 
      referenceName: 'employee', 
      listName: 'employeeSkillList', ref:state._employee, 
      listDisplayName: '员工技能列表' }, // this is for model namespace and
    }))(EmployeeSkillSearch)
  }
  getEmployeeSkillCreateForm = () => {
   	const {EmployeeSkillCreateForm} = GlobalComponents;
    return connect(state => ({
      rule: state.rule,
      role: "employeeSkill",
      data: state._employee.employeeSkillList,
      metaInfo: state._employee.employeeSkillListMetaInfo,
      count: state._employee.employeeSkillCount,
      currentPage: state._employee.employeeSkillCurrentPageNumber,
      searchFormParameters: state._employee.employeeSkillSearchFormParameters,
      loading: state._employee.loading,
      owner: { type: '_employee', id: state._employee.id, referenceName: 'employee', listName: 'employeeSkillList', ref:state._employee, listDisplayName: '员工技能列表'}, // this is for model namespace and
    }))(EmployeeSkillCreateForm)
  }
  
  getEmployeeSkillUpdateForm = () => {
  	const {EmployeeSkillUpdateForm} = GlobalComponents;
    return connect(state => ({
      selectedRows: state._employee.selectedRows,
      role: "employeeSkill",
      currentUpdateIndex: state._employee.currentUpdateIndex,
      owner: { type: '_employee', id: state._employee.id, listName: 'employeeSkillList', ref:state._employee, listDisplayName: '员工技能列表' }, // this is for model namespace and
    }))(EmployeeSkillUpdateForm)
  }

  getEmployeePerformanceSearch = () => {
    const {EmployeePerformanceSearch} = GlobalComponents;
    return connect(state => ({
      rule: state.rule,
      name: "员工绩效",
      role: "employeePerformance",
      data: state._employee.employeePerformanceList,
      metaInfo: state._employee.employeePerformanceListMetaInfo,
      count: state._employee.employeePerformanceCount,
      currentPage: state._employee.employeePerformanceCurrentPageNumber,
      searchFormParameters: state._employee.employeePerformanceSearchFormParameters,
      searchParameters: {...state._employee.searchParameters},
      expandForm: state._employee.expandForm,
      loading: state._employee.loading,
      partialList: state._employee.partialList,
      owner: { type: '_employee', id: state._employee.id, 
      referenceName: 'employee', 
      listName: 'employeePerformanceList', ref:state._employee, 
      listDisplayName: '员工绩效列表' }, // this is for model namespace and
    }))(EmployeePerformanceSearch)
  }
  getEmployeePerformanceCreateForm = () => {
   	const {EmployeePerformanceCreateForm} = GlobalComponents;
    return connect(state => ({
      rule: state.rule,
      role: "employeePerformance",
      data: state._employee.employeePerformanceList,
      metaInfo: state._employee.employeePerformanceListMetaInfo,
      count: state._employee.employeePerformanceCount,
      currentPage: state._employee.employeePerformanceCurrentPageNumber,
      searchFormParameters: state._employee.employeePerformanceSearchFormParameters,
      loading: state._employee.loading,
      owner: { type: '_employee', id: state._employee.id, referenceName: 'employee', listName: 'employeePerformanceList', ref:state._employee, listDisplayName: '员工绩效列表'}, // this is for model namespace and
    }))(EmployeePerformanceCreateForm)
  }
  
  getEmployeePerformanceUpdateForm = () => {
  	const {EmployeePerformanceUpdateForm} = GlobalComponents;
    return connect(state => ({
      selectedRows: state._employee.selectedRows,
      role: "employeePerformance",
      currentUpdateIndex: state._employee.currentUpdateIndex,
      owner: { type: '_employee', id: state._employee.id, listName: 'employeePerformanceList', ref:state._employee, listDisplayName: '员工绩效列表' }, // this is for model namespace and
    }))(EmployeePerformanceUpdateForm)
  }

  getEmployeeWorkExperienceSearch = () => {
    const {EmployeeWorkExperienceSearch} = GlobalComponents;
    return connect(state => ({
      rule: state.rule,
      name: "员工工作经验",
      role: "employeeWorkExperience",
      data: state._employee.employeeWorkExperienceList,
      metaInfo: state._employee.employeeWorkExperienceListMetaInfo,
      count: state._employee.employeeWorkExperienceCount,
      currentPage: state._employee.employeeWorkExperienceCurrentPageNumber,
      searchFormParameters: state._employee.employeeWorkExperienceSearchFormParameters,
      searchParameters: {...state._employee.searchParameters},
      expandForm: state._employee.expandForm,
      loading: state._employee.loading,
      partialList: state._employee.partialList,
      owner: { type: '_employee', id: state._employee.id, 
      referenceName: 'employee', 
      listName: 'employeeWorkExperienceList', ref:state._employee, 
      listDisplayName: '员工工作经验列表' }, // this is for model namespace and
    }))(EmployeeWorkExperienceSearch)
  }
  getEmployeeWorkExperienceCreateForm = () => {
   	const {EmployeeWorkExperienceCreateForm} = GlobalComponents;
    return connect(state => ({
      rule: state.rule,
      role: "employeeWorkExperience",
      data: state._employee.employeeWorkExperienceList,
      metaInfo: state._employee.employeeWorkExperienceListMetaInfo,
      count: state._employee.employeeWorkExperienceCount,
      currentPage: state._employee.employeeWorkExperienceCurrentPageNumber,
      searchFormParameters: state._employee.employeeWorkExperienceSearchFormParameters,
      loading: state._employee.loading,
      owner: { type: '_employee', id: state._employee.id, referenceName: 'employee', listName: 'employeeWorkExperienceList', ref:state._employee, listDisplayName: '员工工作经验列表'}, // this is for model namespace and
    }))(EmployeeWorkExperienceCreateForm)
  }
  
  getEmployeeWorkExperienceUpdateForm = () => {
  	const {EmployeeWorkExperienceUpdateForm} = GlobalComponents;
    return connect(state => ({
      selectedRows: state._employee.selectedRows,
      role: "employeeWorkExperience",
      currentUpdateIndex: state._employee.currentUpdateIndex,
      owner: { type: '_employee', id: state._employee.id, listName: 'employeeWorkExperienceList', ref:state._employee, listDisplayName: '员工工作经验列表' }, // this is for model namespace and
    }))(EmployeeWorkExperienceUpdateForm)
  }

  getEmployeeLeaveSearch = () => {
    const {EmployeeLeaveSearch} = GlobalComponents;
    return connect(state => ({
      rule: state.rule,
      name: "请假记录",
      role: "employeeLeave",
      data: state._employee.employeeLeaveList,
      metaInfo: state._employee.employeeLeaveListMetaInfo,
      count: state._employee.employeeLeaveCount,
      currentPage: state._employee.employeeLeaveCurrentPageNumber,
      searchFormParameters: state._employee.employeeLeaveSearchFormParameters,
      searchParameters: {...state._employee.searchParameters},
      expandForm: state._employee.expandForm,
      loading: state._employee.loading,
      partialList: state._employee.partialList,
      owner: { type: '_employee', id: state._employee.id, 
      referenceName: 'who', 
      listName: 'employeeLeaveList', ref:state._employee, 
      listDisplayName: '请假记录列表' }, // this is for model namespace and
    }))(EmployeeLeaveSearch)
  }
  getEmployeeLeaveCreateForm = () => {
   	const {EmployeeLeaveCreateForm} = GlobalComponents;
    return connect(state => ({
      rule: state.rule,
      role: "employeeLeave",
      data: state._employee.employeeLeaveList,
      metaInfo: state._employee.employeeLeaveListMetaInfo,
      count: state._employee.employeeLeaveCount,
      currentPage: state._employee.employeeLeaveCurrentPageNumber,
      searchFormParameters: state._employee.employeeLeaveSearchFormParameters,
      loading: state._employee.loading,
      owner: { type: '_employee', id: state._employee.id, referenceName: 'who', listName: 'employeeLeaveList', ref:state._employee, listDisplayName: '请假记录列表'}, // this is for model namespace and
    }))(EmployeeLeaveCreateForm)
  }
  
  getEmployeeLeaveUpdateForm = () => {
  	const {EmployeeLeaveUpdateForm} = GlobalComponents;
    return connect(state => ({
      selectedRows: state._employee.selectedRows,
      role: "employeeLeave",
      currentUpdateIndex: state._employee.currentUpdateIndex,
      owner: { type: '_employee', id: state._employee.id, listName: 'employeeLeaveList', ref:state._employee, listDisplayName: '请假记录列表' }, // this is for model namespace and
    }))(EmployeeLeaveUpdateForm)
  }

  getEmployeeInterviewSearch = () => {
    const {EmployeeInterviewSearch} = GlobalComponents;
    return connect(state => ({
      rule: state.rule,
      name: "员工面试",
      role: "employeeInterview",
      data: state._employee.employeeInterviewList,
      metaInfo: state._employee.employeeInterviewListMetaInfo,
      count: state._employee.employeeInterviewCount,
      currentPage: state._employee.employeeInterviewCurrentPageNumber,
      searchFormParameters: state._employee.employeeInterviewSearchFormParameters,
      searchParameters: {...state._employee.searchParameters},
      expandForm: state._employee.expandForm,
      loading: state._employee.loading,
      partialList: state._employee.partialList,
      owner: { type: '_employee', id: state._employee.id, 
      referenceName: 'employee', 
      listName: 'employeeInterviewList', ref:state._employee, 
      listDisplayName: '员工面试列表' }, // this is for model namespace and
    }))(EmployeeInterviewSearch)
  }
  getEmployeeInterviewCreateForm = () => {
   	const {EmployeeInterviewCreateForm} = GlobalComponents;
    return connect(state => ({
      rule: state.rule,
      role: "employeeInterview",
      data: state._employee.employeeInterviewList,
      metaInfo: state._employee.employeeInterviewListMetaInfo,
      count: state._employee.employeeInterviewCount,
      currentPage: state._employee.employeeInterviewCurrentPageNumber,
      searchFormParameters: state._employee.employeeInterviewSearchFormParameters,
      loading: state._employee.loading,
      owner: { type: '_employee', id: state._employee.id, referenceName: 'employee', listName: 'employeeInterviewList', ref:state._employee, listDisplayName: '员工面试列表'}, // this is for model namespace and
    }))(EmployeeInterviewCreateForm)
  }
  
  getEmployeeInterviewUpdateForm = () => {
  	const {EmployeeInterviewUpdateForm} = GlobalComponents;
    return connect(state => ({
      selectedRows: state._employee.selectedRows,
      role: "employeeInterview",
      currentUpdateIndex: state._employee.currentUpdateIndex,
      owner: { type: '_employee', id: state._employee.id, listName: 'employeeInterviewList', ref:state._employee, listDisplayName: '员工面试列表' }, // this is for model namespace and
    }))(EmployeeInterviewUpdateForm)
  }

  getEmployeeAttendanceSearch = () => {
    const {EmployeeAttendanceSearch} = GlobalComponents;
    return connect(state => ({
      rule: state.rule,
      name: "员工考勤",
      role: "employeeAttendance",
      data: state._employee.employeeAttendanceList,
      metaInfo: state._employee.employeeAttendanceListMetaInfo,
      count: state._employee.employeeAttendanceCount,
      currentPage: state._employee.employeeAttendanceCurrentPageNumber,
      searchFormParameters: state._employee.employeeAttendanceSearchFormParameters,
      searchParameters: {...state._employee.searchParameters},
      expandForm: state._employee.expandForm,
      loading: state._employee.loading,
      partialList: state._employee.partialList,
      owner: { type: '_employee', id: state._employee.id, 
      referenceName: 'employee', 
      listName: 'employeeAttendanceList', ref:state._employee, 
      listDisplayName: '员工考勤列表' }, // this is for model namespace and
    }))(EmployeeAttendanceSearch)
  }
  getEmployeeAttendanceCreateForm = () => {
   	const {EmployeeAttendanceCreateForm} = GlobalComponents;
    return connect(state => ({
      rule: state.rule,
      role: "employeeAttendance",
      data: state._employee.employeeAttendanceList,
      metaInfo: state._employee.employeeAttendanceListMetaInfo,
      count: state._employee.employeeAttendanceCount,
      currentPage: state._employee.employeeAttendanceCurrentPageNumber,
      searchFormParameters: state._employee.employeeAttendanceSearchFormParameters,
      loading: state._employee.loading,
      owner: { type: '_employee', id: state._employee.id, referenceName: 'employee', listName: 'employeeAttendanceList', ref:state._employee, listDisplayName: '员工考勤列表'}, // this is for model namespace and
    }))(EmployeeAttendanceCreateForm)
  }
  
  getEmployeeAttendanceUpdateForm = () => {
  	const {EmployeeAttendanceUpdateForm} = GlobalComponents;
    return connect(state => ({
      selectedRows: state._employee.selectedRows,
      role: "employeeAttendance",
      currentUpdateIndex: state._employee.currentUpdateIndex,
      owner: { type: '_employee', id: state._employee.id, listName: 'employeeAttendanceList', ref:state._employee, listDisplayName: '员工考勤列表' }, // this is for model namespace and
    }))(EmployeeAttendanceUpdateForm)
  }

  getEmployeeQualifierSearch = () => {
    const {EmployeeQualifierSearch} = GlobalComponents;
    return connect(state => ({
      rule: state.rule,
      name: "员工资质",
      role: "employeeQualifier",
      data: state._employee.employeeQualifierList,
      metaInfo: state._employee.employeeQualifierListMetaInfo,
      count: state._employee.employeeQualifierCount,
      currentPage: state._employee.employeeQualifierCurrentPageNumber,
      searchFormParameters: state._employee.employeeQualifierSearchFormParameters,
      searchParameters: {...state._employee.searchParameters},
      expandForm: state._employee.expandForm,
      loading: state._employee.loading,
      partialList: state._employee.partialList,
      owner: { type: '_employee', id: state._employee.id, 
      referenceName: 'employee', 
      listName: 'employeeQualifierList', ref:state._employee, 
      listDisplayName: '员工资质列表' }, // this is for model namespace and
    }))(EmployeeQualifierSearch)
  }
  getEmployeeQualifierCreateForm = () => {
   	const {EmployeeQualifierCreateForm} = GlobalComponents;
    return connect(state => ({
      rule: state.rule,
      role: "employeeQualifier",
      data: state._employee.employeeQualifierList,
      metaInfo: state._employee.employeeQualifierListMetaInfo,
      count: state._employee.employeeQualifierCount,
      currentPage: state._employee.employeeQualifierCurrentPageNumber,
      searchFormParameters: state._employee.employeeQualifierSearchFormParameters,
      loading: state._employee.loading,
      owner: { type: '_employee', id: state._employee.id, referenceName: 'employee', listName: 'employeeQualifierList', ref:state._employee, listDisplayName: '员工资质列表'}, // this is for model namespace and
    }))(EmployeeQualifierCreateForm)
  }
  
  getEmployeeQualifierUpdateForm = () => {
  	const {EmployeeQualifierUpdateForm} = GlobalComponents;
    return connect(state => ({
      selectedRows: state._employee.selectedRows,
      role: "employeeQualifier",
      currentUpdateIndex: state._employee.currentUpdateIndex,
      owner: { type: '_employee', id: state._employee.id, listName: 'employeeQualifierList', ref:state._employee, listDisplayName: '员工资质列表' }, // this is for model namespace and
    }))(EmployeeQualifierUpdateForm)
  }

  getEmployeeEducationSearch = () => {
    const {EmployeeEducationSearch} = GlobalComponents;
    return connect(state => ({
      rule: state.rule,
      name: "员工教育",
      role: "employeeEducation",
      data: state._employee.employeeEducationList,
      metaInfo: state._employee.employeeEducationListMetaInfo,
      count: state._employee.employeeEducationCount,
      currentPage: state._employee.employeeEducationCurrentPageNumber,
      searchFormParameters: state._employee.employeeEducationSearchFormParameters,
      searchParameters: {...state._employee.searchParameters},
      expandForm: state._employee.expandForm,
      loading: state._employee.loading,
      partialList: state._employee.partialList,
      owner: { type: '_employee', id: state._employee.id, 
      referenceName: 'employee', 
      listName: 'employeeEducationList', ref:state._employee, 
      listDisplayName: '员工教育列表' }, // this is for model namespace and
    }))(EmployeeEducationSearch)
  }
  getEmployeeEducationCreateForm = () => {
   	const {EmployeeEducationCreateForm} = GlobalComponents;
    return connect(state => ({
      rule: state.rule,
      role: "employeeEducation",
      data: state._employee.employeeEducationList,
      metaInfo: state._employee.employeeEducationListMetaInfo,
      count: state._employee.employeeEducationCount,
      currentPage: state._employee.employeeEducationCurrentPageNumber,
      searchFormParameters: state._employee.employeeEducationSearchFormParameters,
      loading: state._employee.loading,
      owner: { type: '_employee', id: state._employee.id, referenceName: 'employee', listName: 'employeeEducationList', ref:state._employee, listDisplayName: '员工教育列表'}, // this is for model namespace and
    }))(EmployeeEducationCreateForm)
  }
  
  getEmployeeEducationUpdateForm = () => {
  	const {EmployeeEducationUpdateForm} = GlobalComponents;
    return connect(state => ({
      selectedRows: state._employee.selectedRows,
      role: "employeeEducation",
      currentUpdateIndex: state._employee.currentUpdateIndex,
      owner: { type: '_employee', id: state._employee.id, listName: 'employeeEducationList', ref:state._employee, listDisplayName: '员工教育列表' }, // this is for model namespace and
    }))(EmployeeEducationUpdateForm)
  }

  getEmployeeAwardSearch = () => {
    const {EmployeeAwardSearch} = GlobalComponents;
    return connect(state => ({
      rule: state.rule,
      name: "员工嘉奖",
      role: "employeeAward",
      data: state._employee.employeeAwardList,
      metaInfo: state._employee.employeeAwardListMetaInfo,
      count: state._employee.employeeAwardCount,
      currentPage: state._employee.employeeAwardCurrentPageNumber,
      searchFormParameters: state._employee.employeeAwardSearchFormParameters,
      searchParameters: {...state._employee.searchParameters},
      expandForm: state._employee.expandForm,
      loading: state._employee.loading,
      partialList: state._employee.partialList,
      owner: { type: '_employee', id: state._employee.id, 
      referenceName: 'employee', 
      listName: 'employeeAwardList', ref:state._employee, 
      listDisplayName: '员工嘉奖列表' }, // this is for model namespace and
    }))(EmployeeAwardSearch)
  }
  getEmployeeAwardCreateForm = () => {
   	const {EmployeeAwardCreateForm} = GlobalComponents;
    return connect(state => ({
      rule: state.rule,
      role: "employeeAward",
      data: state._employee.employeeAwardList,
      metaInfo: state._employee.employeeAwardListMetaInfo,
      count: state._employee.employeeAwardCount,
      currentPage: state._employee.employeeAwardCurrentPageNumber,
      searchFormParameters: state._employee.employeeAwardSearchFormParameters,
      loading: state._employee.loading,
      owner: { type: '_employee', id: state._employee.id, referenceName: 'employee', listName: 'employeeAwardList', ref:state._employee, listDisplayName: '员工嘉奖列表'}, // this is for model namespace and
    }))(EmployeeAwardCreateForm)
  }
  
  getEmployeeAwardUpdateForm = () => {
  	const {EmployeeAwardUpdateForm} = GlobalComponents;
    return connect(state => ({
      selectedRows: state._employee.selectedRows,
      role: "employeeAward",
      currentUpdateIndex: state._employee.currentUpdateIndex,
      owner: { type: '_employee', id: state._employee.id, listName: 'employeeAwardList', ref:state._employee, listDisplayName: '员工嘉奖列表' }, // this is for model namespace and
    }))(EmployeeAwardUpdateForm)
  }

  getEmployeeSalarySheetSearch = () => {
    const {EmployeeSalarySheetSearch} = GlobalComponents;
    return connect(state => ({
      rule: state.rule,
      name: "工资单",
      role: "employeeSalarySheet",
      data: state._employee.employeeSalarySheetList,
      metaInfo: state._employee.employeeSalarySheetListMetaInfo,
      count: state._employee.employeeSalarySheetCount,
      currentPage: state._employee.employeeSalarySheetCurrentPageNumber,
      searchFormParameters: state._employee.employeeSalarySheetSearchFormParameters,
      searchParameters: {...state._employee.searchParameters},
      expandForm: state._employee.expandForm,
      loading: state._employee.loading,
      partialList: state._employee.partialList,
      owner: { type: '_employee', id: state._employee.id, 
      referenceName: 'employee', 
      listName: 'employeeSalarySheetList', ref:state._employee, 
      listDisplayName: '工资单列表' }, // this is for model namespace and
    }))(EmployeeSalarySheetSearch)
  }
  getEmployeeSalarySheetCreateForm = () => {
   	const {EmployeeSalarySheetCreateForm} = GlobalComponents;
    return connect(state => ({
      rule: state.rule,
      role: "employeeSalarySheet",
      data: state._employee.employeeSalarySheetList,
      metaInfo: state._employee.employeeSalarySheetListMetaInfo,
      count: state._employee.employeeSalarySheetCount,
      currentPage: state._employee.employeeSalarySheetCurrentPageNumber,
      searchFormParameters: state._employee.employeeSalarySheetSearchFormParameters,
      loading: state._employee.loading,
      owner: { type: '_employee', id: state._employee.id, referenceName: 'employee', listName: 'employeeSalarySheetList', ref:state._employee, listDisplayName: '工资单列表'}, // this is for model namespace and
    }))(EmployeeSalarySheetCreateForm)
  }
  
  getEmployeeSalarySheetUpdateForm = () => {
  	const {EmployeeSalarySheetUpdateForm} = GlobalComponents;
    return connect(state => ({
      selectedRows: state._employee.selectedRows,
      role: "employeeSalarySheet",
      currentUpdateIndex: state._employee.currentUpdateIndex,
      owner: { type: '_employee', id: state._employee.id, listName: 'employeeSalarySheetList', ref:state._employee, listDisplayName: '工资单列表' }, // this is for model namespace and
    }))(EmployeeSalarySheetUpdateForm)
  }

  getPayingOffSearch = () => {
    const {PayingOffSearch} = GlobalComponents;
    return connect(state => ({
      rule: state.rule,
      name: "工资支付",
      role: "payingOff",
      data: state._employee.payingOffList,
      metaInfo: state._employee.payingOffListMetaInfo,
      count: state._employee.payingOffCount,
      currentPage: state._employee.payingOffCurrentPageNumber,
      searchFormParameters: state._employee.payingOffSearchFormParameters,
      searchParameters: {...state._employee.searchParameters},
      expandForm: state._employee.expandForm,
      loading: state._employee.loading,
      partialList: state._employee.partialList,
      owner: { type: '_employee', id: state._employee.id, 
      referenceName: 'paidFor', 
      listName: 'payingOffList', ref:state._employee, 
      listDisplayName: '工资支付列表' }, // this is for model namespace and
    }))(PayingOffSearch)
  }
  getPayingOffCreateForm = () => {
   	const {PayingOffCreateForm} = GlobalComponents;
    return connect(state => ({
      rule: state.rule,
      role: "payingOff",
      data: state._employee.payingOffList,
      metaInfo: state._employee.payingOffListMetaInfo,
      count: state._employee.payingOffCount,
      currentPage: state._employee.payingOffCurrentPageNumber,
      searchFormParameters: state._employee.payingOffSearchFormParameters,
      loading: state._employee.loading,
      owner: { type: '_employee', id: state._employee.id, referenceName: 'paidFor', listName: 'payingOffList', ref:state._employee, listDisplayName: '工资支付列表'}, // this is for model namespace and
    }))(PayingOffCreateForm)
  }
  
  getPayingOffUpdateForm = () => {
  	const {PayingOffUpdateForm} = GlobalComponents;
    return connect(state => ({
      selectedRows: state._employee.selectedRows,
      role: "payingOff",
      currentUpdateIndex: state._employee.currentUpdateIndex,
      owner: { type: '_employee', id: state._employee.id, listName: 'payingOffList', ref:state._employee, listDisplayName: '工资支付列表' }, // this is for model namespace and
    }))(PayingOffUpdateForm)
  }


  
  buildRouters = () =>{
  	const {EmployeeDashboard} = GlobalComponents
  	const {EmployeePreference} = GlobalComponents
  	
  	
  	const routers=[
  	{path:"/employee/:id/dashboard", component: EmployeeDashboard},
  	{path:"/employee/:id/preference", component: EmployeePreference},
  	
  	
  	
  	{path:"/employee/:id/list/employeeCompanyTrainingList", component: this.getEmployeeCompanyTrainingSearch()},
  	{path:"/employee/:id/list/employeeCompanyTrainingCreateForm", component: this.getEmployeeCompanyTrainingCreateForm()},
  	{path:"/employee/:id/list/employeeCompanyTrainingUpdateForm", component: this.getEmployeeCompanyTrainingUpdateForm()},
   	
  	{path:"/employee/:id/list/employeeSkillList", component: this.getEmployeeSkillSearch()},
  	{path:"/employee/:id/list/employeeSkillCreateForm", component: this.getEmployeeSkillCreateForm()},
  	{path:"/employee/:id/list/employeeSkillUpdateForm", component: this.getEmployeeSkillUpdateForm()},
   	
  	{path:"/employee/:id/list/employeePerformanceList", component: this.getEmployeePerformanceSearch()},
  	{path:"/employee/:id/list/employeePerformanceCreateForm", component: this.getEmployeePerformanceCreateForm()},
  	{path:"/employee/:id/list/employeePerformanceUpdateForm", component: this.getEmployeePerformanceUpdateForm()},
   	
  	{path:"/employee/:id/list/employeeWorkExperienceList", component: this.getEmployeeWorkExperienceSearch()},
  	{path:"/employee/:id/list/employeeWorkExperienceCreateForm", component: this.getEmployeeWorkExperienceCreateForm()},
  	{path:"/employee/:id/list/employeeWorkExperienceUpdateForm", component: this.getEmployeeWorkExperienceUpdateForm()},
   	
  	{path:"/employee/:id/list/employeeLeaveList", component: this.getEmployeeLeaveSearch()},
  	{path:"/employee/:id/list/employeeLeaveCreateForm", component: this.getEmployeeLeaveCreateForm()},
  	{path:"/employee/:id/list/employeeLeaveUpdateForm", component: this.getEmployeeLeaveUpdateForm()},
   	
  	{path:"/employee/:id/list/employeeInterviewList", component: this.getEmployeeInterviewSearch()},
  	{path:"/employee/:id/list/employeeInterviewCreateForm", component: this.getEmployeeInterviewCreateForm()},
  	{path:"/employee/:id/list/employeeInterviewUpdateForm", component: this.getEmployeeInterviewUpdateForm()},
   	
  	{path:"/employee/:id/list/employeeAttendanceList", component: this.getEmployeeAttendanceSearch()},
  	{path:"/employee/:id/list/employeeAttendanceCreateForm", component: this.getEmployeeAttendanceCreateForm()},
  	{path:"/employee/:id/list/employeeAttendanceUpdateForm", component: this.getEmployeeAttendanceUpdateForm()},
   	
  	{path:"/employee/:id/list/employeeQualifierList", component: this.getEmployeeQualifierSearch()},
  	{path:"/employee/:id/list/employeeQualifierCreateForm", component: this.getEmployeeQualifierCreateForm()},
  	{path:"/employee/:id/list/employeeQualifierUpdateForm", component: this.getEmployeeQualifierUpdateForm()},
   	
  	{path:"/employee/:id/list/employeeEducationList", component: this.getEmployeeEducationSearch()},
  	{path:"/employee/:id/list/employeeEducationCreateForm", component: this.getEmployeeEducationCreateForm()},
  	{path:"/employee/:id/list/employeeEducationUpdateForm", component: this.getEmployeeEducationUpdateForm()},
   	
  	{path:"/employee/:id/list/employeeAwardList", component: this.getEmployeeAwardSearch()},
  	{path:"/employee/:id/list/employeeAwardCreateForm", component: this.getEmployeeAwardCreateForm()},
  	{path:"/employee/:id/list/employeeAwardUpdateForm", component: this.getEmployeeAwardUpdateForm()},
   	
  	{path:"/employee/:id/list/employeeSalarySheetList", component: this.getEmployeeSalarySheetSearch()},
  	{path:"/employee/:id/list/employeeSalarySheetCreateForm", component: this.getEmployeeSalarySheetCreateForm()},
  	{path:"/employee/:id/list/employeeSalarySheetUpdateForm", component: this.getEmployeeSalarySheetUpdateForm()},
   	
  	{path:"/employee/:id/list/payingOffList", component: this.getPayingOffSearch()},
  	{path:"/employee/:id/list/payingOffCreateForm", component: this.getPayingOffCreateForm()},
  	{path:"/employee/:id/list/payingOffUpdateForm", component: this.getPayingOffUpdateForm()},
     	
  	
  	]
  	
  	const {extraRoutesFunc} = this.props;
	const extraRoutes = extraRoutesFunc?extraRoutesFunc():[]
    const finalRoutes = routers.concat(extraRoutes)
    
  	return (<Switch>
             {finalRoutes.map((item)=>(<Route key={item.path} path={item.path} component={item.component} />))}    
  	  	</Switch>)
  	
  
  }
 

  getPageTitle = () => {
    // const { location } = this.props
    // const { pathname } = location
    const title = '双链小超全流程供应链系统'
    return title
  }
 
  handleOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1)
    this.setState({
      openKeys: latestOpenKey ? [latestOpenKey] : [],
    })
  }
   toggle = () => {
     const { collapsed } = this.props
     this.props.dispatch({
       type: 'global/changeLayoutCollapsed',
       payload: !collapsed,
     })
   }
    logout = () => {
   
    console.log("log out called")
    this.props.dispatch({ type: 'launcher/signOut' })
  }
   render() {
     // const { collapsed, fetchingNotices,loading } = this.props
     const { collapsed } = this.props
     const { breadcrumb }  = this.props

     //const {EmployeeEditDetail} = GlobalComponents
     //const {EmployeeViewDetail} = GlobalComponents
     
     
     const targetApp = sessionObject('targetApp')
     const currentBreadcrumb =sessionObject(targetApp.id)
     
     
     // Don't show popup menu when it is been collapsed
     const menuProps = collapsed ? {} : {
       openKeys: this.state.openKeys,
     }
     const layout = (
     <Layout>
        <Header>
          
          <div className={styles.left}>
          <img
            src="./favicon.png"
            alt="logo"
            onClick={this.toggle}
            className={styles.logo}
          />
          {currentBreadcrumb.map((item)=>{
            return (<Link  key={item.link} to={`${item.link}`} className={styles.breadcrumbLink}> &gt;{item.name}</Link>)

          })}
         </div>
          <div className={styles.right}  >
          <Button type="primary"  icon="logout" onClick={()=>this.logout()}>
          退出</Button>
          </div>
          
        </Header>
       <Layout>
         <Sider
           trigger={null}
           collapsible
           collapsed={collapsed}
           breakpoint="md"
           onCollapse={()=>this.onCollapse(collapsed)}
           collapsedWidth={56}
           className={styles.sider}
         >

		 {this.getNavMenuItems(this.props.employee)}
		 
         </Sider>
         <Layout>
           <Content style={{ margin: '24px 24px 0', height: '100%' }}>
           
           {this.buildRouters()}
 
             
             
           </Content>
          </Layout>
        </Layout>
      </Layout>
     )
     return (
       <DocumentTitle title={this.getPageTitle()}>
         <ContainerQuery query={query}>
           {params => <div className={classNames(params)}>{layout}</div>}
         </ContainerQuery>
       </DocumentTitle>
     )
   }
}

export default connect(state => ({
  collapsed: state.global.collapsed,
  fetchingNotices: state.global.fetchingNotices,
  notices: state.global.notices,
  employee: state._employee,
  ...state,
}))(EmployeeBizApp)



