import{d as k,a as c,B as y,j as h,h as g,N as w,o as p,c as m,w as l,C as o,f as T,b as a,e as S,t as B,p as C,z as b,F as j,M as N}from"./index-CS0ctzBO.js";import{R as V,_ as x,a as A}from"./EntryFieldGroup.vue_vue_type_style_index_0_lang-BwTWXxhL.js";import{l as D,o as F}from"./EasyInput.vue_vue_type_script_setup_true_lang-DyZPaHgo.js";import"./ButtonIcon.vue_vue_type_script_setup_true_lang-CJazxrdG.js";import"./CardWidget-CZble4Vm.js";import"./FormBase.vue_vue_type_script_setup_true_lang-D9V7oIsE.js";import"./TransitionList.vue_vue_type_style_index_0_lang-DHrpeRMs.js";import"./Button.vue_vue_type_script_setup_true_lang-BTGI5PMB.js";import"./InputData.vue_vue_type_script_setup_true_lang-D720uB00.js";const G={class:"title-4"},q=k({__name:"SettingsDetailView",props:{settingsType:{}},setup(v){const n=v,s=c({}),i=y(()=>N.get(n.settingsType)),_=y(()=>i.value.fieldGroups.filter(e=>e.fields.length>0)),u=c(!1);h(async()=>{u.value=!1,s.value=await g.call("settings","getSettings",{settingsType:n.settingsType}),u.value=!0}),D(e=>{F(e,async()=>{e.preventDefault(),await g.call("settings","updateSettings",{settingsType:n.settingsType,data:s.value})})}),w(n.settingsType,(e,t)=>{switch(e){case"update":s.value=t;break;case"join":f("join",t);break;case"leave":f("leave",t);break}});const d=c([]);function f(e,t){t.user;const r=t.users;d.value=r}return(e,t)=>u.value?(p(),m(o,{key:0,class:"settings-view"},{default:l(()=>[a(o,{class:"title-area"},{default:l(()=>[S("div",G,B(i.value.config.label),1)]),_:1}),a(o,{class:"row shrink fields-area"},{default:l(()=>[(p(!0),C(j,null,b(_.value,r=>(p(),m(A,{edit:"",group:r,entry:s.value,key:r.key},null,8,["group","entry"]))),128))]),_:1}),a(o,{class:"row shrink actions-area"},{default:l(()=>[a(V,{users:d.value},null,8,["users"]),a(x,{"entry-type":i.value,entry:s.value,type:"settings"},null,8,["entry-type","entry"])]),_:1})]),_:1})):T("",!0)}});export{q as default};