// from https://github.com/befinal/node-tenpay

import { ApiEndpoints, createEndpoints, Endpoint } from './endpoints';
import {
  buildXML,
  decrypt,
  generate,
  md5,
  parseXML,
  sha256,
  toQueryString,
} from './utils';
import urllib from 'urllib';

export interface WexinPayProps {
  appid: string;
  mchid: string;
  partnerKey: string;
  pfx?: string;
  notify_url?: string;
  refund_url?: string;
  spbill_create_ip?: string;
  sandbox?: boolean;
  debug?: boolean;
}

export class WexinPay implements WexinPayProps {
  appid: string;
  mchid: string;
  partnerKey: string;
  pfx?: string | undefined;
  notify_url?: string | undefined;
  refund_url?: string | undefined;
  spbill_create_ip?: string | undefined;
  debug?: boolean;

  endpoints: ApiEndpoints;

  constructor(public props: WexinPayProps) {
    const {
      appid,
      mchid,
      partnerKey,
      pfx,
      notify_url,
      refund_url,
      spbill_create_ip,
      sandbox,
      debug,
    } = props;

    this.appid = appid;
    this.mchid = mchid;
    this.partnerKey = partnerKey;
    this.pfx = pfx;
    this.notify_url = notify_url;
    this.refund_url = refund_url;
    this.spbill_create_ip = spbill_create_ip || '127.0.0.1';

    this.endpoints = createEndpoints(sandbox);

    this.debug = debug;
  }

  log(...args: any[]) {
    if (this.debug) console.log(...args);
  }

  async _parse(xml: string, type: Endpoint, signType: any) {
    let json = (await parseXML(xml)) as any;

    switch (type) {
      case 'middleware_nativePay':
        break;
      default:
        if (json.return_code !== 'SUCCESS')
          throw new Error(json.return_msg || 'XMLDataError');
    }

    switch (type) {
      case 'middleware_refund':
      case 'middleware_nativePay':
      case 'getsignkey':
        break;
      default:
        if (json.result_code !== 'SUCCESS')
          throw new Error(json.err_code || 'XMLDataError');
    }

    switch (type) {
      case 'getsignkey':
        break;
      case 'middleware_refund': {
        if (json.appid !== this.appid) throw new Error('appid不匹配');
        if (json.mch_id !== this.mchid) throw new Error('mch_id不匹配');
        let key = md5(this.partnerKey).toLowerCase();
        let info = decrypt(json.req_info, key);
        json.req_info = await parseXML(info);
        break;
      }
      case 'transfers':
        if (json.mchid !== this.mchid) throw new Error('mchid不匹配');
        break;
      case 'sendredpack':
      case 'sendgroupredpack':
        if (json.wxappid !== this.appid) throw new Error('wxappid不匹配');
        if (json.mch_id !== this.mchid) throw new Error('mchid不匹配');
        break;
      case 'gethbinfo':
      case 'gettransferinfo':
        if (json.mch_id !== this.mchid) throw new Error('mchid不匹配');
        break;
      case 'send_coupon':
      case 'query_coupon_stock':
      case 'querycouponsinfo':
        if (json.appid !== this.appid) throw new Error('appid不匹配');
        if (json.mch_id !== this.mchid) throw new Error('mch_id不匹配');
        break;
      case 'getpublickey':
        break;
      case 'paybank':
        if (json.mch_id !== this.mchid) throw new Error('mchid不匹配');
        break;
      case 'querybank':
        if (json.mch_id !== this.mchid) throw new Error('mchid不匹配');
        break;
      case 'combinedorder':
        if (json.combine_appid !== this.appid) throw new Error('appid不匹配');
        if (json.combine_mch_id !== this.mchid) throw new Error('mch_id不匹配');
        if (json.sign !== this._getSign(json, 'HMAC-SHA256'))
          throw new Error('sign签名错误');
        break;
      default:
        if (json.appid !== this.appid) throw new Error('appid不匹配');
        if (json.mch_id !== this.mchid) throw new Error('mch_id不匹配');
        if (json.sign !== this._getSign(json, json.sign_type || signType))
          throw new Error('sign签名错误');
    }
    return json;
  }

  _getSign(params: { [key: string]: string }, type = 'MD5') {
    let str = toQueryString(params) + '&key=' + this.partnerKey;
    switch (type) {
      case 'MD5':
        return md5(str).toUpperCase();
      case 'HMAC-SHA256':
        return sha256(str, this.partnerKey).toUpperCase();
      default:
        throw new Error('signType Error');
    }
  }

  async _request(
    params: { [key: string]: string },
    type: Endpoint,
    cert = false
  ) {
    // 安全签名
    params.sign = this._getSign(params, params.sign_type);
    // 创建请求参数
    let pkg: any = {
      method: 'POST',
      dataType: 'text',
      data: buildXML(params),
      timeout: [10000, 15000],
    };

    if (cert) {
      pkg.pfx = this.pfx;
      pkg.passphrase = this.mchid;
    }

    this.log('post data =>\r\n%s\r\n', pkg.data);
    let { status, data } = await urllib.request(this.endpoints[type], pkg);
    if (status !== 200) throw new Error('request fail');
    this.log('receive data =>\r\n%s\r\n', data);

    return ['downloadbill', 'downloadfundflow'].indexOf(type) < 0
      ? this._parse(data, type, params.sign_type)
      : data;
  }

  // 统一下单
  unifiedOrder(params: any) {
    let pkg = {
      ...params,
      appid: this.appid,
      mch_id: this.mchid,
      nonce_str: generate(),
      sign_type: params.sign_type || 'MD5',
      notify_url: params.notify_url || this.notify_url,
      spbill_create_ip: params.spbill_create_ip || this.spbill_create_ip,
      trade_type: params.trade_type || 'JSAPI',
    };

    return this._request(pkg, 'unifiedorder');
  }
}
