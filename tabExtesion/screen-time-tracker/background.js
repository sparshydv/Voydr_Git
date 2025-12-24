console.log("🔥 Background loaded");

// ==================================================
// GLOBAL STATE
// ==================================================
let activeTabId = null;
let startTime = null;
let siteTimeData = {};
let userId = null;
let siteLimits = {}; // { domain: seconds }

// ==================================================
// RECEIVE USER FROM WEBSITE (LOGIN)
// ==================================================
// For external messages (with extension ID)
chrome.runtime.onMessageExternal.addListener((msg, sender, sendResponse) => {
  if (msg.type === "SAVE_USER" && msg.user) {
    userId = msg.user._id;

    chrome.storage.local.set({ user: msg.user }, () => {
      console.log("🟢 User saved:", userId);
      loadLimits();
    });

    sendResponse({ success: true });
  }
  return true;
});

// For internal messages (from content script/bridge)
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("📨 Background received message:", msg);
  
  if (msg.type === "SAVE_USER" && msg.user) {
    userId = msg.user._id;

    chrome.storage.local.set({ user: msg.user }, () => {
      console.log("🟢 User saved via bridge:", userId);
      loadLimits();
    });

    sendResponse({ success: true });
  }
  return true;
});

// ==================================================
// LOAD USER ON EXTENSION START
// ==================================================
chrome.storage.local.get(["user", "siteTimeData"], (res) => {
  if (res.user) {
    userId = res.user._id;
    console.log("✅ Loaded user:", userId);
    loadLimits();
  }
  if (res.siteTimeData) {
    siteTimeData = res.siteTimeData;
    console.log("✅ Loaded siteTimeData:", siteTimeData);
  }
});

// ==================================================
// LOAD LIMITS FROM SERVER
// ==================================================
async function loadLimits() {
  if (!userId) return;

  console.log("🧪 Fetching limits for userId:", userId);

  try {
    const res = await fetch(`http://localhost:5000/limits/${userId}`);
    const limits = await res.json();

    console.log("🧪 Raw limits response:", limits);

    siteLimits = {};
    limits.forEach(l => {
      const domain = l.site.replace(/^www\./, "");
      siteLimits[domain] = l.limit * 60; // minutes → seconds
    });

    console.log("📘 Loaded limits (seconds):", siteLimits);
  } catch (e) {
    console.error("❌ Failed to load limits", e);
  }
}

// ==================================================
// TAB CLOSING WITH RETRY (CHROME SAFE)
// ==================================================
function closeDomainTabs(domain) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      if (tab.url && tab.url.includes(domain)) {
        attemptCloseTab(tab.id, domain, 0);
      }
    });
  });
}

function attemptCloseTab(tabId, domain, retryCount) {
  chrome.tabs.remove(tabId, () => {
    if (chrome.runtime.lastError) {
      console.warn(
        `⚠️ Close failed (${retryCount}):`,
        chrome.runtime.lastError.message
      );

      // Retry up to 5 times
      if (retryCount < 5) {
        setTimeout(() => {
          attemptCloseTab(tabId, domain, retryCount + 1);
        }, 500);
      }
    } else {
      console.log("❌ Correct tab closed due to limit:", domain);
    }
  });
}

// ==================================================
// MAIN TRACKING + LIMIT ENFORCEMENT
// ==================================================
async function updateTimeSpent() {
  if (!activeTabId || !startTime) return;

  const elapsed = (Date.now() - startTime) / 1000;

  chrome.tabs.get(activeTabId, async (tab) => {
    if (!tab || !tab.url) return;

    const domain = new URL(tab.url).hostname.replace(/^www\./, "");
    siteTimeData[domain] = (siteTimeData[domain] || 0) + elapsed;

    chrome.storage.local.set({ siteTimeData }, () => {
      console.log("💾 Saved siteTimeData");
    });

    console.log(`⏳ ${domain}: ${siteTimeData[domain].toFixed(2)} sec`);

    // 🚫 LIMIT CHECK
    if (
      siteLimits[domain] &&
      siteTimeData[domain] >= siteLimits[domain]
    ) {
      console.log(`🚨 LIMIT HIT for ${domain}`);

      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "Time Limit Reached",
        message: `You've reached your limit for ${domain}`
      });

      closeDomainTabs(domain);
      return;
    }

    // 🔁 SYNC TO SERVER
    if (userId) {
      try {
        await fetch("http://localhost:5000/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            usage: siteTimeData
          })
        });
      } catch (e) {
        console.error("❌ Sync error:", e);
      }
    }
  });

  startTime = Date.now();
}

// ==================================================
// TAB EVENTS
// ==================================================
chrome.tabs.onActivated.addListener(info => {
  if (activeTabId) updateTimeSpent();
  activeTabId = info.tabId;
  startTime = Date.now();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url) {
    if (activeTabId) updateTimeSpent();
    activeTabId = tabId;
    startTime = Date.now();
  }
});
