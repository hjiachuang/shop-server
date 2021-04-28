'use strict';

const Controller = require('egg').Controller;

class CategoryController extends Controller {
  async index() {
    const { ctx } = this;
    try {
      await ctx.service.category.index();
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async changeIconDisplay() {
    const { ctx } = this;
    const { id, icon_display } = ctx.request.body;
    if (isNaN(parseInt(id)) || icon_display === undefined) {
      return ctx.service.common.fail(400, '参数错误');
    }
    try {
      await ctx.service.category.changeIconDisplay(parseInt(id), Boolean(icon_display));
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async changeShowIndex() {
    const { ctx } = this;
    const { id, show_index } = ctx.request.body;
    if (isNaN(parseInt(id)) || show_index === undefined) {
      return ctx.service.common.fail(400, '参数错误');
    }
    try {
      await ctx.service.category.changeShowIndex(parseInt(id), Boolean(show_index));
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async changeSortOrder() {
    const { ctx } = this;
    const { id, sort_order } = ctx.request.body;
    if (isNaN(parseInt(id)) || isNaN(parseInt(sort_order))) {
      return ctx.service.common.fail(400, '参数错误');
    }
    try {
      await ctx.service.category.changeSortOrder(parseInt(id), parseInt(sort_order));
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async deleteCategory() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    if (isNaN(parseInt(id))) {
      return ctx.service.common.fail(400, '参数错误');
    }
    try {
      await ctx.service.category.deleteCategory(parseInt(id));
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async info() {
    const { ctx } = this;
    const { id } = ctx.query;
    if (isNaN(parseInt(id))) {
      return ctx.service.common.fail(400, '参数错误');
    }
    try {
      await ctx.service.category.info(parseInt(id));
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async save() {
    const { ctx } = this;
    const { category } = ctx.request.body;
    if (typeof category !== 'object' || category === null) {
      return ctx.service.common.fail(400, '参数错误');
    }
    if (!category.hasOwnProperty('name') || !category.name || category.name === '') {
      return ctx.service.common.fail(400, '参数错误');
    }
    if (!category.hasOwnProperty('type') || !category.type || category.type === '') {
      return ctx.service.common.fail(400, '参数错误');
    }
    if (!category.hasOwnProperty('icon_url') || !category.icon_url || category.icon_url === '') {
      return ctx.service.common.fail(400, '参数错误');
    }
    if (!category.hasOwnProperty('sort_order') || !category.sort_order || category.sort_order === '') {
      return ctx.service.common.fail(400, '参数错误');
    }
    try {
      await ctx.service.category.save(category);
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
}

module.exports = CategoryController;
