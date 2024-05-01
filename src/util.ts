import { createContext } from 'preact';

export const TokenContext = createContext<string | null>(null);

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

export function capitalize(str: string): string {
  return str
    .split(/\s+/g)
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}
