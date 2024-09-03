import{a as c,o as r,c as y,w as f,l as d,i as b,t as p,h as m,g,p as k,C as O,G as V,f as h,s as B,U as _,V as q}from"./Container-DH2J1Vin.js";const w={key:0,class:"text-small pb-1"},C={key:0,class:"ps-1 text-error"},$={key:1,class:"error-message bold italic"},D={key:2,class:"description italic bold"},v=c({__name:"InputWrapper",props:{label:{},error:{},required:{type:Boolean},readOnly:{type:Boolean},description:{}},setup(t){return(a,l)=>(r(),y(O,{class:k(["input grid-gap-0",{readonly:a.readOnly}]),rows:["max-content","max-content","minmax(1rem,max-content)"]},{default:f(()=>[a.label?(r(),d("label",w,[b("span",null,p(a.label),1),a.required?(r(),d("span",C,"*")):m("",!0)])):m("",!0),g(a.$slots,"default"),a.error?(r(),d("div",$,p(a.error),1)):a.description?(r(),d("div",D,p(a.description),1)):m("",!0)]),_:3},8,["class"]))}}),I=["name","placeholder","disabled"],N=c({__name:"InputData",props:{modelValue:{},label:{},error:{},name:{},placeholder:{},required:{type:Boolean},readOnly:{type:Boolean},focus:{type:Boolean}},emits:["update:modelValue"],setup(t,{emit:a}){const l=t,u=a,o=V(),n=h({get:()=>l.modelValue,set:e=>{u("update:modelValue",e)}});return B(()=>{var e;l.focus&&((e=o.value)==null||e.focus())}),(e,s)=>(r(),y(v,{label:e.label,error:e.error,required:e.required,"read-only":e.readOnly},{default:f(()=>[_(b("input",{maxlength:"255",name:e.name,ref_key:"input",ref:o,type:"text",placeholder:e.placeholder,"onUpdate:modelValue":s[0]||(s[0]=i=>n.value=i),disabled:e.readOnly},null,8,I),[[q,n.value]])]),_:1},8,["label","error","required","read-only"]))}}),U=["name","disabled"],S=c({__name:"InputPassword",props:{modelValue:{},label:{},error:{},name:{},required:{type:Boolean},readOnly:{type:Boolean},focus:{type:Boolean}},emits:["update:modelValue"],setup(t,{emit:a}){const l=t,u=a,o=V(),n=h({get:()=>l.modelValue,set:e=>{u("update:modelValue",e)}});return B(()=>{var e;l.focus&&((e=o.value)==null||e.focus())}),(e,s)=>(r(),y(v,{label:e.label,error:e.error,required:e.required,"read-only":e.readOnly},{default:f(()=>[_(b("input",{maxlength:"140",name:e.name,ref_key:"input",ref:o,type:"password","onUpdate:modelValue":s[0]||(s[0]=i=>n.value=i),disabled:e.readOnly},null,8,U),[[q,n.value]])]),_:1},8,["label","error","required","read-only"]))}});export{N as _,S as a,v as b};