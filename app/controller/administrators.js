'use strict';

const Controller = require('egg').Controller;

class Administrators extends Controller {
  async getAdministrators() {
    const { ctx } = this;
    try {
      await ctx.service.administrators.getAdministrators();
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async add() {
    const { ctx } = this;
    const { administrator } = ctx.request.body;
    if (typeof administrator !== 'object') {
      return ctx.service.common.fail(400, '参数错误');
    }
    if (!administrator.hasOwnProperty('username') || administrator.username === '') {
      return ctx.service.common.fail(400, '参数错误');
    }
    if (!administrator.hasOwnProperty('name') || administrator.name === '') {
      return ctx.service.common.fail(400, '参数错误');
    }
    if (!administrator.hasOwnProperty('email') || administrator.email === '') {
      return ctx.service.common.fail(400, '参数错误');
    }
    try {
      await ctx.service.administrators.add(administrator);
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async edit() {
    const { ctx } = this;
    const { administrator } = ctx.request.body;
    if (typeof administrator !== 'object') {
      return ctx.service.common.fail(400, '参数错误');
    }
    if (!administrator.hasOwnProperty('name') || administrator.name === '') {
      return ctx.service.common.fail(400, '参数错误');
    }
    if (!administrator.hasOwnProperty('email') || administrator.email === '') {
      return ctx.service.common.fail(400, '参数错误');
    }
    try {
      await ctx.service.administrators.edit(administrator);
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async changePassword() {
    const { ctx } = this;
    const { data } = ctx.request.body;
    if (data === undefined) {
      return ctx.service.common.fail(400, '参数错误');
    }
    try {
      await ctx.service.administrators.changePassword(data);
    } catch (err) {
      console.log('服务器错误，位置为controller -> administrators.js -> changePassword()，错误内容为：', err);
      ctx.service.common.fail(500);
    }
  }
}

module.exports = Administrators;
