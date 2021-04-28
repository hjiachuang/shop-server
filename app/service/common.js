'use strict';

const Service = require('egg').Service;

class CommonService extends Service {
  async checkData(...arg) {
    console.log(arg);
  }
  async success(error, data) {
    this.ctx.body = {
      error,
      data,
    };
  }
  async fail(error, msg = '服务器错误，请稍后重试。') {
    this.ctx.body = {
      error,
      msg,
    };
  }
}

module.exports = CommonService;
