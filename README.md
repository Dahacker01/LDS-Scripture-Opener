# Chrome Extension Project

This project is a **Chrome browser extension**. Browser extensions allow developers to add custom functionality to the browser such as modifying webpages, adding UI panels, automating tasks, or integrating with external APIs.

This README explains:

1. How to load the extension locally
2. The purpose of each file in the project
3. A structural overview of the project

---

# Loading the Extension in Chrome

Before publishing an extension to the Chrome Web Store, developers typically **load it locally in Developer Mode**. This allows you to test and debug the extension while you are building it.

Follow these steps to load the extension:

### 1. Download or Clone the Project

Place the project folder somewhere on your computer.

Example:

```
my-extension/
```

---

### 2. Open Chrome Extensions Page

Open Chrome and navigate to:

```
chrome://extensions/
```

---

### 3. Enable Developer Mode

In the **top right corner**, toggle:

```
Developer mode → ON
```

This will reveal additional options for managing local extensions.

---

### 4. Load the Extension

Click:

```
Load unpacked
```

Then select the **root folder of this project**.

Example:

```
my-extension/
```

Chrome will now install the extension locally.

---

### 5. Verify Installation

Once loaded, the extension should appear in the list of installed extensions.

You can:

* Enable/disable it
* Inspect background scripts
* View logs and errors
* Reload the extension after changes

---

### 6. Updating the Extension During Development

When you modify files in the project:

1. Go back to `chrome://extensions`
2. Click the **reload icon** on the extension

This refreshes the extension with the latest code.

---

# How Chrome Extensions Are Structured (Quick Overview)

Most Chrome extensions contain several common components:

| File               | Purpose                                                          |
| ------------------ | ---------------------------------------------------------------- |
| `manifest.json`    | The configuration file that tells Chrome how the extension works |
| background scripts | Run in the background and manage logic/events                    |
| content scripts    | Run inside webpages and interact with page content               |
| popup / panel UI   | The interface the user interacts with                            |
| assets             | Icons, images, or stylesheets                                    |

# File Breakdown

## `popup.html`

This file defines the **user interface for the extension popup**. The popup appears when a user clicks the extension icon in Chrome.

### Purpose

It provides a simple interface where users can type a scripture reference and open it on the Church website.

### Key Components

**Input Field**

```html
<input id="scriptureInput" placeholder="Alma 32:21" autofocus />
```

* Allows the user to type a scripture reference.
* The placeholder gives an example of the expected format.
* `autofocus` automatically places the cursor in the input box when the popup opens.

---

**Open Button**

```html
<button id="openButton">Open Scripture</button>
```

* Triggers the action that opens the scripture page.

---

**JavaScript Link**

```html
<script src="popup.js"></script>
```

This loads the logic that handles:

* user input
* URL generation
* opening the scripture page

---

### Styling

The popup includes minimal styling:

```css
body { font-family: Arial; width: 250px; padding: 10px; }
input { width: 100%; padding: 8px; font-size: 14px; }
button { margin-top: 5px; width: 100%; padding: 8px; }
```

This ensures the popup is:

* compact
* readable
* consistent with browser UI constraints

---

# `popup.js`

This script handles the **logic for the popup interface**.

It performs three main tasks:

1. Formatting scripture references
2. Opening the scripture page in a new tab
3. Handling user interaction

---

## Formatting the Scripture Reference

```javascript
function formatReference(reference) {
  return reference.toLowerCase()
                  .replace(/\s+/g, "/")
                  .replace(":", ".");
}
```

This function converts a scripture reference into a format used by the Church scripture URLs.

Example:

```
Input:
Alma 32:21

Output:
alma/32.21
```

This formatted reference is inserted into the scripture URL.

---

## Opening the Scripture

```javascript
chrome.tabs.create({ url });
```

When the user presses the button or hits **Enter**, the extension:

1. Reads the input field
2. Formats the reference
3. Generates the scripture URL
4. Opens the scripture in a **new browser tab**

Example generated URL:

```
https://www.churchofjesuschrist.org/study/scriptures/alma/32.21?lang=eng
```

---

## Event Listeners

### Button Click

```javascript
document.getElementById("openButton").addEventListener("click", openScripture);
```

Runs the scripture opening function when the button is pressed.

---

### Enter Key

```javascript
document.getElementById("scriptureInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") openScripture();
});
```

Allows users to press **Enter instead of clicking the button**.

---

## Sidebar Message Listener

```javascript
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "openSidebar") {
    chrome.sidePanel.open();
  }
});
```

This allows other parts of the extension (such as background scripts) to send a message requesting the **side panel to open**.

---

# `panel.js`

This file powers the **extension side panel**, which loads scripture content inside the extension.

Unlike the popup, which opens a new tab, the panel displays scripture **within the browser side panel**.

---

# Scripture Book Mapping

At the top of the file is a large object:

```javascript
const scriptureBooks = { ... }
```

This maps **scripture book names to the URL format used by the Church website**.

Example mapping:

```
"Alma" → "alma"
"1 Nephi" → "1-ne"
"Matthew" → "matt"
```

