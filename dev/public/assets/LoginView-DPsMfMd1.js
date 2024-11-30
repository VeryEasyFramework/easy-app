import{d as y,u as h,r as g,a as d,o as c,c as p,w as a,b as s,C as l,e as S,t as m,f as x,g as v,h as P,n as L,i as k}from"./index-CS0ctzBO.js";import{_ as E}from"./InputData.vue_vue_type_script_setup_true_lang-D720uB00.js";import{_ as $,a as b}from"./Button.vue_vue_type_script_setup_true_lang-BTGI5PMB.js";import{C as q}from"./CardWidget-CZble4Vm.js";import{_ as B}from"./FormBase.vue_vue_type_script_setup_true_lang-D9V7oIsE.js";const N={class:"title-3"},A=y({__name:"LoginForm",setup(V){const n=h(),e=g({email:"",password:""}),o=g({email:"",password:""}),f=d("Login"),r=d(!1);async function _(){e.password="",r.value=!r.value,f.value=r.value?"Reset Password":"Login"}const t=d(!1);async function C(){if(o.email="",o.password="",!e.email){o.email="Email is required";return}if(r.value){t.value=!0;const w=await P.call("auth","resetPassword",{email:e.email});L({message:w.message,type:"success"}),t.value=!1,await _()}if(!e.password){o.password="Password is required";return}t.value=!0,await n.login(e.email,e.password),t.value=!1,n.isAuthenticated&&await k.push({name:"home"})}return(w,i)=>(c(),p(q,{class:"px-5 py-4"},{default:a(()=>[s(l,{class:"row-gap-5"},{default:a(()=>[s(l,{class:"header horizontal-align-center row-gap-2"},{default:a(()=>[S("div",N,m(f.value),1)]),_:1}),s(B,{name:"login",onSubmitted:C},{default:a(()=>[s(l,{class:"px-3 row-gap-3"},{default:a(()=>[s(E,{label:"Email",placeholder:"Enter your email...",required:"",focus:"",edit:"",name:"email",error:o.email,modelValue:e.email,"onUpdate:modelValue":i[0]||(i[0]=u=>e.email=u)},null,8,["error","modelValue"]),r.value?x("",!0):(c(),p($,{key:0,label:"Password",required:"",placeholder:"Enter your password...",edit:"",name:"password",error:o.password,modelValue:e.password,"onUpdate:modelValue":i[1]||(i[1]=u=>e.password=u)},null,8,["error","modelValue"])),s(l,{class:"py-4"},{default:a(()=>[s(b,{type:"submit",disabled:t.value},{default:a(()=>[v(m(t.value?"Submitting...":r.value?"Send Reset Email":"Login"),1)]),_:1},8,["disabled"])]),_:1})]),_:1})]),_:1})]),_:1}),s(l,{class:"row justify-center"},{default:a(()=>[s(b,{disabled:t.value,type:"button",class:"flat",onClick:_},{default:a(()=>[v(m(t.value?"Submitting...":r.value?"Back to Login":"Forgot Password"),1)]),_:1},8,["disabled"])]),_:1})]),_:1}))}}),D=y({__name:"LoginView",setup(V){return h(),(n,e)=>(c(),p(l,{class:"row horizontal-align-center vertical-align-center"},{default:a(()=>[s(A)]),_:1}))}});export{D as default};
