(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-57427974"],{4247:function(e,t,n){"use strict";n.r(t);var r=n("7a23"),a=Object(r["withScopeId"])("data-v-c0fa2cf2");Object(r["pushScopeId"])("data-v-c0fa2cf2");var c={class:"shop-freight-template"},o=Object(r["createVNode"])("h3",null,"运费模板列表",-1),i=Object(r["createTextVNode"])("添加"),d={key:0},u=Object(r["createVNode"])("span",{style:{"margin-right":"6px"}},"不可用",-1),p={key:1},l=Object(r["createTextVNode"])("编辑"),s=Object(r["createTextVNode"])("删除");Object(r["popScopeId"])();var f=a((function(e,t,n,f,b,m){var O=Object(r["resolveComponent"])("a-button"),g=Object(r["resolveComponent"])("a-table-column"),h=Object(r["resolveComponent"])("InfoCircleOutlined"),j=Object(r["resolveComponent"])("a-tooltip"),k=Object(r["resolveComponent"])("a-table"),v=Object(r["resolveComponent"])("a-spin");return Object(r["openBlock"])(),Object(r["createBlock"])(v,{spinning:b.spinning},{default:a((function(){return[Object(r["createVNode"])("div",c,[Object(r["createVNode"])(k,{"data-source":b.template,pagination:!1,rowKey:function(e){return e.id}},{title:a((function(){return[o,Object(r["createVNode"])(O,{type:"primary",onClick:t[1]||(t[1]=function(e){return m.edit("add")})},{default:a((function(){return[i]})),_:1})]})),default:a((function(){return[Object(r["createVNode"])(g,{key:"id",title:"ID","data-index":"id",width:80}),Object(r["createVNode"])(g,{key:"name",title:"名字","data-index":"name"}),Object(r["createVNode"])(g,{key:"shipper_name",title:"快递公司","data-index":"shipper.name"}),Object(r["createVNode"])(g,{key:"package_price",title:"包装费","data-index":"package_price"}),Object(r["createVNode"])(g,{key:"freight_type",title:"按件/按重","data-index":"freight_type"},{default:a((function(e){var t=e.text;return[Object(r["createTextVNode"])(Object(r["toDisplayString"])(0===t?"按件":"按重"),1)]})),_:1}),Object(r["createVNode"])(g,{key:"status",title:"状态","data-index":"status"},{default:a((function(e){var t=e.record;return[0===t.shipper.enabled?(Object(r["openBlock"])(),Object(r["createBlock"])("span",d,[u,Object(r["createVNode"])(j,{title:"快递已停用，请先启用快递",color:"#f50"},{default:a((function(){return[Object(r["createVNode"])(h,{style:{color:"#f50"}})]})),_:1})])):(Object(r["openBlock"])(),Object(r["createBlock"])("span",p,"可用"))]})),_:1}),Object(r["createVNode"])(g,{key:"action",title:"操作"},{default:a((function(e){var t=e.record;return[1===t.shipper.enabled?(Object(r["openBlock"])(),Object(r["createBlock"])(O,{key:0,type:"primary",onClick:function(e){return m.edit("edit",t)},style:{"margin-right":"20px"}},{default:a((function(){return[l]})),_:2},1032,["onClick"])):Object(r["createCommentVNode"])("",!0),Object(r["createVNode"])(O,{type:"danger",onClick:function(e){return m.edit("delete",t)}},{default:a((function(){return[s]})),_:2},1032,["onClick"])]})),_:1})]})),_:1},8,["data-source","rowKey"])])]})),_:1},8,["spinning"])})),b=n("1da1"),m=(n("96cf"),n("1740")),O={name:"ShopFreightTemplate",components:{InfoCircleOutlined:m["a"]},data:function(){return{spinning:!1,template:[]}},methods:{getFreightTemplate:function(){var e=this;return Object(b["a"])(regeneratorRuntime.mark((function t(){var n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.spinning=!0,t.prev=1,t.next=4,e.$axios({method:e.$api.GET_FREIGHT_TEMPLATE.method,url:e.$api.GET_FREIGHT_TEMPLATE.url});case 4:n=t.sent,e.template=n.data.template,e.spinning=!1,t.next=13;break;case 9:t.prev=9,t.t0=t["catch"](1),console.log("获取运费模板失败。[getFreightTemplate]",t.t0),e.spinning=!1;case 13:case"end":return t.stop()}}),t,null,[[1,9]])})))()},edit:function(e){var t=arguments,n=this;return Object(b["a"])(regeneratorRuntime.mark((function r(){var a,c;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:a=t.length>1&&void 0!==t[1]?t[1]:null,"delete"===e?n.$modal.confirm({okText:"确定",okType:"danger",cancelText:"取消",maskClosable:!0,content:"确定删除运费模板?",onOk:function(){var e=Object(b["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n.spinning=!0,e.prev=1,e.next=4,n.$axios({method:n.$api.DELETE_FREIGHT_TEMPLATE.method,url:n.$api.DELETE_FREIGHT_TEMPLATE.url,params:{id:a.id}});case 4:n.getFreightTemplate(),n.spinning=!1,e.next=12;break;case 8:e.prev=8,e.t0=e["catch"](1),console.log("删除运费模板失败。[edit->delete]",e.t0),n.spinning=!1;case 12:case"end":return e.stop()}}),e,null,[[1,8]])})));function t(){return e.apply(this,arguments)}return t}()}):(c="","edit"===e&&(c=a.id),n.$router.push("/freight/edit?id="+c));case 2:case"end":return r.stop()}}),r)})))()}},mounted:function(){this.getFreightTemplate()}};n("e7b6");O.render=f,O.__scopeId="data-v-c0fa2cf2";t["default"]=O},"87af":function(e,t,n){},e7b6:function(e,t,n){"use strict";n("87af")}}]);
//# sourceMappingURL=chunk-57427974.18969357.js.map