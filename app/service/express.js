'use strict';

const Service = require('egg').Service;

class ExpressService extends Service {
  async getAutomaticDeliveryStatus() {
    const { app } = this;
    const status = await app.mysql.get('settings', { id: 1 });
    return {
      status: status.autoDelivery,
    };
  }
  async type() {
    const { app } = this;
    const type = await app.mysql.select('shipper');
    if (type.length === 0) {
      return {
        status: 500,
      };
    }
    return {
      type,
    };
  }
  async changeStatus(id, enabled) {
    const { app } = this;
    const updateData = {
      id,
      enabled: enabled === 'true' ? 1 : 0,
    };
    console.log(updateData);
    const result = await app.mysql.update('shipper', updateData);
    if (result.affectedRows === 1) {
      return {
        msg: '更新成功',
      };
    }
    throw result;
  }
  async detail(id) {
    const { app } = this;
    const detail = await app.mysql.get('shipper', { id });
    return {
      detail,
    };
  }
  async edit(id, name, code, MonthCode, CustomerName, enabled) {
    const { app } = this;
    if (id === '') {
      const result = await app.mysql.insert('shipper', {
        name,
        code,
        MonthCode,
        CustomerName,
        enabled,
      });
      if (result.affectedRows === 1) {
        return {
          msg: '保存成功',
        };
      }
      throw result;
    } else {
      const result = await app.mysql.update('shipper', {
        id,
        name,
        code,
        MonthCode,
        CustomerName,
        enabled,
      });
      if (result.affectedRows === 1) {
        return {
          msg: '保存成功',
        };
      }
      throw result;
    }
  }
  async getFreightTemplate() {
    const { app } = this;
    const data = await app.mysql.select('freight_template', {
      where: {
        is_delete: 0,
      },
    });
    for (const item of data) {
      item.name = unescape(item.name);
      item.shipper = await app.mysql.get('shipper', { id: item.shipper_id });
    }
    return {
      template: data,
      count: data.length,
    };
  }
  async deleteFreightTemplate(id) {
    const { app } = this;
    const result = await app.mysql.update('freight_template', {
      id,
      is_delete: 1,
    });
    if (result.affectedRows === 1) {
      return {
        msg: '删除成功',
      };
    }
    throw result;
  }
  async getFreightTemplateDetail(id) {
    const { app } = this;
    const data = await app.mysql.select('freight_template_group', {
      where: {
        template_id: id,
        is_delete: 0,
      },
    });
    for (const item of data) {
      const area = item.area;
      if (item.free_by_money > 0) {
        item.freeByMoney = true;
      } else {
        item.freeByMoney = false;
      }
      if (item.free_by_number > 0) {
        item.freeByNumber = true;
      } else {
        item.freeByNumber = false;
      }
      const areaData = area.split(',');
      const info = await app.mysql.select('region', {
        where: {
          id: areaData,
        },
        columns: [ 'name' ],
      });
      item.areaName = info.map(value => value.name).join('，');
    }
    const freight = await app.mysql.get('freight_template', { id });
    freight.name = unescape(freight.name);
    return {
      detail: data,
      freight,
    };
  }
  async canUseShipper() {
    const { app } = this;
    const shipper = await app.mysql.select('shipper', {
      where: {
        enabled: 1,
      },
    });
    return {
      shipper,
    };
  }
  async saveFreightTemplate(id, name, package_price, freight_type, shipper_id, defaultFreightId, template_id, start, start_fee, add, add_fee, free_by_money, free_by_number, specialFreight) {
    const { app } = this;
    if (id && template_id && defaultFreightId && id === template_id) {
      for (const item of specialFreight) {
        if (parseInt(item.template_id) !== id) {
          this.ctx.service.common.fail(400, '参数错误');
          return false;
        }
      }
      await app.mysql.update('freight_template', {
        id,
        name: escape(name),
        package_price,
        freight_type,
        shipper_id,
        is_delete: 0,
      });
      await app.mysql.update('freight_template_group', {
        id: defaultFreightId,
        template_id,
        is_default: 1,
        area: 0,
        start,
        start_fee,
        add,
        add_fee,
        free_by_number,
        free_by_money,
        is_delete: 0,
      });
      const idInfo = [];
      for (const item of specialFreight) {
        if (item.id > 0) {
          idInfo.push(item.id);
        }
      }
      if (idInfo.length !== 0) {
        const query = 'select `id` from `freight_template_group` where `id` not in (' + idInfo.join(',') + ') and `template_id` = ' + template_id + ' and `is_default` = 0 and `is_delete` = 0';
        const deleteData = await app.mysql.query(query);
        for (const ele of deleteData) {
          await app.mysql.update('freight_template_group', {
            id: ele.id,
            is_delete: 1,
          });
        }
      } else {
        const query = 'update `freight_template_group` set `is_delete` = 1 where `template_id` = ' + id + ' and is_default = 0';
        await app.mysql.query(query);
      }
      for (const item of specialFreight) {
        const rowData = await app.mysql.get('freight_template_group', { id: item.id });
        if (rowData) {
          await app.mysql.update('freight_template_group', {
            id: item.id,
            template_id: item.template_id,
            is_default: 0,
            area: item.area,
            start: parseInt(item.start),
            start_fee: parseFloat(item.start_fee),
            add: parseInt(item.add),
            add_fee: parseFloat(item.add_fee),
            free_by_number: parseInt(item.free_by_number),
            free_by_money: parseFloat(item.free_by_money),
            is_delete: 0,
          });
        } else {
          await app.mysql.insert('freight_template_group', {
            template_id: id,
            is_default: 0,
            area: item.area,
            start: parseInt(item.start),
            start_fee: parseFloat(item.start_fee),
            add: parseInt(item.add),
            add_fee: parseFloat(item.add_fee),
            free_by_number: parseInt(item.free_by_number),
            free_by_money: parseFloat(item.free_by_money),
            is_delete: 0,
          });
        }

      }
      return {
        msg: '保存成功',
      };
    }
    // 新添加
    await app.mysql.insert('freight_template', {
      name: escape(name),
      package_price,
      freight_type,
      shipper_id,
      is_delete: 0,
    });
    const newTemplate = await app.mysql.get('freight_template', { name: escape(name) });
    const newTemplateId = newTemplate.id;
    await app.mysql.insert('freight_template_group', {
      template_id: newTemplateId,
      is_default: 1,
      area: 0,
      start,
      start_fee,
      add,
      add_fee,
      free_by_number,
      free_by_money,
      is_delete: 0,
    });
    for (const item of specialFreight) {
      await app.mysql.insert('freight_template_group', {
        template_id: newTemplateId,
        is_default: 0,
        area: item.area,
        start: parseInt(item.start),
        start_fee: parseFloat(item.start_fee),
        add: parseInt(item.add),
        add_fee: parseFloat(item.add_fee),
        free_by_number: parseInt(item.free_by_number),
        free_by_money: parseFloat(item.free_by_money),
        is_delete: 0,
      });
    }
    return {
      msg: '添加成功',
    };
  }
}

module.exports = ExpressService;
