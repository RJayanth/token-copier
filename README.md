# 🔐 Token Copier — Chrome Extension

A Chrome extension designed specifically for developers to **copy localStorage, sessionStorage, and cookie data** from a logged-in session (e.g., a dev/staging domain) and **paste it to `localhost`** — avoiding the painful manual work caused by SSO limitations during local development.

---

## 🚀 Why This Exists

Many enterprise apps use **SSO (Single Sign-On)**, which usually doesn't function on `localhost`. Developers often have to:

- Open dev/staging environment
- Copy each cookie/localStorage/sessionStorage item manually
- Paste into the browser for `localhost`

This is tedious and error-prone — so we automated it.

---

## ✅ Features

- 📋 Copy all `cookies`, `localStorage`, and `sessionStorage` from the current tab.
- 📥 Paste the copied data to a different tab (e.g., `localhost`).
- ❌ Clear only the **injected data** added by the extension — safe and scoped.
- 💾 Remembers what was pasted, so only that can be cleared later.
- 🧪 Built for developer convenience. No 3rd-party services involved.

---

## 🛠 How to Install (Dev Mode)

> You can run this extension locally without publishing it to the Chrome Web Store.

### 1. Clone the Repo

```bash
git clone https://github.com/RJayanth/token-copier.git
cd token-copier
```

### 2. Open Chrome Extensions

In Chrome, navigate to:

```
chrome://extensions
```

### 3. Enable Developer Mode

Toggle **Developer mode** in the top-right corner.

### 4. Load Unpacked Extension

Click **Load unpacked** and select the cloned folder (where `manifest.json` is located).

### 5. Done!

You should now see the extension icon in your Chrome toolbar.

---

## 🔍 How to Use

1. Open your app in the **dev environment** (where you're already logged in via SSO).
2. Click the extension icon → click `📋 Copy Auth Data`.
3. Open the same app on `http://localhost:3000` (or your local server).
4. Click the extension icon again → click `📥 Paste to Current`.
5. ✅ You're now "logged in" locally with the copied tokens.
6. Want to clean up? Click `❌ Clear Injected Data` to remove only what the extension added.

---

## 🧱 Tech Used

- Chrome Extensions API (Manifest v3)
- Vanilla JavaScript
- Chrome `scripting`, `cookies`, `tabs` and `storage` permissions

---

## 📎 Limitations

- **HttpOnly cookies** cannot be accessed or injected via JavaScript — this is by browser design and affects all extensions.
- Some cookie values may still require domain/path/security matching to take effect properly.

---

## 📌 Disclaimer

This tool is intended for **developer use only** in trusted environments. It does not store or share any data externally. All operations happen strictly within your browser.

---

## 🤝 Contributions

PRs welcome! Ideas you could contribute:

- Auto-paste when visiting specific domains
- Environment presets for quicker switching
- Keyboard shortcuts
- Icon improvements

---

## 📄 License

MIT © Jayanth R
