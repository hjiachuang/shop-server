/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1615447203265_1136';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.jwt = {
    secret: 'jwt_secret',
  };

  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: 'localhost',
      // 端口号
      port: '3306',
      // 用户名
      user: 'aidioute',
      // 密码
      password: 'aidioute',
      // 数据库名
      database: 'aidioute',
      // 数据库字符集
      charset: 'UTF8MB4_GENERAL_CI',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  config.weixin = {
    appid: '', // 小程序 appid
    secret: '', // 小程序密钥
    // mch_id: '', // 商户帐号ID
    // partner_key: '', // 微信支付密钥
    // notify_url: 'https://www.您的域名.com/api/pay/notify', // 微信支付异步通知
  };

  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0,
    },
  };

  config.multipart = {
    mode: 'file',
    fileSize: '10mb',
  };

  exports.static = {
    prefix: '/',
  };

  return {
    ...config,
    ...userConfig,
  };
};
