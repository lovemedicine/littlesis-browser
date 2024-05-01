export type LsEntity = {
  id: number;
  name: string;
  primary_ext: string;
  url: string;
  blurb?: string;
  [key: string]: unknown;
};

export type Entity = {
  id: number;
  name: string;
  type: string;
  url: string;
  blurb?: string;
};
