Google Ad Manager — Rewarded Video (web) integration (concise)

1) Overview
- We'll use a VAST ad tag from Google Ad Manager (GAM) and the Google IMA JS SDK.
- This repo exposes `window.CVCraftRewardedAd.show()` (initialized from `client/src/components/ads/initRewardedAd.js`).
- Configure a GAM rewarded ad unit and supply its VAST ad tag URL via Vite env: `VITE_GAM_REWARDED_TAG`.

2) Steps in Google Ad Manager
- In GAM, create a new Ad Unit of type "Rewarded" or a video unit.
- Create a line item with video creatives (VAST) and target inventory.
- In the inventory UI, generate a VAST ad tag for the rewarded line item (copy the ad tag URL).
- Optionally use a dedicated "rewarded" key/value if you need custom targeting.

3) Configure this app
- In the client project, add the Vite env variable:
  - Create `.env` (or set in Vercel):
    VITE_GAM_REWARDED_TAG="<YOUR_VAST_TAG_URL>"
- Rebuild/deploy so `import.meta.env.VITE_GAM_REWARDED_TAG` is available to the browser.

4) How the code uses it
- On startup `initRewardedAd()` attaches `window.CVCraftRewardedAd.show()`.
- When invoked, it tries to load `https://imasdk.googleapis.com/js/sdkloader/ima3.js` and request the VAST tag.
- If the SDK or tag fail, the code falls back to a 60-second simulated view (this matches your 1-minute requirement).
- The IMA path attempts to verify the ad `COMPLETE` event and also enforces a 60s minimum watch time before returning success.

5) Testing locally
- Use a test VAST tag (GAM or a public VAST test tag). Example test tag:
  - https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/4765139/example&impl=s&gdfp_req=1&env=vp&output=vast
- Run the dev server and open Export > Watch Ad. The ad will appear in an overlay if the tag works.

6) Production notes
- GAM must allow the site origin and adhere to cross-domain/SSL settings.
- Verify Vercel/CSP and that ad tag URLs are reachable from the deployed domain.
- Monitor eCPM and fill — add fallback for no-fill (we already fall back to the 60s wait; consider offering a paid unlock as alternate).

7) Next steps I can implement for you (optional)
- Show a loading state and nicer UI for the ad overlay.
- Add server-side verification (if your ad network provides receipts) and persistent unlocks.
- Replace the 60s fallback with a short unskippable rewarded creative gating if you obtain a guaranteed VAST.
