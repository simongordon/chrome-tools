console.log("Extension loaded");

const btnClick: HTMLElement = document.getElementById("btnClick")!;

const closeDuplicates = () =>
  new Promise(resolve => {
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
        resolve();
      });
    });
  });

const sortTabs = () =>
  new Promise(resolve => {
    chrome.tabs.query({ currentWindow: true }, function(tabArray) {
      const sorted = tabArray.sort(({ url: urlA = "" }, { url: urlB = "" }) => {
        if (urlA == urlB) {
          return 0;
        }
        if (urlA < urlB) {
          return -1;
        } else {
          return 1;
        }
      });
      console.log(sorted);
      for (let i = 0; i < sorted.length; i++) {
        const element = sorted[i];
        chrome.tabs.move(element.id || 0, {
          index: i
        });
      }
      resolve();
    });
  });

btnClick.addEventListener("click", () => {
  console.log("Button was clicked");
  closeDuplicates();
});

const btnSort: HTMLElement = document.getElementById("btnSort")!;

btnSort.addEventListener("click", () => {
  console.log("Button was clicked");
  sortTabs();
});
