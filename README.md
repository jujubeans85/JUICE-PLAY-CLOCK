# JUICE Play — Clock

A free, dependency-free clock PWA with tactile animation, three colour skins, optional sound and native link sharing.

## Open and share

Once GitHub Pages is enabled, open https://jujubeans85.github.io/JUICE-PLAY-CLOCK/

Tap **Share clock** in Safari on iPhone, iPad or Mac, then choose **AirDrop** or **Messages** in the system share sheet. Available targets depend on your device settings. Browsers without native sharing get a copy-link fallback. This shares the website link, not a native app installer.

Use **Keep this clock** for Home Screen installation instructions. Offline use requires an online visit and retained browser cache.

## GitHub Pages

In **Settings → Pages**, choose **Deploy from a branch → main → /(root)** and Save. The source files are at the repository root; no build or external dependencies are needed.

## Reuse

Edit `config.js` for title, subtitle, dedication and defaults. Add `?for=ChloBo` to a link for a personal dedication. Reuse the shell, colour tokens and interaction patterns for future gift apps. A new weather or traffic app needs its own verified real data source.

Update the manifest identity for each new app, and change the service-worker cache name whenever assets change. Keep one authoritative repository per app.

## Files

- `index.html` — application shell
- `config.js` — per-gift settings
- `style.css` — skins and responsive styling
- `app.js` — device time, spring motion, optional sound and installation guidance
- `share.js` — native sharing and copy fallback
- `sw.js`, manifest and icons — offline use and installation

## Behaviour

The actual time comes from the device clock and timezone. Spinning changes only the animation, never the displayed time. Reduced motion is respected. Animation pauses when the page is hidden. Sound starts only after a tap. Preferences stay on the device.

No ChatGPT hosting dependency, accounts, paid APIs or subscriptions. This is a web app, not a native Home Screen widget or Watch app.

Original implementation inspired by the playful everyday utilities of Not Boring Software. No affiliation or copied proprietary assets.
