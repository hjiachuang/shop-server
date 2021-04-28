'use strict';

const crypto = require('crypto');
const aesKey = Buffer.from('aes_key');
const aesIv = Buffer.from('0102030405060708');
const PrivateKey = `rsa加密私钥`;

const aesEncrypt = text => {
  const buffer = Buffer.from(text);
  const cipher = crypto.createCipheriv('aes-128-cbc', aesKey, aesIv);
  return Buffer.concat([ cipher.update(buffer), cipher.final() ]).toString('base64');
};

const aesDecrypt = text => {
  const textArr = text.match(/(\w{2})/g);
  textArr.forEach((val, index) => {
    textArr[index] = '0x' + val;
  });
  const buffer = Buffer.from(textArr);
  const cipher = crypto.createDecipheriv('aes-128-cbc', aesKey, aesIv);
  return Buffer.concat([ cipher.update(buffer), cipher.final() ]).toString();
};

const rsaDecrypt = text => {
  return crypto.privateDecrypt({
    key: PrivateKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
  }, Buffer.from(text, 'base64')).toString('utf8');
};

module.exports = {
  aesEncrypt,
  aesDecrypt,
  rsaDecrypt,
};
