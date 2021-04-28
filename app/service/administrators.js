'use strict';

const Service = require('egg').Service;
const moment = require('moment');
const Encrypt = require('../utils/encrypt');

class Administrators extends Service {
  async getAdministrators() {
    const { ctx, app } = this;
    const result = await app.mysql.select('admin');
    for (const item of result) {
      delete item.password;
      item.last_login_time = moment.unix(item.last_login_time).format('YYYY-MM-DD HH:mm:ss');
    }
    ctx.service.common.success(0, {
      list: result,
    });
  }
  async add(administrator) {
    const { ctx, app } = this;
    const admin = await app.mysql.get('admin', {
      username: administrator.username,
    });
    if (!admin) {
      const result = await app.mysql.insert('admin', {
        username: administrator.username,
        name: administrator.name,
        email: administrator.email,
        password: '3c4635708ecc55f48c2a5043bb4c1932',
        last_login_time: '0',
        last_login_ip: '0.0.0.0',
      });
      if (result.affectedRows === 1) {
        ctx.service.common.success(0, {
          msg: '添加成功',
        });
      } else {
        ctx.service.common.fail(500);
      }
    } else {
      return ctx.service.common.fail(400, '用户名已存在');
    }
  }
  async edit(administrator) {
    const { ctx, app } = this;
    const result = await app.mysql.update('admin', {
      id: administrator.id,
      name: administrator.name,
      email: administrator.email,
    });
    if (result.affectedRows === 1) {
      ctx.service.common.success(0, {
        msg: '保存成功',
      });
    } else {
      ctx.service.common.fail(500);
    }
  }
  async changePassword(data) {
    const { ctx, app } = this;
    const request = JSON.parse(Encrypt.aesDecrypt(data));
    const username = request.username;
    const oldPassword = Encrypt.rsaDecrypt(request.oldPassword);
    const newPassword = Encrypt.rsaDecrypt(request.newPassword);
    const comfirmPassword = Encrypt.rsaDecrypt(request.comfirmPassword);
    if (newPassword !== comfirmPassword) {
      return ctx.service.common.fail(400, '新密码和确认密码不一致');
    }
    if (oldPassword === newPassword) {
      return ctx.service.common.fail(400, '旧密码和新密码不能一致');
    }
    const userInfo = await app.mysql.get('admin', { username });
    if (userInfo) {
      if (userInfo.password !== oldPassword) {
        return ctx.service.common.fail(400, '旧密码错误');
      }
      const result = await app.mysql.update('admin', {
        password: newPassword,
      }, {
        where: {
          username,
        },
      });
      if (result.affectedRows === 1) {
        ctx.service.common.success(0, {
          msg: '修改密码成功',
        });
      } else {
        ctx.service.common.fail(500);
      }
    } else {
      ctx.service.common.fail(500);
    }
  }
}

module.exports = Administrators;
