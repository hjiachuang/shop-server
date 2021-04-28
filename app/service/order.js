'use strict';

const Service = require('egg').Service;
const moment = require('moment');
const _ = require('lodash');

class OrderService extends Service {
  // 获取订单状态文字
  getOrderStatusText(status) {
    let statusText = '';
    switch (status) {
      case 101:
        statusText = '待付款';
        break;
      case 102:
        statusText = '交易关闭';
        break;
      case 103:
        statusText = '交易关闭'; // 到时间系统自动取消
        break;
      case 201:
        statusText = '待发货';
        break;
      case 202:
        statusText = '退款中';
        break;
      case 203:
        statusText = '已退款';
        break;
      case 300:
        statusText = '未发货';
        break;
      case 301:
        statusText = '已发货';
        break;
      case 302:
        statusText = '待评价';
        break;
      case 303:
        statusText = '待评价'; // 到时间，未收货的系统自动收货、
        break;
      case 401:
        statusText = '交易成功'; // 到时间，未收货的系统自动收货、
        break;
      case 801:
        statusText = '拼团待付款';
        break;
      case 802:
        statusText = '拼团中'; // 如果sum变为0了。则，变成201待发货
        break;
      default:
        statusText = '';
    }
    return statusText;
  }
  // 获取订单列表按钮文字
  getOrderBtnText(status) {
    let statusText = '';
    switch (status) {
      case 101:
        statusText = '修改价格';
        break;
      case 102:
        statusText = '查看详情';
        break;
      case 103:
        statusText = '查看详情'; // 到时间系统自动取消
        break;
      case 201:
        statusText = '备货';
        break;
      case 202:
        statusText = '查看详情';
        break;
      case 203:
        statusText = '查看详情';
        break;
      case 300:
        statusText = '打印快递单';
        break;
      case 301:
        statusText = '确认收货';
        break;
      case 302:
        statusText = '查看详情';
        break;
      case 303:
        statusText = '查看详情'; // 到时间，未收货的系统自动收货、
        break;
      case 401:
        statusText = '查看详情'; // 到时间，未收货的系统自动收货、
        break;
      default:
        statusText = '';
    }
    return statusText;
  }
  // 生成订单的编号order_sn
  generateOrderNumber() {
    const date = new Date();
    return date.getFullYear() + _.padStart(date.getMonth(), 2, '0') + _.padStart(date.getDay(), 2, '0') + _.padStart(date.getHours(), 2, '0') + _.padStart(date.getMinutes(), 2, '0') + _.padStart(date.getSeconds(), 2, '0') + _.random(100000, 999999);
  }
  // 获取订单列表
  async getOrder(page, orderStatus, logisticCode, orderSn, consignee) {
    const { ctx, app } = this;
    const offset = (page - 1) * 20;
    let order = null;
    let count = null;
    if (logisticCode === '') {
      const query = 'select * from `order` where `order_sn` like "%' + orderSn + '%" and `consignee` like "%' + consignee + '%" and `order_status` in (' + orderStatus + ') and `order_type` < 7 order by `id` desc limit 20 offset ' + offset;
      const countQuery = 'select count(1) as count from `order` where `order_sn` like "%' + orderSn + '%" and `consignee` like "%' + consignee + '%" and `order_status` in (' + orderStatus + ') and `order_type` < 7';
      order = await app.mysql.query(query);
      count = await app.mysql.query(countQuery);
    } else {
      const logisticOrder = await app.mysql.get('order_express', { logistic_code: logisticCode });
      order = await app.mysql.select('order', {
        where: {
          logistic_code: logisticOrder.order_id,
        },
        orders: [[ 'id', 'desc' ]],
        limit: 20,
        offset,
      });
      count = await app.mysql.query('select count(1) as count from `order` where `logistic_code` = ?', [ logisticOrder.order_id ]);
    }
    for (const item of order) {
      item.goodsList = await app.mysql.select('order_goods', {
        where: {
          order_id: item.id,
          is_delete: 0,
        },
        columns: [ 'goods_name', 'goods_aka', 'list_pic_url', 'number', 'goods_specifition_name_value', 'retail_price' ],
      });
      item.goodsCount = 0;
      item.goodsList.forEach(v => {
        item.goodsCount += v.number;
      });
      item.userInfo = await app.mysql.get('user', { id: item.user_id }, {
        columns: [ 'nickname', 'name', 'mobile', 'avatar' ],
      });
      if (item.userInfo !== null) {
        item.userInfo.nickname = unescape(item.userInfo.nickname);
      } else {
        item.userInfo = {
          nickname: '已删除',
        };
      }
      const province_name = await app.mysql.select('region', {
        where: {
          id: item.province,
        },
        columns: [ 'name' ],
      });
      const city_name = await app.mysql.select('region', {
        where: {
          id: item.city,
        },
        columns: [ 'name' ],
      });
      const district_name = await app.mysql.select('region', {
        where: {
          id: item.district,
        },
        columns: [ 'name' ],
      });
      item.full_region = province_name[0].name + city_name[0].name + district_name[0].name;
      item.postscript = unescape(item.postscript);
      item.add_time = moment.unix(item.add_time).format('YYYY-MM-DD HH:mm:ss');
      if (item.pay_time !== 0 && item.pay_time !== '0') {
        item.pay_time = moment.unix(item.pay_time).format('YYYY-MM-DD HH:mm:ss');
      } else {
        item.pay_time = 0;
      }
      item.order_status_text = this.getOrderStatusText(item.order_status);
      const express = await app.mysql.get('order_express', { order_id: item.id });
      if (express !== null) {
        item.expressInfo = express.shipper_name + express.logistic_code;
      } else {
        item.expressInfo = '';
      }
    }
    return ctx.service.common.success(0, {
      order,
      count: count[0].count,
    });
  }
  // 获取指定订单订单详细
  async getOrderDetail(orderId) {
    const { ctx, app } = this;
    const order = await app.mysql.get('order', { id: orderId });
    order.goodsList = await app.mysql.select('order_goods', {
      where: {
        order_id: orderId,
        is_delete: 0,
      },
      columns: [ 'id', 'product_id', 'goods_name', 'goods_aka', 'list_pic_url', 'number', 'goods_specifition_name_value', 'retail_price', 'goods_id' ],
    });
    order.goodsCount = 0;
    order.goodsList.forEach(v => {
      order.goodsCount += v.number;
    });
    for (const item of order.goodsList) {
      const info = await app.mysql.get('product', { id: item.product_id });
      item.goods_sn = info.goods_sn;
    }
    const userInfo = await app.mysql.get('user', { id: order.user_id });
    userInfo.nickname = unescape(userInfo.nickname);
    order.avatar = userInfo.avatar;
    const province_name = await app.mysql.select('region', {
      where: {
        id: order.province,
      },
      columns: [ 'name' ],
    });
    const city_name = await app.mysql.select('region', {
      where: {
        id: order.city,
      },
      columns: [ 'name' ],
    });
    const district_name = await app.mysql.select('region', {
      where: {
        id: order.district,
      },
      columns: [ 'name' ],
    });
    order.full_region = province_name[0].name + city_name[0].name + district_name[0].name;
    order.postscript = unescape(order.postscript);
    order.seller_memo = unescape(order.seller_memo);
    order.order_status_text = this.getOrderStatusText(order.order_status);
    order.add_time = moment.unix(order.add_time).format('YYYY-MM-DD HH:mm:ss');
    order.allAddress = order.full_region + order.address;
    if (order.pay_time !== 0) {
      order.pay_time = moment.unix(order.pay_time).format('YYYY-MM-DD HH:mm:ss');
    }
    if (order.shipping_time !== 0) {
      order.shipping_time = moment.unix(order.shipping_time).format('YYYY-MM-DD HH:mm:ss');
    }
    if (order.confirm_time !== 0) {
      order.confirm_time = moment.unix(order.confirm_time).format('YYYY-MM-DD HH:mm:ss');
    }
    if (order.dealdone_time !== 0) {
      order.dealdone_time = moment.unix(order.dealdone_time).format('YYYY-MM-DD HH:mm:ss');
    }
    const setting = await app.mysql.get('settings', { id: 1 });
    const receiver = {
      name: unescape(order.consignee),
      mobile: order.mobile,
      province: province_name[0].name,
      province_id: order.province,
      city: city_name[0].name,
      city_id: order.city,
      district: district_name[0].name,
      district_id: order.district,
      address: unescape(order.address),
    };
    const sender = {
      name: unescape(setting.Name),
      mobile: setting.Tel,
      province: setting.ProvinceName,
      city: setting.CityName,
      district: setting.ExpAreaName,
      province_id: setting.province_id,
      city_id: setting.city_id,
      district_id: setting.district_id,
      address: unescape(setting.Address),
    };
    return ctx.service.common.success(0, {
      detail: order,
      receiver,
      sender,
    });
  }
  // 发货确认
  async goDelivery(orderId) {
    const { ctx, app } = this;
    const currentTime = parseInt(new Date().getTime() / 1000);
    const updateData = {
      id: orderId,
      order_status: 301,
      print_status: 1,
      shipping_status: 1,
      shipping_time: currentTime,
    };
    await app.mysql.update('order', updateData);
    const order = await app.mysql.get('order', { id: orderId });
    const user_openid = await app.mysql.get('user', { id: order.user_id });
    const order_goods = await app.mysql.select('order_goods', {
      where: {
        order_id: orderId,
      },
      columns: [ 'goods_name' ],
    });
    const express = await app.mysql.get('order_express', { order_id: orderId });
    let goodsName = '';
    if (order_goods.length === 1) {
      goodsName = order_goods[0].goods_name;
    } else {
      goodsName = order_goods[0].goods_name + '等' + order_goods.length + '件商品';
    }
    const templateId = 'bBbKCxhwzu3UL9OIVeiTtognlKIYcF0SsuPpQ3G7EbY';
    const message = {
      character_string1: {
        value: orderId.toString(),
      },
      character_string2: {
        value: express.logistic_code,
      },
      thing3: {
        value: goodsName,
      },
      thing5: {
        value: express.shipper_name,
      },
      thing4: {
        value: '签收前请检查包裹!',
      },
    };
    const page = '/index';
    const result = await ctx.service.weixin.sendMessage(templateId, message, page, user_openid.weixin_openid);
    console.log(result);
    // return result;
  }
  // 修改卖家留言
  async saveSellerMemo(orderId, memo) {
    const { ctx, app } = this;
    const updateData = {
      id: orderId,
      seller_memo: escape(memo),
    };
    const result = await app.mysql.update('order', updateData);
    return ctx.service.common.success(0, {
      result,
    });
  }
  // 修改订单价格
  async revisePrice(orderId, actualPrice, freightPrice, goodsPrice) {
    const { ctx, app } = this;
    const newOrderSn = this.generateOrderNumber();
    const updateData = {
      id: orderId,
      actual_price: actualPrice,
      freight_price: freightPrice,
      goods_price: goodsPrice,
      order_sn: newOrderSn,
    };
    await app.mysql.update('order', updateData);
    return ctx.service.common.success(0, {
      msg: '修改价格成功!',
    });
  }
  // 检查订单是否已有快递信息
  async checkExpress(orderId) {
    const { ctx, app } = this;
    const express = await app.mysql.get('order_express', { order_id: orderId });
    if (express) {
      const info = await app.mysql.get('shipper', { code: express.shipper_code });
      console.log(info);
      express.MonthCode = info.MonthCode;
      express.send_time = moment.unix(express.add_time).format('YYYY-MM-DD');
      express.traces = JSON.parse(express.traces);
      express.request_time = moment.unix(express.request_time).format('YYYY-MM-DD HH:mm:ss');
      express.add_time = moment.unix(express.add_time).format('YYYY-MM-DD HH:mm:ss');
      express.update_time = moment.unix(express.update_time).format('YYYY-MM-DD HH:mm:ss');
      return ctx.service.common.success(0, {
        count: 1,
        express,
      });
    }
    return ctx.service.common.success(0, {
      count: 0,
    });
  }
  // 重新生成新订单号
  async regenerateOrderSn(orderId) {
    const { ctx, app } = this;
    const orderSn = this.generateOrderNumber();
    const updateData = {
      id: orderId,
      order_sn: orderSn,
    };
    const result = await app.mysql.update('order', updateData);
    return ctx.service.common.success(0, {
      result,
    });
  }
}

module.exports = OrderService;
