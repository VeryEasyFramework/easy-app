import{a as m,o as r,c,w as y,i as t,t as d,l as p,h as i,g as b,Q as B,C as h,F as V,f as g,q,J as k,K as v}from"./logo-C62CV3B5.js";const C={class:"text-small pb-1"},O={key:0,class:"ps-1 text-error"},w={key:0,class:"error-message"},D=m({__name:"InputWrapper",props:{label:{},error:{},required:{type:Boolean},readOnly:{type:Boolean}},setup(s){return(a,o)=>(r(),c(h,{class:B(["input grid-gap-0",{readonly:a.readOnly}]),rows:["max-content","max-content","minmax(1rem,max-content)"]},{default:y(()=>[t("label",C,[t("span",null,d(a.label),1),a.required?(r(),p("span",O,"*")):i("",!0)]),b(a.$slots,"default"),a.error?(r(),p("div",w,d(a.error),1)):i("",!0)]),_:3},8,["class"]))}}),$=["name","disabled"],M=m({__name:"InputData",props:{modelValue:{},label:{},error:{},name:{},required:{type:Boolean},readOnly:{type:Boolean},focus:{type:Boolean}},emits:["update:modelValue"],setup(s,{emit:a}){const o=s,f=a,l=V(),n=g({get:()=>o.modelValue,set:e=>{f("update:modelValue",e)}});return q(()=>{var e;o.focus&&((e=l.value)==null||e.focus())}),(e,u)=>(r(),c(D,{label:e.label,error:e.error,required:e.required,"read-only":e.readOnly},{default:y(()=>[k(t("input",{maxlength:"255",name:e.name,ref_key:"input",ref:l,type:"text","onUpdate:modelValue":u[0]||(u[0]=_=>n.value=_),disabled:e.readOnly},null,8,$),[[v,n.value]])]),_:1},8,["label","error","required","read-only"]))}});export{D as _,M as a};