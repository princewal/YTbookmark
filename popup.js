import { getCurrentTabURL } from "./utils.js"

const addNewBookmark = (bookmarksElement, bookmark) => {
  const bookmarkTitleElement = document.createElement("div")
  const newBookmarkElement = document.createElement("div")
  const controlsElement = document.createElement("div")

  bookmarkTitleElement.textContent = bookmark.desc
  bookmarkTitleElement.className = "bookmark-title"

  controlsElement.className = "bookmark-controls"

  newBookmarkElement.id = "bookmark-" + bookmark.time
  newBookmarkElement.className = "bookmark"
  newBookmarkElement.setAttribute("timestamp", bookmark.time)

  setBookmarkAttributes("play", onPlay, controlsElement)
  setBookmarkAttributes("delete", onDelete, controlsElement)

  newBookmarkElement.appendChild(bookmarkTitleElement)
  newBookmarkElement.appendChild(controlsElement)
  bookmarksElement.appendChild(newBookmarkElement)
}

const viewBookmarks = (currentBookmarks = []) => {
  const bookmarksElement = document.getElementById("bookmarks")
  bookmarksElement.innerHTML = ""
  if (currentBookmarks.length > 0) {
    for (let bm of currentBookmarks) {
      addNewBookmark(bookmarksElement, bm)
    }
  } else {
    bookmarksElement.innerHTML = '<i class="row">No bookmarks to show. </i>'
  }
}

const onPlay = async (e) => {
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp")
  const activeTab = await getCurrentTabURL()
  console.log("on play activeTab", activeTab)
  chrome.tabs.sendMessage(activeTab.id, {
    type: "PLAY",
    value: bookmarkTime,
  })
}

const onDelete = async (e) => {
  const activeTab = await getCurrentTabURL()
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp")
  console.log("on delete activeTab", activeTab, bookmarkTime)
  const bookmarksElementToDelete = document.getElementById(
    "bookmark-" + bookmarkTime
  )
  console.log("bokmark delete element", bookmarksElementToDelete)

  bookmarksElementToDelete.parentNode.removeChild(bookmarksElementToDelete)

  chrome.tabs.sendMessage(
    activeTab.id,
    {
      type: "DELETE",
      value: bookmarkTime,
    },
    viewBookmarks
  )
}

const setBookmarkAttributes = (src, eventListener, controlParentElement) => {
  const controlElement = document.createElement("img")

  controlElement.src = "assets/" + src + ".png"
  controlElement.title = src
  controlElement.addEventListener("click", eventListener)
  controlParentElement.appendChild(controlElement)
}

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getCurrentTabURL()
  const queryParameters = activeTab.url.split("?")[1]
  const urlParameters = new URLSearchParams(queryParameters)

  const currentVideo = urlParameters.get("v")

  if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
    chrome.storage.sync.get([currentVideo], (data) => {
      const currentVideoBookmarks = data[currentVideo]
        ? JSON.parse(data[currentVideo])
        : []
      viewBookmarks(currentVideoBookmarks)
    })
  } else {
    const container = document.querySelector(".container")
    container.innerHTML =
      '<div class="title">This is not a Youtube video page.</div>'
  }
})
