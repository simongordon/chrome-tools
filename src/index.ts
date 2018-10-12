console.log("Extension loading");

const closeDuplicates = () =>
  new Promise(resolve => {
    chrome.tabs.query({ currentWindow: true }, tabs => {
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

const closeSearches = () =>
  new Promise(resolve => {
    chrome.tabs.query({ currentWindow: true }, tabs => {
      for (let i = 0; i < tabs.length; i++) {
        const curTab = tabs[i];
        const curUrl = curTab.url!;
        if (curUrl.indexOf("https://www.google.com.au/search") === 0) {
          chrome.tabs.remove(curTab.id!);
        }
      }
      resolve();
    });
  });

const sortTabs = (
  compareFn: ((a: chrome.tabs.Tab, b: chrome.tabs.Tab) => number)
) =>
  new Promise(resolve => {
    chrome.tabs.query({ currentWindow: true }, tabs => {
      const sorted = tabs.sort(compareFn);

      for (let i = 0; i < sorted.length; i++) {
        const element = sorted[i];
        chrome.tabs.move(element.id || 0, {
          index: i
        });
      }
      resolve();
    });
  });

const compareStr = (
  str1: string | undefined = "",
  str2: string | undefined = ""
) => (str1 === str2 ? 0 : str1 < str2 ? -1 : 1);

const sortTabsByUrl = () => sortTabs((a, b) => compareStr(a.url, b.url));
const sortTabsByTitle = () => sortTabs((a, b) => compareStr(a.title, b.title));

window.addEventListener("load", () => {
  console.log("Extension loaded");

  const btnClick = document.getElementById("btnClick")!;
  btnClick.addEventListener("click", () => {
    console.log("btnClick was clicked");
    closeDuplicates();
  });

  const btnSortURL = document.getElementById("btnSortURL")!;
  btnSortURL.addEventListener("click", () => {
    console.log("btnSortURL was clicked");
    sortTabsByUrl();
  });

  const btnSortTitle = document.getElementById("btnSortTitle")!;
  btnSortTitle.addEventListener("click", () => {
    console.log("btnSortTitle was clicked");
    sortTabsByTitle();
  });

  const btnCleanup = document.getElementById("btnCleanup")!;
  btnCleanup.addEventListener("click", async () => {
    console.log("btnCleanup was clicked");
    await closeDuplicates();
    await sortTabsByUrl();
  });

  const btnCloseSearch = document.getElementById("btnCloseSearch")!;
  btnCloseSearch.addEventListener("click", async () => {
    console.log("btnCloseSearch was clicked");
    closeSearches();
  });
});
