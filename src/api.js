import axios from 'axios'

let base = process.env.API_ROOT;
console.log(base);
//初始化查询
export const getPayMemInfo = params => { return axios.post(`${base}/pay/cashier/getPayMemInfo`, params).then(res => res.data); };
//查询优惠券
export const queryCoupon = params => { return axios.post(`${base}/pay/cashier/queryCoupon`, params).then(res => res.data); };
//下单
export const getPrepayInfo = params => { return axios.post(`${base}/pay/cashier/getPrepayInfo`, params).then(res => res.data); };
//会员下单
export const getPayInfoByMemCard = params => { return axios.post(`${base}/pay/cashier/getPayInfoByMemCard`, params).then(res => res.data); };
export const updateMempayInfo = params => { return axios.post(`${base}/pay/cashier/updateMempayInfo`, params).then(res => res.data); };
//查询广告
export const queryAd = params => { return axios.post(`${base}/pay/ad/queryAd`, params).then(res => res.data); };
// export const getCode = params => { return axios.get(`${base}/pay/getCode`,{ params: params }); };
