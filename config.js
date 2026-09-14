/* Per-recipient configuration. BOSS shares the same clock and assets. */
(() => {
 const params=new URLSearchParams(location.search);
 const boss=(params.get('for')||'').trim().toUpperCase()==='BOSS'||params.get('edition')==='boss';
 window.JUICE_PLAY=Object.freeze({title:boss?'BOSS.':'Clock.',subtitle:boss?'A clock. A quiz. Some deeply weird facts.':'A little time to play.',dedication:boss?'A little weirdness, with love.':'Made with love. Dad.',defaultSkin:boss?'violet':'citrus',default24Hour:false,bossEdition:boss,storagePrefix:boss?'juice-play:boss:':'juice-play:'});
 if(boss){const violet=document.createElement('label');violet.innerHTML='<input type="radio" name="skin" value="violet"><span class="swatch violet"></span><span>BOSS</span>';document.querySelector('.skins').prepend(violet);document.querySelector('link[rel=apple-touch-icon]').href='./boss-icon-192.png';document.querySelector('link[rel=icon]').href='./boss-icon.svg';document.querySelector('meta[name=apple-mobile-web-app-title]').content='BOSS';document.body.dataset.edition='boss';document.querySelector('.wordmark').href='./?for=BOSS';document.querySelector('link[rel=manifest]').href='./boss.webmanifest';}
})();
