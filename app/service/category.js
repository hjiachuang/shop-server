'use strict';

const Service = require('egg').Service;

class CategoryService extends Service {
  async index() {
    const { ctx, app } = this;
    const category = await app.mysql.select('category', {
      where: {
        is_delete: 0,
      },
      orders: [[ 'sort_order', 'asc' ]],
    });
    for (const item of category) {
      item.show_index = Boolean(item.show_index);
      item.is_show = Boolean(item.is_show);
      item.icon_display = Boolean(item.icon_display);
      item.is_delete = Boolean(item.is_delete);
    }
    ctx.service.common.success(0, {
      category,
    });
  }
  async changeIconDisplay(id, state) {
    const { ctx, app } = this;
    const result = await app.mysql.update('category', {
      id,
      icon_display: state,
    });
    if (result.affectedRows === 1) {
      ctx.service.common.success(0, {
        msg: '修改成功',
      });
    } else {
      ctx.service.common.fail(500);
    }
  }
  async changeShowIndex(id, state) {
    const { ctx, app } = this;
    const result = await app.mysql.update('category', {
      id,
      show_index: state,
    });
    if (result.affectedRows === 1) {
      ctx.service.common.success(0, {
        msg: '修改成功',
      });
    } else {
      ctx.service.common.fail(500);
    }
  }
  async changeSortOrder(id, state) {
    const { ctx, app } = this;
    const result = await app.mysql.update('category', {
      id,
      sort_order: state,
    });
    if (result.affectedRows === 1) {
      ctx.service.common.success(0, {
        msg: '修改成功',
      });
    } else {
      ctx.service.common.fail(500);
    }
  }
  async deleteCategory(id) {
    const { ctx, app } = this;
    const result = await app.mysql.update('category', {
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
  async info(id) {
    const { ctx, app } = this;
    const info = await app.mysql.get('category', {
      id,
    });
    if (info) {
      ctx.service.common.success(0, {
        info,
      });
    } else {
      ctx.service.common.fail(404, {
        msg: '找不到对应的商品分类信息',
      });
    }
  }
  async save(category) {
    const { ctx, app } = this;
    if (category.type === 'add' && category.id === '') {
      const result = await app.mysql.insert('category', {
        name: category.name,
        keywords: category.keywords,
        sort_order: category.sort_order,
        icon_url: category.icon_url,
      });
      if (result.affectedRows === 1) {
        ctx.service.common.success(0, {
          msg: '保存成功',
        });
      } else {
        ctx.service.common.fail(500);
      }
    } else if (category.type === 'update' && category.id && category.id !== '') {
      const result = await app.mysql.update('category', {
        id: category.id,
        name: category.name,
        keywords: category.keywords,
        sort_order: category.sort_order,
        icon_url: category.icon_url,
      });
      if (result.affectedRows === 1) {
        ctx.service.common.success(0, {
          msg: '保存成功',
        });
      } else {
        ctx.service.common.fail(500);
      }
    } else {
      ctx.service.common.fail(400, '参数错误');
    }
  }
}

module.exports = CategoryService;
