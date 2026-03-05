// Ask the active YouTube tab's content script for the current skip count
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  const countEl = document.getElementById("count");

  if (!tab || !tab.url || !tab.url.includes("youtube.com")) {
    countEl.textContent = "—";
    document.querySelector(".pill").innerHTML = `
      <span style="color:#888">Open YouTube to start</span>
    `;
    return;
  }

  chrome.tabs.sendMessage(tab.id, { type: "getCount" }, (response) => {
    if (chrome.runtime.lastError || !response) {
      countEl.textContent = "0";
      return;
    }
    countEl.textContent = response.count ?? 0;
  });
});
