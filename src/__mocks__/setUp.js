import React from 'react'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

// 添加对react16的支持
configure({ adapter: new Adapter() })