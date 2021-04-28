'use strict';

const Controller = require('egg').Controller;

class RegionController extends Controller {
  async getAll() {
    const { ctx, app } = this;
    const region = await app.redis.get('region');
    if (region) {
      ctx.service.common.success(0, {
        region: JSON.parse(region),
      });
    } else {
      try {
        await ctx.service.region.getAll();
      } catch (err) {
        console.log(err);
        ctx.service.common.fail(500);
      }
    }
  }
  async getAllArea() {
    const { ctx } = this;
    try {
      await ctx.service.region.getAllArea();
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
}

module.exports = RegionController;
