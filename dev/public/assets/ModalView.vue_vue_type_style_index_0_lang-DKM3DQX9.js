import{x as u,K as f,d as p,B as C,o as d,c as i,b as m,w as s,C as w,G as _,m as k,g as v,f as y,O as V}from"./index-hlzIjE76.js";import{C as g}from"./CardWidget-Cv_RxGrY.js";import{a as x}from"./ButtonIcon.vue_vue_type_script_setup_true_lang-DedLdgYS.js";const B=e=>e.getModifierState("Control")||e.metaKey,N=(e,a)=>{B(e)&&e.key==="s"&&(e.preventDefault(),a())},h=(e,a)=>{const o=e;u(()=>{document.addEventListener("keydown",o)}),f(()=>{document.removeEventListener("keydown",o)})},S=p({__name:"ModalView",props:{modelValue:{type:Boolean}},emits:["update:modelValue","close"],setup(e,{emit:a}){function o(){l.value=!1,n("close")}const c=e,n=a,l=C({get:()=>c.modelValue,set:t=>{n("update:modelValue",t)}});return h(t=>{t.key==="Escape"&&o()}),(t,r)=>(d(),i(V,{to:"#modals"},[m(x,null,{default:s(()=>[l.value?(d(),i(w,{key:0,onClick:_(o,["self"]),class:"modal-wrapper z-max position-fixed top left vh-100 vw-100 horizontal-align-center vertical-align-center"},{default:s(()=>[m(g,null,{default:s(()=>[k(t.$slots,"default",{},()=>[r[0]||(r[0]=v(" modal "))])]),_:3})]),_:3})):y("",!0)]),_:3})]))}});export{S as _,h as l,N as o};
