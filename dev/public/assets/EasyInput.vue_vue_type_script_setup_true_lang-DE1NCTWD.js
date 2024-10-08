import{d as n,L as p,o,p as r,t as i,_ as f,b as h,v as m,e as v,M as y,a as D,x as $,c as F,B as x,l as V}from"./index-CQnUWCV4.js";import{M as B}from"./ButtonIcon.vue_vue_type_script_setup_true_lang-CsaDcWkB.js";import{g as b,a as C,f as I}from"./index-Hw269v-C.js";const g=n({__name:"DisplayTimestamp",props:{value:{},format:{},showSeconds:{type:Boolean},field:{}},setup(a){const e=a,l=p(()=>e.value?b(e.value,{format:e.format||"pretty",showSeconds:e.showSeconds||!1}):"");return(s,c)=>(o(),r("div",null,i(l.value),1))}}),k={class:"data-field"},M=n({__name:"DisplayData",props:{value:{},field:{}},setup(a){const e=a;return(l,s)=>(o(),r("div",k,i(e.value),1))}}),_=f(M,[["__scopeId","data-v-d6563119"]]),w={class:"int-field"},L=n({__name:"DisplayInt",props:{value:{},field:{}},setup(a){const e=a,l=p(()=>e.value==null?"":e.value);return(s,c)=>(o(),r("div",w,i(l.value),1))}}),P=n({__name:"DisplayBigInt",props:{value:{},field:{}},setup(a){const e=a;return(l,s)=>(o(),r("div",null,i(e.value),1))}}),R=n({__name:"DisplayDate",props:{value:{},field:{}},setup(a){const e=a;return(l,s)=>(o(),r("div",null,i(e.value),1))}}),T=n({__name:"DisplayBoolean",props:{value:{},field:{}},setup(a){return(e,l)=>(o(),r("div",{class:m(["boolean-field",{true:e.value}])},[h(B,{class:"icon",icon:e.value?"check":"close",size:"0.6"},null,8,["icon"])],2))}}),S=n({__name:"DisplayPassword",props:{value:{},field:{}},setup(a){const e=a;return(l,s)=>(o(),r("div",null,i(e.value),1))}}),U={class:"choices-field"},E=n({__name:"DisplayChoices",props:{value:{},field:{}},setup(a){const e=a,l=p(()=>{var c,t,u;return((u=(t=(c=e.field)==null?void 0:c.choices)==null?void 0:t.find(d=>d.key==e.value))==null?void 0:u.color)||""}),s=p(()=>{var c,t,u;return((u=(t=(c=e.field)==null?void 0:c.choices)==null?void 0:t.find(d=>d.key==e.value))==null?void 0:u.label)||e.value});return(c,t)=>(o(),r("div",U,[v("div",{class:m({[l.value]:!0})},i(s.value),3)]))}}),O=n({__name:"DisplayMultiChoice",props:{value:{},field:{}},setup(a){const e=a;return(l,s)=>(o(),r("div",null,i(e.value),1))}}),q={class:"text-field"},N=n({__name:"DisplayText",props:{value:{},field:{}},setup(a){const e=a;return(l,s)=>(o(),r("div",q,i(e.value),1))}}),z=n({__name:"DisplayEmail",props:{value:{},field:{}},setup(a){const e=a;return(l,s)=>(o(),r("div",null,i(e.value),1))}}),J=n({__name:"DisplayImage",props:{value:{},field:{}},setup(a){const e=a;return(l,s)=>(o(),r("div",null,i(e.value),1))}}),j=n({__name:"DisplayPhone",props:{value:{},field:{}},setup(a){const e=a;return(l,s)=>(o(),r("div",null,i(e.value),1))}}),A=n({__name:"DisplayConnection",props:{value:{},routePrefix:{},field:{},titleValue:{}},setup(a){const e=y();async function l(){const s=`${a.routePrefix}/${a.value}`;await e.push(s)}return(s,c)=>(o(),r("div",{class:"connection-field",onClick:l},i(s.titleValue||s.value),1))}}),G={class:"decimal-field"},H=n({__name:"DisplayDecimal",props:{value:{},field:{}},setup(a){const e=a,l=p(()=>e.value==null?"":parseFloat(e.value).toFixed(2));return(s,c)=>(o(),r("div",G,i(l.value),1))}}),K={class:"url-field"},Q=["href"],W=n({__name:"DisplayURL",props:{value:{},field:{}},setup(a){const e=a,l=D();return $(()=>{if(e.value)try{l.value=new URL(e.value)}catch{}}),(s,c)=>{var t,u;return o(),r("div",K,[v("a",{href:(t=l.value)==null?void 0:t.href,target:"_blank"},i((u=l.value)==null?void 0:u.href),9,Q)])}}}),X=f(W,[["__scopeId","data-v-f58314d7"]]),Y=n({__name:"DisplayRichText",props:{value:{}},setup(a){return(e,l)=>(o(),r("div",null,i(e.value),1))}}),le={IDField:_,DataField:_,IntField:L,BigIntField:P,DateField:R,BooleanField:T,PasswordField:S,ChoicesField:E,MultiChoiceField:O,TextField:N,EmailField:z,ImageField:J,JSONField:C,PhoneField:j,ConnectionField:A,TimeStampField:g,DecimalField:H,URLField:X,RichTextField:Y},se=n({__name:"EasyInput",props:{modelValue:{},field:{},error:{},focus:{type:Boolean},placeholder:{},noLabel:{type:Boolean}},emits:["update:modelValue"],setup(a,{emit:e}){const l=a,s=e,c=p({get:()=>l.modelValue,set:t=>{s("update:modelValue",t)}});return(t,u)=>(o(),F(x(V(I)[l.field.fieldType]),{modelValue:c.value,"onUpdate:modelValue":u[0]||(u[0]=d=>c.value=d),field:l.field,required:t.field.required,label:t.noLabel?"":t.field.label,readOnly:t.field.readOnly,error:l.error,name:t.field.key,placeholder:t.placeholder,focus:l.focus,description:t.field.description},null,8,["modelValue","field","required","label","readOnly","error","name","placeholder","focus","description"]))}});export{g as _,se as a,le as d};