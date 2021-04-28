'use strict';

const Service = require('egg').Service;
const moment = require('moment');

class HomeService extends Service {
  async info() {
    const { ctx, app } = this;
    const goodsOnsale = await app.mysql.select('goods', { is_on_sale: 1, is_delete: 0 });
    const orderToDelivery = await app.mysql.select('order', { order_status: 300 });
    const user = await app.mysql.select('user');
    ctx.service.common.success(0, {
      goodsOnsale: goodsOnsale.length,
      orderToDelivery: orderToDelivery.length,
      user: user.length,
    });
  }
  async main(index) {
    const { ctx, app } = this;
    const todayTimeStamp = new Date(new Date().setHours(0, 0, 0, 0)) / 1000; // 今天零点的时间戳
    const yesTimeStamp = todayTimeStamp - 86400; // 昨天零点的时间戳
    const sevenTimeStamp = todayTimeStamp - 86400 * 7; // 7天前零点的时间戳
    const thirtyTimeStamp = todayTimeStamp - 86400 * 30; // 30天前零点的时间戳
    let oldUser = 0;
    let oldData = [];
    let newUser = 0;
    let newData = [];
    let addCart = 0;
    let addOrderNum = 0;
    let addOrderSum = 0;
    let payOrderNum = 0;
    let payOrderSum = 0;
    if (index === 2) {
      newData = await app.mysql.query('select * from `user` where `id` > 0 and `register_time` >= ? and `register_time` < ?', [ yesTimeStamp, todayTimeStamp ]);
      newUser = newData.length;
      for (const item of newData) {
        item.nickname = Buffer.from(item.nickname, 'base64').toString();
      }
      oldData = await app.mysql.query('select * from `user` where `id` > 0 and `register_time` < ? and `last_login_time` >= ? and `last_login_time` < ?', [ yesTimeStamp, yesTimeStamp, todayTimeStamp ]);
      for (const item of oldData) {
        item.nickname = Buffer.from(item.nickname, 'base64').toString();
      }
      oldUser = oldData.length;
      addCart = await app.mysql.query('select * from `cart` where `is_delete` = 0 and `add_time` >= ? and `add_time` < ?', [ yesTimeStamp, todayTimeStamp ]);
      addOrderNum = await app.mysql.query('select * from `order` where `is_delete` = 0 and `add_time` >= ? and `add_time` < ?', [ yesTimeStamp, todayTimeStamp ]);
      addOrderSum = await app.mysql.query('select sum(`actual_price`) from `order` where `is_delete` = 0 and `add_time` >= ? and `add_time` < ?', [ yesTimeStamp, todayTimeStamp ]);
      payOrderNum = await app.mysql.query('select * from `order` where `is_delete` = 0 and `add_time` >= ? and `add_time` < ? and `order_status` in (201,802,300,301)', [ yesTimeStamp, todayTimeStamp ]);
      payOrderSum = await app.mysql.query('select sum(`actual_price`) from `order` where `is_delete` = 0 and `add_time` >= ? and `add_time` < ? and `order_status` in (201,802,300,301)', [ yesTimeStamp, todayTimeStamp ]);
    } else {
      let timeStamp = 0;
      if (index === 1) {
        timeStamp = todayTimeStamp;
      } else if (index === 3) {
        timeStamp = sevenTimeStamp;
      } else if (index === 4) {
        timeStamp = thirtyTimeStamp;
      } else {
        return ctx.service.common.fail(400, '参数错误');
      }
      newData = await app.mysql.query('select * from `user` where `id` > 0 and `register_time` >= ?', [ timeStamp ]);
      newUser = newData.length;
      for (const item of newData) {
        item.nickname = Buffer.from(item.nickname, 'base64').toString();
      }
      oldData = await app.mysql.query('select * from `user` where `id` > 0 and `register_time` < ? and `last_login_time` >= ?', [ timeStamp, timeStamp ]);
      for (const item of oldData) {
        item.nickname = Buffer.from(item.nickname, 'base64').toString();
      }
      oldUser = oldData.length;
      addCart = await app.mysql.query('select * from `cart` where `is_delete` = 0 and `add_time` >= ?', [ timeStamp ]);
      addOrderNum = await app.mysql.query('select * from `order` where `is_delete` = 0 and `add_time` >= ?', [ timeStamp ]);
      addOrderSum = await app.mysql.query('select sum(`actual_price`) from `order` where `is_delete` = 0 and `add_time` >= ?', [ timeStamp ]);
      payOrderNum = await app.mysql.query('select * from `order` where `is_delete` = 0 and `add_time` >= ? and `order_status` in (201,802,300,301)', [ timeStamp ]);
      payOrderSum = await app.mysql.query('select sum(`actual_price`) from `order` where `is_delete` = 0 and `add_time` >= ? and `order_status` in (201,802,300,301)', [ timeStamp ]);
    }
    if (newData.length > 0) {
      for (const item of newData) {
        item.birthday = moment.unix(item.birthday).format('YYYY-MM-DD HH:mm:ss');
        item.register_time = moment.unix(item.register_time).format('YYYY-MM-DD HH:mm:ss');
        item.last_login_time = moment.unix(item.last_login_time).format('YYYY-MM-DD HH:mm:ss');
        delete item.username;
        delete item.weixin_openid;
        delete item.password;
      }
    }
    if (oldData.length > 0) {
      for (const item of oldData) {
        item.birthday = moment.unix(item.birthday).format('YYYY-MM-DD HH:mm:ss');
        item.register_time = moment.unix(item.register_time).format('YYYY-MM-DD HH:mm:ss');
        item.last_login_time = moment.unix(item.last_login_time).format('YYYY-MM-DD HH:mm:ss');
        delete item.username;
        delete item.weixin_openid;
        delete item.password;
      }
    }
    return ctx.service.common.success(0, {
      newData,
      newUser,
      oldData,
      oldUser,
      addCart: addCart.length, // 加入购物车
      addOrderNum: addOrderNum.length, // 提交订单数
      addOrderSum: addOrderSum[0]['sum(`actual_price`)'] || 0,
      payOrderNum: payOrderNum.length,
      payOrderSum: payOrderSum[0]['sum(`actual_price`)'] || 0,
    });
  }
}

module.exports = HomeService;
