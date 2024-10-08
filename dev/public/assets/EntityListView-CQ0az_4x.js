var K=Object.defineProperty;var J=(c,i,t)=>i in c?K(c,i,{enumerable:!0,configurable:!0,writable:!0,value:t}):c[i]=t;var E=(c,i,t)=>J(c,typeof i!="symbol"?i+"":i,t);import{_ as Q}from"./ListDetailLayout.vue_vue_type_style_index_0_lang-CNrDxCF5.js";import{d as $,o as f,c as _,w as d,b as o,C as I,e as h,t as F,p as T,F as V,z as M,B as X,l as w,v as Y,a as v,x as B,D as O,s as R,h as U,m as Z,E as tt,G as et,j as it,A as st,H as nt,I as at,T as lt,_ as ot}from"./index-CQnUWCV4.js";import{C as W}from"./CardWidget-BgBev2dT.js";import{d as rt,_ as x,a as dt}from"./EasyInput.vue_vue_type_script_setup_true_lang-DE1NCTWD.js";import{M as H,_ as S}from"./ButtonIcon.vue_vue_type_script_setup_true_lang-CsaDcWkB.js";import{l as ct,_ as ut}from"./index-Hw269v-C.js";import{l as ft}from"./index-Bc1H_-TJ.js";import"./Button.vue_vue_type_script_setup_true_lang-1s5_nbt9.js";import"./InputData.vue_vue_type_script_setup_true_lang-DzXQy-iL.js";const yt={class:"text-small text-primary bold item-label"},pt={class:"text-small italic text-primary-bright"},mt=$({__name:"EntityListItem",props:{entityDef:{},record:{},active:{type:Boolean},fields:{}},emits:["select"],setup(c,{emit:i}){return(t,r)=>(f(),_(W,{class:Y(["full-width entity-list-item position-relative",{active:t.active}]),onClick:r[0]||(r[0]=s=>t.$emit("select",t.record.id))},{default:d(()=>[o(I,{class:"row shrink"},{default:d(()=>[o(I,{class:"col shrink horizontal-align-between"},{default:d(()=>[h("div",yt,F(t.record[t.entityDef.config.titleField||"id"]),1)]),_:1}),o(I,{class:"col shrink"},{default:d(()=>[(f(!0),T(V,null,M(t.fields,s=>(f(),T("div",{key:s.key},[h("div",pt,[(f(),_(X(w(rt)[s.fieldType]),{field:s,format:"date",routePrefix:`/entity/${s.connectionEntity}`,value:t.record[s.key],titleValue:s.connectionTitleField?t.record[s.connectionTitleField]:""},null,8,["field","routePrefix","value","titleValue"]))])]))),128))]),_:1})]),_:1}),o(I,{class:"gap-2 pe-2 pt-1 dates col shrink position-absolute top right"},{default:d(()=>[o(I,{class:"col shrink text-tiny italic overflow-visible"},{default:d(()=>[o(H,{icon:"add",size:"0.6"}),o(x,{value:t.record.createdAt,format:"compact"},null,8,["value"])]),_:1}),o(I,{class:"col shrink text-tiny italic overflow-visible"},{default:d(()=>[o(H,{icon:"update",size:"0.6"}),o(x,{value:t.record.updatedAt,format:"compact"},null,8,["value"])]),_:1})]),_:1})]),_:1},8,["class"]))}}),ht={class:"title-3"},vt=$({__name:"NewEntityForm",props:{entityDef:{}},emits:["close"],setup(c,{emit:i}){function t(){k("close")}async function r(){if(!P())return;await U.createEntity(C.entityDef.entityId,y.value)&&t()}let s=[];function P(){let n=!0;return m.value={},s.forEach(L=>{y.value[L.key]||(m.value[L.key]="This field is required.",n=!1)}),n}const C=c,y=v({}),m=v({}),k=i;return ct(n=>{n.key==="Escape"&&t(),n.key==="Enter"&&r()}),B(()=>{s=C.entityDef.fields.filter(n=>n.required),s.forEach(n=>{n.defaultValue&&(y.value[n.key]=n.defaultValue)})}),(n,L)=>(f(),_(R,{class:"row-gap-4"},{default:d(()=>[h("div",ht," New "+F(n.entityDef.config.label),1),h("form",{onSubmit:L[0]||(L[0]=O(()=>{},["prevent"]))},[o(I,{class:"col-2 row-gap-4 column-gap-3"},{default:d(()=>[(f(!0),T(V,null,M(n.entityDef.fields.filter(p=>p.required),(p,g)=>(f(),_(dt,{focus:g==0,field:p,error:m.value[p.key],modelValue:y.value[p.key],"onUpdate:modelValue":z=>y.value[p.key]=z,key:p.key},null,8,["focus","field","error","modelValue","onUpdate:modelValue"]))),128))]),_:1})],32),o(I,{class:"col shrink horizontal-align-center"},{default:d(()=>[o(S,{onClick:t,icon:"close",color:"error",size:"1"}),o(S,{type:"submit",onClick:O(r,["prevent"]),icon:"check",color:"success",size:"1"})]),_:1})]),_:1}))}});class _t{constructor(){E(this,"initialized");E(this,"entity");E(this,"listInfo");E(this,"entityList");E(this,"isListLoading",!1);E(this,"listOptions");E(this,"easyApi");this.easyApi=U,this.initialized=!1,this.entityList=v([]),this.listOptions={offset:0},this.listInfo={totalCount:v(0),itemsLoaded:v(0),itemsPerPage:0,listHeight:v(0),limitStart:0,resetScroll:v(!1),currentPage:1}}async init(i){var t;((t=this.entity)==null?void 0:t.entityId)==i.entityId&&(this.entityList.value=[],this.listOptions.columns=i.listFields,this.listOptions.orderBy=i.config.orderField||"updatedAt",this.listOptions.order=i.config.orderDirection||"desc",this.entity=i,this.initialized||(this.initialized=!0))}reset(){this.entityList.value=[],this.listInfo.totalCount.value=0,this.listInfo.itemsLoaded.value=0,this.listInfo.currentPage=1,this.listInfo.limitStart=0}async loadList(){if(!this.isListLoading){this.isListLoading=!0;const{data:i,columns:t,rowCount:r,totalCount:s}=await this.easyApi.getList(this.entity.entityId,{...this.listOptions,offset:this.listInfo.limitStart,limit:this.listInfo.itemsPerPage});this.entityList.value.push(...i),this.listInfo.totalCount.value=s,this.listInfo.itemsLoaded.value=r,this.isListLoading=!1,this.listInfo.resetScroll.value=!0}}async loadMore(i){if(!(this.listInfo.itemsLoaded.value>=this.listInfo.totalCount.value)&&!this.isListLoading){this.isListLoading=!0;const t=this.entityList.value.length,r=i-t+this.listInfo.itemsPerPage,{data:s,columns:P,rowCount:C,totalCount:y}=await this.easyApi.getList(this.entity.entityId,{...this.listOptions,offset:t,limit:r});this.entityList.value.push(...s),this.listInfo.totalCount.value=y,this.listInfo.itemsLoaded.value=this.entityList.value.length,this.listInfo.currentPage=Math.floor(this.entityList.value.length/this.listInfo.itemsPerPage),this.isListLoading=!1}}}const Lt=$({__name:"TransitionList",props:{fade:{type:Boolean}},setup(c){return(i,t)=>(f(),_(tt,{name:i.fade?"list-fade":"list"},{default:d(()=>[Z(i.$slots,"default")]),_:3},8,["name"]))}}),gt={class:"position-relative input"},wt=$({__name:"EntitySearchInput",props:{entity:{}},emits:["search"],setup(c,{emit:i}){const t=c;let r=[];const s=["DataField","EmailField","TextField","IntField","PhoneField"];B(()=>{if(!t.entity)throw new Error("EntitySearchInput requires an entity prop");r=t.entity.fields.filter(y=>s.includes(y.fieldType))});const P=i;function C(y){const m=y.target.value,k={};r.forEach(n=>{const L=n.fieldType;let p="contains";if(L==="IntField"){const g=parseInt(m);if(isNaN(g))return;p="=",k[n.key]={op:p,value:g};return}k[n.key]={op:p,value:m}}),P("search",k)}return(y,m)=>(f(),T("div",gt,[h("input",{type:"search",placeholder:"Type to search...",onInput:C},null,32)]))}}),It={class:"title-3"},kt={class:"label text-end"},Et={class:"grid standard-grid-no-padding list-wrapper"},q=3,G=60,Ct=$({__name:"EntityList",props:{entity:{},activeEntity:{}},emits:["select"],setup(c,{emit:i}){et(e=>({"2d62dc11":z,c5fe08da:L,a1d04d18:p.value}));const t=new _t,r=c;let s=v();function P(){m.value=!0}function C(){m.value=!1}function y(e){t.listOptions.orFilter=e,t.loadList()}const m=v(!1);let k=[];it(async()=>{const e=st.entities.find(l=>l.entityId===r.entity);if(!e)return;s.value=e,t.entity=e;const a=e.fields.filter(l=>l.connectionTitleField).map(l=>l.connectionTitleField);k=e.fields.filter(l=>!e.listFields.includes(l.key)||["id","createdAt","updatedAt",e.config.titleField].includes(l.key)?!1:!a.includes(l.key))}),ft(r.entity,async(e,a)=>{switch(e){case"create":await b();break;case"update":let l=!1;t.entityList.value.forEach((u,D)=>{u.id===a.id&&(l=!0,t.entityList.value[D]=a)}),l||await b();break;case"delete":t.entityList.value=t.entityList.value.filter(u=>u.id!==a.id);break}});const n=nt("infinite"),L=`${q}px`,p=v("0"),g=G+q,z=`${G}px`;B(async()=>{var a;await t.init(s.value);const e=(a=n.value)==null?void 0:a.parentElement;e&&await N(e),window.addEventListener("resize",b),e==null||e.addEventListener("scroll",A)}),at(()=>{var a;const e=(a=n.value)==null?void 0:a.parentElement;e==null||e.removeEventListener("scroll",A),window.removeEventListener("resize",b)});async function A(e){const l=e.currentTarget.scrollTop,u=Math.floor(l/g+t.listInfo.itemsPerPage);u+3>t.listInfo.itemsLoaded.value&&(await t.loadMore(u),setTimeout(j,500))}async function j(){var l,u;const e=(u=(l=n.value)==null?void 0:l.parentElement)==null?void 0:u.scrollTop;let a=Math.floor(e/g+t.listInfo.itemsPerPage);a>t.listInfo.totalCount.value&&(a=t.listInfo.totalCount.value),a>t.listInfo.itemsLoaded.value&&await t.loadMore(a)}async function b(){var e;await N((e=n.value)==null?void 0:e.parentElement)}async function N(e){const a=e.getBoundingClientRect(),l=Math.floor(a.height/g);t.listInfo.itemsPerPage=l*2,e.scrollTop=0,t.reset(),await t.loadList(),p.value=`${t.listInfo.totalCount.value*g}px`}return(e,a)=>(f(),_(R,{class:"entity-list-wrapper"},{default:d(()=>{var l;return[h("div",It,F((l=w(s))==null?void 0:l.config.label),1),o(W,null,{default:d(()=>[o(I,{class:"list-header col horizontal-align-between"},{default:d(()=>[o(wt,{entity:w(s),onSearch:y},null,8,["entity"]),h("div",null,[o(S,{label:`New ${e.entity}`,onClick:P,icon:"add",size:"1"},null,8,["label"])])]),_:1})]),_:1}),h("div",kt," Loaded "+F(w(t).listInfo.itemsLoaded)+" of "+F(w(t).listInfo.totalCount)+" records ",1),h("div",Et,[h("div",{ref_key:"infinite",ref:n,class:"grid standard-grid-no-padding list-container row infinite overflow-hidden"},[o(Lt,{fade:""},{default:d(()=>[(f(!0),T(V,null,M(w(t).entityList.value,u=>(f(),_(mt,{active:e.activeEntity==u.id,key:u.id,entityDef:w(s),fields:w(k),record:u,onSelect:a[0]||(a[0]=D=>e.$emit("select",D))},null,8,["active","entityDef","fields","record"]))),128))]),_:1})],512)]),o(ut,{modelValue:m.value,"onUpdate:modelValue":a[1]||(a[1]=u=>m.value=u)},{default:d(()=>[o(vt,{entityDef:w(t).entity,onClose:C},null,8,["entityDef"])]),_:1},8,["modelValue"])]}),_:1}))}}),Pt=$({__name:"EntityListView",props:{entity:{},id:{}},setup(c){const i=c;return(t,r)=>(f(),_(Q,{maxWidth:"300px"},{list:d(()=>[(f(),_(Ct,{entity:t.entity,activeEntity:t.id,onSelect:r[0]||(r[0]=s=>t.$router.push(`/entity/${t.entity}/${s}`)),key:t.entity},null,8,["entity","activeEntity"]))]),detail:d(()=>[(f(),_(lt,{key:i.id}))]),_:1}))}}),At=ot(Pt,[["__scopeId","data-v-12e89caf"]]);export{At as default};