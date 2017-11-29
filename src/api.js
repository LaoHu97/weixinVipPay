import axios from 'axios'

let base = "http://test.weupay.com";

//初始化查询
export const getPayMemInfoNew = params => { return axios.post(`${base}/pay/cashier/getPayMemInfoNew`, params).then(res => res.data); };
// //验证码
// export const getCode = params => { return axios.get(`${base}/pay/getCode`,{ params: params }); };
