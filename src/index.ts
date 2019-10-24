console.log("Extension loading");

const closeDuplicates = (groupHashes: boolean = false) =>
  new Promise(resolve => {
    chrome.tabs.query({ currentWindow: true }, tabs => {
      const alreadyOpen: string[] = [];
      for (let i = 0; i < tabs.length; i++) {
        const curTab = tabs[i];
        let curUrl = curTab.url!;
        if (groupHashes) {
          const hashLocation = curUrl.indexOf("#");
          if (hashLocation >= 0) {
            curUrl = curUrl.substr(0, hashLocation);
          }
        }
        if (alreadyOpen.indexOf(curUrl) !== -1) {
          chrome.tabs.remove(curTab.id!);
        }
        // else if (groupHashes) {
        // }
        else {
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

const closeWebsite = (keepCurrentOpen: boolean = false) =>
  new Promise(resolve => {
    chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
      const [tab] = tabs;
      const hostname = getHostname(tab.url || "");
      chrome.tabs.query({ currentWindow: true }, tabs => {
        for (let i = 0; i < tabs.length; i++) {
          const curTab = tabs[i];
          const curUrl = curTab.url!;
          if (
            getHostname(curUrl) === hostname &&
            (keepCurrentOpen ? !curTab.active : true)
          ) {
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

  const btnCleanup = document.getElementById("btnCleanup")!;
  // chrome://extensions/shortcuts
  btnCleanup.focus();
  btnCleanup.addEventListener("click", async () => {
    console.log("btnCleanup was clicked");
    const inpCloseDuplicates = document.getElementById(
      "closeDuplicates"
    )! as HTMLInputElement;
    if (inpCloseDuplicates.checked) {
      await closeDuplicates();
    }
    const slctSort = document.getElementById("slctSort")! as HTMLSelectElement;
    switch (slctSort.value) {
      case "title": {
        await sortTabsByTitle();
        break;
      }
      case "url": {
        await sortTabsByUrl();
        break;
      }
      case "url2": {
        await sortTabsByUrl2();
        break;
      }
    }
  });

  const btnCloseWebsite = document.getElementById("btnCloseWebsite")!;
  btnCloseWebsite.addEventListener("click", async () => {
    console.log("btnCloseWebsite was clicked");
    closeWebsite();
  });

  const btnCloseWebsite2 = document.getElementById("btnCloseWebsite2")!;
  btnCloseWebsite2.addEventListener("click", async () => {
    console.log("btnCloseWebsite2 was clicked");
    closeWebsite(true);
  });
});
