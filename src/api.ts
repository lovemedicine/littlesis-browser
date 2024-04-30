import { baseUrl } from '@src/config';
import { openNewTab } from '@src/util';
import { LsEntity, Entity } from '@src/types';

function prepareLsEntity(entity: LsEntity): Entity {
  const { id, name, primary_ext, url, blurb } = entity;
  return { id, name, type: primary_ext.toLowerCase(), url, blurb };
}

export async function getToken(): Promise<string | null> {
  const response = await fetch(baseUrl + '/home/token', {
    credentials: 'include',
  });

  if (response.status == 200) {
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return (
      doc.querySelector("meta[name='csrf-token']")?.getAttribute('content') ||
      null
    );
  }

  return null;
}

export async function searchForEntity(
  name: string,
  num = 8
): Promise<Entity[]> {
  if (name.length < 2) return [];

  const response = await fetch(
    baseUrl + `/search/entity?q=${encodeURIComponent(name)}`
  );
  const data = await response.json();
  return data.map(prepareLsEntity).slice(0, num);
}

export function openLoginTab() {
  return openNewTab(baseUrl + '/login');
}
