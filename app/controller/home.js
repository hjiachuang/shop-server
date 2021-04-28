'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async info() {
    const { ctx } = this;
    try {
      await ctx.service.home.info();
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async main() {
    const { ctx } = this;
    const { index = 1 } = ctx.query;
    try {
      await ctx.service.home.main(Number(index));
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
}

module.exports = HomeController;
