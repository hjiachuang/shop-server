'use strict';

const Service = require('egg').Service;
const qs = require('qs');

class WeixinService extends Service {
  async sendMessage(templateId, message, page, user_openid) {
    const { app } = this;
    const access_token = await this.getAccessToken();
    const data = {
      access_token,
      touser: user_openid,
      template_id: templateId,
      page,
      data: message,
    };
    const url = 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=' + access_token;
    try {
      const send = await app.curl(url, {
        method: 'post',
        data: JSON.stringify(data),
      });
      return JSON.parse(Buffer.from(send.data).toString());
    } catch (err) {
      console.log(err);
      return err;
    }
  }
  async getAccessToken() {
    const { app } = this;
    const data = {
      grant_type: 'client_credential',
      appid: app.config.weixin.appid,
      secret: app.config.weixin.secret,
    };
    const url = 'https://api.weixin.qq.com/cgi-bin/token?' + qs.stringify(data);
    try {
      const tokenData = await app.curl(url);
      const token = JSON.parse(Buffer.from(tokenData.data).toString()).access_token;
      return token || '';
    } catch (err) {
      return '';
    }
  }
}

module.exports = WeixinService;
