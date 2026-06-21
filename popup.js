document.addEventListener('DOMContentLoaded', async () => {
  const blockBtn = document.getElementById('block-btn');
  const allowBtn = document.getElementById('allow-btn');
  const statusText = document.getElementById('status-text');

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab || !tab.url || /^chrome:/.test(tab.url)) {
    statusText.textContent = "このページでは設定できません。";
    blockBtn.disabled = true;
    allowBtn.disabled = true;
    return;
  }

  const urlObj = new URL(tab.url);
  const pattern = `${urlObj.protocol}//*.${urlObj.hostname}/*`;

  // 【追加】現在のこのサイトのJS設定をChromeから取得してUIに反映
  chrome.contentSettings.javascript.get({ primaryUrl: tab.url }, (details) => {
    if (details.setting === 'block') {
      statusText.textContent = `状態: JS無効化中 (${urlObj.hostname})`;
      statusText.style.color = "#dc3545"; // 赤文字
    } else {
      statusText.textContent = `状態: JS許可中 (${urlObj.hostname})`;
      statusText.style.color = "#28a745"; // 緑文字
    }
  });

  blockBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "block", pattern: pattern }, () => {
      alert(`JSを無効化しました。ページをリロードしてください。`);
      window.close(); // ポップアップを閉じる
    });
  });

  allowBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "allow", pattern: pattern }, () => {
      alert(`無効化を解除しました。ページをリロードしてください。`);
      window.close();
    });
  });
});