export function openNewTab(url: string) {
  chrome.tabs.query({ currentWindow: true }, tabs => {
    console.log(
      'tab urls',
      tabs.map(tab => tab.url)
    );
    const existingTab = tabs.find(tab => tab.url === url);

    if (existingTab !== undefined) {
      chrome.tabs.update(existingTab.id as number, { active: true });
    } else {
      chrome.tabs.create({ url });
    }
  });
}
