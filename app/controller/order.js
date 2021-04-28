'use strict';

const Controller = require('egg').Controller;

class OrderController extends Controller {
  // 获取订单列表
  async index() {
    const { ctx } = this;
    const {
      page = 1,
      orderStatus,
      logisticCode = '',
      orderSn = '',
      consignee = '',
    } = ctx.query;
    if (orderStatus === '') {
      ctx.service.common.fail(400, '参数错误');
    } else {
      try {
        await ctx.service.order.getOrder(Number(page), orderStatus, logisticCode, orderSn, consignee);
      } catch (err) {
        console.log(err);
        ctx.service.common.fail(500);
      }
    }
  }
  // 获取指定订单订单详细
  async getOrderDetail() {
    const { ctx } = this;
    const {
      order_id,
    } = ctx.query;
    if (order_id === '') {
      ctx.service.common.fail(400, '参数错误');
    } else {
      try {
        await ctx.service.order.getOrderDetail(Number(order_id));
      } catch (err) {
        console.log(err);
        ctx.service.common.fail(500);
      }
    }
  }
  // 发货确认
  async goDelivery() {
    const { ctx } = this;
    const { order_id = '' } = ctx.request.body;
    if (order_id === '') {
      ctx.service.common.fail(400, '参数错误');
    } else {
      try {
        await ctx.service.order.goDelivery(Number(order_id));
      } catch (err) {
        console.log(err);
        ctx.service.common.fail(500);
      }
    }
  }
  // 修改卖家留言
  async saveSellerMemo() {
    const { ctx } = this;
    const {
      order_id,
      memo = '',
    } = ctx.request.body;
    if (order_id === '') {
      ctx.service.common.fail(400, '参数错误');
    } else {
      try {
        await ctx.service.order.saveSellerMemo(Number(order_id), memo);
      } catch (err) {
        console.log(err);
        ctx.service.common.fail(500);
      }
    }
  }
  // 修改订单价格
  async revisePrice() {
    const { ctx } = this;
    const {
      order_id,
      actual_price,
      freight_price,
      goods_price,
    } = ctx.query;
    if (isNaN(parseInt(order_id)) && isNaN(parseFloat(actual_price)) && isNaN(parseFloat(freight_price)) && isNaN(parseFloat(goods_price))) {
      ctx.service.common.fail(400, '参数错误');
    } else {
      try {
        await ctx.service.order.revisePrice(parseInt(order_id), parseFloat(actual_price), parseFloat(freight_price), parseFloat(goods_price));
      } catch (err) {
        console.log(err);
        ctx.service.common.fail(500);
      }
    }
  }
  // 检查订单是否已有快递信息
  async checkExpress() {
    const { ctx } = this;
    const {
      order_id,
    } = ctx.query;
    if (isNaN(parseInt(order_id))) {
      ctx.service.common.fail(400, '参数错误');
    } else {
      try {
        await ctx.service.order.checkExpress(parseInt(order_id));
      } catch (err) {
        console.log(err);
        ctx.service.common.fail(500);
      }
    }
  }
  // 重新生成新的订单号
  async regenerateOrderSn() {
    const { ctx } = this;
    const {
      order_id,
    } = ctx.query;
    if (isNaN(parseInt(order_id))) {
      ctx.service.common.fail(400, '参数错误');
    } else {
      try {
        await ctx.service.order.regenerateOrderSn(parseInt(order_id));
      } catch (err) {
        console.log(err);
        ctx.service.common.fail(500);
      }
    }
  }
}

module.exports = OrderController;
