import axios from 'axios'

let base = process.env.API_ROOT;

//初始化查询
export const getPayMemInfoNew = params => { return axios.post(`${base}/pay/cashier/getPayMemInfoNew`, params).then(res => res.data); };
//查询优惠券
export const queryCoupon = params => { return axios.post(`${base}/pay/cashier/queryCoupon`, params).then(res => res.data); };
// export const getCode = params => { return axios.get(`${base}/pay/getCode`,{ params: params }); };
