import{a as l,o as r,l as _,g as c,j as d,p as h,K as $,m as b,L as w,M as y,i as u,_ as V,c as f,w as a,b as t,C as i,x as S,I as B,J as C}from"./RootLayout.vue_vue_type_style_index_0_lang-Br_nyGRA.js";import{C as L}from"./CardWidget-N1jG415S.js";import{_ as v,a as I}from"./InputPassword.vue_vue_type_script_setup_true_lang-B2ThDIOm.js";import"./InputWrapper.vue_vue_type_script_setup_true_lang-CwPPx3d0.js";const k=["type"],x=l({__name:"Button",props:{type:{},disabled:{type:Boolean},color:{}},setup(s){return(e,o)=>(r(),_("button",{class:h(["button",{[e.color??"primary"]:e.color}]),type:e.type||"button"},[c(e.$slots,"default",{},()=>[d(" Button ")])],10,k))}}),F=["name"],N=l({__name:"Form",props:{name:{}},emits:["submitted"],setup(s,{emit:e}){return(o,m)=>(r(),_("form",{class:"form",name:o.name,onSubmit:m[0]||(m[0]=$(n=>o.$emit("submitted"),["stop","prevent"]))},[c(o.$slots,"default",{},()=>[d(" Form ")])],40,F))}}),z="/logo.png",E=s=>(w("data-v-0e2e9ced"),s=s(),y(),s),M=E(()=>u("img",{src:z,alt:"logo"},null,-1)),P=[M],U=l({__name:"Logo",props:{width:{},height:{}},setup(s){return(e,o)=>(r(),_("div",{class:"logo",style:b(`width:${e.width||"100px"}`)},P,4))}}),j=V(U,[["__scopeId","data-v-0e2e9ced"]]),q=u("h2",{class:"title"},"Login",-1),A=l({__name:"LoginForm",setup(s){const e={email:"",password:""};function o(){console.log("submitted")}return(m,n)=>(r(),f(i,{class:"center-items"},{default:a(()=>[t(L,{class:"px-5 py-4"},{default:a(()=>[t(i,{class:"center-items row-gap-2"},{default:a(()=>[t(j),q]),_:1}),t(N,{name:"login",onSubmitted:o},{default:a(()=>[t(i,{class:""},{default:a(()=>[t(v,{required:"",focus:"",label:"Email",name:"email",modelValue:e.email,"onUpdate:modelValue":n[0]||(n[0]=p=>e.email=p)},null,8,["modelValue"]),t(I,{label:"Password",name:"password",modelValue:e.password,"onUpdate:modelValue":n[1]||(n[1]=p=>e.password=p)},null,8,["modelValue"]),t(i,{class:"py-4"},{default:a(()=>[t(x,{type:"submit"},{default:a(()=>[d("Login")]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}))}}),J=l({__name:"LoginView",setup(s){return(e,o)=>(r(),f(S,null,{default:a(()=>[t(A)]),_:1}))}}),g=B(J);g.use(C());g.mount("#login");
