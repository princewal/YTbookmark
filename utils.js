/**
 * Returns the current active tab in chrome
 * @returns tab
 */
export async function getCurrentTabURL() {
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    active: true,
  })
  return tabs[0]
}
