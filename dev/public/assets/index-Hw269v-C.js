import{d as b,L as g,o as p,c as y,w as m,e as f,b as B,C as k,x as v,I as P,D as L,m as D,g as N,f as R,O as E,a as c,P as _,Q as h,R as z,H as I,p as O,F as j,z as Y,l as H,v as M,t as F,A as J,h as A}from"./index-CQnUWCV4.js";import{C as S}from"./CardWidget-BgBev2dT.js";import{a as K}from"./ButtonIcon.vue_vue_type_script_setup_true_lang-CsaDcWkB.js";import{b as V,a as Z,_ as Q}from"./Button.vue_vue_type_script_setup_true_lang-1s5_nbt9.js";import{_ as T}from"./InputData.vue_vue_type_script_setup_true_lang-DzXQy-iL.js";function Ke(n,r,t){if(!n)return"";let u="";t==="camelCase"&&(n=W(n));const o=G(n);return r==="titleCase"&&(u=n.split(o).map(s=>`${s.charAt(0).toUpperCase()}${s.slice(1)}`).join(" ")),r==="pascal"&&(u=n.toLowerCase().replace(o,"-")),r==="initials"&&(u=n.split(o).map(s=>s[0]).join("").toUpperCase()),r==="snakeCase"&&(u=n.toLowerCase().replace(o,"_")),u}function W(n){return n.replace(/([A-Z])/g,r=>`_${r.toLowerCase()}`)}function G(n){const r=[" ","-","_"];let t=" ";return r.forEach(u=>{if(n.includes(u))return t=u,u}),t}function q(n,r){return n.toString().padStart(2,"0")}function X(n,r){const t=r||new Date;return n.getDate()==t.getDate()&&n.getMonth()==t.getMonth()&&n.getFullYear()==t.getFullYear()}function x(n,r){const t=r||new Date;return t.setDate(t.getDate()-1),n.getDate()==t.getDate()&&n.getMonth()==t.getMonth()&&n.getFullYear()==t.getFullYear()}function Ze(n,r){const t=new Date(n);if(t.setMinutes(t.getMinutes()-t.getTimezoneOffset()),isNaN(t.getTime()))return n;const u=l=>{const a=new Date;let d="",i=l.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});if(r!=null&&r.showSeconds&&(i=l.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit",second:"2-digit"})),a.toLocaleDateString()==l.toLocaleDateString())return d="Today at",`${d} ${i}`;if(a.getFullYear()==l.getFullYear()&&l.getMonth().toString()+(l.getDay()+1).toString()==a.getMonth().toString()+a.getDay().toString())return d="Yesterday at",`${d} ${i}`;let $=l.toString().substring(0,15);return r!=null&&r.showSeconds&&($=l.toString().substring(0,21)),$},o=l=>{const a=q(l.getDate()),d=q(l.getMonth()+1),i=l.getFullYear();return`${a}/${d}/${i}`},s=l=>{const a=new Date,d=a.getFullYear();a.getMonth(),a.getDate();const i=l.getFullYear(),$=l.getMonth(),C=l.getDate();let w=`${q(C)}/${q($+1)}`;return d!=i&&(w=`${w}/${i}`),X(l,a)&&(w=l.toLocaleTimeString(void 0,{hour:"numeric",hour12:!1,minute:"numeric"})),x(l,a)&&(w="Yesterday"),w};switch((r==null?void 0:r.format)||"standard"){case"pretty":return u(t);case"date":return o(t);case"compact":return s(t);case"time":return t.toLocaleTimeString();default:{const l=q(t.getDate()),a=q(t.getMonth()+1),d=t.getFullYear(),i=q(t.getHours()),$=q(t.getMinutes()),C=q(t.getSeconds());return`${l}/${a}/${d} ${i}:${$}${r!=null&&r.showSeconds?`:${C}`:""}`}}}const ee='<span class="json-colon">: </span>';function te(n){let r=n;const t=/"([^"]+)":/g,u=/:\s+(.*$)/g,o=t.exec(r);if(!o)return`<div class="json-row">${U(r)}</div>`;const s=u.exec(r);if(!o||!s)return r;const e=`<span class="json-key">"${o[1]}"</span>`,l=s[1],a=r.match(/^\s+/);return`<div class="json-row">${a?a[0]:""}${e}${ee}${U(l)}</div>`}function U(n){const r=/"([^"]+)"/g,t=/(\d+)/g,u=/(true|false)/g,o=r.exec(n);if(o){const l=ne(o[1]);return n.replace(r,`<span class="json-string">"${l}"</span>`)}const s=t.exec(n);if(s)return n.replace(t,`<span class="json-number">${s[1]}</span>`);const e=u.exec(n);return e?n.replace(u,`<span class="json-boolean">${e[1]}</span>`):n==="null"?'<span class="json-null">null</span>':n==="undefined"?'<span class="json-undefined">undefined</span>':n}function ne(n){return n.replace(/[&<>"']/g,r=>{switch(r){case"&":return"&amp;";case"<":return"&lt;";case">":return"&gt;";case'"':return"&quot;";default:return""}})}const re=["innerHTML"],Qe=b({__name:"DisplayJSON",props:{value:{},field:{}},setup(n){const r=n,t=g(()=>r.value?JSON.stringify(r.value,null,2).split(`
`).map(s=>`${te(s)}`).join(""):'<div class="italic">no content</div>');return(u,o)=>(p(),y(k,{class:"json-wrapper"},{default:m(()=>[o[0]||(o[0]=f("div",{class:"gutter"},null,-1)),B(k,{class:"json-content-wrapper position-relative"},{default:m(()=>[f("div",{class:"json-content",innerHTML:t.value},null,8,re)]),_:1})]),_:1}))}}),le=n=>n.getModifierState("Control")||n.metaKey,We=(n,r)=>{le(n)&&n.key==="s"&&(n.preventDefault(),r())},ae=(n,r)=>{const t=n;v(()=>{document.addEventListener("keydown",t)}),P(()=>{document.removeEventListener("keydown",t)})},Ge=b({__name:"ModalView",props:{modelValue:{type:Boolean}},emits:["update:modelValue","close"],setup(n,{emit:r}){function t(){s.value=!1,o("close")}const u=n,o=r,s=g({get:()=>u.modelValue,set:e=>{o("update:modelValue",e)}});return ae(e=>{e.key==="Escape"&&t()}),(e,l)=>(p(),y(E,{to:"#modals"},[B(K,null,{default:m(()=>[s.value?(p(),y(k,{key:0,onClick:L(t,["self"]),class:"modal-wrapper z-max position-fixed top left vh-100 vw-100 horizontal-align-center vertical-align-center"},{default:m(()=>[B(S,null,{default:m(()=>[D(e.$slots,"default",{},()=>[l[0]||(l[0]=N(" modal "))])]),_:3})]),_:3})):R("",!0)]),_:3})]))}}),oe=["name","disabled"],se=b({__name:"InputBigInt",props:{modelValue:{},label:{},error:{},name:{},required:{type:Boolean},readOnly:{type:Boolean},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:r}){const t=n,u=r,o=c(),s=g({get:()=>t.modelValue,set:e=>{u("update:modelValue",e)}});return v(()=>{var e;t.focus&&((e=o.value)==null||e.focus())}),(e,l)=>(p(),y(V,{label:e.label,error:e.error,required:e.required,"read-only":e.readOnly},{default:m(()=>[_(f("input",{name:e.name,ref_key:"input",ref:o,type:"number","onUpdate:modelValue":l[0]||(l[0]=a=>s.value=a),disabled:e.readOnly},null,8,oe),[[h,s.value]])]),_:1},8,["label","error","required","read-only"]))}}),ue=["name","disabled"],de=b({__name:"InputBoolean",props:{modelValue:{},label:{},error:{},name:{},required:{type:Boolean},readOnly:{type:Boolean},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:r}){const t=n,u=r,o=c(),s=g({get:()=>t.modelValue,set:e=>{u("update:modelValue",e)}});return v(()=>{var e;t.focus&&((e=o.value)==null||e.focus())}),(e,l)=>(p(),y(V,{label:e.label,error:e.error,required:e.required,"read-only":e.readOnly},{default:m(()=>[_(f("input",{name:e.name,ref_key:"input",ref:o,type:"checkbox","onUpdate:modelValue":l[0]||(l[0]=a=>s.value=a),disabled:e.readOnly},null,8,ue),[[z,s.value]])]),_:1},8,["label","error","required","read-only"]))}}),ie=b({__name:"ButtonDropdown",setup(n){const r=c(!1);c("0px"),c("0px");function t(a){s()}const u=I("popover"),o=I("dropdown");function s(){var a;l(),(a=u.value)==null||a.showPopover(),r.value=!0}function e(){var a;(a=u.value)==null||a.hidePopover(),r.value=!1}function l(){var i;const a=(i=o.value)==null?void 0:i.getBoundingClientRect();if(!u.value)return;const d=u.value;d.style.top=`${a==null?void 0:a.bottom}px`,d.style.left=`${a==null?void 0:a.left}px`,d.style.width=`${a==null?void 0:a.width}px`}return v(()=>{r.value=!1,e()}),(a,d)=>(p(),O("div",{ref_key:"dropdown",ref:o,class:"dropdown-container"},[f("div",{onClick:t},[D(a.$slots,"default",{},()=>[B(Z)])]),f("div",{ref_key:"popover",ref:u,class:"dropdown",popover:"auto"},[D(a.$slots,"dropdown",{},()=>[B(S,{class:"shadow"},{default:m(()=>d[0]||(d[0]=[f("div",{class:"label"},null,-1)])),_:1})])],512)],512))}}),pe={class:"p-2 choices-dropdown"},me=["onClick"],ce=b({__name:"InputChoices",props:{modelValue:{},label:{},error:{},name:{},required:{type:Boolean},readOnly:{type:Boolean},focus:{type:Boolean},field:{},choices:{}},emits:["update:modelValue"],setup(n,{emit:r}){const t=c(!1),u=n,o=r,s=u.choices||u.field.choices||[],e=g({get:()=>s.find(a=>a.key===u.modelValue),set:a=>{o("update:modelValue",a.key)}});function l(a){e.value=a,t.value=!t.value}return v(()=>{}),(a,d)=>(p(),y(V,{label:a.label,error:a.error,required:a.required,"read-only":a.readOnly},{default:m(()=>[(p(),y(ie,{class:"choices-input",key:t.value.toString()},{dropdown:m(()=>[f("div",pe,[a.field.required?R("",!0):(p(),O("div",{key:0,class:"choice label",onClick:d[0]||(d[0]=i=>l({key:"",label:""}))}," clear ")),(p(!0),O(j,null,Y(H(s),i=>(p(),O("div",{class:M(["choice",{[i.color||"muted"]:!0}]),onClick:L($=>l(i),["stop","prevent"]),key:i.key},F(i.label),11,me))),128))])]),default:m(()=>{var i,$;return[f("div",{class:M(["choice",{[((i=e.value)==null?void 0:i.color)||"muted"]:!0}])},F((($=e.value)==null?void 0:$.label)||"Click to Select..."),3)]}),_:1}))]),_:1},8,["label","error","required","read-only"]))}}),fe={class:"connection-input position-relative"},ye=["name","disabled"],be={class:"search-item text-small"},ge=b({__name:"InputConnection",props:{modelValue:{},label:{},field:{},error:{},name:{},required:{type:Boolean},readOnly:{type:Boolean},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:r}){const t=n,u=r,o=c();g({get:()=>t.modelValue,set:d=>{u("update:modelValue",d)}}),v(()=>{var d;t.focus&&((d=o.value)==null||d.focus())});const s=c("");c(null);const e=c([]);let l=J.entities.find(d=>d.entityId===t.field.connectionEntity);async function a(d){s.value=d.target.value;const i=(l==null?void 0:l.config.titleField)||"id",$=await A.getList(t.field.connectionEntity,{columns:[i,"id"],limit:10,filter:{[i]:{op:"contains",value:s.value}}});e.value=$.data}return(d,i)=>(p(),O("div",fe,[B(V,{class:"overflow-visible",label:d.label,error:d.error,required:d.required,"read-only":d.readOnly},{default:m(()=>[f("input",{name:d.name,ref_key:"input",ref:o,onInput:a,type:"text",disabled:d.readOnly},null,40,ye)]),_:1},8,["label","error","required","read-only"]),B(S,{class:"dropdown-container w-100"},{default:m(()=>[B(k,{class:"row shrink"},{default:m(()=>[(p(!0),O(j,null,Y(e.value,$=>(p(),O("div",be,F($.title||$.id),1))),256))]),_:1})]),_:1})]))}}),ve=["name","disabled"],Ve=b({__name:"InputDate",props:{modelValue:{},label:{},error:{},name:{},required:{type:Boolean},readOnly:{type:Boolean},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:r}){const t=n,u=r,o=c(),s=g({get:()=>t.modelValue,set:e=>{u("update:modelValue",e)}});return v(()=>{var e;t.focus&&((e=o.value)==null||e.focus())}),(e,l)=>(p(),y(V,{label:e.label,error:e.error,required:e.required,"read-only":e.readOnly},{default:m(()=>[_(f("input",{name:e.name,ref_key:"input",ref:o,type:"date","onUpdate:modelValue":l[0]||(l[0]=a=>s.value=a),disabled:e.readOnly},null,8,ve),[[h,s.value]])]),_:1},8,["label","error","required","read-only"]))}}),$e=["name","disabled"],_e=b({__name:"InputEmail",props:{modelValue:{},label:{},error:{},name:{},required:{type:Boolean},readOnly:{type:Boolean},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:r}){const t=n,u=r,o=c(),s=g({get:()=>t.modelValue,set:e=>{u("update:modelValue",e)}});return v(()=>{var e;t.focus&&((e=o.value)==null||e.focus())}),(e,l)=>(p(),y(V,{label:e.label,error:e.error,required:e.required,"read-only":e.readOnly},{default:m(()=>[_(f("input",{name:e.name,ref_key:"input",ref:o,type:"text","onUpdate:modelValue":l[0]||(l[0]=a=>s.value=a),disabled:e.readOnly},null,8,$e),[[h,s.value]])]),_:1},8,["label","error","required","read-only"]))}}),he=["name","disabled"],qe=b({__name:"InputImage",props:{modelValue:{},label:{},error:{},name:{},required:{type:Boolean},readOnly:{type:Boolean},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:r}){const t=n,u=r,o=c(),s=g({get:()=>t.modelValue,set:e=>{u("update:modelValue",e)}});return v(()=>{var e;t.focus&&((e=o.value)==null||e.focus())}),(e,l)=>(p(),y(V,{label:e.label,error:e.error,required:e.required,"read-only":e.readOnly},{default:m(()=>[_(f("input",{name:e.name,ref_key:"input",ref:o,type:"text","onUpdate:modelValue":l[0]||(l[0]=a=>s.value=a),disabled:e.readOnly},null,8,he),[[h,s.value]])]),_:1},8,["label","error","required","read-only"]))}}),Be=["name","disabled"],Oe=b({__name:"InputInt",props:{modelValue:{},label:{},error:{},name:{},required:{type:Boolean},readOnly:{type:Boolean},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:r}){const t=n,u=r,o=c(),s=g({get:()=>t.modelValue,set:e=>{u("update:modelValue",e)}});return v(()=>{var e;t.focus&&((e=o.value)==null||e.focus())}),(e,l)=>(p(),y(V,{label:e.label,error:e.error,required:e.required,"read-only":e.readOnly},{default:m(()=>[_(f("input",{name:e.name,ref_key:"input",ref:o,type:"number","onUpdate:modelValue":l[0]||(l[0]=a=>s.value=a),disabled:e.readOnly},null,8,Be),[[h,s.value]])]),_:1},8,["label","error","required","read-only"]))}}),we=["name","disabled"],ke=b({__name:"InputJSON",props:{modelValue:{},label:{},error:{},name:{},required:{type:Boolean},readOnly:{type:Boolean},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:r}){const t=n,u=r,o=c(),s=g({get:()=>t.modelValue,set:e=>{u("update:modelValue",e)}});return v(()=>{var e;t.focus&&((e=o.value)==null||e.focus())}),(e,l)=>(p(),y(V,{label:e.label,error:e.error,required:e.required,"read-only":e.readOnly},{default:m(()=>[_(f("textarea",{name:e.name,ref_key:"input",ref:o,"onUpdate:modelValue":l[0]||(l[0]=a=>s.value=a),disabled:e.readOnly},null,8,we),[[h,s.value]])]),_:1},8,["label","error","required","read-only"]))}}),Ce=["name","disabled"],De=b({__name:"InputMultiChoice",props:{modelValue:{},label:{},error:{},name:{},required:{type:Boolean},readOnly:{type:Boolean},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:r}){const t=n,u=r,o=c(),s=g({get:()=>t.modelValue,set:e=>{u("update:modelValue",e)}});return v(()=>{var e;t.focus&&((e=o.value)==null||e.focus())}),(e,l)=>(p(),y(V,{label:e.label,error:e.error,required:e.required,"read-only":e.readOnly},{default:m(()=>[_(f("input",{name:e.name,ref_key:"input",ref:o,type:"text","onUpdate:modelValue":l[0]||(l[0]=a=>s.value=a),disabled:e.readOnly},null,8,Ce),[[h,s.value]])]),_:1},8,["label","error","required","read-only"]))}}),Fe=["name","disabled"],Se=b({__name:"InputPhone",props:{modelValue:{},label:{},error:{},name:{},required:{type:Boolean},readOnly:{type:Boolean},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:r}){const t=n,u=r,o=c(),s=g({get:()=>t.modelValue,set:e=>{u("update:modelValue",e)}});return v(()=>{var e;t.focus&&((e=o.value)==null||e.focus())}),(e,l)=>(p(),y(V,{label:e.label,error:e.error,required:e.required,"read-only":e.readOnly},{default:m(()=>[_(f("input",{name:e.name,ref_key:"input",ref:o,type:"text","onUpdate:modelValue":l[0]||(l[0]=a=>s.value=a),disabled:e.readOnly},null,8,Fe),[[h,s.value]])]),_:1},8,["label","error","required","read-only"]))}}),Ie=["name","disabled"],Me=b({__name:"InputText",props:{modelValue:{},label:{},error:{},name:{},required:{type:Boolean},readOnly:{type:Boolean},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:r}){const t=n,u=r,o=c(),s=g({get:()=>t.modelValue,set:e=>{u("update:modelValue",e)}});return v(()=>{var e;t.focus&&((e=o.value)==null||e.focus())}),(e,l)=>(p(),y(V,{label:e.label,error:e.error,required:e.required,"read-only":e.readOnly},{default:m(()=>[_(f("textarea",{name:e.name,ref_key:"input",ref:o,"onUpdate:modelValue":l[0]||(l[0]=a=>s.value=a),disabled:e.readOnly},null,8,Ie),[[h,s.value]])]),_:1},8,["label","error","required","read-only"]))}}),Te=["name","disabled"],Ue=b({__name:"InputTimestamp",props:{modelValue:{},label:{},error:{},name:{},required:{type:Boolean},readOnly:{type:Boolean},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:r}){const t=n,u=r,o=c(),s=g({get:()=>t.modelValue,set:e=>{u("update:modelValue",e)}});return v(()=>{var e;t.focus&&((e=o.value)==null||e.focus())}),(e,l)=>(p(),y(V,{label:e.label,error:e.error,required:e.required,"read-only":e.readOnly},{default:m(()=>[_(f("input",{maxlength:"255",name:e.name,ref_key:"input",ref:o,type:"datetime-local","onUpdate:modelValue":l[0]||(l[0]=a=>s.value=a),disabled:e.readOnly},null,8,Te),[[h,s.value]])]),_:1},8,["label","error","required","read-only"]))}}),Le=["name","disabled"],Re=b({__name:"InputDecimal",props:{modelValue:{},label:{},error:{},name:{},required:{type:Boolean},readOnly:{type:Boolean},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:r}){const t=n,u=r,o=c(),s=g({get:()=>t.modelValue,set:e=>{u("update:modelValue",e)}});return v(()=>{var e;t.focus&&((e=o.value)==null||e.focus())}),(e,l)=>(p(),y(V,{label:e.label,error:e.error,required:e.required,"read-only":e.readOnly},{default:m(()=>[_(f("input",{name:e.name,ref_key:"input",ref:o,type:"number","onUpdate:modelValue":l[0]||(l[0]=a=>s.value=a),disabled:e.readOnly},null,8,Le),[[h,s.value]])]),_:1},8,["label","error","required","read-only"]))}}),je=["name","disabled"],Ye=b({__name:"InputRichText",props:{modelValue:{},label:{},error:{},name:{},required:{type:Boolean},readOnly:{type:Boolean},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:r}){const t=n,u=r,o=c(),s=g({get:()=>t.modelValue,set:e=>{u("update:modelValue",e)}});return v(()=>{var e;t.focus&&((e=o.value)==null||e.focus())}),(e,l)=>(p(),y(V,{label:e.label,error:e.error,required:e.required,"read-only":e.readOnly},{default:m(()=>[_(f("textarea",{name:e.name,ref_key:"input",ref:o,"onUpdate:modelValue":l[0]||(l[0]=a=>s.value=a),disabled:e.readOnly},null,8,je),[[h,s.value]])]),_:1},8,["label","error","required","read-only"]))}}),Pe=["name","placeholder","disabled"],Ne=b({__name:"InputURL",props:{modelValue:{},label:{},error:{},name:{},placeholder:{},required:{type:Boolean},readOnly:{type:Boolean},focus:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:r}){const t=n,u=r,o=c(),s=g({get:()=>t.modelValue,set:e=>{u("update:modelValue",e)}});return v(()=>{var e;t.focus&&((e=o.value)==null||e.focus())}),(e,l)=>(p(),y(V,{label:e.label,error:e.error,required:e.required,"read-only":e.readOnly},{default:m(()=>[_(f("input",{maxlength:"255",name:e.name,ref_key:"input",ref:o,type:"url",placeholder:e.placeholder,"onUpdate:modelValue":l[0]||(l[0]=a=>s.value=a),disabled:e.readOnly},null,8,Pe),[[h,s.value]])]),_:1},8,["label","error","required","read-only"]))}}),Xe={BigIntField:se,BooleanField:de,ChoicesField:ce,ConnectionField:ge,DateField:Ve,DecimalField:Re,EmailField:_e,ImageField:qe,IntField:Oe,JSONField:ke,MultiChoiceField:De,PasswordField:Q,PhoneField:Se,TextField:Me,DataField:T,IDField:T,TimeStampField:Ue,RichTextField:Ye,URLField:Ne};export{Ge as _,Qe as a,Ke as b,Xe as f,Ze as g,ae as l,We as o};
