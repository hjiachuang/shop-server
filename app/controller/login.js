'use strict';

const Controller = require('egg').Controller;
const { getCode } = require('../utils/svg-captcha');

class LoginController extends Controller {
  // 获取登录页面验证码
  async code() {
    const { ctx } = this;
    try {
      const { text, data } = getCode();
      ctx.session.verifyCode = text.toLowerCase();
      ctx.service.common.success(0, data);
    } catch (err) {
      console.log('服务器错误，位置为controller -> login.js -> code()，错误内容为：', err);
      ctx.service.common.fail(500);
    }
  }
  // 登录
  async login() {
    const { ctx } = this;
    const { data } = ctx.request.body;
    if (data === undefined) {
      ctx.service.common.fail(400, '参数错误');
      return false;
    }
    try {
      await ctx.service.login.login(data);
    } catch (err) {
      console.log('服务器错误，位置为controller -> login.js -> login()，错误内容为：', err);
      ctx.service.common.fail(500);
    }
  }
  // 登出
  async logout() {
    const { ctx } = this;
    ctx.cookies.set('token', null);
    ctx.cookies.set('csrfToken', null);
    ctx.session = null;
    ctx.service.common.success(0, '退出成功');
  }
}

module.exports = LoginController;
