chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.includes("youtube.com/watch")) {
    /* const queryParameters = new URLSearchParams(new URL(tab.url).search)    
    const videoId = queryParameters.get("v") */
    const queryParameters = tab.url.split("?")[1]
    const urlParameters = new URLSearchParams(queryParameters)
    console.log("urlparameters:", urlParameters)

    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      videoId: urlParameters.get("v"),
    })
  }
})
