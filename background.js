chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.type === "GET_FB_PRICE") {

    chrome.windows.create({
      url: message.url,
      focused: false,
      state: "minimized"
    }, (window) => {

      const tabId = window.tabs[0].id;

      chrome.tabs.onUpdated.addListener(function listener(updatedTabId, info) {

        if (updatedTabId === tabId && info.status === "complete") {

          chrome.tabs.onUpdated.removeListener(listener);

          chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["facebookScraper.js"]
          });

          const priceListener = (msg, senderTab) => {

            if (msg.type === "FB_PRICE" && senderTab.tab.id === tabId) {

              chrome.runtime.onMessage.removeListener(priceListener);

              sendResponse({ price: msg.price });

              // Close entire hidden window
              chrome.windows.remove(window.id);
            }
          };

          chrome.runtime.onMessage.addListener(priceListener);
        }

      });

    });

    return true;
  }

});
