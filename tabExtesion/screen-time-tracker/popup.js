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
      li.textContent = `${site}: ${Math.floor(time / 60)} min ${Math.floor(time % 60)} sec`;
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
        console.error("❌ No user logged in");
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
        .then(data => console.log("✅ Sync successful:", data))
        .catch(err => console.error("❌ Sync failed:", err));
    });
  });
});
