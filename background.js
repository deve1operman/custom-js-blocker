chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const setting = request.action === "block" ? "block" : "allow";

  chrome.contentSettings.javascript.set({
    primaryPattern: request.pattern,
    setting: setting
  }, () => {
    console.log(`JavaScript setting updated to [${setting}] for: ${request.pattern}`);
    sendResponse({ success: true });
  });

  return true; // 非同期通信のために必要
});