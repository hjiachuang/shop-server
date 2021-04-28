'use strict';

const Service = require('egg').Service;

class RegionService extends Service {
  async getAll() {
    const { ctx, app } = this;
    const aData = await app.mysql.select('region', {
      where: {
        type: 1,
      },
    });
    const bData = await app.mysql.select('region', {
      where: {
        type: 2,
      },
    });
    const cData = await app.mysql.select('region', {
      where: {
        type: 3,
      },
    });
    const newData = [];
    for (const item of aData) {
      const children = [];
      for (const bitem of bData) {
        const innerChildren = [];
        for (const citem of cData) {
          if (citem.parent_id === bitem.id) {
            innerChildren.push({
              value: citem.id,
              label: citem.name,
            });
          }
        }
        if (bitem.parent_id === item.id) {
          children.push({
            value: bitem.id,
            label: bitem.name,
            children: innerChildren,
          });
        }
      }
      newData.push({
        value: item.id,
        label: item.name,
        children,
      });
    }
    app.redis.set('region', JSON.stringify(newData));
    return ctx.service.common.success(0, {
      region: newData,
    });
  }
  async getAllArea() {
    const { ctx, app } = this;
    const area = await app.mysql.select('region', {
      where: {
        type: 1,
      },
      columns: [ 'id', 'name' ],
    });
    return ctx.service.common.success(0, {
      area,
    });
  }
}

module.exports = RegionService;
