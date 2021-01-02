export interface ApiEndpoints {
  micropay: string;
  reverse: string;
  unifiedorder: string;
  orderquery: string;
  closeorder: string;
  refund: string;
  refundquery: string;
  downloadbill: string;
  downloadfundflow: string;
  send_coupon: string;
  query_coupon_stock: string;
  querycouponsinfo: string;
  transfers: string;
  gettransferinfo: string;
  sendredpack: string;
  sendgroupredpack: string;
  gethbinfo: string;
  paybank: string;
  querybank: string;
  getsignkey: string;
  middleware_nativePay: string;
  middleware_refund: string;
  getpublickey: string;
  combinedorder: string;
}

export type Endpoint = keyof ApiEndpoints;

export const createEndpoints = (sandbox?: boolean): ApiEndpoints => ({
  micropay: `https://api.mch.weixin.qq.com${
    sandbox ? '/sandboxnew' : ''
  }/pay/micropay`,
  reverse: `https://api.mch.weixin.qq.com${
    sandbox ? '/sandboxnew' : ''
  }/secapi/pay/reverse`,
  unifiedorder: `https://api.mch.weixin.qq.com${
    sandbox ? '/sandboxnew' : ''
  }/pay/unifiedorder`,
  orderquery: `https://api.mch.weixin.qq.com${
    sandbox ? '/sandboxnew' : ''
  }/pay/orderquery`,
  closeorder: `https://api.mch.weixin.qq.com${
    sandbox ? '/sandboxnew' : ''
  }/pay/closeorder`,
  refund: `https://api.mch.weixin.qq.com${
    sandbox ? '/sandboxnew' : ''
  }/secapi/pay/refund`,
  refundquery: `https://api.mch.weixin.qq.com${
    sandbox ? '/sandboxnew' : ''
  }/pay/refundquery`,
  downloadbill: `https://api.mch.weixin.qq.com${
    sandbox ? '/sandboxnew' : ''
  }/pay/downloadbill`,
  downloadfundflow: `https://api.mch.weixin.qq.com${
    sandbox ? '/sandboxnew' : ''
  }/pay/downloadfundflow`,
  send_coupon: `https://api.mch.weixin.qq.com${
    sandbox ? '/sandboxnew' : ''
  }/mmpaymkttransfers/send_coupon`,
  query_coupon_stock: `https://api.mch.weixin.qq.com${
    sandbox ? '/sandboxnew' : ''
  }/mmpaymkttransfers/query_coupon_stock`,
  querycouponsinfo: `https://api.mch.weixin.qq.com${
    sandbox ? '/sandboxnew' : ''
  }/mmpaymkttransfers/querycouponsinfo`,
  transfers: `https://api.mch.weixin.qq.com${
    sandbox ? '/sandboxnew' : ''
  }/mmpaymkttransfers/promotion/transfers`,
  gettransferinfo: `https://api.mch.weixin.qq.com${
    sandbox ? '/sandboxnew' : ''
  }/mmpaymkttransfers/gettransferinfo`,
  sendredpack: `https://api.mch.weixin.qq.com${
    sandbox ? '/sandboxnew' : ''
  }/mmpaymkttransfers/sendredpack`,
  sendgroupredpack: `https://api.mch.weixin.qq.com${
    sandbox ? '/sandboxnew' : ''
  }/mmpaymkttransfers/sendgroupredpack`,
  gethbinfo: `https://api.mch.weixin.qq.com${
    sandbox ? '/sandboxnew' : ''
  }/mmpaymkttransfers/gethbinfo`,
  paybank: `https://api.mch.weixin.qq.com${
    sandbox ? '/sandboxnew' : ''
  }/mmpaysptrans/pay_bank`,
  querybank: `https://api.mch.weixin.qq.com${
    sandbox ? '/sandboxnew' : ''
  }/mmpaysptrans/query_bank`,
  getsignkey: '',
  middleware_nativePay: '',
  middleware_refund: '',
  getpublickey: '',
  combinedorder: '',
});
