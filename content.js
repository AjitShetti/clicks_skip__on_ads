// YouTube Ad Skipper - Content Script
// Watches for skip buttons and clicks them automatically

(function () {
  // All known YouTube skip button selectors (they change over time)
  const SKIP_SELECTORS = [
    ".ytp-skip-ad-button",
    ".ytp-ad-skip-button",
    ".ytp-ad-skip-button-modern",
    "[class*='skip-ad']",
    "[class*='skip_ad']",
  ];

  let skippedCount = 0;

  function trySkip() {
    for (const selector of SKIP_SELECTORS) {
      const btn = document.querySelector(selector);
      if (btn && btn.offsetParent !== null) {
        btn.click();
        skippedCount++;
        console.log(`[YT Skip] Ad skipped! Total: ${skippedCount}`);
        // Notify popup of the updated count
        chrome.runtime.sendMessage({ type: "skipped", count: skippedCount }).catch(() => {});
        return true;
      }
    }
    return false;
  }

  // Poll every 500ms for the skip button
  setInterval(trySkip, 500);

  // Also observe DOM changes for faster detection
  const observer = new MutationObserver(() => {
    trySkip();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style"],
  });

  // Listen for count requests from the popup
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type === "getCount") {
      sendResponse({ count: skippedCount });
    }
  });
})();
