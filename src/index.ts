declare var chrome: any;

console.log("Hello!");

console.log(chrome);
console.log(chrome.tabs);

// // Content script
// chrome.runtime.sendMessage({ closeThis: true });

// // Background script
// chrome.runtime.onMessage.addListener(function(
//   message: { closeThis: boolean },
//   sender: {
//     tab: {
//       id: number;
//     };
//   },
//   sendResponse: {}
// ) {
//   if (message.closeThis) chrome.tabs.remove(sender.tab.id);
// });

const btnClick: HTMLElement = document.getElementById("btnClick")!;

btnClick.addEventListener("click", function() {
  console.log("Button was clicked");
  console.log(chrome);
  console.log(chrome.tabs);
  chrome.tabs.getSelected(null, function(tab: { id: number }) {
    chrome.tabs.remove(tab.id);
  });
});
