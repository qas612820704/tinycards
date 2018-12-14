import fetch from 'node-fetch';
import debug from 'debug';
import { parse as cookieParser } from 'cookie';

const logger = {
  login: debug('api:login'),
};

const API_PREFIX = 'https://tinycards.duolingo.com/api/1';

function ResponseError(message) {
  this.name = 'ResponseError';
  this.message = message;
}

const defaultLoginOption = { retry: 2 };
export async function login(identifier, password, { retry } = defaultLoginOption) {
  try {
    const response = await fetch(`${API_PREFIX}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify({ identifier, password }),
    });

    if (response.status !== 200) {
      logger.login(`${response.status} ${response.statusText} ${await response.text()}`);
      throw new ResponseError('login failed');
    }

    const { jwt_token: jwtToken, ...cookie } = cookieParser(
      response.headers.get('set-cookie')
    );

    const profile = {
      ...await response.json(),
      cookie: {
        jwtToken,
        ...cookie,
      }
    };
    return profile;
  } catch (e) {
    if (!e instanceof ResponseError) throw e;
    if (retry <= 0) throw e;

    logger.login(`Error retry to login, remain time: ${retry}`);

    return login(identifier, password, { retry: retry - 1 });
  }
}
