import{a as t,o as a,c as n,w as l,l as s,h as i,t as r,i as o,g as p,p as d,C as c}from"./RootLayout.vue_vue_type_style_index_0_lang-C7NduuQ-.js";const m={key:0,class:"text-small pb-1"},u={key:0,class:"ps-1 text-error"},y={key:1,class:"error-message bold italic"},_={key:2,class:"description italic bold"},B=t({__name:"InputWrapper",props:{label:{},error:{},required:{type:Boolean},readOnly:{type:Boolean},description:{}},setup(b){return(e,h)=>(a(),n(c,{class:d(["input grid-gap-0",{readonly:e.readOnly}]),rows:["max-content","max-content","minmax(1rem,max-content)"]},{default:l(()=>[e.label?(a(),s("label",m,[i("span",null,r(e.label),1),e.required?(a(),s("span",u,"*")):o("",!0)])):o("",!0),p(e.$slots,"default"),e.error?(a(),s("div",y,r(e.error),1)):e.description?(a(),s("div",_,r(e.description),1)):o("",!0)]),_:3},8,["class"]))}});export{B as _};