'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  // 获取所有用户列表
  async index() {
    const { ctx } = this;
    const { page = 1, size = 20, nickname = '' } = ctx.query;
    try {
      await ctx.service.user.getUser(Number(page), Number(size), String(nickname));
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  // 获取指定用户的详情
  async getUserDetail() {
    const { ctx } = this;
    const { id } = ctx.query;
    if (id === '') {
      ctx.service.common.fail(400, '参数错误');
    } else {
      try {
        await ctx.service.user.getUserDetail(Number(id));
      } catch (err) {
        console.log(err);
        ctx.service.common.fail(500);
      }
    }
  }
  // 更新指定用户的详情
  async updateDetail() {
    const { ctx } = this;
    const {
      id,
      nickname,
      name,
      gender,
      mobile,
    } = ctx.request.body;
    if (id === '') {
      ctx.service.common.fail(400, '参数错误');
    } else {
      try {
        await ctx.service.user.updateDetail(id, nickname, name, gender, mobile);
      } catch (err) {
        console.log(err);
        ctx.service.common.fail(500);
      }
    }
  }
  // 获取指定用户的订单内容
  async getUserOrder() {
    const { ctx } = this;
    const { page = 1, id } = ctx.query;
    if (id === '') {
      ctx.service.common.fail(400, '参数错误');
    } else {
      try {
        await ctx.service.user.getUserOrder(Number(id), Number(page));
      } catch (err) {
        console.log(err);
        ctx.service.common.fail(500);
      }
    }
  }
  // 获取指定用户的收货地址
  async getUserAddress() {
    const { ctx } = this;
    const { page = 1, id } = ctx.query;
    if (id === '') {
      ctx.service.common.fail(400, '参数错误');
    } else {
      try {
        await ctx.service.user.getUserAddress(Number(id), Number(page));
      } catch (err) {
        console.log(err);
        ctx.service.common.fail(500);
      }
    }
  }
  // 获取指定用户的购物车列表
  async getUserCart() {
    const { ctx } = this;
    const { page = 1, id } = ctx.query;
    if (id === '') {
      ctx.service.common.fail(400, '参数错误');
    } else {
      try {
        await ctx.service.user.getUserCart(Number(id), Number(page));
      } catch (err) {
        console.log(err);
        ctx.service.common.fail(500);
      }
    }
  }
  // 获取指定用户的足迹列表
  async getUserFoot() {
    const { ctx } = this;
    const { page = 1, id } = ctx.query;
    if (id === '') {
      ctx.service.common.fail(400, '参数错误');
    } else {
      try {
        await ctx.service.user.getUserFoot(Number(id), Number(page));
      } catch (err) {
        console.log(err);
        ctx.service.common.fail(500);
      }
    }
  }
  // 获取所有的购物车列表
  async getAllShopCartList() {
    const { ctx } = this;
    const { page = 1, name = '' } = ctx.query;
    try {
      await ctx.service.user.getAllShopCartList(parseInt(page), name);
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
}

module.exports = UserController;
