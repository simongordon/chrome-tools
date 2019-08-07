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

const getHostname = (url: string) => {
  // TODO: Something less hacky
  const a = document.createElement("a");
  a.href = url;
  return a.hostname;
};

const reverseHostname = (url: string) => {
  const hostname = getHostname(url);
  const reversed = hostname
    .split("")
    .reverse()
    .join("");
  return url.replace(hostname, reversed);
};

const reversePeriods = (url: string) => {
  const hostname = getHostname(url);
  const reversed = hostname
    .split(".")
    .reverse()
    .join(".");
  return url.replace(hostname, reversed);
};

const closeWebsite = () =>
  new Promise(resolve => {
    chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
      const [tab] = tabs;
      const hostname = getHostname(tab.url || "");
      chrome.tabs.query({ currentWindow: true }, tabs => {
        for (let i = 0; i < tabs.length; i++) {
          const curTab = tabs[i];
          const curUrl = curTab.url!;
          if (getHostname(curUrl) === hostname) {
            chrome.tabs.remove(curTab.id!);
          }
        }
        resolve();
      });
    });
  });

const sortTabs = (
  compareFn: (a: chrome.tabs.Tab, b: chrome.tabs.Tab) => number
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

const sortTabsByUrl2 = () =>
  sortTabs((a, b) =>
    compareStr(reversePeriods(a.url || ""), reversePeriods(b.url || ""))
  );

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
  const btnSortURL2 = document.getElementById("btnSortURL2")!;
  btnSortURL2.addEventListener("click", () => {
    console.log("btnSortURL2 was clicked");
    sortTabsByUrl2();
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

  const btnCleanup2 = document.getElementById("btnCleanup2")!;
  btnCleanup2.addEventListener("click", async () => {
    console.log("btnCleanup2 was clicked");
    await closeDuplicates();
    await sortTabsByUrl2();
  });

  const btnCloseWebsite = document.getElementById("btnCloseWebsite")!;
  btnCloseWebsite.addEventListener("click", async () => {
    console.log("btnCloseWebsite was clicked");
    closeWebsite();
  });
});
