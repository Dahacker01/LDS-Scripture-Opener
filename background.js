chrome.commands.onCommand.addListener((command) => {

  if (command === "open-scripture-search") {

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {

      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "showScriptureBar" }
      );

    });

  }

});

let pendingRef = null;

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {

  if (msg.action === "openSidebar") {

    pendingRef = msg.ref;

    await chrome.sidePanel.open({
      tabId: sender.tab.id
    });

  }

  if (msg.action === "getScripture") {
    sendResponse({ ref: pendingRef });
  }

});