import { get, post } from '../http';

export const getList = () => get({ url: '/api/getList' }); // 获取列表
export const logout = data => post({ url: '/api/logout', data }); // 退出登录
