'use strict';

const Service = require('egg').Service;
const moment = require('moment');

const getOrderStatusText = status => {
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
      statusText = '已备货';
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
};

const getOrderBtnText = status => {
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
};

class UserService extends Service {
  async getUser(page, size, nickname) {
    const { ctx, app } = this;
    const name = escape(nickname);
    const offset = (page - 1) * size;
    const queryResult = 'select * from `user` where `nickname` like "%' + name + '%" order by id desc limit ' + size + ' offset ' + offset;
    const queryCount = 'select count(1) as count from `user` where `nickname` like "%' + name + '%"';
    const user = await app.mysql.query(queryResult);
    const count = await app.mysql.query(queryCount);
    for (const item of user) {
      item.register_time = moment.unix(item.register_time).format('YYYY-MM-DD HH:mm:ss');
      item.last_login_time = moment.unix(item.last_login_time).format('YYYY-MM-DD HH:mm:ss');
      item.nickname = unescape(item.nickname);
      delete item.password;
      delete item.weixin_openid;
    }
    return ctx.service.common.success(0, {
      userlist: user,
      total: count[0].count,
      currentPage: page,
      pageSize: size,
      pageCount: Math.ceil(count[0].count / size),
    });
  }
  async getUserDetail(id) {
    const { ctx, app } = this;
    const detail = await app.mysql.get('user', { id });
    if (detail) {
      detail.register_time = moment.unix(detail.register_time).format('YYYY-MM-DD HH:mm:ss');
      detail.last_login_time = moment.unix(detail.last_login_time).format('YYYY-MM-DD HH:mm:ss');
      detail.nickname = unescape(detail.nickname);
      detail.name = unescape(detail.name);
      detail.gender = detail.gender.toString();
      delete detail.password;
      delete detail.username;
      delete detail.weixin_openid;
    }
    const orderSum = await app.mysql.query('select count(1) as count from `order` where `user_id` = ? and `order_type` < 8 and `is_delete` = 0', [ id ]);
    const orderDone = await app.mysql.query('select count(1) as count from `order` where `user_id` = ? and `order_status` in (302,303,401) and `order_type` < 8 and `is_delete` = 0', [ id ]);
    const orderMoney = await app.mysql.query('select sum(`actual_price`) as sum from `order` where `user_id` = ? and `order_status` in (302,303,401) and `order_type` < 8 and `is_delete` = 0', [ id ]);
    const cartSum = await app.mysql.query('select sum(`number`) as sum from `cart` where `user_id` = ? and `is_delete` = 0', [ id ]);
    return ctx.service.common.success(0, {
      userInfo: detail,
      orderSum: orderSum[0].count,
      orderDone: orderDone[0].count,
      orderMoney: orderMoney[0].sum || 0,
      cartSum: cartSum[0].sum || 0,
    });
  }
  async updateDetail(id, nickname, name, gender, mobile) {
    const { ctx, app } = this;
    const result = await app.mysql.update('user', {
      id,
      nickname: escape(nickname),
      name: escape(name),
      gender: Number(gender),
      mobile: Number(mobile),
    });
    if (result.affectedRows === 1) {
      return ctx.service.common.success(0, {
        msg: '更新成功',
      });
    }
    return ctx.service.common.fail(500);
  }
  async getUserOrder(id, page) {
    const { ctx, app } = this;
    const offset = (page - 1) * 20;
    const result = await app.mysql.query('select * from `order` where `user_id` = ? and `order_type` < 8 order by `id` desc limit 20 offset ?', [ id, offset ]);
    const count = await app.mysql.query('select count(1) as count from `order` where `user_id` = ? and `order_type` < 8', [ id ]);
    for (const item of result) {
      item.goodsList = await app.mysql.select('order_goods', {
        where: {
          order_id: item.id,
          is_delete: 0,
        },
        columns: [ 'goods_name', 'list_pic_url', 'number', 'goods_specifition_name_value', 'retail_price' ],
      });
      item.goodsCount = 0;
      item.goodsList.forEach(value => {
        item.goodsCount += value.number;
      });
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
      item.postscript = Buffer.from(item.postscript, 'base64').toString();
      item.add_time = moment.unix(item.add_time).format('YYYY-MM-DD HH:mm:ss');
      item.order_status_text = getOrderStatusText(item.order_status);
      item.button_text = getOrderBtnText(item.order_status);
    }
    return ctx.service.common.success(0, {
      order: result,
      count: count[0].count,
    });
  }
  async getUserAddress(id, page) {
    const { ctx, app } = this;
    const offset = (page - 1) * 20;
    const result = await app.mysql.select('address', {
      where: {
        user_id: id,
      },
      limit: 20,
      offset,
    });
    const count = await app.mysql.query('select count(1) as count from `address` where `user_id` = ?', [ id ]);
    for (const item of result) {
      const province_name = await app.mysql.select('region', {
        where: {
          id: item.province_id,
        },
        columns: [ 'name' ],
      });
      const city_name = await app.mysql.select('region', {
        where: {
          id: item.city_id,
        },
        columns: [ 'name' ],
      });
      const district_name = await app.mysql.select('region', {
        where: {
          id: item.district_id,
        },
        columns: [ 'name' ],
      });
      item.full_region = province_name[0].name + city_name[0].name + district_name[0].name;
    }
    return ctx.service.common.success(0, {
      address: result,
      count: count[0].count,
    });
  }
  async getUserCart(id, page) {
    const { ctx, app } = this;
    const offset = (page - 1) * 20;
    const result = await app.mysql.select('cart', {
      where: {
        user_id: id,
      },
      orders: [[ 'add_time', 'desc' ]],
      limit: 20,
      offset,
    });
    const count = await app.mysql.query('select count(1) as count from `cart` where `user_id` = ?', [ id ]);
    for (const item of result) {
      item.add_time = moment.unix(item.add_time).format('YYYY-MM-DD HH:mm:ss');
    }
    return ctx.service.common.success(0, {
      cart: result,
      count: count[0].count,
    });
  }
  async getUserFoot(id, page) {
    const { ctx, app } = this;
    const offset = (page - 1) * 20;
    const result = await app.mysql.select('footmark', {
      where: {
        user_id: id,
      },
      orders: [[ 'add_time', 'desc' ]],
      limit: 20,
      offset,
    });
    const count = await app.mysql.query('select count(1) as count from `footmark` where `user_id` = ?', [ id ]);
    for (const item of result) {
      item.add_time = moment.unix(item.add_time).format('YYYY-MM-DD HH:mm:ss');
      const goods = await app.mysql.get('goods', { id: item.goods_id });
      if (goods) {
        for (const key in goods) {
          item[key] = goods[key];
        }
      }
    }
    return ctx.service.common.success(0, {
      foot: result,
      count: count[0].count,
    });
  }
  async getAllShopCartList(page, name) {
    const { ctx, app } = this;
    const offset = (page - 1) * 20;
    const query = 'select * from `cart` where `goods_name` like "%' + name + '%" order by id desc limit 20 offset ' + offset;
    const list = await app.mysql.query(query);
    const count = await app.mysql.select('cart');
    for (const item of list) {
      item.add_time = moment.unix(item.add_time).format('YYYY-MM-DD HH:mm:ss');
      const userInfo = await app.mysql.get('user', { id: item.user_id });
      console.log(userInfo);
      if (userInfo) {
        item.nickname = unescape(userInfo.nickname);
      } else {
        item.nickname = '已删除';
      }
    }
    return ctx.service.common.success(0, {
      list,
      count: count.length,
    });
  }
}

module.exports = UserService;
