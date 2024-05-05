import { baseUrl } from '@src/config';
import { openNewTab, capitalize } from '@src/util';
import { LsEntity, Entity } from '@src/types';

function convertLsEntityToEntity(entity: LsEntity): Entity {
  const { id, name, primary_ext, url, blurb } = entity;
  return { id, name, type: primary_ext.toLowerCase(), url, blurb };
}

function getIdFromEntityUrl(url: string): number | null {
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
  const id = getIdFromEntityUrl(url);
  if (!id) return null;
  const entity = { ...data, id, url };
  return entity;
}

type BooleanData = 'yes' | 'no' | 'null';

type CreateRelationshipData = {
  relationship: {
    entity1_id: number;
    entity2_id: number;
    category_id: string;
    description1: string | null;
    description2: string | null;
    is_current: BooleanData;
    start_date: string | null;
    end_date: string | null;
  };
  position_attributes?: {
    is_board: BooleanData;
    is_executive: BooleanData;
    is_employee: BooleanData;
    compensation: string | null;
  };
  education_attributes?: {
    field: string | null;
    degree_id: number | null;
  };
  amount?: string | null;
  reference: {
    url: string;
    name: string;
  };
};

type CreateRelationshipResponseData = {
  path: string;
  relationship_id: number;
  url: string;
};

export async function createRelationship(
  token: string,
  data: CreateRelationshipData
): Promise<CreateRelationshipResponseData | null> {
  const response = await fetch(baseUrl + '/relationships', {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': token,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) return null;
  return await response.json();
}

type EssentialRelationshipData = {
  entity1_id: string;
  entity2_id: string;
  category_id: string;
};

export async function findSimilarRelationships(
  token: string,
  data: EssentialRelationshipData
): Promise<{ url: string }[] | null> {
  const params = new URLSearchParams(data).toString();
  const url = baseUrl + '/relationships/find_similar?' + params;
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'X-CSRF-Token': token,
    },
  });

  if (!response.ok) return null;
  return await response.json();
}

export function openLoginTab() {
  return openNewTab(baseUrl + '/login');
}

type CategoryOption = [string, string, [string, string]];

export const categories: CategoryOption[] = [
  ['', 'relationship type', ['any', 'any']],
  ['1', 'Position', ['person', 'any']],
  ['2', 'Education', ['person', 'org']],
  ['3', 'Membership', ['any', 'org']],
  ['4', 'Family', ['person', 'person']],
  ['5', 'Donation/Grant', ['any', 'any']],
  ['6', 'Service/Transaction', ['any', 'any']],
  ['7', 'Lobbying', ['any', 'any']],
  ['8', 'Social', ['person', 'person']],
  ['9', 'Professional', ['person', 'person']],
  ['10', 'Ownership', ['any', 'org']],
  ['11', 'Hierarchy', ['org', 'org']],
  ['12', 'Generic', ['any', 'any']],
];

export function getAllowedCategories(
  type1?: string,
  type2?: string
): [string, string][] {
  if (!type1 || !type2) return [['', 'relationship type']];

  return categories
    .filter(cat => {
      const [t1, t2] = cat[2];
      return (t1 === 'any' || t1 === type1) && (t2 === 'any' || t2 === type2);
    })
    .map(cat => [cat[0], cat[1]]);
}

export function isAllowedCategory(
  type1: string | undefined,
  type2: string | undefined,
  categoryId: string
) {
  const allowedCategoryIds = getAllowedCategories(type1, type2).map(
    category => category[0]
  );
  return allowedCategoryIds.includes(categoryId);
}
