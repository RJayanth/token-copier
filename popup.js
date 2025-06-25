async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function updateStatus(text) {
  const el = document.getElementById("status");
  if (el) el.innerText = text;
}

document.getElementById("copy").onclick = async () => {
  const tab = await getCurrentTab();
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const cookies = document.cookie;
      const local = JSON.stringify(localStorage);
      const session = JSON.stringify(sessionStorage);
      chrome.runtime.sendMessage({
        type: "STORE_DATA",
        data: { cookies, local, session }
      }, (res) => {
        if (res?.success) {
          // Can't access popup DOM here
        }
      });
    }
  });
  updateStatus("Data copied!");
};

document.getElementById("paste").onclick = async () => {
  const tab = await getCurrentTab();

  chrome.runtime.sendMessage({ type: "GET_DATA" }, (response) => {
    if (!response) {
      updateStatus("No data copied yet.");
      return;
    }

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (data) => {
        const addedKeys = {
          localStorage: [],
          sessionStorage: [],
          cookies: []
        };

        data.cookies.split(";").forEach(cookieStr => {
          const [key, value] = cookieStr.split("=");
          if (key && value) {
            document.cookie = `${key.trim()}=${value.trim()}; path=/`;
            addedKeys.cookies.push(key.trim());
          }
        });

        const local = JSON.parse(data.local || "{}");
        for (const [k, v] of Object.entries(local)) {
          localStorage.setItem(k, v);
          addedKeys.localStorage.push(k);
        }

        const session = JSON.parse(data.session || "{}");
        for (const [k, v] of Object.entries(session)) {
          sessionStorage.setItem(k, v);
          addedKeys.sessionStorage.push(k);
        }

        chrome.runtime.sendMessage({ type: "SAVE_KEYS", keys: addedKeys });
      },
      args: [response]
    }).then(() => {
      updateStatus("Data pasted!");
    });
  });
};

document.getElementById("clear").onclick = async () => {
  const tab = await getCurrentTab();

  chrome.runtime.sendMessage({ type: "GET_KEYS" }, (keys) => {
    if (!keys || (!keys.cookies.length && !keys.localStorage.length && !keys.sessionStorage.length)) {
      updateStatus("No injected data to clear.");
      return;
    }

    chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: false, frameIds: [0] },
      func: (keysToClear) => {
        console.log("Clearing injected auth data", keysToClear);

        // Clear cookies (non-HttpOnly, matching current domain/path)
        keysToClear.cookies.forEach(name => {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        });

        // Clear localStorage
        keysToClear.localStorage.forEach(key => {
          localStorage.removeItem(key);
        });

        // Clear sessionStorage
        keysToClear.sessionStorage.forEach(key => {
          sessionStorage.removeItem(key);
        });

        console.log("Cleared cookies, localStorage, sessionStorage");
      },
      args: [keys]
    }).then(() => {
      updateStatus("Cleared injected data!");
    }).catch((err) => {
      console.error("Clear failed", err);
      updateStatus("Clear failed.");
    });
  });
};

