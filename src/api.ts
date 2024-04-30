import { baseUrl } from '@src/config';
import { openNewTab } from '@src/util';

export async function getToken(): Promise<string | null> {
  const response = await fetch(baseUrl + '/home/token', {
    credentials: 'include',
  });

  if (response.status == 200) {
    const html = await response.text();
    console.log(html);
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return (
      doc.querySelector("meta[name='csrf-token']")?.getAttribute('content') ||
      null
    );
  }

  return null;
}

export function openLoginTab() {
  return openNewTab(baseUrl + '/login');
}
