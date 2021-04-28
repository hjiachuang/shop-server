'use strict';

const Service = require('egg').Service;
const Encrypt = require('../utils/encrypt');
const { getCode } = require('../utils/svg-captcha');

class LoginService extends Service {
  async login(data) {
    const { ctx, app } = this;
    const request = JSON.parse(Encrypt.aesDecrypt(data));
    const requestPws = Encrypt.rsaDecrypt(request.password);
    if (request.code.toLowerCase() !== ctx.session.verifyCode) {
      const { text } = getCode();
      ctx.session.verifyCode = text.toLowerCase();
      ctx.service.common.fail(500, '验证码错误');
      return false;
    }
    const userInfo = await app.mysql.get('admin', { username: request.username });
    if (userInfo) {
      if (userInfo.password !== requestPws) {
        const { text } = getCode();
        ctx.session.verifyCode = text.toLowerCase();
        return ctx.service.common.fail(500, '用户名或者密码输入错误，请重新输入');
      }
      userInfo.last_login_time = Math.ceil(new Date().getTime() / 1000);
      userInfo.last_login_ip = ctx.request.ip || '0.0.0.0';
      app.mysql.update('admin', userInfo);
      const token = app.jwt.sign({
        username: request.username,
      }, app.config.jwt.secret, {
        expiresIn: '24h',
      });
      ctx.session.username = request.username;
      const userInfoTemp = Object.assign(userInfo);
      userInfoTemp.password = null;
      ctx.cookies.set('token', token, { httpOnly: false });
      ctx.service.common.success(0, {
        msg: '登录成功',
        userInfo: userInfoTemp,
      });
      return false;
    }
    ctx.service.common.fail(500, '用户名或者密码输入错误，请重新输入');
  }
}

module.exports = LoginService;
