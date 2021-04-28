'use strict';

const path = require('path');
const Service = require('egg').Service;

class GoodsService extends Service {
  async getGoodsList(sort, status, page, name) {
    const { app } = this;
    const offset = (page - 1) * 20;
    let orders = '';
    switch (sort) {
      case 'sale':
        orders = 'order by `sell_volume` desc';
        break;
      case 'price':
        orders = 'order by `retail_price` desc';
        break;
      case 'stock':
        orders = 'order by `goods_number` desc';
        break;
      default:
        orders = 'order by `sort_order` asc';
    }
    let query = '';
    let queryForCount = '';
    if (status === '1') {
      query = 'select * from `goods` where `is_delete` = 0 and name like "%' + name + '%" ' + orders + ' limit 20 offset ' + offset;
      queryForCount = 'select count(1) as count from `goods` where `is_delete` = 0 and name like "%' + name + '%"';
    } else if (status === '2') {
      query = 'select * from `goods` where `is_delete` = 0 and `is_on_sale` = 1 and name like "%' + name + '%" ' + orders + ' limit 20 offset ' + offset;
      queryForCount = 'select count(1) as count from `goods` where `is_delete` = 0 and `is_on_sale` = 1 and name like "%' + name + '%"';
    } else if (status === '3') {
      query = 'select * from `goods` where `is_delete` = 0 and `goods_number` <= 0 and name like "%' + name + '%" ' + orders + ' limit 20 offset ' + offset;
      queryForCount = 'select count(1) as count from `goods` where `is_delete` = 0 and `goods_number` <= 0 and name like "%' + name + '%"';
    } else if (status === '4') {
      query = 'select * from `goods` where `is_delete` = 0 and `is_on_sale` = 0 and name like "%' + name + '%" ' + orders + ' limit 20 offset ' + offset;
      queryForCount = 'select count(1) as count from `goods` where `is_delete` = 0 and `is_on_sale` = 0 and name like "%' + name + '%"';
    }
    const list = await app.mysql.query(query);
    const count = await app.mysql.query(queryForCount);
    for (const item of list) {
      const category = await app.mysql.get('category', { id: item.category_id });
      item.category_name = category.name;
      // const subcategory = await app.mysql.get('sub_category', {  // 本来想做二级分类，想想，算了。
      //   id: item.sub_category_id,
      // });
      // if (subcategory) {
      //   item.category_name += ` - ${subcategory.name}`;
      // }
      if (item.is_on_sale === 1) {
        item.is_on_sale = true;
      } else {
        item.is_on_sale = false;
      }
      if (item.is_index === 1) {
        item.is_index = true;
      } else {
        item.is_index = false;
      }
      const product = await app.mysql.select('product', {
        where: {
          goods_id: item.id,
          is_delete: 0,
        },
      });
      for (const ele of product) {
        const spec = await app.mysql.get('goods_specification', {
          id: ele.goods_specification_ids,
          is_delete: 0,
        });
        ele.value = spec.value;
        ele.is_on_sale = ele.is_on_sale ? '1' : '0';
      }
      item.product = product;
    }
    return {
      list,
      count: count[0].count,
    };
  }
  async deleteGoods(id) {
    const { app } = this;
    await app.mysql.update('goods', {
      id,
      is_delete: 1,
    });
    await app.mysql.update('product', {
      is_delete: 1,
    }, {
      where: {
        goods_id: id,
      },
    });
    await app.mysql.update('goods_specification', {
      is_delete: 1,
    }, {
      where: {
        goods_id: id,
      },
    });
    return {
      msg: '删除成功!',
    };
  }
  async changeGoodsStatus(type, id, sort_order, is_index, is_on_sale) {
    const { ctx, app } = this;
    id = parseInt(id);
    if (type === 'sort') {
      await app.mysql.update('goods', {
        id,
        sort_order: parseInt(sort_order),
      });
      ctx.service.common.success(0, { msg: '修改成功' });
    } else if (type === 'index') {
      await app.mysql.update('goods', {
        id,
        is_index: is_index ? 1 : 0,
      });
      ctx.service.common.success(0, { msg: '修改成功' });
    } else if (type === 'sale') {
      await app.mysql.update('goods', {
        id,
        is_on_sale: is_on_sale ? 1 : 0,
      });
      ctx.service.common.success(0, { msg: '修改成功' });
    } else {
      ctx.service.common.fail(400, '参数错误');
    }
  }
  async getGoodsDetail(id) {
    const { ctx, app } = this;
    const detail = await app.mysql.get('goods', {
      id,
      is_delete: 0,
    });
    const category = await app.mysql.get('category', { id: detail.category_id });
    detail.category_name = category.name;
    // const subcategory = await app.mysql.get('sub_category', {  // 本来想做二级分类，想想，算了。
    //   id: detail.sub_category_id,
    // });
    // if (subcategory) {
    //   detail.category_name += ` - ${subcategory.name}`;
    // }
    if (detail.is_on_sale === 1) {
      detail.is_on_sale = true;
    } else {
      detail.is_on_sale = false;
    }
    if (detail.is_index === 1) {
      detail.is_index = true;
    } else {
      detail.is_index = false;
    }
    const product = await app.mysql.select('product', {
      where: {
        goods_id: detail.id,
        is_delete: 0,
      },
    });
    detail.specValue = 0;
    for (const ele of product) {
      const spec = await app.mysql.get('goods_specification', {
        id: ele.goods_specification_ids,
        is_delete: 0,
      });
      detail.specValue = spec.specification_id;
      ele.value = spec.value;
      ele.is_on_sale = ele.is_on_sale ? '1' : '0';
    }
    detail.product = product;
    const gallery = await app.mysql.select('goods_gallery', {
      where: {
        goods_id: id,
        is_delete: 0,
      },
    });
    detail.galleryData = [];
    for (const item of gallery) {
      detail.galleryData.push({
        uid: item.id,
        name: path.basename(item.img_url),
        url: item.img_url,
        status: 'done',
      });
    }
    const specInfo = await app.mysql.select('specification');
    detail.specOptionsData = [];
    for (const spitem of specInfo) {
      const info = {
        value: spitem.id,
        label: spitem.name,
      };
      detail.specOptionsData.push(info);
    }
    ctx.service.common.success(0, {
      detail,
    });
  }
  async getAllSpecification() {
    const { ctx, app } = this;
    const specification = await app.mysql.select('specification', {
      where: {
        is_delete: 0,
      },
    });
    ctx.service.common.success(0, {
      specification,
    });
  }
  async save(goods) {
    const { ctx, app } = this;
    if (goods.type === 'add' && goods.id === '') {
      const result = await app.mysql.insert('goods', {
        category_id: goods.category_id,
        is_on_sale: goods.is_on_sale,
        name: goods.name,
        goods_number: goods.goods_number,
        sell_volume: goods.sell_volume,
        keywords: goods.keywords,
        retail_price: goods.retail_price,
        min_cost_price: goods.min_cost_price,
        min_retail_price: goods.min_retail_price,
        cost_price: goods.cost_price,
        goods_brief: goods.goods_brief,
        goods_desc: goods.goods_desc,
        sort_order: goods.sort_order,
        is_index: goods.is_index,
        is_new: goods.is_new,
        goods_unit: goods.goods_unit,
        https_pic_url: goods.https_pic_url,
        list_pic_url: goods.list_pic_url,
        freight_template_id: goods.freight_template_id,
        freight_type: goods.freight_type,
        is_delete: 0,
      });
      if (result.affectedRows === 1) {
        goods.id = result.insertId;
      }
      for (const pic of goods.galleryData) {
        await app.mysql.insert('goods_gallery', {
          goods_id: goods.id,
          img_url: pic.url,
        });
      }
      for (const ele of goods.product) {
        const specificationData = {
          value: ele.value,
          goods_id: goods.id,
          specification_id: goods.specValue,
        };
        const insertResult = await app.mysql.insert('goods_specification', specificationData);
        if (insertResult.affectedRows === 1) {
          ele.goods_sn = goods.id + new Date().getTime();
          ele.is_on_sale = goods.is_on_sale;
          await app.mysql.insert('product', {
            goods_id: goods.id,
            goods_specification_ids: insertResult.insertId,
            goods_sn: goods.id + new Date().getTime(),
            goods_number: ele.goods_number,
            retail_price: ele.retail_price,
            cost: ele.cost,
            goods_weight: ele.goods_weight,
            goods_name: ele.goods_name,
            is_on_sale: ele.is_on_sale,
            is_delete: ele.is_delete,
          });
        }
      }
    } else if (goods.type === 'update' && goods.id && goods.id !== '') {
      await app.mysql.update('goods', {
        id: goods.id,
        category_id: goods.category_id,
        is_on_sale: goods.is_on_sale,
        name: goods.name,
        goods_number: goods.goods_number,
        sell_volume: goods.sell_volume,
        keywords: goods.keywords,
        retail_price: goods.retail_price,
        min_cost_price: goods.min_cost_price,
        min_retail_price: goods.min_retail_price,
        cost_price: goods.cost_price,
        goods_brief: goods.goods_brief,
        goods_desc: goods.goods_desc,
        sort_order: goods.sort_order,
        is_index: goods.is_index,
        is_new: goods.is_new,
        goods_unit: goods.goods_unit,
        https_pic_url: goods.https_pic_url,
        list_pic_url: goods.list_pic_url,
        freight_template_id: goods.freight_template_id,
        freight_type: goods.freight_type,
        is_delete: 0,
      });
      await app.mysql.update('cart', {
        checked: goods.is_on_sale,
        is_on_sale: goods.is_on_sale,
        list_pic_url: goods.list_pic_url,
        freight_template_id: goods.freight_template_id,
      }, {
        where: {
          goods_id: goods.id,
        },
      });
      await app.mysql.update('product', {
        is_delete: 1,
      }, {
        where: {
          goods_id: goods.id,
        },
      });
      await app.mysql.update('goods_gallery', {
        is_delete: 1,
      }, {
        where: {
          goods_id: goods.id,
        },
      });
      const gallery = await app.mysql.select('goods_gallery', {
        where: {
          goods_id: goods.id,
        },
      });
      for (const pic of goods.galleryData) {
        if (gallery.find(value => value.id === pic.uid)) {
          await app.mysql.update('goods_gallery', {
            id: pic.uid,
            is_delete: 0,
          });
        } else {
          await app.mysql.insert('goods_gallery', {
            goods_id: goods.id,
            img_url: pic.url,
          });
        }
      }
      const product = await app.mysql.select('product', {
        where: {
          goods_id: goods.id,
        },
      });
      for (const prod of goods.product) {
        if (product.find(value => value.id === prod.id)) {
          await app.mysql.update('cart', {
            retail_price: prod.retail_price,
            goods_specifition_name_value: prod.value,
            goods_sn: prod.goods_sn,
          }, {
            where: {
              product_id: prod.id,
              is_delete: 0,
            },
          });
          delete prod.is_delete;
          prod.is_delete = 0;
          await app.mysql.update('product', {
            id: prod.id,
            goods_number: prod.goods_number,
            retail_price: prod.retail_price,
            cost: prod.cost,
            goods_weight: prod.goods_weight,
            goods_name: prod.goods_name,
            is_on_sale: prod.is_on_sale,
            is_delete: prod.is_delete,
          });
          const specificationData = {
            value: prod.value,
            specification_id: goods.specValue,
            is_delete: 0,
          };
          await app.mysql.update('goods_specification', specificationData, {
            where: {
              id: prod.goods_specification_ids,
            },
          });
        } else {
          const specificationData = {
            goods_id: goods.id,
            value: prod.value,
            specification_id: goods.specValue,
          };
          const insertResult = await app.mysql.insert('goods_specification', specificationData);
          if (insertResult.affectedRows === 1) {
            prod.goods_specification_ids = insertResult.insertId;
            prod.goods_id = goods.id;
            prod.goods_sn = goods.id + new Date().getTime();
            await app.mysql.insert('product', prod);
          } else {
            return ctx.service.common.fail(500);
          }
        }
      }
    } else {
      return ctx.service.common.fail(400, '参数错误');
    }
    const pro = await app.mysql.select('product', {
      where: {
        goods_id: goods.id,
        is_on_sale: 1,
        is_delete: 0,
      },
    });
    if (pro.length > 1) {
      const goodsNum = pro.reduce((a, b) => a.goods_number + b.goods_number, 0);
      const retail_price = pro.map(v => v.retail_price);
      const maxPrice = Math.max(...retail_price);
      const minPrice = Math.min(...retail_price);
      const cost = pro.map(v => v.cost);
      const maxCost = Math.max(...cost);
      const minCost = Math.min(...cost);
      let goodsPrice = '';
      if (minPrice === maxPrice) {
        goodsPrice = minPrice;
      } else {
        goodsPrice = minPrice + '~' + maxPrice;
      }
      const costPrice = minCost + '~' + maxCost;
      await app.mysql.update('goods', {
        goods_number: goodsNum,
        retail_price: goodsPrice,
        cost_price: costPrice,
        min_retail_price: minPrice,
        min_cost_price: minCost,
      }, {
        where: {
          id: goods.id,
        },
      });
    } else {
      const info = {
        goods_number: pro[0].goods_number,
        retail_price: pro[0].retail_price,
        cost_price: pro[0].cost,
        min_retail_price: pro[0].retail_price,
        min_cost_price: pro[0].cost,
      };
      await app.mysql.update('goods', info, {
        where: {
          id: goods.id,
        },
      });
    }
    return ctx.service.common.success(0, {
      msg: '保存成功',
    });
  }
  async changeSpecificationName(id, name) {
    const { ctx, app } = this;
    const result = await app.mysql.update('specification', {
      id,
      name,
    });
    if (result.affectedRows === 1) {
      ctx.service.common.success(0, {
        msg: '修改成功',
      });
    } else {
      ctx.service.common.fail(500);
    }
  }
  async changeSpecificationSortOrder(id, state) {
    const { ctx, app } = this;
    const result = await app.mysql.update('specification', {
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
  async deleteSpecification(id) {
    const { ctx, app } = this;
    const result = await app.mysql.update('specification', {
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
  async saveSpecification(specification) {
    const { ctx, app } = this;
    const result = await app.mysql.insert('specification', {
      name: specification.name,
      sort_order: specification.sort_order,
    });
    if (result.affectedRows === 1) {
      ctx.service.common.success(0, {
        msg: '保存成功',
      });
    } else {
      ctx.service.common.fail(500);
    }
  }
  async getGoodsSimpleList(page) {
    const { ctx, app } = this;
    const offset = (page - 1) * 20;
    const list = await app.mysql.select('goods', {
      where: {
        is_delete: 0,
      },
      limit: 20,
      offset,
    });
    const total = await app.mysql.query('select count(1) as count from `goods` where `is_delete` = 0');
    const result = [];
    if (list.length > 0) {
      for (const item of list) {
        const temp = {
          id: item.id,
          name: item.name,
          img_url: item.list_pic_url,
        };
        result.push(temp);
      }
    }
    ctx.service.common.success(0, {
      list: result,
      total: total[0].count,
    });
  }
}

module.exports = GoodsService;