The mapping is grouped by scripture collection:

| Section | Description            |
| ------- | ---------------------- |
| `ot`    | Old Testament          |
| `nt`    | New Testament          |
| `bofm`  | Book of Mormon         |
| `dc`    | Doctrine and Covenants |
| `pgp`   | Pearl of Great Price   |

---

# Scripture URL Parser

The core function is:

```javascript
function generateScriptureUrl(reference)
```

This function converts a scripture reference into a **fully qualified scripture URL**.

Example:

```
Input:
Alma 32:21

Output:
https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/32?lang=eng&id=p21#p21
```

---

## Special Case Handling

Doctrine and Covenants references require a different URL structure.

Example:

```
D&C 4:2
```

These are detected using a regex pattern:

```javascript
const dcMatch = reference.match(/D\.?&?C\.?\s*(\d+)[:|\s](\d+)/i);
```

If matched, the URL is constructed using the **D&C section path**.

---

## Generic Reference Parsing

For all other scriptures, the parser expects:

```
Book Chapter:Verse
```

Example:

```
Matthew 5:16
Mosiah 2:17
1 Nephi 3:7
```

The parser:

1. Extracts the book name
2. Finds the book in the mapping table
3. Determines the scripture collection
4. Builds the correct URL

---

# Panel Initialization

When the side panel loads:

```javascript
window.addEventListener("DOMContentLoaded", () => {
```

The script requests the scripture reference from another extension component.

```javascript
chrome.runtime.sendMessage({ action: "getScripture" }, ...)
```

If a reference is returned:

1. The parser generates the scripture URL
2. The scripture page loads inside an iframe

```javascript
document.getElementById("scriptureFrame").src = url
```
Great — with these additional files we can complete most of the **architecture explanation** for the README. Below is the continuation you can append to the existing README.

---

# Additional File Breakdown

## `panel.html`

This file defines the **layout of the side panel** used by the extension.

Chrome’s **Side Panel API** allows extensions to render a persistent interface in the browser’s side panel instead of opening new tabs or popups.

### Structure

```html
<iframe id="scriptureFrame"></iframe>
```

The panel contains a single **iframe** which loads scripture pages from the Church website.

### Why an iframe is used

The extension loads scripture pages directly from:

```
https://www.churchofjesuschrist.org
```

Instead of recreating the scripture interface, the extension simply embeds the official page inside the side panel.

### Styling

```css
iframe {
  width: 100%;
  height: 100vh;
  border: none;
}
```

This ensures:

* The iframe fills the entire side panel
* No extra borders appear
* The scripture content behaves like a normal webpage

### Script Connection

```html
<script src="panel.js"></script>
```

This loads the **panel logic**, which determines which scripture reference should be displayed.

---

# `manifest.json`

The `manifest.json` file is the **core configuration file for any Chrome extension**. It tells Chrome:

* what scripts run
* what permissions are required
* what UI elements exist
* what keyboard shortcuts are available

Without this file, the extension cannot run.

---

## Basic Metadata

```json
{
  "manifest_version": 3,
  "name": "LDS Scripture Opener",
  "version": "1.0",
  "description": "Quickly open LDS scriptures from a shortcut"
}
```

Important note:

**Manifest V3** is the current Chrome extension standard and requires using **service workers instead of persistent background pages**.

---

# Permissions

```json
"permissions": ["tabs", "sidePanel", "activeTab"]
```

These permissions allow the extension to:

| Permission  | Purpose                               |
| ----------- | ------------------------------------- |
| `tabs`      | Create or manage browser tabs         |
| `sidePanel` | Open and control Chrome's side panel  |
| `activeTab` | Interact with the currently open page |

---

# Background Service Worker

```json
"background": {
  "service_worker": "background.js"
}
```

The background script runs **in the background of the browser** and handles:

* keyboard shortcuts
* messaging between scripts
* opening the side panel

Unlike older extensions, this script **is not always running**. Chrome starts it when needed.

---

# Side Panel Configuration

```json
"side_panel": {
  "default_path": "panel.html"
}
```

This registers the extension’s **side panel interface**.

When the side panel opens, Chrome loads:

```
panel.html
```

which then loads `panel.js`.

---

# Keyboard Shortcut

```json
"commands": {
  "open-scripture-search": {
    "suggested_key": {
      "default": "Ctrl+Shift+F"
    },
    "description": "Open scripture search bar"
  }
}
```

This allows users to open the scripture search bar by pressing:

```
Ctrl + Shift + F
```

Keyboard shortcuts are handled by the **background script**.

---

# Content Scripts

```json
"content_scripts": [
  {
    "matches": ["<all_urls>"],
    "js": ["content.js"]
  }
]
```

A **content script** runs inside webpages.

This extension injects `content.js` into **every page** the user visits.

This allows the extension to:

* inject UI elements into webpages
* listen for commands
* communicate with the extension background logic

---

# `content.js`

This file is responsible for **injecting the scripture search bar into webpages**.

Content scripts run **inside the page's DOM**, allowing them to modify the page interface.

---

# Creating the Scripture Input Bar

