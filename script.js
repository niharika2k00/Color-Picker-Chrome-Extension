// var imgarr = [];

// const imgs = document.getElementsByTagName("img");
// for (let i = 0; i < imgs.length; i++) {
//   const random = Math.floor(Math.random() * imgs.length);
//   // imgs[i].src = imgarr[0];
// }

// (function () {
//   // alert("Chrome Extention running.");
// })();

const button = document.querySelector(".btn");
const displayColor = document.querySelector("#displayColor");
const colorGrid = document.querySelector(".colorGrid");
const colorValue = document.querySelector(".colorValue");

// browser.tabs.query(queryObj , callback)
chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
  console.log(tabs[0]);
});

// chrome.tabs
//   .query({ currentWindow: true, active: true })
//   .then((tabs) => console.log(tabs[0]));

button.addEventListener("click", async () => {
  try {
    console.log("add event listener");

    let tabArr = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log(tabArr[0]);

    // Inject js script into website  - asynchronous function that returns a Promise.
    // ReturnType: array of InjectionResult
    // chrome.scripting.executeScript(
    //   {
    //     target: { tabId: tabArr[0].id },
    //     func: getColor,
    //   },
    //   async (injectionResults) => {
    //     console.log(injectionResults);
    //   }
    // );

    // chrome.scripting
    //   .executeScript({
    //     target: { tabId: tabArr[0].id },
    //     func: getColor,
    //   })
    //   .then((injectionResults) => {
    //     console.log(injectionResults);
    //   });

    let injectionResults = await chrome.scripting.executeScript({
      target: { tabId: tabArr[0].id },
      func: getColor,
    });

    let res = await injectionResults;
    console.log(res);

    if (res.length) {
      let color = res[0].result.sRGBHex;
      colorGrid.style.backgroundColor = color;
      colorValue.innerHTML = color;
    }
  } catch (err) {
    console.log(err);
  }
});

var getColor = async () => {
  try {
    const eyeDropper = new EyeDropper();
    return await eyeDropper.open();
    // eyeDropper.open().then((res) => {
    //   console.log("Picked color => ", res);
    //   return res;
    // });
  } catch (e) {
    console.log(err);
  }
};

/*
  Reference : https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/query
  https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper
*/
