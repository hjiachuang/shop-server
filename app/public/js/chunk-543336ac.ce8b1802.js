(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-543336ac"],{2251:function(e,t,a){},d3f1:function(e,t,a){"use strict";a("2251")},e8f2:function(e,t,a){"use strict";a.r(t);var n=a("7a23"),r=Object(n["withScopeId"])("data-v-276b9f6d");Object(n["pushScopeId"])("data-v-276b9f6d");var o={class:"user-index"},c=Object(n["createTextVNode"])("查询"),i=Object(n["createTextVNode"])("重置"),d=Object(n["createTextVNode"])("查看");Object(n["popScopeId"])();var l=r((function(e,t,a,l,u,f){var b=Object(n["resolveComponent"])("a-input"),s=Object(n["resolveComponent"])("a-form-item"),m=Object(n["resolveComponent"])("a-button"),p=Object(n["resolveComponent"])("a-form"),g=Object(n["resolveComponent"])("a-table-column"),O=Object(n["resolveComponent"])("a-image"),j=Object(n["resolveComponent"])("a-table");return Object(n["openBlock"])(),Object(n["createBlock"])("div",o,[Object(n["createVNode"])(p,{layout:"inline",model:u.formState},{default:r((function(){return[Object(n["createVNode"])(s,{label:"用户昵称"},{default:r((function(){return[Object(n["createVNode"])(b,{value:u.formState.nickname,"onUpdate:value":t[1]||(t[1]=function(e){return u.formState.nickname=e}),placeholder:"请输入用户昵称"},null,8,["value"])]})),_:1}),Object(n["createVNode"])(s,null,{default:r((function(){return[Object(n["createVNode"])(m,{type:"primary",onClick:t[2]||(t[2]=function(){return f.getUser(1,20,u.formState.nickname)})},{default:r((function(){return[c]})),_:1})]})),_:1}),Object(n["createVNode"])(s,null,{default:r((function(){return[Object(n["createVNode"])(m,{type:"primary",onClick:t[3]||(t[3]=function(){u.formState.nickname="",f.getUser()})},{default:r((function(){return[i]})),_:1})]})),_:1})]})),_:1},8,["model"]),Object(n["createVNode"])(j,{"data-source":u.tableData,pagination:u.tablePagination,rowKey:function(e){return e.id},style:{"margin-top":"10px"},loading:u.tableLoading},{default:r((function(){return[Object(n["createVNode"])(g,{key:"id",title:"ID","data-index":"id",width:80}),Object(n["createVNode"])(g,{key:"avatar",title:"头像","data-index":"avatar",width:60},{default:r((function(e){var t=e.text;return[Object(n["createVNode"])(O,{src:t,fallback:"/images/fallback.png",preview:!1,alt:"头像",width:60,height:60},null,8,["src"])]})),_:1}),Object(n["createVNode"])(g,{key:"nickname",title:"昵称","data-index":"nickname"}),Object(n["createVNode"])(g,{key:"gender",title:"性别","data-index":"gender"},{default:r((function(e){var t=e.text;return[Object(n["createTextVNode"])(Object(n["toDisplayString"])(2===t?"女":"男"),1)]})),_:1}),Object(n["createVNode"])(g,{key:"register_time",title:"注册时间","data-index":"register_time"}),Object(n["createVNode"])(g,{key:"action",title:"最近登录","data-index":"last_login_time"}),Object(n["createVNode"])(g,{key:"action",title:"登录IP","data-index":"last_login_ip"}),Object(n["createVNode"])(g,{key:"action",title:"操作"},{default:r((function(t){var a=t.record;return[Object(n["createVNode"])(m,{type:"primary",onClick:function(t){return e.$router.push("/user/info?id=".concat(a.id))}},{default:r((function(){return[d]})),_:2},1032,["onClick"])]})),_:1})]})),_:1},8,["data-source","pagination","rowKey","loading"])])})),u=a("1da1"),f=(a("96cf"),{name:"UserIndex",data:function(){var e=this;return{spinning:!1,tableLoading:!1,formState:{nickname:""},tablePagination:{defaultPageSize:20,hideOnSinglePage:!0,showQuickJumper:!0,showTotal:function(e){return"共 ".concat(e," 条")},total:0,onChange:function(t){return e.getUser(t,20,e.formState.nickname)}},tableData:[],editableData:[]}},methods:{getUser:function(){var e=arguments,t=this;return Object(u["a"])(regeneratorRuntime.mark((function a(){var n,r,o,c;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return n=e.length>0&&void 0!==e[0]?e[0]:1,r=e.length>1&&void 0!==e[1]?e[1]:20,o=e.length>2&&void 0!==e[2]?e[2]:"",t.tableLoading=!0,a.next=6,t.$axios({method:t.$api.GET_ALL_USER.method,url:t.$api.GET_ALL_USER.url,params:{page:n,size:r,nickname:o}});case 6:c=a.sent,t.tableData=c.data.userlist,t.tablePagination.total=c.data.total,t.tableLoading=!1;case 10:case"end":return a.stop()}}),a)})))()}},mounted:function(){this.getUser()}});a("d3f1");f.render=l,f.__scopeId="data-v-276b9f6d";t["default"]=f}}]);
//# sourceMappingURL=chunk-543336ac.ce8b1802.js.map