When triggered, the script dynamically creates an input field:

```javascript
scriptureBar = document.createElement("input");
```

The bar is styled and positioned at the top center of the page.

Example appearance:

```
---------------------------------
| Scripture (example: Alma 32:21) |
---------------------------------
```

---

# UI Styling

The search bar is styled directly with JavaScript:

```javascript
scriptureBar.style.position = "fixed";
scriptureBar.style.top = "10px";
scriptureBar.style.left = "50%";
scriptureBar.style.transform = "translateX(-50%)";
```

This ensures:

* it stays fixed on the screen
* appears centered
* remains visible above the webpage content

The very high `z-index` ensures it appears above everything else on the page.

---

# Preventing Duplicate Search Bars

```javascript
if (scriptureBar) {
  scriptureBar.focus();
  return;
}
```

If the search bar already exists, the script simply focuses it instead of creating another one.

---

# Enter Key Behavior

When the user presses **Enter**:

```javascript
chrome.runtime.sendMessage({
  action: "openSidebar",
  ref: reference
});
```

This sends a message to the extension asking it to:

1. open the side panel
2. load the scripture reference

---

# Escape Key Behavior

Pressing **Escape** closes the search bar.

```javascript
scriptureBar.remove();
scriptureBar = null;
```

# `background.js`

The **background script** acts as the central controller for the extension. It manages:

* keyboard shortcuts
* communication between scripts
* opening the side panel
* storing the current scripture reference

In Manifest V3, background scripts run as a **service worker**, meaning they are started by Chrome only when needed.

---

# Handling Keyboard Shortcuts

The extension listens for keyboard commands defined in `manifest.json`.

```javascript
chrome.commands.onCommand.addListener((command) => {
```

When a command is triggered, the script checks which command was used.

```javascript
if (command === "open-scripture-search")
```

This corresponds to the shortcut defined in the manifest:

```
Ctrl + Shift + F
```

---

# Sending a Message to the Active Tab

When the shortcut is pressed, the background script identifies the currently active tab.

```javascript
chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
```

It then sends a message to the content script running in that tab.

```javascript
chrome.tabs.sendMessage(
  tabs[0].id,
  { action: "showScriptureBar" }
);
```

This message instructs the content script to **display the scripture input bar**.

---

# Temporary Scripture Storage

The script stores the last scripture reference entered by the user.

```javascript
let pendingRef = null;
```

This variable acts as a temporary memory location so the side panel can access the scripture reference.

---

# Handling Messages from Other Scripts

The background script listens for messages from content scripts or the panel.

```javascript
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
```

---

# Opening the Side Panel

When the user presses **Enter** in the scripture search bar, the content script sends:

```
action: "openSidebar"
```

The background script then:

1. saves the reference
2. opens the side panel

```javascript
pendingRef = msg.ref;

await chrome.sidePanel.open({
  tabId: sender.tab.id
});
```

The `tabId` ensures the side panel opens for the correct tab.

---

# Providing the Scripture Reference

When the side panel loads, `panel.js` asks the background script for the reference.

```javascript
action: "getScripture"
```

The background script responds with:

```javascript
sendResponse({ ref: pendingRef });
```

This allows the panel to retrieve the reference and generate the correct scripture URL.

---

# Full Extension Workflow

The entire extension works through **event-driven communication between scripts**.

### 1. User presses keyboard shortcut

```
Ctrl + Shift + F
```

Handled by:

```
background.js
```

---

### 2. Content script displays search bar

The background script sends a message:

```
showScriptureBar
```

Handled by:

```
content.js
```

---

### 3. User enters scripture reference

Example:

```
Alma 32:21
```

---

### 4. Content script sends request to open panel

Message sent:

```
openSidebar
```

Handled by:

```
background.js
```

---

### 5. Background script opens side panel

Chrome loads:

```
panel.html
```

---

### 6. Panel requests the scripture reference

Message sent:

```
getScripture
```

Handled by:

```
background.js
```

---

### 7. Panel loads scripture

`panel.js`:

1. Parses the reference
2. Generates the scripture URL
3. Loads it into the iframe

Example final URL:

```
https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/32?lang=eng&id=p21#p21
```

---

# Final Project Structure

```
lds-scripture-opener/
│
├── manifest.json        # Extension configuration and permissions
│
├── background.js        # Handles commands, messaging, and panel control
│
├── content.js           # Injects scripture search bar into webpages
│
├── popup.html           # Popup UI for manual scripture entry
├── popup.js             # Logic for popup actions
│
├── panel.html           # Layout for side panel interface
├── panel.js             # Scripture parsing and URL generation
```

---

# Development Tips

### Reloading the Extension

During development you must reload the extension after changes.

Go to:

```
chrome://extensions
```

Then click **Reload**.

---

### Debugging Scripts

You can inspect each part of the extension:

| Component     | Where to Inspect            |
| ------------- | --------------------------- |
| background.js | Extensions → Service Worker |
| content.js    | Browser DevTools on webpage |
| popup.js      | Popup → Inspect             |
| panel.js      | Side panel DevTools         |

