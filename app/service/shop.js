'use strict';

const moment = require('moment');
const Service = require('egg').Service;

class ShopService extends Service {
  async expressSettings() {
    const { ctx, app } = this;
    const express = await app.mysql.select('shipper');
    const settings = await app.mysql.select('settings', {
      where: {
        id: 1,
      },
      columns: [ 'Name', 'Tel', 'Address', 'province_id', 'city_id', 'district_id', 'autoDelivery' ],
    });
    if (settings.length !== 0) {
      console.log(settings[0]);
      settings[0].Name = unescape(settings[0].Name);
      settings[0].Address = unescape(settings[0].Address);
      settings[0].autoDelivery = Boolean(settings[0].autoDelivery);
    }
    return ctx.service.common.success(0, {
      express,
      settings: settings[0],
    });
  }
  async setSettings(name, tel, address, province_id, city_id, district_id, autoDelivery) {
    const { ctx, app } = this;
    const provinceName = await app.mysql.get('region', { id: province_id });
    const cityName = await app.mysql.get('region', { id: city_id });
    const expAreaName = await app.mysql.get('region', { id: district_id });
    const updateData = {
      id: 1,
      Name: escape(name),
      Tel: tel,
      Address: escape(address),
      province_id,
      city_id,
      district_id,
      autoDelivery,
      ProvinceName: provinceName.name,
      CityName: cityName.name,
      ExpAreaName: expAreaName.name,
    };
    const result = await app.mysql.update('settings', updateData);
    if (result.affectedRows === 1) {
      return ctx.service.common.success(0, {
        msg: '更新成功',
      });
    }
    return ctx.service.common.fail(500);
  }
  async getAdvertisement(page) {
    const { ctx, app } = this;
    const offset = (page - 1) * 20;
    const advertisement = await app.mysql.select('advertisement', {
      where: {
        is_delete: 0,
      },
      limit: 20,
      offset,
    });
    for (const item of advertisement) {
      item.end_time = moment.unix(item.end_time).format('YYYY-MM-DD HH:mm:ss');
      item.enabled = Boolean(item.enabled);
    }
    const all = await app.mysql.query('select count(1) as count from `advertisement` where `is_delete` = 0');
    ctx.service.common.success(0, {
      advertisement,
      total: all[0].count,
    });
  }
  async changeAdvertisementState(id, state) {
    const { ctx, app } = this;
    const result = await app.mysql.update('advertisement', {
      id,
      enabled: state,
    });
    if (result.affectedRows === 1) {
      return ctx.service.common.success(0, {
        msg: '修改成功',
      });
    }
    ctx.service.common.fail(500);
  }
  async deleteAdvertisement(id) {
    const { ctx, app } = this;
    const result = await app.mysql.update('advertisement', {
      id,
      is_delete: true,
    });
    if (result.affectedRows === 1) {
      return ctx.service.common.success(0, {
        msg: '删除成功',
      });
    }
    ctx.service.common.fail(500);
  }
  async getAdvertisementDetail(id) {
    const { ctx, app } = this;
    const result = await app.mysql.get('advertisement', {
      id,
    });
    if (result) {
      result.end_time = moment.unix(result.end_time).format('YYYY-MM-DD HH:mm:ss');
      result.enabled = Boolean(result.enabled);
    }
    ctx.service.common.success(0, {
      advertisement: result,
    });
  }
  async saveAdvertisement(advertisement) {
    const { ctx, app } = this;
    const result = await app.mysql.insert('advertisement', {
      link_type: advertisement.link_type,
      link: advertisement.link,
      goods_id: advertisement.goods_id,
      image_url: advertisement.image_url,
      end_time: moment(advertisement.end_time).format('X'),
      enabled: advertisement.enabled || true,
      sort_order: advertisement.sort_order || 1,
    });
    if (result.affectedRows === 1) {
      ctx.service.common.success(0, {
        msg: '保存成功',
      });
    } else {
      ctx.service.common.fail(500);
    }
  }
  async updateAdvertisement(advertisement) {
    const { ctx, app } = this;
    console.log(advertisement.end_time);
    console.log(moment(advertisement.end_time).valueOf());
    const result = await app.mysql.update('advertisement', {
      id: advertisement.id,
      link_type: advertisement.link_type,
      link: advertisement.link,
      goods_id: advertisement.goods_id,
      image_url: advertisement.image_url,
      end_time: moment(advertisement.end_time).format('X'),
      enabled: advertisement.enabled || true,
      sort_order: advertisement.sort_order || 1,
    });
    if (result.affectedRows === 1) {
      ctx.service.common.success(0, {
        msg: '保存成功',
      });
    } else {
      ctx.service.common.fail(500);
    }
  }
  async getShowSetting() {
    const { ctx, app } = this;
    const set = await app.mysql.get('show_setting', { id: 1 });
    ctx.service.common.success(0, {
      setting: set,
    });
  }
  async saveShowSetting(setting) {
    const { ctx, app } = this;
    const result = await app.mysql.update('show_setting', {
      id: 1,
      banner: Boolean(setting.banner),
      channel: Boolean(setting.channel),
      index_banner_img: Boolean(setting.index_banner_img),
      notice: Boolean(setting.notice),
    });
    if (result.affectedRows === 1) {
      return ctx.service.common.success(0, {
        msg: '保存成功',
      });
    }
    ctx.service.common.fail(500);
  }
  async getNotice(page) {
    const { ctx, app } = this;
    const offset = (page - 1) * 20;
    const notice = await app.mysql.select('notice', {
      where: {
        is_delete: 0,
      },
      orders: [[ 'id', 'desc' ]],
      limit: 20,
      offset,
    });
    const nowDate = moment().format('X');
    if (notice.length > 0) {
      for (const item of notice) {
        item.is_delete = Boolean(item.is_delete);
        item.is_expire = item.end_time <= nowDate;
        item.start_time = moment.unix(item.start_time).format('YYYY-MM-DD HH:mm:ss');
        item.end_time = moment.unix(item.end_time).format('YYYY-MM-DD HH:mm:ss');
      }
    }
    const total = await app.mysql.query('select count(1) as count from `notice`');
    ctx.service.common.success(0, {
      notice,
      total: total[0].count,
    });
  }
  async saveNotice(notice) {
    const { ctx, app } = this;
    let result = null;
    if (notice.id === '') {
      result = await app.mysql.insert('notice', {
        title: notice.title,
        content: notice.content,
        start_time: moment(notice.start_time).format('X'),
        end_time: moment(notice.end_time).format('X'),
      });
    } else {
      result = await app.mysql.update('notice', {
        id: notice.id,
        title: notice.title,
        content: notice.content,
        start_time: moment(notice.start_time).format('X'),
        end_time: moment(notice.end_time).format('X'),
      });
    }
    if (result.affectedRows === 1) {
      ctx.service.common.success(0, {
        msg: '保存成功',
      });
    } else {
      ctx.service.common.fail(500);
    }
  }
  async deleteNotice(id) {
    const { ctx, app } = this;
    const result = await app.mysql.update('notice', {
      id,
      is_delete: true,
    });
    if (result.affectedRows === 1) {
      ctx.service.common.success(0, {
        msg: '删除成功',
      });
    } else {
      ctx.service.common.fail(500);
    }
  }
}

module.exports = ShopService;
