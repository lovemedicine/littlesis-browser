import { baseUrl } from '@src/config';
import { openNewTab, capitalize } from '@src/util';
import { LsEntity, Entity } from '@src/types';

function convertLsEntityToEntity(entity: LsEntity): Entity {
  const { id, name, primary_ext, url, blurb } = entity;
  return { id, name, type: primary_ext.toLowerCase(), url, blurb };
}

function getLsIdFromUrl(url: string): number | null {
  const re = new RegExp(`${baseUrl}/[^\\/]+/(\\d+)-`, 'g');
  const match = re.exec(url);
  return match ? parseInt(match[1]) : null;
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
  return data.map(convertLsEntityToEntity).slice(0, num);
}

type CreateEntityData = {
  name: string;
  type: string;
  blurb?: string;
};

export async function createEntity(
  token: string,
  data: CreateEntityData
): Promise<Entity | null> {
  const submitData = {
    entity: {
      name: data.name,
      primary_ext: capitalize(data.type),
      blurb: data.blurb,
    },
    add_relationship_page: true,
  };

  const response = await fetch(baseUrl + '/entities', {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': token,
    },
    body: JSON.stringify(submitData),
  });

  const url = response.url;
  if (!response.ok || !url) return null;
  const id = getLsIdFromUrl(url);
  console.log('id', id);
  if (!id) return null;
  const entity = { ...data, id, url };
  console.log('created entity', url, entity);
  return entity;
}

export function openLoginTab() {
  return openNewTab(baseUrl + '/login');
}
