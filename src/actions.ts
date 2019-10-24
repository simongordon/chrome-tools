export const closeDuplicates = (groupHashes: boolean = false) =>
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

export const reverseHostname = (url: string) => {
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

export const closeWebsite = (keepCurrentOpen: boolean = false) =>
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

export const sortTabsByUrl = () => sortTabs((a, b) => compareStr(a.url, b.url));
export const sortTabsByTitle = () =>
  sortTabs((a, b) => compareStr(a.title, b.title));

export const sortTabsByUrl2 = () =>
  sortTabs((a, b) =>
    compareStr(reversePeriods(a.url || ""), reversePeriods(b.url || ""))
  );
