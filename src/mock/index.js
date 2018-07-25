// http://mockjs.com/
import CodeList from './code/code-list.js'
const Mock = require('mockjs')
const rootPath = process.env.API_ROOT
Mock.mock(rootPath + '/project/projects', CodeList)
