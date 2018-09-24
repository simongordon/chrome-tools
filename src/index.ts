console.log("Extension loaded");

const btnClick: HTMLElement = document.getElementById("btnClick")!;

btnClick.addEventListener("click", () => {
  console.log("Button was clicked");
  chrome.windows.getCurrent(({ id }) => {
    chrome.tabs.query({ windowId: id }, tabs => {
      const alreadyOpen: string[] = [];
      for (let i = 0; i < tabs.length; i++) {
        const curTab = tabs[i];
        const curUrl = curTab.url!;
        if (alreadyOpen.indexOf(curUrl) !== -1) {
          chrome.tabs.remove(curTab.id!);
        } else {
          alreadyOpen.push(curUrl);
        }
      }
    });
  });
});
