'use strict';

const fs = require('fs');
const path = require('path');
const Controller = require('egg').Controller;

class UploadController extends Controller {
  async image() {
    const { ctx } = this;
    const file = ctx.request.files[0];
    console.log(file);
    if (file) {
      const isJpgOrPng = file.mime === 'image/jpeg' || file.mime === 'image/png';
      if (!isJpgOrPng) {
        return ctx.service.common.fail(400, '只允许上传JPG和PNG格式的图片');
      }
      const states = fs.statSync(file.filepath);
      const isLt2M = states.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        return ctx.service.common.fail(400, '只允许上传小于10M的图片');
      }
    }
    const filename = new Date().getTime() + file.filename;
    const filePath = path.join('./', `app/public/upload/image/${filename}`);
    try {
      fs.writeFileSync(filePath, fs.readFileSync(file.filepath));
      ctx.service.common.success(0, {
        name: filename,
        url: 'http://127.0.0.1:7001/public/upload/image/' + filename,
      });
    } catch (err) {
      console.log(err);
      ctx.service.common.fail(500);
    }
  }
}

module.exports = UploadController;
