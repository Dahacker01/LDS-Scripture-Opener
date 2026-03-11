function formatReference(reference) {
  // basic formatting
  return reference.toLowerCase()
                  .replace(/\s+/g, "/")
                  .replace(":", ".");
}

function openScripture() {
  const input = document.getElementById("scriptureInput");
  const ref = input.value.trim();
  if (!ref) return;

  const formatted = formatReference(ref);
  const url = `https://www.churchofjesuschrist.org/study/scriptures/${formatted}?lang=eng`;

  chrome.tabs.create({ url });
}
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "openSidebar") {
    chrome.sidePanel.open(); // only here, not in background
  }
});
document.getElementById("openButton").addEventListener("click", openScripture);
document.getElementById("scriptureInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") openScripture();
});