import{d as c,B as r,o as i,p as d,e as u,t as _,v as f,c as m,w as v,m as h,M as B}from"./index-hlzIjE76.js";const k={class:"choices-field"},C=c({__name:"DisplayChoices",props:{value:{},field:{}},setup(l){const e=l,n=r(()=>{var a,s,o;return((o=(s=(a=e.field)==null?void 0:a.choices)==null?void 0:s.find(t=>t.key==e.value))==null?void 0:o.color)||""}),p=r(()=>{var a,s,o;return((o=(s=(a=e.field)==null?void 0:a.choices)==null?void 0:s.find(t=>t.key==e.value))==null?void 0:o.label)||e.value});return(a,s)=>(i(),d("div",k,[u("div",{class:f({[n.value]:!0})},_(p.value),3)]))}}),b=c({__name:"TransitionList",props:{fade:{type:Boolean}},setup(l){return(e,n)=>(i(),m(B,{name:e.fade?"list-fade":"list"},{default:v(()=>[h(e.$slots,"default")]),_:3},8,["name"]))}});export{C as _,b as a};
