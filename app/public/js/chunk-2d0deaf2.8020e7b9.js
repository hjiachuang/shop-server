(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0deaf2"],{8763:function(e,t,a){"use strict";a.r(t);a("b0c0");var n=a("7a23"),r={class:"content-box"},i=Object(n["createTextVNode"])("添加新管理员"),o=Object(n["createTextVNode"])("编辑");function d(e,t,a,d,c,l){var u=Object(n["resolveComponent"])("a-button"),s=Object(n["resolveComponent"])("a-table-column"),m=Object(n["resolveComponent"])("a-table"),p=Object(n["resolveComponent"])("a-spin"),b=Object(n["resolveComponent"])("a-input"),g=Object(n["resolveComponent"])("a-form-item"),O=Object(n["resolveComponent"])("a-form"),h=Object(n["resolveComponent"])("a-modal");return Object(n["openBlock"])(),Object(n["createBlock"])(n["Fragment"],null,[Object(n["createVNode"])(p,{spinning:c.spinning},{default:Object(n["withCtx"])((function(){return[Object(n["createVNode"])("div",r,[Object(n["createVNode"])(u,{type:"primary",style:{"margin-bottom":"14px"},onClick:t[1]||(t[1]=function(e){return c.showAddModal=!0})},{default:Object(n["withCtx"])((function(){return[i]})),_:1}),Object(n["createVNode"])(m,{"data-source":c.administrators,pagination:c.pagination,rowKey:function(e){return e.id},bordered:""},{default:Object(n["withCtx"])((function(){return[Object(n["createVNode"])(s,{key:"id",title:"ID","data-index":"id"}),Object(n["createVNode"])(s,{key:"name",title:"昵称","data-index":"name"}),Object(n["createVNode"])(s,{key:"username",title:"用户名","data-index":"username"}),Object(n["createVNode"])(s,{key:"email",title:"邮箱地址","data-index":"email"}),Object(n["createVNode"])(s,{key:"last_login_time",title:"最后一次登录时间","data-index":"last_login_time"}),Object(n["createVNode"])(s,{key:"last_login_ip",title:"最后一次登录IP","data-index":"last_login_ip"}),Object(n["createVNode"])(s,null,{default:Object(n["withCtx"])((function(e){var t=e.record;return[Object(n["createVNode"])(u,{type:"primary",style:{"margin-right":"10px"},onClick:function(e){return l.edit(t)}},{default:Object(n["withCtx"])((function(){return[o]})),_:2},1032,["onClick"])]})),_:1})]})),_:1},8,["data-source","pagination","rowKey"])])]})),_:1},8,["spinning"]),Object(n["createVNode"])(h,{visible:c.showAddModal,"onUpdate:visible":t[5]||(t[5]=function(e){return c.showAddModal=e}),title:"添加管理员",width:650,okText:"保存",cancelText:"取消",onOk:l.addAdministrators},{default:Object(n["withCtx"])((function(){return[Object(n["createVNode"])(O,{ref:"addForm",model:c.addData,rules:c.addRules,"label-col":{span:4},"wrapper-col":{span:14}},{default:Object(n["withCtx"])((function(){return[Object(n["createVNode"])(g,{label:"用户名",name:"username",help:"用户名一旦创建不可更改"},{default:Object(n["withCtx"])((function(){return[Object(n["createVNode"])(b,{value:c.addData.username,"onUpdate:value":t[2]||(t[2]=function(e){return c.addData.username=e}),placeholder:"请输入用户名"},null,8,["value"])]})),_:1}),Object(n["createVNode"])(g,{label:"昵称",name:"name"},{default:Object(n["withCtx"])((function(){return[Object(n["createVNode"])(b,{value:c.addData.name,"onUpdate:value":t[3]||(t[3]=function(e){return c.addData.name=e}),placeholder:"请输入昵称"},null,8,["value"])]})),_:1}),Object(n["createVNode"])(g,{label:"邮箱地址",name:"email",help:"用于找回密码"},{default:Object(n["withCtx"])((function(){return[Object(n["createVNode"])(b,{value:c.addData.email,"onUpdate:value":t[4]||(t[4]=function(e){return c.addData.email=e}),placeholder:"请输入邮箱地址"},null,8,["value"])]})),_:1}),Object(n["createVNode"])(g,{label:"密码",name:"password",help:"初始密码，需登录之后才能更改密码"},{default:Object(n["withCtx"])((function(){return[Object(n["createVNode"])(b,{value:"123456",disabled:""})]})),_:1})]})),_:1},8,["model","rules"])]})),_:1},8,["visible","onOk"]),Object(n["createVNode"])(h,{visible:c.showEditModal,"onUpdate:visible":t[9]||(t[9]=function(e){return c.showEditModal=e}),title:"编辑管理员",width:650,okText:"保存",cancelText:"取消",onOk:l.editAdministrators},{default:Object(n["withCtx"])((function(){return[Object(n["createVNode"])(O,{ref:"editForm",model:c.editData,rules:c.editRules,"label-col":{span:4},"wrapper-col":{span:14}},{default:Object(n["withCtx"])((function(){return[Object(n["createVNode"])(g,{label:"用户名",name:"username",help:"用户名不可更改"},{default:Object(n["withCtx"])((function(){return[Object(n["createVNode"])(b,{value:c.editData.username,"onUpdate:value":t[6]||(t[6]=function(e){return c.editData.username=e}),disabled:""},null,8,["value"])]})),_:1}),Object(n["createVNode"])(g,{label:"昵称",name:"name"},{default:Object(n["withCtx"])((function(){return[Object(n["createVNode"])(b,{value:c.editData.name,"onUpdate:value":t[7]||(t[7]=function(e){return c.editData.name=e}),placeholder:"请输入昵称"},null,8,["value"])]})),_:1}),Object(n["createVNode"])(g,{label:"邮箱地址",name:"email",help:"用于找回密码"},{default:Object(n["withCtx"])((function(){return[Object(n["createVNode"])(b,{value:c.editData.email,"onUpdate:value":t[8]||(t[8]=function(e){return c.editData.email=e}),placeholder:"请输入邮箱地址"},null,8,["value"])]})),_:1})]})),_:1},8,["model","rules"])]})),_:1},8,["visible","onOk"])],64)}var c=a("1da1"),l=(a("96cf"),{name:"Administrators",data:function(){var e=this;return{spinning:!1,administrators:[],page:1,pagination:{defaultPageSize:20,hideOnSinglePage:!0,showQuickJumper:!0,showTotal:function(e){return"共 ".concat(e," 条")},total:0,onChange:function(t){e.getAdministrators(t),e.page=t}},showAddModal:!1,showEditModal:!1,addData:{id:"",username:"",name:"",email:""},editData:{},addRules:{username:[{required:!0,message:"请输入用户名",trigger:"blur"},{min:6,max:16,message:"用户名长度应在 6~16 之间",trigger:"blur"}],name:[{required:!0,message:"请输入昵称",trigger:"blur"}],email:[{required:!0,message:"请输入邮箱地址",trigger:"blur"},{type:"email",message:"请输入正确的邮箱地址",trigger:"blur"}]},editRules:{name:[{required:!0,message:"请输入昵称",trigger:"blur"}],email:[{required:!0,message:"请输入邮箱地址",trigger:"blur"},{type:"email",message:"请输入正确的邮箱地址",trigger:"blur"}]}}},methods:{getAdministrators:function(e){var t=this;return Object(c["a"])(regeneratorRuntime.mark((function a(){var n;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return t.spinning=!0,a.prev=1,a.next=4,t.$axios({method:t.$api.GET_ADMINISTRATORS.method,url:t.$api.GET_ADMINISTRATORS.url,params:{page:e}});case 4:n=a.sent,t.administrators=n.data.list,t.spinning=!1,a.next=13;break;case 9:a.prev=9,a.t0=a["catch"](1),console.log(a.t0),t.spinning=!1;case 13:case"end":return a.stop()}}),a,null,[[1,9]])})))()},edit:function(e){this.editData=Object.assign({},e),this.showEditModal=!0},addAdministrators:function(){var e=this;return Object(c["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,e.$refs.addForm.validate();case 3:return e.spinning=!0,t.prev=4,t.next=7,e.$axios({method:e.$api.ADD_ADMINISTRATORS.method,url:e.$api.ADD_ADMINISTRATORS.url,data:{administrator:e.addData}});case 7:e.spinning=!1,e.showAddModal=!1,e.getAdministrators(e.page),t.next=17;break;case 12:t.prev=12,t.t0=t["catch"](4),console.log(t.t0),e.spinning=!1,t.t0.msg&&"用户名已存在"===t.t0.msg&&(e.addData.username="");case 17:t.next=22;break;case 19:t.prev=19,t.t1=t["catch"](0),console.log("表单验证失败",t.t1);case 22:case"end":return t.stop()}}),t,null,[[0,19],[4,12]])})))()},editAdministrators:function(){var e=this;return Object(c["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,e.$refs.editForm.validate();case 3:return e.spinning=!0,t.prev=4,t.next=7,e.$axios({method:e.$api.EDIT_ADMINISTRATORS.method,url:e.$api.EDIT_ADMINISTRATORS.url,data:{administrator:e.editData}});case 7:e.spinning=!1,e.showEditModal=!1,e.getAdministrators(e.page),t.next=16;break;case 12:t.prev=12,t.t0=t["catch"](4),console.log(t.t0),e.spinning=!1;case 16:t.next=21;break;case 18:t.prev=18,t.t1=t["catch"](0),console.log("表单验证失败",t.t1);case 21:case"end":return t.stop()}}),t,null,[[0,18],[4,12]])})))()}},mounted:function(){this.getAdministrators(1);var e=this.$encrypt.md5Encrypt(this.$encrypt.md5Encrypt("123456"));console.log(e)}});l.render=d;t["default"]=l}}]);
//# sourceMappingURL=chunk-2d0deaf2.8020e7b9.js.map