import{M as h,e as B,a as k,T as z}from"./main-CpZoqYpB.js";import{q as D,R as g,a as _,o as u,c as f,w as r,C as y,b as c,g as E,j as $,i as p,t as L,Q as b,l as F,F as m,A as w,S as V,O as I,P as S,_ as T}from"./logo-C62CV3B5.js";import{C as M}from"./CardWidget-BFzG0_qg.js";import{a as O}from"./InputData.vue_vue_type_script_setup_true_lang-sdGTyYUO.js";const N=(s,e)=>{s.key==="Enter"&&(s.preventDefault(),e())},R=(s,e)=>{D(()=>{document.addEventListener("keydown",s),console.log({el:e})}),g(()=>{document.removeEventListener("keydown",s)})},A=_({__name:"ListDetailLayout",setup(s){return(e,i)=>(u(),f(y,{class:"list-detail"},{default:r(()=>[c(y,null,{default:r(()=>[E(e.$slots,"list",{},()=>[$("List")])]),_:3}),c(y,null,{default:r(()=>[E(e.$slots,"detail",{},()=>[$("Detail")])]),_:3})]),_:3}))}}),P={class:"text-small text-primary bold item-label"},j=_({__name:"EntityListItem",props:{entityDef:{},record:{},active:{type:Boolean}},emits:["select"],setup(s,{emit:e}){return(i,l)=>(u(),f(M,{class:b(["full-width entity-list-item",{active:i.active}]),onClick:l[0]||(l[0]=a=>i.$emit("select",i.record.id))},{default:r(()=>[p("div",P,L(i.record[i.entityDef.titleField||"id"]),1)]),_:1},8,["class"]))}}),q=["type"],K=_({__name:"ButtonIcon",props:{type:{},disabled:{type:Boolean},icon:{},size:{},color:{}},setup(s){return(e,i)=>(u(),F("button",{class:b(["button icon",{[e.color??"primary"]:e.color}]),type:e.type||"button"},[c(h,{icon:e.icon,size:e.size??1.4},null,8,["icon","size"])],10,q))}}),Q=_({__name:"EntityList",props:{entity:{},activeEntity:{}},emits:["select"],setup(s,{emit:e}){const i=s,l=m([]),a={entityDef:{},loading:m(!0),totalCount:m(0),currentCount:m(0),listOptions:w({filter:{},orderBy:"",order:"asc",limit:50,offset:0})};async function v(){const t=await k.getList(i.entity,a.listOptions);l.value=t.data,a.totalCount.value=t.totalCount,a.currentCount.value=t.rowCount}return V(async()=>{const t=B.entities.find(o=>o.entityId===i.entity);t&&(a.entityDef=t,await v())}),(t,o)=>(u(),f(y,{class:"entity-list-wrapper"},{default:r(()=>[c(y,{class:"list-header col align-items-center"},{default:r(()=>[p("div",null,[c(O,{label:"search"})]),p("div",null,[c(K,{icon:"add",size:"1"})]),p("div",null,[p("span",null,L(a.currentCount)+" of "+L(a.totalCount),1)])]),_:1}),c(y,{class:"list-container"},{default:r(()=>[(u(!0),F(S,null,I(l.value,d=>(u(),f(j,{active:t.activeEntity==d.id,key:d.id,entityDef:a.entityDef,record:d,onSelect:o[0]||(o[0]=n=>t.$emit("select",n))},null,8,["active","entityDef","record"]))),128))]),_:1})]),_:1}))}}),U=_({__name:"EntityListView",props:{entity:{},id:{}},setup(s){const e=s,i=m([]),l=w({filter:{},orderBy:"",order:"asc",limit:50,offset:0}),a=w({data:[],rowCount:0,columns:[]});async function v(){const t=await k.getList(e.entity,{filter:l.filter,orderBy:l.orderBy,order:l.order,limit:100,offset:0});i.value=t.data,a.rowCount=t.rowCount,a.columns=t.columns}return R(t=>{N(t,async()=>{await v()})}),D(async()=>{i.value=[],await v()}),g(()=>{i.value=[]}),V(()=>{console.log("EntityListView mounted");const t=B.entities.find(o=>o.entityId===e.entity);if(t&&t){t.label,t.fields;const o=t.fields.filter(n=>n.connectionTitleField).map(n=>n.connectionTitleField);t.fields.filter(n=>n.inList&&o.includes(n.key)).reduce((n,C)=>(n[C.key]=C,n),{}),t.fields.filter(n=>n.inList&&!o.includes(n.key))}}),(t,o)=>(u(),f(A,null,{list:r(()=>[c(Q,{entity:t.entity,activeEntity:t.id,onSelect:o[0]||(o[0]=d=>t.$router.push(`/entity/${t.entity}/${d}`))},null,8,["entity","activeEntity"])]),detail:r(()=>[(u(),f(z,{key:e.entity}))]),_:1}))}}),X=T(U,[["__scopeId","data-v-136863f7"]]);export{X as default};
