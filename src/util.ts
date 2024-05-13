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
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(
          tabs[0].id as number,
          { message: 'getPageInfo' },
          resolve
        );
      });
    } catch (error) {
      reject(error);
    }
  });
}

export function capitalize(str: string): string {
  if (str === '') return '';

  return str
    .trim()
    .split(/\s+/g)
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

export function parseNumberString(value: string): any {
  return value === '' ? null : value;
}

export type QueueItem = { [key: string]: any };

export function nextQueueItem(queue: string): [string, QueueItem | null] {
  const queueLines = queue.split(/\n+/);
  const parsedQueue = queueLines.map(line => line.split(/\s+,\s+/));
  if (parsedQueue.length < 2) return [queue, null];
  const keys = parsedQueue[0];
  const lineNum = parsedQueue.findIndex(
    (line, index) => index > 0 && line.length === keys.length
  );
  if (lineNum < 0) return [queue, null];
  const values = parsedQueue[lineNum];
  const item = Object.fromEntries(
    keys.map((key, index) => [key, values[index]])
  );
  const newQueue = [queueLines[0], ...queueLines.slice(lineNum + 1)].join('\n');
  return [newQueue, item];
}

export function countQueueItems(queue: string): number {
  return Math.max(
    0,
    queue.split(/\n+/).filter(line => line.length > 0).length - 1
  );
}
