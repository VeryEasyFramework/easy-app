var Y=Object.defineProperty;var Z=(i,t,e)=>t in i?Y(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var P=(i,t,e)=>Z(i,typeof t!="symbol"?t+"":t,e);import{_ as ee}from"./ListDetailLayout.vue_vue_type_style_index_0_lang-DxRcJYzj.js";import{h as j,a as g,d as p,o as a,p as d,t as f,_ as N,B as J,b as c,v as K,D as te,x as b,e as L,c as w,w as _,C as k,F as A,z as R,E as ie,l as E,G as q,s as W,H as se,j as ne,A as ae,I as le,J as oe,K as re,f as ce,T as ue}from"./index-CS0ctzBO.js";import{M,_ as S}from"./ButtonIcon.vue_vue_type_script_setup_true_lang-CJazxrdG.js";import{C as Q}from"./CardWidget-CZble4Vm.js";import{_ as de,a as B,l as pe,b as fe,c as ye}from"./EasyInput.vue_vue_type_script_setup_true_lang-DyZPaHgo.js";import{_ as _e}from"./TransitionList.vue_vue_type_style_index_0_lang-DHrpeRMs.js";import{_ as me}from"./DisplayChoices.vue_vue_type_style_index_0_lang-zD-gM-pX.js";import"./Button.vue_vue_type_script_setup_true_lang-BTGI5PMB.js";import"./InputData.vue_vue_type_script_setup_true_lang-D720uB00.js";class ve{constructor(){P(this,"initialized");P(this,"entryType");P(this,"listInfo");P(this,"entryList");P(this,"isListLoading",!1);P(this,"listOptions");P(this,"easyApi");this.easyApi=j,this.initialized=!1,this.entryList=g([]),this.listOptions={offset:0},this.listInfo={totalCount:g(0),itemsLoaded:g(0),itemsPerPage:0,listHeight:g(0),limitStart:0,resetScroll:g(!1),currentPage:1}}async init(t){var e;((e=this.entryType)==null?void 0:e.entryType)==t.entryType&&(this.entryList.value=[],this.listOptions.columns=t.listFields,this.listOptions.orderBy=t.config.orderField||"updatedAt",this.listOptions.order=t.config.orderDirection||"desc",this.entryType=t,this.initialized||(this.initialized=!0))}reset(){this.entryList.value=[],this.listInfo.totalCount.value=0,this.listInfo.itemsLoaded.value=0,this.listInfo.currentPage=1,this.listInfo.limitStart=0}async loadList(){if(!this.isListLoading){this.isListLoading=!0;const{data:t,columns:e,rowCount:s,totalCount:l}=await this.easyApi.getList(this.entryType.entryType,{...this.listOptions,offset:this.listInfo.limitStart,limit:this.listInfo.itemsPerPage});this.entryList.value.push(...t),this.listInfo.totalCount.value=l,this.listInfo.itemsLoaded.value=s,this.isListLoading=!1,this.listInfo.resetScroll.value=!0}}async loadMore(t){if(!(this.listInfo.itemsLoaded.value>=this.listInfo.totalCount.value)&&!this.isListLoading){this.isListLoading=!0;const e=this.entryList.value.length,s=t-e+this.listInfo.itemsPerPage,{data:l,columns:$,rowCount:T,totalCount:m}=await this.easyApi.getList(this.entryType.entryType,{...this.listOptions,offset:e,limit:s});this.entryList.value.push(...l),this.listInfo.totalCount.value=m,this.listInfo.itemsLoaded.value=this.entryList.value.length,this.listInfo.currentPage=Math.floor(this.entryList.value.length/this.listInfo.itemsPerPage),this.isListLoading=!1}}}const he={class:"data-field"},ge=p({__name:"DisplayData",props:{value:{},field:{}},setup(i){const t=i;return(e,s)=>(a(),d("div",he,f(t.value),1))}}),z=N(ge,[["__scopeId","data-v-565ecf45"]]),Le={class:"int-field"},Te=p({__name:"DisplayInt",props:{value:{},field:{}},setup(i){const t=i,e=J(()=>t.value==null?"":t.value);return(s,l)=>(a(),d("div",Le,f(e.value),1))}}),we=p({__name:"DisplayBigInt",props:{value:{},field:{}},setup(i){const t=i;return(e,s)=>(a(),d("div",null,f(t.value),1))}}),$e=p({__name:"DisplayDate",props:{value:{},field:{}},setup(i){const t=i;return(e,s)=>(a(),d("div",null,f(t.value),1))}}),Ie=p({__name:"DisplayBoolean",props:{value:{},field:{}},setup(i){return(t,e)=>(a(),d("div",{class:K(["boolean-field",{true:t.value}])},[c(M,{class:"icon",icon:t.value?"check":"close",size:"0.6"},null,8,["icon"])],2))}}),Fe=p({__name:"DisplayPassword",props:{value:{},field:{}},setup(i){const t=i;return(e,s)=>(a(),d("div",null,f(t.value),1))}}),ke=p({__name:"DisplayMultiChoice",props:{value:{},field:{}},setup(i){const t=i;return(e,s)=>(a(),d("div",null,f(t.value),1))}}),Ce={class:"text-field"},Pe=p({__name:"DisplayText",props:{value:{},field:{}},setup(i){const t=i;return(e,s)=>(a(),d("div",Ce,f(t.value),1))}}),Ee=p({__name:"DisplayEmail",props:{value:{},field:{}},setup(i){const t=i;return(e,s)=>(a(),d("div",null,f(t.value),1))}}),De=p({__name:"DisplayImage",props:{value:{},field:{}},setup(i){const t=i;return(e,s)=>(a(),d("div",null,f(t.value),1))}}),be=p({__name:"DisplayPhone",props:{value:{},field:{}},setup(i){const t=i;return(e,s)=>(a(),d("div",null,f(t.value),1))}}),xe=p({__name:"DisplayConnection",props:{value:{},routePrefix:{},field:{},titleValue:{}},setup(i){const t=te();async function e(){const s=`${i.routePrefix}/${i.value}`;await t.push(s)}return(s,l)=>(a(),d("div",{class:"connection-field",onClick:e},f(s.titleValue||s.value),1))}}),Ve={class:"decimal-field"},ze=p({__name:"DisplayDecimal",props:{value:{},field:{}},setup(i){const t=i,e=J(()=>t.value==null?"":parseFloat(t.value).toFixed(2));return(s,l)=>(a(),d("div",Ve,f(e.value),1))}}),Me={class:"url-field"},Se=["href"],Be=p({__name:"DisplayURL",props:{value:{},field:{}},setup(i){const t=i,e=g();return b(()=>{if(t.value)try{e.value=new URL(t.value)}catch{}}),(s,l)=>{var $,T;return a(),d("div",Me,[L("a",{href:($=e.value)==null?void 0:$.href,target:"_blank"},f((T=e.value)==null?void 0:T.href),9,Se)])}}}),Ne=N(Be,[["__scopeId","data-v-7506a7d2"]]),Ae=p({__name:"DisplayRichText",props:{value:{}},setup(i){return(t,e)=>(a(),d("div",null,f(t.value),1))}}),Re={IDField:z,DataField:z,IntField:Te,BigIntField:we,DateField:$e,BooleanField:Ie,PasswordField:Fe,ChoicesField:me,MultiChoiceField:ke,TextField:Pe,EmailField:Ee,ImageField:De,JSONField:de,PhoneField:be,ConnectionField:xe,TimeStampField:B,DecimalField:ze,URLField:Ne,RichTextField:Ae,ListField:z},Oe={class:"text-small text-primary bold item-label"},Ue={class:"text-small italic text-primary-bright"},qe=p({__name:"EntryListItem",props:{entryType:{},entry:{},active:{type:Boolean},fields:{}},emits:["select"],setup(i,{emit:t}){return(e,s)=>(a(),w(Q,{class:K(["px-3 py-2 full-width entry-list-item position-relative",{active:e.active}]),onClick:s[0]||(s[0]=l=>e.$emit("select",e.entry.id))},{default:_(()=>[c(k,{class:"row gap-1 shrink overflow-visible"},{default:_(()=>[c(k,{class:"col shrink horizontal-align-between"},{default:_(()=>[L("div",Oe,f(e.entry[e.entryType.config.titleField||"id"]),1)]),_:1}),c(k,{class:"col shrink"},{default:_(()=>[(a(!0),d(A,null,R(e.fields,l=>(a(),d("div",{key:l.key},[L("div",Ue,[(a(),w(ie(E(Re)[l.fieldType]),{field:l,format:"date",routePrefix:`/entry/${l.connectionEntryType}`,value:e.entry[l.key],titleValue:l.connectionTitleField?e.entry[l.connectionTitleField]:""},null,8,["field","routePrefix","value","titleValue"]))])]))),128))]),_:1})]),_:1}),c(k,{class:"gap-2 pe-2 pt-1 dates col shrink position-absolute top right"},{default:_(()=>[c(k,{class:"col shrink text-tiny italic overflow-visible"},{default:_(()=>[c(M,{icon:"add",size:"0.6"}),c(B,{value:e.entry.createdAt,format:"compact"},null,8,["value"])]),_:1}),c(k,{class:"col shrink text-tiny italic overflow-visible"},{default:_(()=>[c(M,{icon:"update",size:"0.6"}),c(B,{value:e.entry.updatedAt,format:"compact"},null,8,["value"])]),_:1})]),_:1})]),_:1},8,["class"]))}}),He={class:"position-relative input"},Ge=p({__name:"EntrySearchInput",props:{entryType:{}},emits:["search"],setup(i,{emit:t}){const e=i;let s=[];const l=["DataField","EmailField","TextField","IntField","PhoneField"];b(()=>{if(!e.entryType)throw new Error("Entry SearchInput requires an entry type prop");s=e.entryType.fields.filter(m=>l.includes(m.fieldType))});const $=t;function T(m){const h=m.target.value,C={};s.forEach(o=>{const I=o.fieldType;let v="contains";if(I==="IntField"){const F=parseInt(h);if(isNaN(F))return;v="=",C[o.key]={op:v,value:F};return}C[o.key]={op:v,value:h}}),$("search",C)}return(m,h)=>(a(),d("div",He,[L("input",{type:"search",placeholder:"Type to search...",onInput:T},null,32)]))}}),je={class:"title-3"},Je=p({__name:"NewEntryForm",props:{entryType:{}},emits:["close"],setup(i,{emit:t}){function e(){C("close")}async function s(){if(!$())return;await j.createEntry(T.entryType.entryType,m.value)&&e()}let l=[];function $(){let o=!0;return h.value={},l.forEach(I=>{m.value[I.key]||(h.value[I.key]="This field is required.",o=!1)}),o}const T=i,m=g({}),h=g({}),C=t;return pe(o=>{o.key==="Escape"&&e(),o.key==="Enter"&&s()}),b(()=>{l=T.entryType.fields.filter(o=>o.required),l.forEach(o=>{o.defaultValue&&(m.value[o.key]=o.defaultValue)})}),(o,I)=>(a(),w(W,{class:"row-gap-4"},{default:_(()=>[L("div",je," New "+f(o.entryType.config.label),1),L("form",{onSubmit:I[0]||(I[0]=q(()=>{},["prevent"]))},[c(k,{class:"col-2 row-gap-4 column-gap-3"},{default:_(()=>[(a(!0),d(A,null,R(o.entryType.fields.filter(v=>v.required),(v,F)=>(a(),w(fe,{focus:F==0,field:v,editable:"",error:h.value[v.key],modelValue:m.value[v.key],"onUpdate:modelValue":V=>m.value[v.key]=V,key:v.key},null,8,["focus","field","error","modelValue","onUpdate:modelValue"]))),128))]),_:1})],32),c(k,{class:"col shrink horizontal-align-center"},{default:_(()=>[c(S,{onClick:e,icon:"close",color:"error",size:"1"}),c(S,{type:"submit",onClick:q(s,["prevent"]),icon:"check",color:"success",size:"1"})]),_:1})]),_:1}))}}),Ke={class:"title-3"},We={class:"label text-end"},Qe={class:"grid standard-grid-no-padding list-wrapper"},H=3,G=50,Xe=p({__name:"EntryList",props:{entryType:{}},emits:["select"],setup(i,{emit:t}){se(n=>({"6277301e":V,"5e535e20":I,"655bccc1":v.value}));const e=new ve,s=i,l=g();function $(){h.value=!0}function T(){h.value=!1}function m(n){e.listOptions.orFilter=n,e.loadList()}const h=g(!1);let C=[];ne(async()=>{const n=ae.get(s.entryType);if(!n)return;l.value=n,e.entryType=n;const r=n.fields.filter(u=>u.connectionTitleField).map(u=>u.connectionTitleField);C=n.fields.filter(u=>!n.listFields.includes(u.key)||["id","createdAt","updatedAt",n.config.titleField].includes(u.key)?!1:!r.includes(u.key))}),le(s.entryType,async(n,r)=>{switch(n){case"create":await x();break;case"update":let u=!1;e.entryList.value.forEach((y,D)=>{y.id===r.id&&(u=!0,e.entryList.value[D]=r)}),u||await x();break;case"delete":e.entryList.value=e.entryList.value.filter(y=>y.id!==r.id);break}});const o=oe("infinite"),I=`${H}px`,v=g("0"),F=G+H,V=`${G}px`;b(async()=>{var r;await e.init(l.value);const n=(r=o.value)==null?void 0:r.parentElement;n&&await U(n),window.addEventListener("resize",x),n==null||n.addEventListener("scroll",O)}),re(()=>{var r;const n=(r=o.value)==null?void 0:r.parentElement;n==null||n.removeEventListener("scroll",O),window.removeEventListener("resize",x)});async function O(n){const u=n.currentTarget.scrollTop,y=Math.floor(u/F+e.listInfo.itemsPerPage);y+3>e.listInfo.itemsLoaded.value&&(await e.loadMore(y),setTimeout(X,500))}async function X(){var u,y;const n=(y=(u=o.value)==null?void 0:u.parentElement)==null?void 0:y.scrollTop;let r=Math.floor(n/F+e.listInfo.itemsPerPage);r>e.listInfo.totalCount.value&&(r=e.listInfo.totalCount.value),r>e.listInfo.itemsLoaded.value&&await e.loadMore(r)}async function x(){var n;await U((n=o.value)==null?void 0:n.parentElement)}async function U(n){const r=n.getBoundingClientRect(),u=Math.floor(r.height/F);e.listInfo.itemsPerPage=u*2,n.scrollTop=0,e.reset(),await e.loadList(),v.value=`${e.listInfo.totalCount.value*F}px`}return(n,r)=>(a(),w(W,{class:"entry-list-wrapper"},{default:_(()=>{var u;return[L("div",Ke,f((u=l.value)==null?void 0:u.config.label),1),c(Q,null,{default:_(()=>[c(k,{class:"list-header col horizontal-align-between"},{default:_(()=>{var y,D;return[E(e).initialized?(a(),w(Ge,{key:0,entryType:l.value,onSearch:m},null,8,["entryType"])):ce("",!0),L("div",null,[c(S,{label:`New ${(D=(y=l.value)==null?void 0:y.config)==null?void 0:D.label}`,onClick:$,icon:"add",size:"1"},null,8,["label"])])]}),_:1})]),_:1}),L("div",We," Loaded "+f(E(e).listInfo.itemsLoaded)+" of "+f(E(e).listInfo.totalCount)+" records ",1),L("div",Qe,[L("div",{ref_key:"infinite",ref:o,class:"grid standard-grid-no-padding list-container row infinite overflow-hidden"},[c(_e,{fade:""},{default:_(()=>[(a(!0),d(A,null,R(E(e).entryList.value,y=>(a(),w(qe,{active:n.$route.params.id==y.id,key:y.id,"entry-type":l.value,fields:E(C),entry:y,onSelect:r[0]||(r[0]=D=>n.$emit("select",D))},null,8,["active","entry-type","fields","entry"]))),128))]),_:1})],512)]),c(ye,{modelValue:h.value,"onUpdate:modelValue":r[1]||(r[1]=y=>h.value=y)},{default:_(()=>[c(Je,{"entry-type":E(e).entryType,onClose:T},null,8,["entry-type"])]),_:1},8,["modelValue"])]}),_:1}))}}),Ye=p({__name:"EntryListView",props:{entryType:{},id:{}},setup(i){return b(()=>{}),(t,e)=>(a(),w(ee,{maxWidth:"300px"},{list:_(()=>[(a(),w(Xe,{"entry-type":t.entryType,onSelect:e[0]||(e[0]=s=>t.$router.push(`/entry/${t.entryType}/${s}`)),key:t.entryType},null,8,["entry-type"]))]),detail:_(()=>[(a(),w(ue,{key:t.$route.params.id||"1"}))]),_:1}))}}),ct=N(Ye,[["__scopeId","data-v-13d66640"]]);export{ct as default};
