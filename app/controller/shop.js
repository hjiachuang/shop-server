'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');

class ShopController extends Controller {
  async expressSettings() {
    const { ctx } = this;
    try {
      await ctx.service.shop.expressSettings();
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async setSettings() {
    const { ctx } = this;
    const {
      name = '',
      tel = '',
      address = '',
      province_id = '',
      city_id = '',
      district_id = '',
      autoDelivery,
    } = ctx.request.body;
    if (name === '' || tel === '' || address === '' || province_id === '' || city_id === '' || district_id === '') {
      return ctx.service.common.fail(400, '参数错误');
    }
    if (isNaN(parseInt(tel)) || isNaN(parseInt(province_id)) || isNaN(parseInt(city_id)) || isNaN(parseInt(district_id))) {
      return ctx.service.common.fail(400, '参数错误');
    }
    try {
      await ctx.service.shop.setSettings(name, parseInt(tel), address, parseInt(province_id), parseInt(city_id), parseInt(district_id), Boolean(autoDelivery));
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async getAdvertisement() {
    const { ctx } = this;
    const { page = 1 } = ctx.query;
    try {
      await ctx.service.shop.getAdvertisement(page);
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async changeAdvertisementState() {
    const { ctx } = this;
    const { id, state } = ctx.request.body;
    if (isNaN(parseInt(id))) {
      return ctx.service.common.fail(400, '参数错误');
    }
    try {
      await ctx.service.shop.changeAdvertisementState(parseInt(id), state);
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async deleteAdvertisement() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    if (isNaN(parseInt(id))) {
      return ctx.service.common.fail(400, '参数错误');
    }
    try {
      await ctx.service.shop.deleteAdvertisement(parseInt(id));
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async getAdvertisementDetail() {
    const { ctx } = this;
    const { id } = ctx.query;
    if (isNaN(parseInt(id))) {
      return ctx.service.common.fail(400, '参数错误');
    }
    try {
      await ctx.service.shop.getAdvertisementDetail(parseInt(id));
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async saveAdvertisement() {
    const { ctx } = this;
    const { advertisement } = ctx.request.body;
    if (advertisement.hasOwnProperty('link_type')) {
      if (advertisement.link_type === 0) {
        if (!advertisement.hasOwnProperty('goods_id') || advertisement.goods_id === '') {
          return ctx.service.common.fail(400, '参数错误');
        }
      } else if (advertisement.link_type === 1) {
        if (!advertisement.hasOwnProperty('link') || advertisement.link === '') {
          return ctx.service.common.fail(400, '参数错误');
        }
      }
    } else {
      return ctx.service.common.fail(400, '参数错误');
    }
    if (!advertisement.hasOwnProperty('image_url') || advertisement.image_url === '') {
      return ctx.service.common.fail(400, '参数错误');
    }
    if (!advertisement.hasOwnProperty('end_time') || advertisement.end_time === '') {
      return ctx.service.common.fail(400, '参数错误');
    }
    try {
      if (advertisement.hasOwnProperty('id') && advertisement.id === '') {
        await ctx.service.shop.saveAdvertisement(advertisement);
      } else {
        await ctx.service.shop.updateAdvertisement(advertisement);
      }
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async getShowSetting() {
    const { ctx } = this;
    try {
      await ctx.service.shop.getShowSetting();
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async saveShowSetting() {
    const { ctx } = this;
    const { setting } = ctx.request.body;
    try {
      await ctx.service.shop.saveShowSetting(setting);
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async getNotice() {
    const { ctx } = this;
    const { page = 1 } = ctx.query;
    try {
      await ctx.service.shop.getNotice(page);
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async saveNotice() {
    const { ctx } = this;
    const { notice } = ctx.request.body;
    if (typeof notice !== 'object') {
      return ctx.service.common.fail('400', '参数错误');
    }
    if (!notice.hasOwnProperty('title') || notice.title === '') {
      return ctx.service.common.fail('400', '参数错误');
    }
    if (!notice.hasOwnProperty('content') || notice.content === '') {
      return ctx.service.common.fail('400', '参数错误');
    }
    if (!notice.hasOwnProperty('end_time') || notice.end_time === '') {
      return ctx.service.common.fail('400', '参数错误');
    }
    if (!notice.hasOwnProperty('start_time')) {
      notice.start_time = '1970-01-01 08:00:00';
    } else {
      if (parseInt(moment(notice.end_time).format('X')) <= parseInt(moment(notice.start_time).format('X'))) {
        return ctx.service.common.fail('400', '参数错误');
      }
    }
    try {
      await ctx.service.shop.saveNotice(notice);
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
  async deleteNotice() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    if (isNaN(parseInt(id))) {
      return ctx.service.common.fail(400, '参数错误');
    }
    try {
      await ctx.service.shop.deleteNotice(parseInt(id));
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
}

module.exports = ShopController;
