// from https://github.com/befinal/node-tenpay

import crypto, {
  CipherKey,
  Encoding,
  BinaryLike,
  KeyObject,
  RsaPrivateKey,
  RsaPublicKey,
  KeyLike,
} from 'crypto';
import xml2js, { convertableToString } from 'xml2js';

export const decrypt = (encryptedData: string, key: CipherKey, iv = '') => {
  let decipher = crypto.createDecipheriv('aes-256-ecb', key, iv);
  decipher.setAutoPadding(true);
  let decoded = decipher.update(encryptedData, 'base64', 'utf8');
  decoded += decipher.final('utf8');
  return decoded;
};

export const md5 = (str: string, encoding: Encoding = 'utf8') =>
  crypto
    .createHash('md5')
    .update(str, encoding)
    .digest('hex');

export const sha256 = (
  str: string,
  key: BinaryLike | KeyObject,
  encoding: Encoding = 'utf8'
) =>
  crypto
    .createHmac('sha256', key)
    .update(str, encoding)
    .digest('hex');

export const encryptRSA = (
  key: RsaPublicKey | RsaPrivateKey | KeyLike,
  hash: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>
) => crypto.publicEncrypt(key, Buffer.from(hash)).toString('base64');

export const checkXML = (str: string) => {
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

export const toQueryString = (obj: { [key: string]: string }) =>
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

export const buildXML = (obj: any, rootName = 'xml') => {
  return new xml2js.Builder({
    rootName,
    allowSurrogateChars: true,
    cdata: true,
  }).buildObject(obj);
};

export const parseXML = (xml: convertableToString) =>
  new Promise((resolve, reject) => {
    const opt = { trim: true, explicitArray: false, explicitRoot: false };
    xml2js.parseString(xml, opt, (err, res) =>
      err ? reject(new Error('XMLDataError')) : resolve(res || {})
    );
  });

export const replyData = (msg: any) =>
  buildXML(
    msg ? { return_code: 'FAIL', return_msg: msg } : { return_code: 'SUCCESS' }
  );
