import {
  closeDuplicates,
  sortTabsByTitle,
  sortTabsByUrl,
  sortTabsByUrl2,
  closeWebsite
} from "./actions";
console.log("Extension loading");

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
