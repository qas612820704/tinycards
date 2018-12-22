export const API_PREFIX = 'https://tinycards.duolingo.com/api/1';

export class ResponseError extends Error {
  constructor(...args) {
    super(...args);
    this.name = 'ResponseError';
  }
}

export * from './login';
export * from './deck';
