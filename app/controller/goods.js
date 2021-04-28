'use strict';

const Controller = require('egg').Controller;

class GoodsController extends Controller {
  async getGoodsList() {
    const { ctx } = this;
    const {
      sort = 'sale',
      status = '2',
      page = 1,
      name = '',
    } = ctx.query;
    try {
      const list = await ctx.service.goods.getGoodsList(sort, status, parseInt(page), name);
      ctx.service.common.success(0, list);
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async deleteGoods() {
    const { ctx } = this;
    const { id } = ctx.query;
    console.log(id);
    if (isNaN(parseInt(id))) {
      ctx.service.common.fail(400, '参数错误');
    } else {
      try {
        const result = await ctx.service.goods.deleteGoods(parseInt(id));
        ctx.service.common.success(0, result);
      } catch (err) {
        console.log(err);
        ctx.service.common.fail(500);
      }
    }
  }
  async changeGoodsStatus() {
    const { ctx } = this;
    const { type, id, sort_order, is_index, is_on_sale } = ctx.request.body;
    if (type === 'sort') {
      if (isNaN(parseInt(id)) || isNaN(parseInt(sort_order))) {
        return ctx.service.common.fail(400, '参数错误1');
      }
    } else if (type === 'index') {
      if (isNaN(parseInt(id)) || (is_index !== true && is_index !== false)) {
        return ctx.service.common.fail(400, '参数错误2');
      }
    } else if (type === 'sale') {
      if (isNaN(parseInt(id)) || (is_on_sale !== true && is_on_sale !== false)) {
        return ctx.service.common.fail(400, '参数错误3');
      }
    }
    try {
      await ctx.service.goods.changeGoodsStatus(type, id, sort_order, is_index, is_on_sale);
    } catch (err) {
      ctx.service.common.fail(500);
    }
  }
  async getGoodsDetail() {
    const { ctx } = this;
    const { id } = ctx.query;
    if (isNaN(parseInt(id))) {
      return ctx.service.common.fail(400, '参数错误');
    }
    try {
      await ctx.service.goods.getGoodsDetail(parseInt(id));
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async getAllSpecification() {
    const { ctx } = this;
    try {
      await ctx.service.goods.getAllSpecification();
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async save() {
    const { ctx } = this;
    const { goods } = ctx.request.body;
    if (typeof goods !== 'object' || goods === null) {
      return ctx.service.common.fail(400, '参数错误');
    }
    if (!goods.hasOwnProperty('name') || !goods.name || goods.name === '') {
      return ctx.service.common.fail(400, '参数错误');
    }
    if (!goods.hasOwnProperty('goods_brief') || !goods.goods_brief || goods.goods_brief === '') {
      return ctx.service.common.fail(400, '参数错误');
    }
    if (!goods.hasOwnProperty('list_pic_url') || !goods.list_pic_url || goods.list_pic_url === '') {
      return ctx.service.common.fail(400, '参数错误');
    }
    if (!goods.hasOwnProperty('goods_unit') || !goods.goods_unit || goods.goods_unit === '') {
      return ctx.service.common.fail(400, '参数错误');
    }
    if (!goods.hasOwnProperty('goods_desc') || !goods.goods_desc || goods.goods_desc === '') {
      return ctx.service.common.fail(400, '参数错误');
    }
    if (!goods.hasOwnProperty('product') || !goods.product instanceof Array || goods.product.lenght === 0) {
      return ctx.service.common.fail(400, '参数错误');
    }
    for (const ele of goods.product) {
      if (ele.cost === '' || ele.goods_weight === '' || ele.retail_price === '' || ele.value === '') {
        return ctx.service.common.fail(400, '参数错误');
      }
    }
    try {
      await ctx.service.goods.save(goods);
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async changeSpecificationName() {
    const { ctx } = this;
    const { id, name } = ctx.request.body;
    if (isNaN(parseInt(id)) || name === undefined) {
      return ctx.service.common.fail(400, '参数错误');
    }
    try {
      await ctx.service.goods.changeSpecificationName(parseInt(id), name);
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async changeSpecificationSortOrder() {
    const { ctx } = this;
    const { id, sort_order } = ctx.request.body;
    if (isNaN(parseInt(id)) || isNaN(parseInt(sort_order))) {
      return ctx.service.common.fail(400, '参数错误');
    }
    try {
      await ctx.service.goods.changeSpecificationSortOrder(parseInt(id), parseInt(sort_order));
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async deleteSpecification() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    if (isNaN(parseInt(id))) {
      return ctx.service.common.fail(400, '参数错误');
    }
    try {
      await ctx.service.goods.deleteSpecification(parseInt(id));
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async saveSpecification() {
    const { ctx } = this;
    const { specification } = ctx.request.body;
    if (typeof specification !== 'object' || specification === null) {
      return ctx.service.common.fail(400, '参数错误');
    }
    if (!specification.hasOwnProperty('name') || !specification.name || specification.name === '') {
      return ctx.service.common.fail(400, '参数错误');
    }
    if (!specification.hasOwnProperty('sort_order') || !specification.sort_order || specification.sort_order === '') {
      return ctx.service.common.fail(400, '参数错误');
    }
    try {
      await ctx.service.goods.saveSpecification(specification);
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async getGoodsSimpleList() {
    const { ctx } = this;
    const { page = 1 } = ctx.query;
    try {
      await ctx.service.goods.getGoodsSimpleList(parseInt(page));
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
}

module.exports = GoodsController;
