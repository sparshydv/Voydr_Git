// Popular sites with special capitalization
const SITE_NAMES = {
  "chatgpt.com": "ChatGPT",
  "youtube.com": "YouTube",
  "github.com": "GitHub",
  "linkedin.com": "LinkedIn",
  "stackoverflow.com": "Stack Overflow",
  "facebook.com": "Facebook",
  "instagram.com": "Instagram",
  "netflix.com": "Netflix",
  "gmail.com": "Gmail",
  "whatsapp.com": "WhatsApp",
  "twitter.com": "Twitter",
  "tiktok.com": "TikTok",
  "reddit.com": "Reddit",
  "wikipedia.org": "Wikipedia",
  "amazon.com": "Amazon",
  "ebay.com": "eBay",
  "figma.com": "Figma",
  "vscode.dev": "VS Code",
  "office.com": "Microsoft Office",
  "docs.google.com": "Google Docs"
};

// Format site name for display
function formatSiteName(rawSite) {
  if (!rawSite) return "Unknown";
  
  // Remove protocol if present
  let site = rawSite.replace(/^https?:\/\//, "").replace(/^www\./, "");
  
  // Remove trailing slashes and paths
  site = site.split('/')[0];
  
  // Check if it's in our dictionary
  if (SITE_NAMES[site]) {
    return SITE_NAMES[site];
  }
  
  // Smart parsing for unknown sites
  // Remove common TLDs
  const domain = site
    .replace(/\.(com|org|net|edu|gov|io|co|gg|cc|in|uk|us|ca|au|de|fr|jp|cn|ru)$/i, "")
    .split('.');
  
  // Capitalize each part
  const formatted = domain
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
  
  return formatted;
}

document.addEventListener("DOMContentLoaded", () => {
  const siteList = document.getElementById("siteList");
  const resetBtn = document.getElementById("resetButton");
  const syncBtn = document.getElementById("syncButton");

  // ===============================
  // LOAD & DISPLAY DATA
  // ===============================
  chrome.storage.local.get(["siteTimeData"], (result) => {
    const siteTimeData = result.siteTimeData || {};

    siteList.innerHTML = "";

    if (Object.keys(siteTimeData).length === 0) {
      siteList.innerHTML = "<li>No data yet</li>";
      return;
    }

    Object.entries(siteTimeData).forEach(([site, time]) => {
      const li = document.createElement("li");
      li.textContent = `${formatSiteName(site)}: ${Math.floor(time / 60)} min ${Math.floor(time % 60)} sec`;
      siteList.appendChild(li);
    });
  });

  // ===============================
  // RESET DATA
  // ===============================
  resetBtn.addEventListener("click", () => {
    chrome.storage.local.set({ siteTimeData: {} }, () => {
      siteList.innerHTML = "<li>Data reset</li>";
    });
  });

  // ===============================
  // SYNC DATA (CORRECT PAYLOAD)
  // ===============================
  syncBtn.addEventListener("click", () => {
    chrome.storage.local.get(["siteTimeData", "user"], (result) => {
      if (!result.user) {
        alert("❌ No user logged in. Please login on the website first!");
        console.error("❌ No user logged in - user data not found in storage");
        return;
      }

      fetch("http://localhost:5000/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: result.user._id,
          usage: result.siteTimeData || {}
        }),
      })
        .then(res => res.json())
        .then(data => {
          console.log("✅ Sync successful:", data);
          alert("✅ Data synced successfully!");
        })
        .catch(err => {
          console.error("❌ Sync failed:", err);
          alert("❌ Sync failed. Check console for details.");
        });
    });
  });
});
