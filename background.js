chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.type === "GET_FB_PRICE") {

    chrome.tabs.create(
      { url: message.url, active: false },
      (tab) => {

        // Wait until Facebook page fully loads
        chrome.tabs.onUpdated.addListener(function listener(tabId, info) {

          if (tabId === tab.id && info.status === "complete") {

            chrome.tabs.onUpdated.removeListener(listener);

            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ["facebookScraper.js"]
            });

            const priceListener = (msg, senderTab) => {

              if (msg.type === "FB_PRICE" && senderTab.tab.id === tab.id) {

                chrome.runtime.onMessage.removeListener(priceListener);

                sendResponse({ price: msg.price });

                chrome.tabs.remove(tab.id);
              }
            };

            chrome.runtime.onMessage.addListener(priceListener);
          }

        });

      }
    );

    return true;
  }

});
