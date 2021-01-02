// from https://github.com/befinal/node-tenpay

import crypto from 'crypto';
import xml2js from 'xml2js';

export const decrypt = (encryptedData, key, iv = '') => {
  let decipher = crypto.createDecipheriv('aes-256-ecb', key, iv);
  decipher.setAutoPadding(true);
  let decoded = decipher.update(encryptedData, 'base64', 'utf8');
  decoded += decipher.final('utf8');
  return decoded;
};

export const md5 = (str, encoding = 'utf8') =>
  crypto
    .createHash('md5')
    .update(str, encoding)
    .digest('hex');
export const sha256 = (str, key, encoding = 'utf8') =>
  crypto
    .createHmac('sha256', key)
    .update(str, encoding)
    .digest('hex');
export const encryptRSA = (key, hash) =>
  crypto.publicEncrypt(key, new Buffer(hash)).toString('base64');

export const checkXML = str => {
  let reg = /^(<\?xml.*\?>)?(\r?\n)*<xml>(.|\r?\n)*<\/xml>$/i;
  return reg.test(str.trim());
};

export const getFullDate = () => {
  const str = new Date();
  let YYYY = str.getFullYear();
  let MM = ('00' + (str.getMonth() + 1)).substr(-2);
  let DD = ('00' + str.getDate()).substr(-2);
  return YYYY + MM + DD;
};

export const toQueryString = obj =>
  Object.keys(obj)
    .filter(key => key !== 'sign' && obj[key] !== void 0 && obj[key] !== '')
    .sort()
    .map(key => key + '=' + obj[key])
    .join('&');

export const generate = (length = 16) => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let noceStr = '',
    maxPos = chars.length;
  while (length--) noceStr += chars[(Math.random() * maxPos) | 0];
  return noceStr;
};

export const buildXML = (obj, rootName = 'xml') => {
  const opt = {
    xmldec: null,
    rootName,
    allowSurrogateChars: true,
    cdata: true,
  };
  return new xml2js.Builder(opt).buildObject(obj);
};

export const parseXML = xml =>
  new Promise((resolve, reject) => {
    const opt = { trim: true, explicitArray: false, explicitRoot: false };
    xml2js.parseString(xml, opt, (err, res) =>
      err ? reject(new Error('XMLDataError')) : resolve(res || {})
    );
  });
