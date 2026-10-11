export default (function secureShareWorker() {
  const E=new TextEncoder(),CNAME="otp_share_session",DURATION=2*3600*1000;
  const H={"cache-control":"private, no-store, max-age=0","content-security-policy":"default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'","x-frame-options":"DENY","x-content-type-options":"nosniff","referrer-policy":"no-referrer","strict-transport-security":"max-age=31536000; includeSubDomains"};
  const CSS=":root{color-scheme:dark;font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;background:#080f1c;color:#eaf3ff}*{box-sizing:border-box}body{margin:0;min-height:100vh;background:radial-gradient(ellipse at 95% 2%,#273854 0,transparent 45%),radial-gradient(ellipse at 0% 100%,#163d41 0,transparent 43%),#080f1c}main{width:min(calc(100% - 36px),565px);margin:0 auto;padding:48px 0 80px}header{display:flex;align-items:center;justify-content:space-between;padding:0 0 65px}.logo{font-weight:850;letter-spacing:1px;font-size:20px}.logo b{color:#78e3d2}.pill{font-size:10px;letter-spacing:.06em;color:#a7d7cd;border:1px solid #39546c;border-radius:99px;padding:9px 12px}.tag{color:#9aa3ff;font-size:11px;letter-spacing:2px;font-weight:800;margin-bottom:22px}h1{font-size:clamp(37px,8vw,50px);letter-spacing:-1.7px;line-height:1.16;margin:0 0 19px}p{color:#9caec5;font-size:14px;line-height:1.9}.panel{background:linear-gradient(143deg,#1a283a,#111b2c);border:1px solid #30445a;border-radius:20px;padding:30px;margin-top:30px;box-shadow:0 15px 60px #0004}.panel h2{margin:0 0 10px;font-size:22px}.lbl{color:#b4c8da;font-weight:700;font-size:12px;display:block;margin:25px 0 9px}input{font:inherit;background:#081523;border:1px solid #3e536a;border-radius:10px;padding:15px;color:#fff;width:100%}input:focus{outline:2px solid #73d8c6;outline-offset:2px}button{font:inherit;cursor:pointer}.submit{display:block;background:linear-gradient(100deg,#81dfd0,#9aabfd);border:0;color:#0d2232;border-radius:10px;padding:15px;width:100%;margin-top:18px;font-weight:800}.fine{color:#8da0b6;font-size:12px;line-height:1.8}.error{color:#f6aea4}.small{font-size:12px;color:#9aadc5}.help{margin-top:24px;padding:20px;border:1px solid #3a4c5f;border-radius:13px;background:#18263775}.help b{font-size:13px}.steps{line-height:2.1;font-size:13px;color:#a6bdd2;padding-left:22px}.steps code,.fine code{color:#a6e4d6;overflow-wrap:anywhere}.row{display:flex;align-items:center;justify-content:space-between;gap:10px}.name{font-size:12px;letter-spacing:.11em;color:#a4bad0;font-weight:750}.number{font-variant-numeric:tabular-nums;font-size:clamp(42px,11vw,70px);font-weight:900;letter-spacing:.06em;white-space:nowrap;margin:27px 0}.track{height:5px;background:#334255;border-radius:4px;overflow:hidden}.bar{height:100%;background:linear-gradient(90deg,#7b97ff,#80e0ce);width:0}.copy{border:1px solid #4b696d;color:#bbfff0;background:#203b45;padding:10px 16px;border-radius:9px;font-size:12px;font-weight:700}.copy:disabled{opacity:.5;cursor:not-allowed}.quiet{background:none;color:#95b1bf;border:0;font-size:12px;text-decoration:underline}.foot{margin-top:30px;text-align:center;color:#72859a;font-size:11px}#toast{position:fixed;bottom:22px;left:50%;background:#e7fff6;color:#20382f;padding:11px 18px;border-radius:10px;transform:translate(-50%,65px);opacity:0;transition:.2s}#toast.visible{transform:translate(-50%,0);opacity:1}@media(max-width:600px){header{padding-bottom:48px}.panel{padding:22px}.number{font-size:45px}}";
  const JS="(()=>{const code=document.getElementById('code');if(!code)return;const bar=document.getElementById('bar'),seconds=document.getElementById('seconds'),copy=document.getElementById('copy'),state=document.getElementById('state');let offset=0,expires=0,digits='',period=30,loading=false,last=0;async function refresh(){if(loading||Date.now()-last<900)return;last=Date.now();loading=true;const start=Date.now();try{const r=await fetch('/api/token',{credentials:'same-origin',cache:'no-store'});if(r.status===401){location.reload();return}if(!r.ok)throw Error('Unavailable');const data=await r.json();if(!/^\\d{6,8}$/.test(data.code)||!Number.isFinite(data.validUntil))throw Error('Malformed');offset=data.serverTime+(Date.now()-start)/2-Date.now();expires=data.validUntil;digits=data.code;period=data.period;code.textContent=digits.slice(0,Math.ceil(digits.length/2))+' '+digits.slice(Math.ceil(digits.length/2));state.textContent='连接正常 · 已验证';state.classList.remove('error')}catch{digits='';code.textContent='--- ---';state.textContent='连接失败 · 正在重新连接';state.classList.add('error')}finally{loading=false}}function tick(){const rem=Math.max(0,expires-Date.now()-offset);seconds.textContent=expires?Math.ceil(rem/1000)+' 秒后刷新':'同步中';bar.style.width=rem/(period*1000)*100+'%';copy.disabled=!digits||rem<500;if((!digits||rem<1100)&&!loading)refresh()}copy.addEventListener('click',async()=>{if(copy.disabled)return;try{await navigator.clipboard.writeText(digits);const toast=document.getElementById('toast');toast.textContent='验证码已复制';toast.classList.add('visible');setTimeout(()=>toast.classList.remove('visible'),1600)}catch{state.textContent='无法自动复制，请手动复制'}});refresh();setInterval(tick,180);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()})})();";
  const response=(body,status=200,type="text/html; charset=utf-8",more={})=>new Response(body,{status,headers:{...H,"content-type":type,...more}});
  const escape=s=>String(s).replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
  function decodeBase32(s){
    const val=s.replace(/[\s-]/g,"").replace(/=+$/,"").toUpperCase();
    if(val.length<16||val.length>512||/[^A-Z2-7]/.test(val))throw Error("Invalid TOTP seed");
    let bits=0,buf=0;const out=[];
    for(const c of val){const v=c>="A"&&c<="Z"?c.charCodeAt(0)-65:c.charCodeAt(0)-50+26;buf=(buf<<5)|v;bits+=5;if(bits>=8){bits-=8;out.push((buf>>>bits)&255);buf&=(1<<bits)-1;}}
    if(out.length<10)throw Error("Too short");return new Uint8Array(out);
  }
  function parseTOTP(s){
    let seed=s.trim(),period=30,digits=6,hash="SHA-1";
    if(/^otpauth:/i.test(seed)){
      const u=new URL(seed);
      if(u.protocol!=="otpauth:"||u.hostname.toLowerCase()!=="totp")throw Error("Only TOTP");
      seed=u.searchParams.get("secret")||"";
      if(u.searchParams.has("period"))period=Number(u.searchParams.get("period"));
      if(u.searchParams.has("digits"))digits=Number(u.searchParams.get("digits"));
      if(u.searchParams.has("algorithm"))hash=({"SHA1":"SHA-1","SHA256":"SHA-256","SHA512":"SHA-512"})[(u.searchParams.get("algorithm")||"").toUpperCase().replace(/-/g,"")];
    }
    if(![30,60,120].includes(period)||![6,8].includes(digits)||!hash)throw Error("Unsupported TOTP parameter");
    return {key:decodeBase32(seed),period,digits,hash};
  }
  async function otp(src,time){
    const step=BigInt(Math.floor(time/(src.period*1000)));let n=step;const bytes=new Uint8Array(8);
    for(let i=7;i>=0;i--){bytes[i]=Number(n&255n);n>>=8n;}
    const k=await crypto.subtle.importKey("raw",src.key,{name:"HMAC",hash:src.hash},false,["sign"]);
    const b=new Uint8Array(await crypto.subtle.sign("HMAC",k,bytes)),j=b[b.length-1]&15;
    const v=(b[j]&127)*16777216+(b[j+1]<<16)+(b[j+2]<<8)+b[j+3];
    return {code:String(v%10**src.digits).padStart(src.digits,"0"),period:src.period,validUntil:(Math.floor(time/(src.period*1000))+1)*src.period*1000,serverTime:time};
  }
  function ready(env){
    if(typeof env?.FRIEND_PASSWORD!=="string"||env.FRIEND_PASSWORD.length<16||typeof env?.TOTP_SECRET!=="string"||!env.TOTP_SECRET.trim())return "missing";
    try{parseTOTP(env.TOTP_SECRET);return "ready";}catch{return "invalid";}
  }
  function enc64(b){return btoa(String.fromCharCode(...b)).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_");}
  function dec64(s){if(s.length>500||!/^[a-zA-Z0-9_-]+$/.test(s))return null;try{return Uint8Array.from(atob(s.replace(/-/g,"+").replace(/_/g,"/")+"===".slice((s.length+3)%4)),c=>c.charCodeAt(0));}catch{return null;}}
  async function signKey(p){return crypto.subtle.importKey("raw",E.encode("otp-share:v1:"+p),{name:"HMAC",hash:"SHA-256"},false,["sign","verify"]);}
  async function issueCookie(pass){
    const message="v1:"+String(Date.now()+DURATION)+":"+enc64(crypto.getRandomValues(new Uint8Array(16)));
    return enc64(E.encode(message))+"."+enc64(new Uint8Array(await crypto.subtle.sign("HMAC",await signKey(pass),E.encode(message))));
  }
  async function authenticated(req,pass){
    const match=(req.headers.get("cookie")||"").match(/(?:^|;\s*)otp_share_session=([^;]+)/);if(!match||match[1].length>300)return false;
    const p=match[1].split(".");if(p.length!==2)return false;
    const msg=dec64(p[0]),sig=dec64(p[1]);if(!msg||!sig||sig.length!==32)return false;
    const parts=new TextDecoder().decode(msg).split(":");if(parts.length!==3||parts[0]!=="v1"||! /^\d{13}$/.test(parts[1]))return false;
    const deadline=Number(parts[1]);if(deadline<=Date.now()||deadline>Date.now()+DURATION)return false;
    return crypto.subtle.verify("HMAC",await signKey(pass),sig,msg);
  }
  async function equalHash(a,b){
    const ah=new Uint8Array(await crypto.subtle.digest("SHA-256",E.encode(a))),bh=new Uint8Array(await crypto.subtle.digest("SHA-256",E.encode(b)));let result=0;for(let i=0;i<32;i++)result|=ah[i]^bh[i];return result===0;
  }
  function page(content,badge="私人访问"){
    return '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#080f1c"><title>共享动态验证码 · OTP SHARE</title><link rel="stylesheet" href="/styles.css"><script defer src="/app.js"></script></head><body><main><header><span class="logo">OTP<b>·SHARE</b></span><span class="pill">'+badge+'</span></header>'+content+'<div class="foot">仅授权的朋友可以查看 · 不对外提供原始密钥</div></main><div id="toast" role="status"></div></body></html>';
  }
  function setup(invalid){
    return page('<div class="tag">OWNER CONFIGURATION</div><h1>网站已锁定<br>等待配置令牌</h1><p>公开演示验证码已停用。未配置授权信息时，任何访客都看不到真实的验证码。</p><section class="panel"><h2>管理员配置指南</h2><p>Cloudflare → Workers & Pages → 2fa → Settings → Variables and Secrets，新增下面两个类型为 Secret 的变量：</p><ol class="steps"><li><code>FRIEND_PASSWORD</code>：至少16字符的随机访问密码，私下发给朋友。</li><li><code>TOTP_SECRET</code>：指定应用的 Base32 密钥或 <code>otpauth://totp/...</code> URI。</li></ol><p class="fine">请勿在聊天、GitHub 或公开 URL 中填写密钥。Google Authenticator 的迁移二维码并非普通 otpauth URI，需要获取目标应用的原始设置密钥。</p>'+(invalid?'<p class="error">检测到令牌格式无效，请核实 TOTP 设置参数。</p>':'')+'</section>',"未启用");
  }
  function login(wrong){
    return page('<div class="tag">FRIENDS ACCESS</div><h1>分享指定应用的<br>动态验证码</h1><p>仅限获得网站所有者授权的朋友。请使用私下提供的访问密码登录。</p><section class="panel"><h2>输入访问密码</h2><form action="/login" method="post"><label class="lbl" for="pwd">访问密码</label><input id="pwd" type="password" name="password" required maxlength="256" autocomplete="current-password"><button class="submit" type="submit">查看动态验证码 →</button></form>'+(wrong?'<p class="error">访问密码不正确，请重试。</p>':'')+'<p class="fine">切勿在公共电脑保存密码，也不要将验证码传播给未授权的人。</p></section>');
  }
  function view(name){
    return page('<div class="tag">AUTHENTICATOR / TOTP</div><h1>当前动态验证码</h1><p>此页面只展示一个指定应用的临时验证码；不会展示、传输给访客或允许导出生成验证码的原始密钥。</p><section class="panel"><div class="row"><span class="name">'+escape(name)+'</span><span class="pill">TOTP</span></div><div id="code" class="number">--- ---</div><div class="track"><div class="bar" id="bar"></div></div><div class="row" style="margin-top:20px"><span id="seconds" class="small">同步中</span><button class="copy" id="copy" disabled>复制验证码</button></div><p id="state" class="fine">正在同步服务器时间…</p></section><div class="help"><b>安全提醒</b><p>获得动态验证码并持有该账户密码的人可能登录账户。请仅与明确获得授权的朋友分享。</p></div><form method="post" action="/logout" style="text-align:right;margin-top:20px"><button class="quiet" type="submit">退出登录</button></form>');
  }
  return {async fetch(request,env={}){
    const method=request.method,path=new URL(request.url).pathname;
    if(path==="/favicon.ico")return new Response(null,{status:204,headers:H});
    if(method==="GET"&&path==="/styles.css")return response(CSS,200,"text/css; charset=utf-8");
    if(method==="GET"&&path==="/app.js")return response(JS,200,"application/javascript; charset=utf-8");
    const status=ready(env);
    if(status!=="ready")return method==="GET"&&path==="/"?response(setup(status==="invalid"),503):response("Not configured",503,"text/plain");
    if(method==="POST"&&(path==="/login"||path==="/logout")){
      const origin=request.headers.get("origin");if(origin&&origin!==new URL(request.url).origin)return response("Forbidden",403,"text/plain");
      if(path==="/logout")return response(null,303,"text/plain",{"location":"/","set-cookie":CNAME+"=; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=0"});
      if(Number(request.headers.get("content-length")||0)>2048)return response("Request too large",413,"text/plain");
      let form;try{form=await request.formData();}catch{return response(login(true),400);}
      const pass=form.get("password");
      if(typeof pass!=="string"||pass.length>256||!await equalHash(pass,env.FRIEND_PASSWORD))return response(login(true),401);
      const cookie=await issueCookie(env.FRIEND_PASSWORD);
      return response(null,303,"text/plain",{"location":"/","set-cookie":CNAME+"="+cookie+"; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age="+DURATION/1000});
    }
    if(method!=="GET")return response("Method not allowed",405,"text/plain",{"allow":"GET, POST"});
    const authorized=await authenticated(request,env.FRIEND_PASSWORD);
    if(path==="/")return response(authorized?view(typeof env.TOKEN_LABEL==="string"?env.TOKEN_LABEL.slice(0,70):"共享应用"):login(false));
    if(path==="/api/token"){
      if(!authorized)return response(JSON.stringify({error:"unauthorized"}),401,"application/json");
      try{return response(JSON.stringify(await otp(parseTOTP(env.TOTP_SECRET),Date.now())),200,"application/json");}
      catch{return response(JSON.stringify({error:"invalid configuration"}),503,"application/json");}
    }
    return response("Not found",404,"text/plain");
  }};
})();
