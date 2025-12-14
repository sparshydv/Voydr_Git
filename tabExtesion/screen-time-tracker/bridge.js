// Listens for window → extension communication
window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (!event.data.type) return;

  if (event.data.type === "SAVE_USER_TO_EXTENSION") {
    chrome.runtime.sendMessage({
      type: "SAVE_USER",
      user: event.data.user
    });
  }
});
