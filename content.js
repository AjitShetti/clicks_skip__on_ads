const SKIP_SELECTORS = [
  ".ytp-skip-ad-button",
  ".ytp-ad-skip-button",
  ".ytp-ad-skip-button-modern",
  ".ytp-ad-skip-button-slot",
  "[class*='skip-ad']",
  "[class*='skip_ad']",
];

let skippedCount = 0;

function trySkip() {
  for (const selector of SKIP_SELECTORS) {
    const btn = document.querySelector(selector);
    if (btn) {
      btn.click();
      skippedCount++;
      console.log("[YT Skip] Ad skipped! Total: " + skippedCount);
      return true;
    }
  }
  return false;
}

setInterval(trySkip, 500);

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "getCount") {
    sendResponse({ count: skippedCount });
  }
});