import{d as B,B as O,o as v,p as q,t as j,c as C,w as y,e as V,b as k,C as I,x as M,K as ue,G as oe,m as K,g as de,f as z,Q as pe,a as $,R as Y,S as U,v as J,J as W,F as Q,z as R,j as ce,A as fe,l as x,h as me,_ as ve,s as ae,U as ye}from"./index-BLUmWJ0B.js";import{C as ge}from"./CardWidget-DGg9H3FA.js";import{a as Z,M as ee,_ as le}from"./ButtonIcon.vue_vue_type_script_setup_true_lang-Clz7Z40D.js";import{b as P,a as he,_ as be}from"./Button.vue_vue_type_script_setup_true_lang-Brrfl2U2.js";import{_ as te}from"./InputData.vue_vue_type_script_setup_true_lang-DcFuWUzI.js";function Cl(n,a,t){if(!n)return"";let i="";t==="camelCase"&&(n=we(n));const r=Ve(n);return a==="titleCase"&&(i=n.split(r).map(o=>`${o.charAt(0).toUpperCase()}${o.slice(1)}`).join(" ")),a==="pascal"&&(i=n.toLowerCase().replace(r,"-")),a==="initials"&&(i=n.split(r).map(o=>o[0]).join("").toUpperCase()),a==="snakeCase"&&(i=n.toLowerCase().replace(r,"_")),i}function we(n){return n.replace(/([A-Z])/g,a=>`_${a.toLowerCase()}`)}function Ve(n){const a=[" ","-","_"];let t=" ";return a.forEach(i=>{if(n.includes(i))return t=i,i}),t}function H(n,a){return n.toString().padStart(2,"0")}function $e(n,a){const t=a||new Date;return n.getDate()==t.getDate()&&n.getMonth()==t.getMonth()&&n.getFullYear()==t.getFullYear()}function ke(n,a){const t=a||new Date;return t.setDate(t.getDate()-1),n.getDate()==t.getDate()&&n.getMonth()==t.getMonth()&&n.getFullYear()==t.getFullYear()}function _e(n,a){const t=new Date(n);if(t.setMinutes(t.getMinutes()-t.getTimezoneOffset()),isNaN(t.getTime()))return n;const i=l=>{const s=new Date;let b="",m=l.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});if(a!=null&&a.showSeconds&&(m=l.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit",second:"2-digit"})),s.toLocaleDateString()==l.toLocaleDateString())return b="Today at",`${b} ${m}`;if(s.getFullYear()==l.getFullYear()&&l.getMonth().toString()+(l.getDay()+1).toString()==s.getMonth().toString()+s.getDay().toString())return b="Yesterday at",`${b} ${m}`;let g=l.toString().substring(0,15);return a!=null&&a.showSeconds&&(g=l.toString().substring(0,21)),g},r=l=>{const s=H(l.getDate()),b=H(l.getMonth()+1),m=l.getFullYear();return`${s}/${b}/${m}`},o=l=>{const s=new Date,b=s.getFullYear();s.getMonth(),s.getDate();const m=l.getFullYear(),g=l.getMonth(),_=l.getDate();let d=`${H(_)}/${H(g+1)}`;return b!=m&&(d=`${d}/${m}`),$e(l,s)&&(d=l.toLocaleTimeString(void 0,{hour:"numeric",hour12:!1,minute:"numeric"})),ke(l,s)&&(d="Yesterday"),d};switch((a==null?void 0:a.format)||"standard"){case"pretty":return i(t);case"date":return r(t);case"compact":return o(t);case"time":return t.toLocaleTimeString();default:{const l=H(t.getDate()),s=H(t.getMonth()+1),b=t.getFullYear(),m=H(t.getHours()),g=H(t.getMinutes()),_=H(t.getSeconds());return`${l}/${s}/${b} ${m}:${g}${a!=null&&a.showSeconds?`:${_}`:""}`}}}const G=B({__name:"DisplayTimestamp",props:{value:{},format:{},showSeconds:{type:Boolean},field:{}},setup(n){const a=n,t=O(()=>a.value?_e(a.value,{format:a.format||"pretty",showSeconds:a.showSeconds||!1}):"");return(i,r)=>(v(),q("div",null,j(t.value),1))}}),Ce='<span class="json-colon">: </span>';function De(n){let a=n;const t=/"([^"]+)":/g,i=/:\s+(.*$)/g,r=t.exec(a);if(!r)return`<div class="json-row">${ne(a)}</div>`;const o=i.exec(a);if(!r||!o)return a;const e=`<span class="json-key">"${r[1]}"</span>`,l=o[1],s=a.match(/^\s+/);return`<div class="json-row">${s?s[0]:""}${e}${Ce}${ne(l)}</div>`}function ne(n){const a=/"([^"]+)"/g,t=/(\d+)/g,i=/(true|false)/g,r=a.exec(n);if(r){const l=Se(r[1]);return n.replace(a,`<span class="json-string">"${l}"</span>`)}const o=t.exec(n);if(o)return n.replace(t,`<span class="json-number">${o[1]}</span>`);const e=i.exec(n);return e?n.replace(i,`<span class="json-boolean">${e[1]}</span>`):n==="null"?'<span class="json-null">null</span>':n==="undefined"?'<span class="json-undefined">undefined</span>':n}function Se(n){return n.replace(/[&<>"']/g,a=>{switch(a){case"&":return"&amp;";case"<":return"&lt;";case">":return"&gt;";case'"':return"&quot;";default:return""}})}const Be=["innerHTML"],Oe=B({__name:"DisplayJSON",props:{value:{},field:{}},setup(n){const a=n,t=O(()=>a.value?typeof a.value=="string"?`<div class="json-string">${a.value}</div>`:JSON.stringify(a.value,null,2).split(`
`).map(o=>`${De(o)}`).join(""):'<div class="italic">no content</div>');return(i,r)=>(v(),C(I,{class:"json-wrapper"},{default:y(()=>[r[0]||(r[0]=V("div",{class:"gutter"},null,-1)),k(I,{class:"json-content-wrapper position-relative"},{default:y(()=>[V("div",{class:"json-content",innerHTML:t.value},null,8,Be)]),_:1})]),_:1}))}}),qe=n=>n.getModifierState("Control")||n.metaKey,Dl=(n,a)=>{qe(n)&&n.key==="s"&&(n.preventDefault(),a())},Me=(n,a)=>{const t=n;M(()=>{document.addEventListener("keydown",t)}),ue(()=>{document.removeEventListener("keydown",t)})},Sl=B({__name:"ModalView",props:{modelValue:{type:Boolean}},emits:["update:modelValue","close"],setup(n,{emit:a}){function t(){o.value=!1,r("close")}const i=n,r=a,o=O({get:()=>i.modelValue,set:e=>{r("update:modelValue",e)}});return Me(e=>{e.key==="Escape"&&t()}),(e,l)=>(v(),C(pe,{to:"#modals"},[k(Z,null,{default:y(()=>[o.value?(v(),C(I,{key:0,onClick:oe(t,["self"]),class:"modal-wrapper z-max position-fixed top left vh-100 vw-100 horizontal-align-center vertical-align-center"},{default:y(()=>[k(ge,null,{default:y(()=>[K(e.$slots,"default",{},()=>[l[0]||(l[0]=de(" modal "))])]),_:3})]),_:3})):z("",!0)]),_:3})]))}}),Fe=["name","disabled"],Ie=B({__name:"InputBigInt",props:{modelValue:{},label:{},error:{},name:{},required:{type:Boolean},readOnly:{type:Boolean},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:a}){const t=n,i=a,r=$(),o=O({get:()=>t.modelValue,set:e=>{i("update:modelValue",e)}});return M(()=>{var e;t.focus&&((e=r.value)==null||e.focus())}),(e,l)=>(v(),C(P,{label:e.label,error:e.error,required:e.required,"read-only":e.readOnly},{default:y(()=>[Y(V("input",{name:e.name,ref_key:"input",ref:r,type:"number","onUpdate:modelValue":l[0]||(l[0]=s=>o.value=s),disabled:e.readOnly},null,8,Fe),[[U,o.value]])]),_:1},8,["label","error","required","read-only"]))}}),Pe=["checked"],Le=B({__name:"Switch",props:{on:{type:Boolean}},emits:["toggle"],setup(n,{emit:a}){const t=n,i=a,r=O({get:()=>t.on,set:o=>(i("toggle",o),o)});return(o,e)=>(v(),q("div",{class:J(["switch",{on:r.value}]),onClick:e[0]||(e[0]=l=>r.value=!r.value)},[V("input",{type:"checkbox",checked:r.value},null,8,Pe),e[1]||(e[1]=V("span",{class:"slider"},null,-1))],2))}}),Ee={key:0,class:"text-small label"},Te={class:"text-small label"},Ye={key:0,class:"ps-1 text-error"},Ue={key:1,style:{display:"contents"}},je={key:0,class:"error-message bold italic"},Ne={key:1,class:"description italic bold"},He=B({__name:"InputBoolean",props:{modelValue:{type:Boolean},field:{},noLabel:{type:Boolean},error:{},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:a}){const t=n,i=a,r=$();function o(e){i("update:modelValue",e)}return M(()=>{var e;t.focus&&((e=r.value)==null||e.focus())}),(e,l)=>(v(),C(I,{class:"row shrink boolean-input input"},{default:y(()=>[e.noLabel?z("",!0):(v(),q("label",Ee)),k(I,{class:"col shrink px-2 input horizontal-align-between vertical-align-center align-content-center"},{default:y(()=>[V("label",Te,[V("span",null,j(e.field.label),1),e.field.required?(v(),q("span",Ye,"*")):z("",!0)]),k(Le,{color:"primary",on:e.modelValue??!1,onToggle:o},null,8,["on"])]),_:1}),e.noLabel?z("",!0):(v(),q("div",Ue,[e.error?(v(),q("div",je,j(e.error),1)):e.field.description?(v(),q("div",Ne,j(e.field.description),1)):z("",!0)]))]),_:1}))}}),Je={class:"choice"},re=B({__name:"InputDropDown",props:{searchValue:{},label:{},icon:{},edit:{type:Boolean},labelClass:{},emptyLabel:{}},emits:["update:searchValue","open","clear"],setup(n,{emit:a}){const t=$(!1),i=n,r=W("input"),o=O({get:()=>i.searchValue,set:p=>{e("update:searchValue",p)}}),e=a,l=$("0px"),s=$("0px");function b(p){if(i.edit){if(t.value){d();return}_()}}const m=W("popover"),g=W("dropdown");function _(){var p,u;(p=m.value)==null||p.showPopover(),(u=r.value)==null||u.focus(),t.value=!0,e("open",!0)}function d(){var p;(p=m.value)==null||p.hidePopover()}function h(p){var X;const u=(X=g.value)==null?void 0:X.getBoundingClientRect(),w=p||m.value;if(!w)return;const c=window.innerHeight,f=w.getBoundingClientRect(),S=(u==null?void 0:u.height)||0,L=(u==null?void 0:u.width)||0,F=(u==null?void 0:u.top)||0,N=(u==null?void 0:u.left)||0;u!=null&&u.right;const A=(u==null?void 0:u.bottom)||0,E=f.height;f.width;const T=A+E>c?F-E:F+S;l.value=`${T}px`,s.value=`${N}px`,w.style.setProperty("--popover-top",l.value),w.style.setProperty("--popover-left",s.value),w.style.opacity="1",w.style.minWidth=`${L}px`}function D(p){p.target.closest(".select-dropdown[popover]")||d()}return M(()=>{var p;(p=m.value)==null||p.addEventListener("toggle",u=>{const w=u;t.value=w.newState==="open";const c=u.target;w.newState==="open"&&(window.addEventListener("wheel",D),h(c)),w.newState==="closed"&&(window.removeEventListener("wheel",D),c.style.opacity="0"),e("open",w.newState==="open")}),d()}),(p,u)=>(v(),q("div",{ref_key:"dropdown",ref:g,class:J(["dropdown-container",{disabled:!p.edit}])},[V("div",{onClick:b},[K(p.$slots,"label",{},()=>[k(I,{class:J(["selected-choice col shrink",{empty:!p.label,disabled:!p.edit,[p.labelClass??""]:p.labelClass}])},{default:y(()=>[p.icon?(v(),C(ee,{key:0,icon:p.icon||"person"},null,8,["icon"])):z("",!0),V("div",Je,j(p.label||`Choose ${p.emptyLabel}`),1),k(ee,{class:J(["arrow",{active:t.value,disabled:!p.edit}]),icon:"chevron_right"},null,8,["class"])]),_:1},8,["class"])])]),V("div",{ref_key:"popover",ref:m,class:"select-dropdown py-2",popover:"auto"},[k(I,{class:"row shrink dropdown pt-2"},{default:y(()=>[k(I,{class:"row shrink px-2 input"},{default:y(()=>[K(p.$slots,"input",{},()=>[Y(V("input",{ref_key:"input",ref:r,"onUpdate:modelValue":u[0]||(u[0]=w=>o.value=w),placeholder:"Search..."},null,512),[[U,o.value]])])]),_:3}),k(I,{class:"row shrink gap-0 w-100 px-3 stufff"},{default:y(()=>[K(p.$slots,"content",{hide:d})]),_:3}),k(I,{class:"footer px-2 py-2"},{default:y(()=>[K(p.$slots,"footer",{},()=>[V("div",{class:"text-small btn cursor-pointer horizontal-align-self-end",onClick:u[1]||(u[1]=w=>p.$emit("clear",d))},"Clear ")])]),_:3})]),_:3})],512)],2))}}),ze=["onClick"],Ae=B({__name:"InputChoices",props:{modelValue:{},field:{},edit:{type:Boolean},error:{},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:a}){const t=n,i=$(!1),r=O({get:()=>{var g;return(g=t.field.choices)==null?void 0:g.find(_=>_.key===t.modelValue)},set:g=>{m("update:modelValue",g.key)}}),o=$("");function e(g){r.value={key:"",label:""},g()}function l(g){i.value=g}function s(g,_){r.value=g,_(),m("update:modelValue",g.key)}const b=O(()=>{var g;return o.value?(g=t.field.choices)==null?void 0:g.filter(_=>{if(_.label.toLowerCase().includes(o.value.toLowerCase()))return _}):t.field.choices}),m=a;return(g,_)=>(v(),C(P,{label:g.field.label,error:g.error,required:g.field.required,class:"input-choices","read-only":!g.edit||g.field.readOnly},{default:y(()=>{var d,h;return[k(re,{onOpen:l,"search-value":o.value,"onUpdate:searchValue":_[0]||(_[0]=D=>o.value=D),onClear:e,edit:g.edit&&!g.field.readOnly,"label-class":((d=r.value)==null?void 0:d.color)??"",label:(h=r.value)==null?void 0:h.label,"empty-label":g.field.label},{content:y(D=>[k(I,null,{default:y(()=>[(v(!0),q(Q,null,R(b.value,(p,u)=>{var w;return v(),q("div",{onClick:c=>s(p,D.hide),class:J(["choice py-1",{[p.color??""]:!0,active:p.key===((w=r.value)==null?void 0:w.key)}]),key:u},j(p.label),11,ze)}),128))]),_:2},1024)]),_:1},8,["search-value","edit","label-class","label","empty-label"])]}),_:1},8,["label","error","required","read-only"]))}}),Ke={class:"connection-input position-relative"},We=["value"],Ze=["onClick"],Ge=B({__name:"InputConnection",props:{modelValue:{},titleValue:{},edit:{type:Boolean},icon:{},field:{},error:{},focus:{type:Boolean}},emits:["update:modelValue","update:titleValue","selected"],setup(n,{emit:a}){const t=n;function i(u){r.value=null,o.value="",u()}const r=O({get:()=>t.modelValue,set:u=>{l("update:modelValue",u),u&&l("selected",u)}}),o=O({get:()=>t.titleValue,set:u=>{l("update:titleValue",u)}});function e(u){var w;d.value=u,u&&((w=s.value)==null||w.focus(),p())}const l=a,s=$();let b,m="id",g;ce(()=>{const u=fe.entities.find(w=>w.entityId===t.field.connectionEntity);if(!u)throw new Error(`Entity ${t.field.connectionEntity} not found`);b=u,m=b.config.titleField||"id",g=b.fields.find(w=>w.key===m)}),M(()=>{var u;t.focus&&((u=s.value)==null||u.focus())});const _=$(""),d=$(!1);function h(u,w){r.value=u.id,o.value=u[m],D.value=[],d.value=!1,w()}const D=$([]);async function p(u){var N;_.value=u||"";const w=((N=b.config.idMethod)==null?void 0:N.type)==="number"?"=":"contains";let c=m||"id",f=w;g&&(c=m,f=["IntField","DecimalField"].includes(g.fieldType)?"=":"contains");let S=_.value,L={};f==="="&&(S=parseInt(_.value),isNaN(S)||(L={[c]:{op:f,value:S}})),f==="contains"&&S&&(L={[c]:{op:f,value:S}});const F=await me.getList(t.field.connectionEntity,{columns:[m,"id"],limit:20,filter:L,orderBy:"id",order:"desc"});D.value=F.data}return(u,w)=>(v(),q("div",Ke,[k(P,{label:u.field.label,error:u.error,required:u.field.required,description:u.field.description,"read-only":u.field.readOnly},{default:y(()=>{var c;return[!u.edit||u.field.readOnly?(v(),q("input",{key:0,value:o.value,disabled:""},null,8,We)):(v(),C(re,{key:1,onOpen:e,"search-value":_.value,"onUpdate:searchValue":[w[0]||(w[0]=f=>_.value=f),p],onClear:i,icon:u.field.connectionEntity==="user"?"person":void 0,label:o.value,"empty-label":(c=x(b))==null?void 0:c.config.label},{content:y(f=>[(v(!0),q(Q,null,R(D.value,S=>(v(),q("div",{class:"choice py-1",key:S.id,onClick:L=>h(S,f.hide)},j(S[x(m)]||S.id),9,Ze))),128))]),_:1},8,["search-value","icon","label","empty-label"]))]}),_:1},8,["label","error","required","description","read-only"])]))}}),Qe=["onClick"],Re=B({__name:"DatePicker",props:{single:{type:Boolean}},emits:["selected","selectedSingle","clear"],setup(n,{emit:a}){const t=$(new Date().getMonth()),i=$(new Date().getFullYear());$(!1);const r=(c,f)=>new Date(f,c+1,0).getDate();function o(c,f){return new Date(f,c,1).getDay()}const e=a,l=n;function s(c,f){const L=r(c,f),F=o(c,f);new Date(f,c,L).getDay();const N=[],A=r(c-1,f);r(c+1,f);for(let E=0;E<35;E++){let T={day:"",isCurrentMonth:!1,date:""};E<F?(T.day=A-F+E+1,T.isCurrentMonth=!1,T.date=`${f}-${b(c)}-${b(A-F+E+1)}`):E>=F&&E<L+F?(T.day=E-F+1,T.isCurrentMonth=!0,T.date=`${f}-${b(c+1)}-${b(E-F+1)}`):(T.day=E-L-F+1,T.isCurrentMonth=!1,T.date=`${f}-${b(c+2)}-${E-L-F+1}`),N.push(T)}return N}function b(c){return c<10?`0${c}`:c}function m(){t.value===11&&(t.value=0,i.value=i.value+1),t.value=t.value+1}function g(){t.value===0&&(t.value=11,i.value=i.value-1),t.value=t.value-1}const _=["January","February","March","April","May","June","July","August","September","October","November","December"],d=$(),h=$();function D(c){if(!h.value&&!d.value){if(d.value=c,l.single){d.value=void 0,h.value=void 0,e("selectedSingle",c.date);return}return}if(d.value&&h.value){d.value=c,h.value=void 0;return}if(w(c)){d.value=c,h.value=void 0;return}h.value=c,e("selected",{from:d.value.date,to:h.value.date})}function p(c,f){return!c||!f?!1:c.date===f.date}function u(c){return d.value&&h.value&&c.date>d.value.date&&c.date<h.value.date}function w(c){return d.value&&c.date<d.value.date}return(c,f)=>(v(),C(I,{class:"row shrink overflow-visible date-picker"},{default:y(()=>[k(I,{class:"col horizontal-align-between vertical-align-center overflow-visible"},{default:y(()=>[k(le,{class:"flat",icon:"chevron_left",onClick:g}),k(Z,{speed:"fast"},{default:y(()=>[(v(),C(I,{class:"col shrink horizontal-align-between vertical-align-center overflow-visible",key:t.value},{default:y(()=>[V("div",null,j(_[t.value]),1),V("div",null,j(i.value),1)]),_:1}))]),_:1}),k(le,{icon:"chevron_right",class:"flat",onClick:m})]),_:1}),k(I,{class:"col-7 row-gap-0 shrink"},{default:y(()=>[f[0]||(f[0]=V("div",{class:"weekday"},"Sun",-1)),f[1]||(f[1]=V("div",{class:"weekday"},"Mon",-1)),f[2]||(f[2]=V("div",{class:"weekday"},"Tue",-1)),f[3]||(f[3]=V("div",{class:"weekday"},"Wed",-1)),f[4]||(f[4]=V("div",{class:"weekday"},"Thu",-1)),f[5]||(f[5]=V("div",{class:"weekday"},"Fri",-1)),f[6]||(f[6]=V("div",{class:"weekday"},"Sat",-1)),k(Z,{speed:"fast"},{default:y(()=>[(v(),q("div",{class:"calendar-days",key:t.value},[(v(!0),q(Q,null,R(s(t.value,i.value),S=>(v(),q("div",{class:J(["day",{"not-current-month":!S.isCurrentMonth,from:p(S,d.value),to:p(S,h.value),between:u(S),disabled:w(S)}]),key:S.date,onClick:L=>D(S)},[V("div",null,j(S.day),1)],10,Qe))),128))]))]),_:1})]),_:1})]),_:1}))}}),se=ve(Re,[["__scopeId","data-v-67f7672b"]]),ie=B({__name:"DropDown",emits:["open"],setup(n,{emit:a}){const t=$(!1),i=a,r=$("0px"),o=$("0px");function e(d){if(t.value){m();return}b()}const l=W("popover"),s=W("dropdown");function b(){var d;(d=l.value)==null||d.showPopover(),t.value=!0,i("open",!0)}function m(){var d;(d=l.value)==null||d.hidePopover()}function g(d){var A;const h=(A=s.value)==null?void 0:A.getBoundingClientRect(),D=d||l.value;if(!D)return;const p=window.innerHeight,u=D.getBoundingClientRect(),w=(h==null?void 0:h.height)||0,c=(h==null?void 0:h.width)||0,f=(h==null?void 0:h.top)||0,S=(h==null?void 0:h.left)||0;h!=null&&h.right;const L=(h==null?void 0:h.bottom)||0,F=u.height;u.width;const N=L+F>p?f-F-8:f+w;r.value=`${N}px`,o.value=`${S}px`,D.style.setProperty("--popover-top",r.value),D.style.setProperty("--popover-left",o.value),D.style.opacity="1",D.style.minWidth=`${c}px`}function _(d){d.target.closest(".select-dropdown[popover]")||m()}return M(()=>{var d;(d=l.value)==null||d.addEventListener("toggle",h=>{const D=h;t.value=D.newState==="open";const p=h.target;D.newState==="open"&&(window.addEventListener("wheel",_),g(p)),D.newState==="closed"&&(window.removeEventListener("wheel",_),p.style.opacity="0"),i("open",D.newState==="open")}),m()}),(d,h)=>(v(),q("div",{ref_key:"dropdown",ref:s,class:"dropdown-container"},[V("div",{onClick:e},[K(d.$slots,"default",{},()=>[k(he)])]),V("div",{ref_key:"popover",ref:l,class:"select-dropdown",popover:"auto"},[K(d.$slots,"dropdown",{hide:m})],512)],512))}}),Xe=B({__name:"InputDate",props:{modelValue:{},field:{},error:{},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:a}){const t=n,i=a,r=$(),o=O({get:()=>t.modelValue,set:l=>{i("update:modelValue",l)}});function e(l,s){o.value=l,s()}return M(()=>{var l;t.focus&&((l=r.value)==null||l.focus())}),(l,s)=>(v(),C(P,{label:l.field.label,error:l.error,description:l.field.description,required:l.field.required,class:"overflow-visible input-timestamp","read-only":l.field.readOnly},{default:y(()=>[k(ie,null,{dropdown:y(b=>[k(ae,{class:"date-container max-content overflow-visible shadow-small"},{default:y(()=>[l.field.readOnly?z("",!0):(v(),C(se,{modelValue:o.value,"onUpdate:modelValue":s[0]||(s[0]=m=>o.value=m),single:"",key:o.value,onSelectedSingle:m=>e(m,b.hide)},null,8,["modelValue","onSelectedSingle"]))]),_:2},1024)]),default:y(()=>[V("div",{class:J(["input",{disabled:l.field.readOnly,empty:!o.value}])},[k(G,{format:"standard",value:o.value||"YYYY/MM/DD"},null,8,["value"])],2)]),_:1})]),_:1},8,["label","error","description","required","read-only"]))}}),xe=["name","disabled"],el=B({__name:"InputEmail",props:{modelValue:{},label:{},error:{},name:{},required:{type:Boolean},readOnly:{type:Boolean},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:a}){const t=n,i=a,r=$(),o=O({get:()=>t.modelValue,set:e=>{i("update:modelValue",e)}});return M(()=>{var e;t.focus&&((e=r.value)==null||e.focus())}),(e,l)=>(v(),C(P,{label:e.label,error:e.error,required:e.required,"read-only":e.readOnly},{default:y(()=>[Y(V("input",{name:e.name,ref_key:"input",ref:r,type:"text","onUpdate:modelValue":l[0]||(l[0]=s=>o.value=s),disabled:e.readOnly},null,8,xe),[[U,o.value]])]),_:1},8,["label","error","required","read-only"]))}}),ll=["name","disabled"],tl=B({__name:"InputImage",props:{modelValue:{},label:{},error:{},name:{},required:{type:Boolean},readOnly:{type:Boolean},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:a}){const t=n,i=a,r=$(),o=O({get:()=>t.modelValue,set:e=>{i("update:modelValue",e)}});return M(()=>{var e;t.focus&&((e=r.value)==null||e.focus())}),(e,l)=>(v(),C(P,{label:e.label,error:e.error,required:e.required,"read-only":e.readOnly},{default:y(()=>[Y(V("input",{name:e.name,ref_key:"input",ref:r,type:"text","onUpdate:modelValue":l[0]||(l[0]=s=>o.value=s),disabled:e.readOnly},null,8,ll),[[U,o.value]])]),_:1},8,["label","error","required","read-only"]))}}),nl=["name","placeholder","disabled"],ol=B({__name:"InputInt",props:{modelValue:{},field:{},placeholder:{},error:{},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:a}){const t=n,i=a,r=$(),o=O({get:()=>t.modelValue,set:e=>{isNaN(e)&&(e=null),e&&e.toString().includes(".")&&(e=Math.round(e)),i("update:modelValue",e)}});return M(()=>{var e;t.focus&&((e=r.value)==null||e.focus())}),(e,l)=>(v(),C(P,{label:e.field.label,error:e.error,required:e.field.required,"read-only":e.field.readOnly},{default:y(()=>[Y(V("input",{name:e.field.key,ref_key:"input",ref:r,placeholder:e.placeholder||e.field.readOnly?"":`Enter ${e.field.label}`,type:"number","onUpdate:modelValue":l[0]||(l[0]=s=>o.value=s),disabled:e.field.readOnly},null,8,nl),[[U,o.value]])]),_:1},8,["label","error","required","read-only"]))}}),al=["name","disabled"],rl=B({__name:"InputJSON",props:{modelValue:{},label:{},error:{},name:{},required:{type:Boolean},readOnly:{type:Boolean},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:a}){const t=n,i=a,r=$(),o=$(t.modelValue),e=$("");function l(){try{o.value=JSON.parse(e.value),e.value=JSON.stringify(o.value,null,2),i("update:modelValue",o.value)}catch(s){o.value=e.value,console.error(s)}}return M(()=>{var s;t.focus&&((s=r.value)==null||s.focus()),e.value=JSON.stringify(t.modelValue,null,2)}),(s,b)=>(v(),C(P,{label:s.label,error:s.error,required:s.required,"read-only":s.readOnly},{default:y(()=>[k(I,{class:"position-relative"},{default:y(()=>[Y(V("textarea",{name:s.name,class:"json-textarea",ref_key:"input",ref:r,"onUpdate:modelValue":b[0]||(b[0]=m=>e.value=m),onInput:l,disabled:s.readOnly},null,40,al),[[U,e.value]]),k(Oe,{class:"z-1 display-json",value:o.value},null,8,["value"])]),_:1})]),_:1},8,["label","error","required","read-only"]))}}),sl=["name","disabled"],il=B({__name:"InputMultiChoice",props:{modelValue:{},label:{},error:{},name:{},required:{type:Boolean},readOnly:{type:Boolean},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:a}){const t=n,i=a,r=$(),o=O({get:()=>t.modelValue,set:e=>{i("update:modelValue",e)}});return M(()=>{var e;t.focus&&((e=r.value)==null||e.focus())}),(e,l)=>(v(),C(P,{label:e.label,error:e.error,required:e.required,"read-only":e.readOnly},{default:y(()=>[Y(V("input",{name:e.name,ref_key:"input",ref:r,type:"text","onUpdate:modelValue":l[0]||(l[0]=s=>o.value=s),disabled:e.readOnly},null,8,sl),[[U,o.value]])]),_:1},8,["label","error","required","read-only"]))}}),ul=["name","disabled"],dl=B({__name:"InputPhone",props:{modelValue:{},label:{},error:{},name:{},required:{type:Boolean},readOnly:{type:Boolean},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:a}){const t=n,i=a,r=$(),o=O({get:()=>t.modelValue,set:e=>{i("update:modelValue",e)}});return M(()=>{var e;t.focus&&((e=r.value)==null||e.focus())}),(e,l)=>(v(),C(P,{label:e.label,error:e.error,required:e.required,"read-only":e.readOnly},{default:y(()=>[Y(V("input",{name:e.name,ref_key:"input",ref:r,type:"text","onUpdate:modelValue":l[0]||(l[0]=s=>o.value=s),disabled:e.readOnly},null,8,ul),[[U,o.value]])]),_:1},8,["label","error","required","read-only"]))}}),pl=["name","placeholder","disabled"],cl=B({__name:"InputText",props:{modelValue:{},field:{},placeholder:{},error:{},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:a}){const t=n,i=a,r=$(),o=O({get:()=>t.modelValue,set:l=>{i("update:modelValue",l)}});M(()=>{var l;t.focus&&((l=r.value)==null||l.focus()),e()});function e(){r.value&&(r.value.style.height="auto",r.value.style.height=r.value.scrollHeight+"px")}return(l,s)=>(v(),C(P,{label:l.field.label,error:l.error,required:l.field.required,"read-only":l.field.readOnly},{default:y(()=>[Y(V("textarea",{name:l.field.key,rows:"1",onKeydown:s[0]||(s[0]=ye(oe(()=>{},["stop"]),["enter"])),placeholder:l.placeholder||l.field.readOnly?"":`Enter ${l.field.label}`,ref_key:"input",ref:r,"onUpdate:modelValue":s[1]||(s[1]=b=>o.value=b),onInput:e,disabled:l.field.readOnly},null,40,pl),[[U,o.value]])]),_:1},8,["label","error","required","read-only"]))}}),fl=B({__name:"InputTimestamp",props:{modelValue:{},field:{},error:{},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:a}){const t=n,i=a,r=$(),o=O({get:()=>t.modelValue,set:l=>{i("update:modelValue",l)}});function e(l,s){o.value=l,s()}return M(()=>{var l;t.focus&&((l=r.value)==null||l.focus())}),(l,s)=>(v(),C(P,{label:l.field.label,error:l.error,description:l.field.description,required:l.field.required,class:"overflow-visible input-timestamp","read-only":l.field.readOnly},{default:y(()=>[l.field.readOnly?(v(),q("div",{key:0,class:J(["input",{disabled:l.field.readOnly,empty:!o.value}])},[k(G,{format:"standard",value:o.value||"YYYY/MM/DD"},null,8,["value"])],2)):(v(),C(ie,{key:1},{dropdown:y(b=>[k(ae,{class:"date-container max-content overflow-visible shadow-small"},{default:y(()=>[l.field.readOnly?z("",!0):(v(),C(se,{modelValue:o.value,"onUpdate:modelValue":s[0]||(s[0]=m=>o.value=m),single:"",key:o.value,onSelectedSingle:m=>e(m,b.hide)},null,8,["modelValue","onSelectedSingle"]))]),_:2},1024)]),default:y(()=>[V("div",{class:J(["input",{disabled:l.field.readOnly,empty:!o.value}])},[k(G,{format:"standard",value:o.value||"YYYY/MM/DD"},null,8,["value"])],2)]),_:1}))]),_:1},8,["label","error","description","required","read-only"]))}}),ml=["name","placeholder","disabled"],vl=B({__name:"InputDecimal",props:{modelValue:{},field:{},error:{},placeholder:{},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:a}){const t=n,i=a,r=$(),o=O({get:()=>t.modelValue,set:e=>{i("update:modelValue",e)}});return M(()=>{var e;t.focus&&((e=r.value)==null||e.focus())}),(e,l)=>(v(),C(P,{label:e.field.label,error:e.error,required:e.field.required,"read-only":e.field.readOnly},{default:y(()=>[Y(V("input",{name:e.field.key,ref_key:"input",ref:r,type:"number",placeholder:e.placeholder||e.field.readOnly?"":`Enter ${e.field.label}`,"onUpdate:modelValue":l[0]||(l[0]=s=>o.value=s),disabled:e.field.readOnly},null,8,ml),[[U,o.value]])]),_:1},8,["label","error","required","read-only"]))}}),yl=["name","disabled"],gl=B({__name:"InputRichText",props:{modelValue:{},label:{},error:{},name:{},required:{type:Boolean},readOnly:{type:Boolean},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:a}){const t=n,i=a,r=$(),o=O({get:()=>t.modelValue,set:e=>{i("update:modelValue",e)}});return M(()=>{var e;t.focus&&((e=r.value)==null||e.focus())}),(e,l)=>(v(),C(P,{label:e.label,error:e.error,required:e.required,"read-only":e.readOnly},{default:y(()=>[Y(V("textarea",{name:e.name,ref_key:"input",ref:r,"onUpdate:modelValue":l[0]||(l[0]=s=>o.value=s),disabled:e.readOnly},null,8,yl),[[U,o.value]])]),_:1},8,["label","error","required","read-only"]))}}),hl=["name","placeholder","disabled"],bl=B({__name:"InputURL",props:{modelValue:{},label:{},error:{},name:{},placeholder:{},required:{type:Boolean},readOnly:{type:Boolean},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:a}){const t=n,i=a,r=$(),o=O({get:()=>t.modelValue,set:e=>{i("update:modelValue",e)}});return M(()=>{var e;t.focus&&((e=r.value)==null||e.focus())}),(e,l)=>(v(),C(P,{label:e.label,error:e.error,required:e.required,"read-only":e.readOnly},{default:y(()=>[Y(V("input",{maxlength:"255",name:e.name,ref_key:"input",ref:r,type:"url",placeholder:e.placeholder,"onUpdate:modelValue":l[0]||(l[0]=s=>o.value=s),disabled:e.readOnly},null,8,hl),[[U,o.value]])]),_:1},8,["label","error","required","read-only"]))}}),Bl={BigIntField:Ie,BooleanField:He,ChoicesField:Ae,ConnectionField:Ge,DateField:Xe,DecimalField:vl,EmailField:el,ImageField:tl,IntField:ol,JSONField:rl,MultiChoiceField:il,PasswordField:be,PhoneField:dl,TextField:cl,DataField:te,IDField:te,TimeStampField:fl,RichTextField:gl,URLField:bl};export{Oe as _,G as a,Sl as b,Cl as c,Bl as f,_e as g,Me as l,Dl as o};
