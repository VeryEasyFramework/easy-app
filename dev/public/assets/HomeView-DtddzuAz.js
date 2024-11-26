import{d as n,o as t,c as r,w as a,e as u,m as d,C as s,p as v,g as $,f as h,q as x,b as o,t as C,s as g,u as m,l as i,_ as w,a as y,v as S,x as B,y as N,T}from"./index-CS0ctzBO.js";import{_ as V}from"./LoaderOverlay.vue_vue_type_style_index_0_lang-CscSw_zg.js";import{M as k,_ as b}from"./ButtonIcon.vue_vue_type_script_setup_true_lang-CJazxrdG.js";const E={class:"side-bar"},z={class:"content p-2"},I=n({__name:"SidebarNavLayout",setup(c){return(e,l)=>(t(),r(s,{class:"side-nav-layout gap-0"},{default:a(()=>[u("div",E,[d(e.$slots,"sidebar")]),u("div",z,[d(e.$slots,"content")])]),_:3}))}}),L={key:0,class:"title-5"},R=n({__name:"HeaderBrand",props:{collapse:{type:Boolean}},setup(c){return(e,l)=>(t(),r(s,{class:"col shrink vertical-align-center cursor-pointer"},{default:a(()=>[l[1]||(l[1]=u("div",{class:"header-logo"},null,-1)),e.collapse?h("",!0):(t(),v("div",L,[d(e.$slots,"default",{},()=>[l[0]||(l[0]=$(" Easy App "))])]))]),_:3}))}}),A={key:0,class:"nav-label pe-3"},p=n({__name:"NavItem",props:{to:{},icon:{},text:{},collapse:{type:Boolean}},setup(c){return(e,l)=>{const _=x("RouterLink");return t(),r(_,{to:e.to,class:"nav-item px-1"},{default:a(()=>[o(g,{class:"col shrink horizontal-align-between"},{default:a(()=>[e.collapse?h("",!0):(t(),v("div",A,C(e.text),1)),u("div",null,[o(k,{icon:e.icon,class:"icon"},null,8,["icon"])])]),_:1})]),_:1},8,["to"])}}}),M=n({__name:"ThemeSwitcher",setup(c){const e=m();return(l,_)=>(t(),r(s,null,{default:a(()=>[o(b,{onClick:i(e).toggleTheme,icon:i(e).theme=="dark"?"light_mode":"dark_mode",color:i(e).theme=="dark"?"warning":"info",class:"flat"},null,8,["onClick","icon","color"])]),_:1}))}}),H=w(M,[["__scopeId","data-v-f9bd81b1"]]),P=n({__name:"NavigatorSide",setup(c){const e=y(!1),l=m();return(_,f)=>(t(),r(g,{class:"vh-100 navigator-side shadow-small"},{default:a(()=>[o(s,{class:S(["brand",{col:!e.value,"horizontal-align-center":e.value}])},{default:a(()=>[o(R,{collapse:e.value},null,8,["collapse"]),o(k,{icon:e.value?"left_panel_open":"left_panel_close",onClick:f[0]||(f[0]=q=>e.value=!e.value),class:"flat"},null,8,["icon"])]),_:1},8,["class"]),o(s,{class:"nav row shrink"},{default:a(()=>[o(p,{collapse:e.value,icon:"person",to:"/entry",text:"Entries"},null,8,["collapse"]),o(p,{collapse:e.value,icon:"settings",to:"/settings",text:"Settings"},null,8,["collapse"]),o(p,{collapse:e.value,icon:"code",to:"/api-explorer",text:"API Explorer"},null,8,["collapse"]),o(p,{collapse:e.value,icon:"network_ping",to:"/realtime",text:"Realtime Explorer"},null,8,["collapse"])]),_:1}),o(s,{class:"bottom"},{default:a(()=>[o(s,{class:"col shrink horizontal-align-between"},{default:a(()=>[o(H),o(b,{color:"error",class:"flat",icon:"logout",label:"Logout",onClick:i(l).logout},null,8,["onClick"])]),_:1})]),_:1})]),_:1}))}}),G=n({__name:"HomeView",setup(c){const e=m();return B(async()=>{}),(l,_)=>(t(),r(N,null,{default:a(()=>[o(I,null,{sidebar:a(()=>[o(P)]),content:a(()=>[o(T)]),_:1}),o(V,{loaded:i(e).booted},null,8,["loaded"])]),_:1}))}});export{G as default};