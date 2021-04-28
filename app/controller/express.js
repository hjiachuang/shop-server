'use strict';

const Controller = require('egg').Controller;

class ExpressController extends Controller {
  async getAutomaticDeliveryStatus() {
    const { ctx } = this;
    try {
      const status = await ctx.service.express.getAutomaticDeliveryStatus();
      ctx.service.common.success(0, status);
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async type() {
    const { ctx } = this;
    try {
      const type = await ctx.service.express.type();
      ctx.service.common.success(0, type);
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async changeStatus() {
    const { ctx } = this;
    const { id, enabled } = ctx.query;
    if (isNaN(parseInt(id))) {
      ctx.service.common.fail(400, '参数错误!');
    } else {
      try {
        const result = await ctx.service.express.changeStatus(parseInt(id), enabled);
        ctx.service.common.success(0, result);
      } catch (err) {
        console.log(err);
        ctx.service.common.fail(500);
      }
    }
  }
  async detail() {
    const { ctx } = this;
    const { id } = ctx.query;
    if (isNaN(parseInt(id))) {
      ctx.service.common.fail(400, '参数错误!');
    } else {
      try {
        const result = await ctx.service.express.detail(parseInt(id));
        ctx.service.common.success(0, result);
      } catch (err) {
        console.log(err);
        ctx.service.common.fail(500);
      }
    }
  }
  async edit() {
    const { ctx } = this;
    const { id = '', name, code, MonthCode, CustomerName, enabled } = ctx.request.body;
    if (name === '' || code === '' || (id !== '' && isNaN(parseInt(id)))) {
      ctx.service.common.fail(400, '参数错误!');
    } else {
      try {
        const result = await ctx.service.express.edit(id, name, code, MonthCode, CustomerName, enabled);
        ctx.service.common.success(0, result);
      } catch (err) {
        console.log(err);
        ctx.service.common.fail(500);
      }
    }
  }
  async getFreightTemplate() {
    const { ctx } = this;
    try {
      const template = await ctx.service.express.getFreightTemplate();
      ctx.service.common.success(0, template);
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async deleteFreightTemplate() {
    const { ctx } = this;
    const { id } = ctx.query;
    if (isNaN(parseInt(id))) {
      ctx.service.common.fail(400, '参数错误!');
      return false;
    }
    try {
      const result = await ctx.service.express.deleteFreightTemplate(parseInt(id));
      ctx.service.common.success(0, result);
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async getFreightTemplateDetail() {
    const { ctx } = this;
    const { id } = ctx.query;
    if (isNaN(parseInt(id))) {
      ctx.service.common.fail(400, '参数错误!');
      return false;
    }
    try {
      const result = await ctx.service.express.getFreightTemplateDetail(parseInt(id));
      ctx.service.common.success(0, result);
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async canUseShipper() {
    const { ctx } = this;
    try {
      const shipper = await ctx.service.express.canUseShipper();
      ctx.service.common.success(0, shipper);
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async saveFreightTemplate() {
    const { ctx } = this;
    const {
      freightInfo: {
        id = '',
        name = '',
        package_price,
        freight_type,
        shipper_id,
      },
      defaultFreight: [{
        id: defaultFreightId = '',
        template_id = '',
        start,
        start_fee,
        add,
        add_fee,
        free_by_money,
        free_by_number,
      }],
      specialFreight,
    } = ctx.request.body;
    if (
      isNaN(parseInt(package_price)) ||
      isNaN(parseInt(freight_type)) ||
      isNaN(parseInt(shipper_id)) ||
      isNaN(parseInt(start)) ||
      isNaN(parseInt(start_fee)) ||
      isNaN(parseInt(add)) ||
      isNaN(parseInt(add_fee)) ||
      isNaN(parseInt(free_by_money)) ||
      isNaN(parseInt(free_by_number)) ||
      Object.prototype.toString.call(specialFreight) !== '[object Array]'
    ) {
      ctx.service.common.fail(400, '参数错误!');
      return false;
    }
    if (name === '') {
      ctx.service.common.fail(400, '参数错误!');
      return false;
    }
    try {
      const result = await ctx.service.express.saveFreightTemplate(parseInt(id), name, parseFloat(package_price), parseInt(freight_type), parseInt(shipper_id), parseInt(defaultFreightId), parseInt(template_id), parseInt(start), parseFloat(start_fee), parseInt(add), parseFloat(add_fee), parseFloat(free_by_money), parseInt(free_by_number), specialFreight);
      ctx.service.common.success(0, result);
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
}

module.exports = ExpressController;
