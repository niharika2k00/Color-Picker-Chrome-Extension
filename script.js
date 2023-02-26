const button = document.querySelector(".btn");
const displayColor = document.querySelector("#displayColor");
const colorGrid = document.querySelector(".colorGrid");
const colorValue = document.querySelector(".colorValue");
const colorValueRgb = document.querySelector(".colorValueRgb");

// chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
//   console.log(tabs[0]);
// });

// chrome.tabs
//   .query({ currentWindow: true, active: true })
//   .then((tabs) => console.log(tabs[0]));

if (button) {
  button.addEventListener("click", async () => {
    try {
      console.log("add event listener");

      let tabArr = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
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

      // chrome.scripting.executeScript({
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

      if (res[0].result) {
        let color = res[0].result.sRGBHex;
        colorValueRgb.innerHTML =
          color + ' <img src="./logo/wheel.png" style="height: 1.7rem" />';
        color = color.split(",");
        console.log(color);
        var r = Number(color[0].split("(")[1].trim());
        var g = Number(color[1].trim());
        var b = Number(color[2].trim());

        var hexColor = rgbToHex(r, g, b);
        console.log(hexColor);
        colorGrid.style.backgroundColor = hexColor;
        colorValue.innerHTML = hexColor;

        // Copy text to clipboard
        hexColorCopy(hexColor);
      }
    } catch (err) {
      console.log(err);
    }
  });
}

var hexColorCopy = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Text copied : ", text);
  } catch (err) {
    console.log(err);
  }
};

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

var rgbToHex = (r, g, b) => {
  console.log(typeof r); // Number required

  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);

  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;

  return "#" + r + g + b;
};

/*
  Reference : https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/query
  https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper
*/
