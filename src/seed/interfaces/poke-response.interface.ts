// Generated by https://quicktype.io

export interface PokeResponse {
  count: number;
  next: string;
  previous: null;
  results: Result[];
}

export interface PokeResponseOne {
  moves: string[];
  types: string[];
}
export interface Result {
  name: string;
  url: string;
}
