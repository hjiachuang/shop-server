'use strict';

const svgCaptcha = require('svg-captcha');

// 获取图片验证码
module.exports = {
  getCode: () => {
    const options = {// 参数
      width: 120, // 验证码图片宽度
      height: 40, // 验证码图片高度
      fontSize: 50, // 验证码字体大小
      color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
      background: '#cc9966', // 验证码图片背景颜色
      noise: 2, // 干扰线条的数量
      ignoreChars: '0o1i', // 验证码字符中排除 0o1i
    };
    const Captcha = svgCaptcha.create(options);// 生成算术式验证码
    return Captcha;
  },
};
