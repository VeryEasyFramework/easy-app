import{d as _,u as g,r as y,a as i,j as V,o as C,c as k,w as e,C as o,k as b,b as a,e as x,g as f,l as B,h as q,n as N,i as p}from"./index-CQnUWCV4.js";import{_ as m,a as w}from"./Button.vue_vue_type_script_setup_true_lang-1s5_nbt9.js";import{_ as R}from"./FormBase.vue_vue_type_script_setup_true_lang-g0x0dRxx.js";import{C as S}from"./CardWidget-BgBev2dT.js";const z=_({__name:"ResetPasswordView",setup(E){const c=g(),r=y({confirmPassword:"",password:""}),n=i(),P=b(),t=i(""),l=i("");V(async()=>{n.value=P.query.token,n.value||await c.logout()});async function v(){if(t.value="",l.value="",!r.password){t.value="Password is required";return}if(!r.confirmPassword){l.value="Please confirm your password";return}if(r.password!==r.confirmPassword){l.value="Passwords do not match";return}t.value="";const u=await q.call("auth","setNewPassword",{token:n.value,password:r.password});u.status==="success"&&(N({message:u.status}),await p.push({name:"login"}))}return(u,s)=>(C(),k(o,{class:"row horizontal-align-center vertical-align-center"},{default:e(()=>[a(S,{class:"px-5 py-4"},{default:e(()=>[a(o,{class:"row-gap-5"},{default:e(()=>[a(o,{class:"header row-gap-2"},{default:e(()=>s[3]||(s[3]=[x("div",{class:"title-4"}," Reset Your Password ",-1)])),_:1}),a(R,{name:"login",onSubmitted:v},{default:e(()=>[a(o,{class:"px-3 row-gap-3"},{default:e(()=>[a(m,{label:"Password",required:"",placeholder:"Enter your password...",name:"password",error:t.value,modelValue:r.password,"onUpdate:modelValue":s[0]||(s[0]=d=>r.password=d)},null,8,["error","modelValue"]),a(m,{label:"Confirm Password",required:"",error:l.value,placeholder:"Confirm your password...",name:"confirmPassword",modelValue:r.confirmPassword,"onUpdate:modelValue":s[1]||(s[1]=d=>r.confirmPassword=d)},null,8,["error","modelValue"]),a(o,{class:"py-4"},{default:e(()=>[a(w,{type:"submit"},{default:e(()=>s[4]||(s[4]=[f("Reset Password")])),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),a(o,{class:"row justify-center"},{default:e(()=>[a(w,{type:"button",class:"flat",onClick:s[2]||(s[2]=()=>B(p).push({name:"login"}))},{default:e(()=>s[5]||(s[5]=[f(" Back to Login ")])),_:1})]),_:1})]),_:1})]),_:1}))}});export{z as default};
