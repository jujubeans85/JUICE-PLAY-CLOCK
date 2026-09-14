/* Per-recipient configuration. BOSS shares the same clock and assets. */
(() => {
 const params=new URLSearchParams(location.search);
 const boss=(params.get('for')||'').trim().toUpperCase()==='BOSS'||params.get('edition')==='boss';
 window.JUICE_PLAY=Object.freeze({title:boss?'BOSS.':'Clock.',subtitle:boss?'A clock. A quiz. Some deeply weird facts.':'A little time to play.',dedication:boss?'A little weirdness, with love.':'Made with love. Dad.',defaultSkin:'citrus',default24Hour:false,bossEdition:boss,storagePrefix:boss?'juice-play:boss:':'juice-play:'});
 if(boss){document.body.dataset.edition='boss';document.querySelector('.wordmark').href='./?for=BOSS';document.querySelector('link[rel=manifest]').href='./boss.webmanifest';}
})();
