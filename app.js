(() => {
 'use strict';
 const $=id=>document.getElementById(id),config=window.JUICE_PLAY;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(config.storagePrefix+k))??f}catch{return f}};
 const save=(k,v)=>{try{localStorage.setItem(config.storagePrefix+k,JSON.stringify(v))}catch{}};
 let use24=read('24h',config.default24Hour),sound=false,audio,skin=read('skin',config.defaultSkin),lastMinute='',lastSecond=-1;
 let rotation=0,velocity=0,drag=null,frame=0,lastFrame=0,tilt=0;
 const clock=$('clock'),hours=$('hours'),minutes=$('minutes'),orbit=$('orbit');
 $('app-title').textContent=config.title;$('subtitle').textContent=config.subtitle;
 const recipient=new URLSearchParams(location.search).get('for');
 $('dedication').textContent=recipient?'For '+recipient.slice(0,60)+'. '+config.dedication:config.dedication;
 document.title='JUICE Play · '+config.title.replace(/\.$/,'');
 function applySkin(value){skin=['citrus','night','candy',...(config.bossEdition?['violet']:[])].includes(value)?value:'citrus';document.body.dataset.skin=skin;document.querySelectorAll('[name=skin]').forEach(el=>el.checked=el.value===skin);document.querySelector('meta[name=theme-color]').content={citrus:'#fff1e2',night:'#171a23',candy:'#f7e7f2',violet:'#eee5ff'}[skin];save('skin',skin);document.dispatchEvent(new CustomEvent('juice:skin',{detail:{skin}}))}
 applySkin(skin);
 const tickFragment=document.createDocumentFragment();
 for(let i=0;i<60;i++){const tick=document.createElement('span');tick.className='tick'+(i%5===0?' major':'');tick.style.transform='rotate('+i*6+'deg)';tickFragment.append(tick)}$('ticks').append(tickFragment);
 const resize=()=>{$('ticks').style.setProperty('--tick-radius',$('ticks').clientHeight/2+'px')};new ResizeObserver(resize).observe(clock);resize();
 function tone(frequency=440,duration=.055){if(!sound)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume().catch(()=>{});const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.setValueAtTime(frequency,audio.currentTime);o.frequency.exponentialRampToValueAtTime(frequency*.65,audio.currentTime+duration);g.gain.setValueAtTime(.0001,audio.currentTime);g.gain.exponentialRampToValueAtTime(.045,audio.currentTime+.008);g.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+duration);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+duration+.02)}catch{sound=false;$('sound').setAttribute('aria-pressed','false');$('announcement').textContent='Sound is unavailable in this browser.'}}
 function pop(el){if(reduced.matches)return;el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop')}
 function updateTime(){const now=new Date(),h=now.getHours(),m=now.getMinutes(),s=now.getSeconds();
 const hour=String(use24?h:(h%12||12)).padStart(2,'0'),minute=String(m).padStart(2,'0');
 if(hours.textContent!==hour){hours.textContent=hour;pop(hours)}if(minutes.textContent!==minute){minutes.textContent=minute;pop(minutes)}
 $('period').textContent=use24?'':h>=12?'PM':'AM';$('seconds').textContent=String(s).padStart(2,'0');
 $('date').textContent=new Intl.DateTimeFormat(undefined,{weekday:'long',day:'numeric',month:'long'}).format(now).toUpperCase();
 $('accessible-time').dateTime=now.toISOString();$('accessible-time').textContent=new Intl.DateTimeFormat(undefined,{hour:'numeric',minute:'2-digit',second:'2-digit',hour12:!use24}).format(now);
 const day=(h*3600+m*60+s)/86400*100;$('day-fill').style.width=day+'%';$('day-bead').style.left=day+'%';
 $('format').textContent=use24?'24h':'12h';$('format').setAttribute('aria-label','Use '+(use24?'12':'24')+' hour time');
 if(lastMinute&&lastMinute!==h+':'+m)tone(660,.16);lastMinute=h+':'+m;
 lastSecond=s;
 }
 function render(t){if(document.hidden){frame=0;return}const dt=Math.min((t-lastFrame)/16.667||1,2);lastFrame=t;
 if(!drag){velocity+=(-rotation*.024-velocity*.16)*dt;rotation+=velocity*dt;tilt*=Math.pow(.84,dt);if(Math.abs(rotation)<.015&&Math.abs(velocity)<.015){rotation=0;velocity=0}}
 clock.style.transform=reduced.matches?'none':'rotateZ('+rotation+'deg) rotateY('+tilt+'deg)';
 const now=new Date();orbit.style.transform='rotate('+((now.getSeconds()+(reduced.matches?0:now.getMilliseconds()/1000))*6)+'deg)';
 frame=requestAnimationFrame(render);
 }
 function start(){if(!frame&&!document.hidden){lastFrame=performance.now();frame=requestAnimationFrame(render)}}
 function release(){if(!drag)return;drag=null;clock.style.touchAction='pan-y';tone(380,.09);$('hint').textContent='Spin it. Time comes back.';start()}
 clock.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY,previous:e.clientX,time:performance.now(),moved:false};clock.setPointerCapture(e.pointerId);velocity=0});
 clock.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.previous,dy=e.clientY-drag.y;if(!drag.moved&&Math.abs(dy)>12&&Math.abs(e.clientX-drag.x)<12){release();return}if(Math.abs(e.clientX-drag.x)>5)drag.moved=true;if(drag.moved){rotation=Math.max(-140,Math.min(140,rotation+dx*.65));velocity=dx*.6;tilt=Math.max(-14,Math.min(14,(e.clientX-drag.x)*.06));$('hint').textContent='Let go. Back to now.'}drag.previous=e.clientX});
 clock.addEventListener('pointerup',()=>{if(drag&&!drag.moved)bounce();release()});clock.addEventListener('pointercancel',release);clock.addEventListener('lostpointercapture',release);
 function bounce(){tone(520,.12);if(!reduced.matches){rotation=-13;velocity=5;pop(hours);pop(minutes);start()}else{$('announcement').textContent='The time is '+$('accessible-time').textContent}}
 $('play').addEventListener('click',bounce);
 $('format').addEventListener('click',()=>{use24=!use24;save('24h',use24);tone();updateTime()});
 $('sound').addEventListener('click',()=>{sound=!sound;$('sound').setAttribute('aria-pressed',String(sound));$('sound').setAttribute('aria-label',sound?'Turn sound off':'Turn sound on');if(sound)tone(660,.15)});
 document.querySelectorAll('[name=skin]').forEach(input=>input.addEventListener('change',()=>{applySkin(input.value);tone(520,.08);bounce()}));
 $('zone').addEventListener('click',()=>{const tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'Device time';$('zone').textContent=$('zone').textContent==='LOCAL TIME'?tz.replaceAll('_',' ').toUpperCase():'LOCAL TIME'});
 let installPrompt;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e});
 function installed(){return matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}if(installed())$('install').hidden=true;
 window.addEventListener('appinstalled',()=>{$('install').hidden=true;installPrompt=null});
 $('install').addEventListener('click',async()=>{if(installPrompt){await installPrompt.prompt();const result=await installPrompt.userChoice;if(result.outcome==='accepted')$('install').hidden=true;installPrompt=null;return}const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);$('install-instructions').textContent=ios?'Open this page in Safari. Tap Share, then Add to Home Screen, then Add.':'Open your browser menu and choose Install app or Add to Home Screen. In Safari on Mac, choose File → Add to Dock.';$('install-dialog').showModal()});
 $('install-dialog').addEventListener('click',e=>{if(e.target===$('install-dialog'))$('install-dialog').close()});
 window.JuiceClock=Object.freeze({setSkin:applySkin,bounce,tone});
 updateTime();let timer=setInterval(updateTime,250);start();
 document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInterval(timer);cancelAnimationFrame(frame);frame=0;drag=null;if(audio)audio.suspend().catch(()=>{})}else{updateTime();timer=setInterval(updateTime,250);rotation=velocity=tilt=0;start()}});
 if('serviceWorker'in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
})();
