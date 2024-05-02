chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.message === 'getPageInfo') {
    sendResponse({
      url: window.location.href,
      title: document.title,
    });
  }
});
