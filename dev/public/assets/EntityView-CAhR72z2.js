import{e as u}from"./main-CPSzirzt.js";import{C as p}from"./CardWidget-t1ohyxJS.js";import{a as o,o as a,c as l,w as e,b as n,C as i,i as r,t as c,g as f,s as m,l as C,N as g,q as h,O as k}from"./Container-DH2J1Vin.js";const v={class:"title-4"},$=o({__name:"WidgetTitled",props:{title:{}},setup(d){return(t,_)=>(a(),l(p,null,{default:e(()=>[n(i,{class:"titled-container"},{default:e(()=>[r("div",v,c(t.title),1),f(t.$slots,"default")]),_:3})]),_:3}))}}),b=r("div",{class:"title-2 pb-3 pt-2"}," Entities ",-1),y={class:"title-6"},S=o({__name:"EntityView",setup(d){return m(()=>{}),(t,_)=>(a(),l(i,{class:"entities-view-grid"},{default:e(()=>[n(i,null,{default:e(()=>[b]),_:1}),n(i,{class:"entities-grid"},{default:e(()=>[(a(!0),C(k,null,g(h(u).entities,s=>(a(),l($,{onClick:w=>t.$router.push(`/entity/${s.entityId}`),key:s.entityId,title:s.label,class:"entity-card cursor-pointer disable-select"},{default:e(()=>[r("div",y,c(s.description||"No description available."),1)]),_:2},1032,["onClick","title"]))),128))]),_:1})]),_:1}))}});export{S as default};