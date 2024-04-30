export type LsEntity = {
  id: string;
  name: string;
  primary_ext: string;
  url: string;
  blurb?: string;
  [key: string]: unknown;
};

export type Entity = {
  id: string;
  name: string;
  type: string;
  url: string;
  blurb?: string;
};
