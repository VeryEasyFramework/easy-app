import{d,o as a,c as n,w as e,b as i,C as r,e as o,t as c,m as u,x as _,p as f,z as m,l as y,F as g,A as C}from"./index-CS0ctzBO.js";import{C as k}from"./CardWidget-CZble4Vm.js";const v={class:"title-4"},$=d({__name:"WidgetTitled",props:{title:{}},setup(p){return(t,l)=>(a(),n(k,null,{default:e(()=>[i(r,{class:"titled-container"},{default:e(()=>[o("div",v,c(t.title),1),u(t.$slots,"default")]),_:3})]),_:3}))}}),b={class:"title-6"},B=d({__name:"EntryView",setup(p){return _(()=>{}),(t,l)=>(a(),n(r,{class:"entries-view-grid"},{default:e(()=>[i(r,null,{default:e(()=>l[0]||(l[0]=[o("div",{class:"title-2 pb-3 pt-2"}," Entry Types ",-1)])),_:1}),i(r,{class:"entries-grid"},{default:e(()=>[(a(!0),f(g,null,m(y(C).list(),s=>(a(),n($,{onClick:T=>t.$router.push(`/entry/${s.entryType}`),key:s.entryType,title:s.config.label,class:"entry-card cursor-pointer disable-select"},{default:e(()=>[o("div",b,c(s.config.description||"No description available."),1)]),_:2},1032,["onClick","title"]))),128))]),_:1})]),_:1}))}});export{B as default};
