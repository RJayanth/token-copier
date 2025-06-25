let storedData = null;
let injectedKeys = {
  localStorage: [],
  sessionStorage: [],
  cookies: []
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "STORE_DATA") {
    storedData = msg.data;
    sendResponse({ success: true });
  } else if (msg.type === "GET_DATA") {
    sendResponse(storedData);
  } else if (msg.type === "SAVE_KEYS") {
    injectedKeys = msg.keys;
    sendResponse({ success: true });
  } else if (msg.type === "GET_KEYS") {
    sendResponse(injectedKeys);
  }

  return true;
});
