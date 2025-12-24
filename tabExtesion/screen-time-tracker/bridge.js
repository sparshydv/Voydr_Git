// Content Script - Bridge between website and extension (Manifest V3 compatible)
console.log("🌉 Bridge.js loaded!");

// Listen for messages from the website
window.addEventListener("message", (event) => {
  // Only accept messages from the same window
  if (event.source !== window) return;
  
  console.log("📨 Bridge received message:", event.data);

  if (event.data.type === "SAVE_USER_TO_EXTENSION" && event.data.user) {
    console.log("✅ Forwarding user to background script:", event.data.user);
    
    // Send to background script
    chrome.runtime.sendMessage({
      type: "SAVE_USER",
      user: event.data.user
    }, (response) => {
      console.log("🔄 Background response:", response);
    });
  }
});

console.log("🌉 Bridge ready - website can use window.postMessage now");
