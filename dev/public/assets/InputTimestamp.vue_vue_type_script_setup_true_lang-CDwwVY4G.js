import{a as y,f as h,o as D,l as p,t as $,s as S,v as w,G as M,c as v,w as Y,O as _,h as F,P as T}from"./RootLayout.vue_vue_type_style_index_0_lang-C7NduuQ-.js";import{_ as b}from"./InputWrapper.vue_vue_type_script_setup_true_lang-D2qf8GVU.js";function u(r,t){return r.toString().padStart(2,"0")}function B(r,t){const e=t||new Date;return r.getDate()==e.getDate()&&r.getMonth()==e.getMonth()&&r.getFullYear()==e.getFullYear()}function L(r,t){const e=t||new Date;return e.setDate(e.getDate()-1),r.getDate()==e.getDate()&&r.getMonth()==e.getMonth()&&r.getFullYear()==e.getFullYear()}function k(r,t){const e=new Date(r);if(e.setMinutes(e.getMinutes()-e.getTimezoneOffset()),isNaN(e.getTime()))return r;const m=n=>{const o=new Date;let s="",l=n.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});if(t!=null&&t.showSeconds&&(l=n.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit",second:"2-digit"})),o.toLocaleDateString()==n.toLocaleDateString())return s="Today at",`${s} ${l}`;if(o.getFullYear()==n.getFullYear()&&n.getMonth().toString()+(n.getDay()+1).toString()==o.getMonth().toString()+o.getDay().toString())return s="Yesterday at",`${s} ${l}`;let i=n.toString().substring(0,15);return t!=null&&t.showSeconds&&(i=n.toString().substring(0,21)),i},c=n=>{const o=u(n.getDate()),s=u(n.getMonth()+1),l=n.getFullYear();return`${o}/${s}/${l}`},d=n=>{const o=new Date,s=o.getFullYear();o.getMonth(),o.getDate();const l=n.getFullYear(),i=n.getMonth(),f=n.getDate();let g=`${u(f)}/${u(i+1)}`;return s!=l&&(g=`${g}/${l}`),B(n,o)&&(g=n.toLocaleTimeString(void 0,{hour:"numeric",hour12:!1,minute:"numeric"})),L(n,o)&&(g="Yesterday"),g};switch((t==null?void 0:t.format)||"standard"){case"pretty":return m(e);case"date":return c(e);case"compact":return d(e);case"time":return e.toLocaleTimeString();default:{const n=u(e.getDate()),o=u(e.getMonth()+1),s=e.getFullYear(),l=u(e.getHours()),i=u(e.getMinutes()),f=u(e.getSeconds());return`${n}/${o}/${s} ${l}:${i}${t!=null&&t.showSeconds?`:${f}`:""}`}}}const q=y({__name:"DisplayTimestamp",props:{value:{},format:{},showSeconds:{type:Boolean},field:{}},setup(r){const t=r,e=h(()=>k(t.value,{format:t.format||"pretty",showSeconds:t.showSeconds||!1}));return(m,c)=>(D(),p("div",null,$(e.value),1))}}),V=r=>r.getModifierState("Control")||r.metaKey,E=(r,t)=>{V(r)&&r.key==="s"&&(r.preventDefault(),t())},N=(r,t)=>{const e=r;S(()=>{document.addEventListener("keydown",e)}),w(()=>{document.removeEventListener("keydown",e)})},C=["name","disabled"],K=y({__name:"InputTimestamp",props:{modelValue:{},label:{},error:{},name:{},required:{type:Boolean},readOnly:{type:Boolean},focus:{type:Boolean}},emits:["update:modelValue"],setup(r,{emit:t}){const e=r,m=t,c=M(),d=h({get:()=>e.modelValue,set:a=>{m("update:modelValue",a)}});return S(()=>{var a;e.focus&&((a=c.value)==null||a.focus())}),(a,n)=>(D(),v(b,{label:a.label,error:a.error,required:a.required,"read-only":a.readOnly},{default:Y(()=>[_(F("input",{name:a.name,ref_key:"input",ref:c,type:"date","onUpdate:modelValue":n[0]||(n[0]=o=>d.value=o),disabled:a.readOnly},null,8,C),[[T,d.value]])]),_:1},8,["label","error","required","read-only"]))}});export{q as _,K as a,N as l,E as o};