import { createContext } from 'preact';

export const TokenContext = createContext<string | null>(null);

export function openNewTab(url: string) {
  chrome.tabs.query({ currentWindow: true }, tabs => {
    const existingTab = tabs.find(tab => tab.url === url);

    if (existingTab !== undefined) {
      chrome.tabs.update(existingTab.id as number, { active: true });
    } else {
      chrome.tabs.create({ url });
    }
  });
}

export async function getPageInfo(): Promise<{
  url: string;
  title: string;
}> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(
        tabs[0].id as number,
        { message: 'getPageInfo' },
        resolve
      );
    });
  });
}

export function capitalize(str: string): string {
  return str
    .split(/\s+/g)
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}
