import fetch from 'node-fetch';
import { parse as cookieParser } from 'cookie';

import { API_PREFIX, ResponseError } from './index';

const logger = require('debug')('api:login');

export async function login(identifier, password) {
  logger(`login ${identifier}, ${password}`);

  if (!identifier || !password) throw new TypeError('identifer, password must be passed');

  const response = await fetch(`${API_PREFIX}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ identifier, password }),
  });

  if (!response.ok) {
    logger(`${response.status} ${response.statusText} ${await response.text()}`);
    throw new ResponseError('login failed');
  }

  const { jwt_token: jwtToken, ...cookie } = cookieParser(
    response.headers.get('set-cookie'),
  );

  const profile = {
    ...await response.json(),
    cookie: {
      jwtToken,
      ...cookie,
    },
  };

  return profile;
}

export default {};
