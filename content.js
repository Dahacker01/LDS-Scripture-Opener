let scriptureBar = null;

chrome.runtime.onMessage.addListener((msg) => {

  if (msg.action === "showScriptureBar") {

    if (scriptureBar) {
      scriptureBar.focus();
      return;
    }

    scriptureBar = document.createElement("input");

    scriptureBar.placeholder = "Scripture (example: Alma 32:21)";

    scriptureBar.style.position = "fixed";
    scriptureBar.style.top = "10px";
    scriptureBar.style.left = "50%";
    scriptureBar.style.transform = "translateX(-50%)";
    scriptureBar.style.zIndex = "999999";
    scriptureBar.style.padding = "8px";
    scriptureBar.style.fontSize = "16px";
    scriptureBar.style.width = "300px";
    scriptureBar.style.border = "2px solid #444";
    scriptureBar.style.borderRadius = "6px";
    scriptureBar.style.backgroundColor = "white";
    scriptureBar.style.opacity = "1";

    document.body.appendChild(scriptureBar);

    scriptureBar.focus();

    scriptureBar.addEventListener("keydown", async (e) => {

      if (e.key === "Enter") {

        const reference = scriptureBar.value.trim();


        chrome.runtime.sendMessage({
          action: "openSidebar",
          ref: reference
        });

        scriptureBar.remove();
        scriptureBar = null;
      }

      if (e.key === "Escape") {
        scriptureBar.remove();
        scriptureBar = null;
      }

    });

  }

});