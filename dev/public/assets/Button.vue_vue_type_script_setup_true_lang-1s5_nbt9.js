import{d,o,c as m,w as c,p as t,e as y,t as l,f as n,m as b,v as f,C as B,a as V,L as k,x as v,P as g,Q as q,g as w}from"./index-CQnUWCV4.js";const C={key:0,class:"text-small input-label pb-1"},$={key:0,class:"ps-1 text-error"},O={key:1,class:"error-message bold italic"},N={key:2,class:"description italic bold"},D=d({__name:"InputWrapper",props:{label:{},error:{},required:{type:Boolean},readOnly:{type:Boolean},description:{}},setup(s){return(e,r)=>(o(),m(B,{class:f(["input grid-gap-0",{readonly:e.readOnly}]),rows:["max-content","max-content","minmax(1rem,max-content)"]},{default:c(()=>[e.label?(o(),t("label",C,[y("span",null,l(e.label),1),e.required?(o(),t("span",$,"*")):n("",!0)])):n("",!0),b(e.$slots,"default"),e.error?(o(),t("div",O,l(e.error),1)):e.description?(o(),t("div",N,l(e.description),1)):n("",!0)]),_:3},8,["class"]))}}),I=["name","placeholder","disabled"],S=d({__name:"InputPassword",props:{modelValue:{},label:{},error:{},name:{},required:{type:Boolean},placeholder:{},readOnly:{type:Boolean},focus:{type:Boolean}},emits:["update:modelValue"],setup(s,{emit:e}){const r=s,_=e,p=V(),i=k({get:()=>r.modelValue,set:a=>{_("update:modelValue",a)}});return v(()=>{var a;r.focus&&((a=p.value)==null||a.focus())}),(a,u)=>(o(),m(D,{label:a.label,error:a.error,required:a.required,"read-only":a.readOnly},{default:c(()=>[g(y("input",{maxlength:"140",name:a.name,ref_key:"input",ref:p,placeholder:a.placeholder,type:"password","onUpdate:modelValue":u[0]||(u[0]=h=>i.value=h),disabled:a.readOnly},null,8,I),[[q,i.value]])]),_:1},8,["label","error","required","read-only"]))}}),M=["type"],T=d({__name:"Button",props:{type:{},disabled:{type:Boolean},color:{}},setup(s){return(e,r)=>(o(),t("button",{class:f(["button",{[e.color??"primary"]:e.color}]),type:e.type||"button"},[b(e.$slots,"default",{},()=>[r[0]||(r[0]=w(" Button "))])],10,M))}});export{S as _,T as a,D as b};