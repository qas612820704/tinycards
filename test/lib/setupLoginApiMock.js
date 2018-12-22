import { use } from 'chai';
import nock from 'nock';
import { eq } from 'lodash';

use(require('chai-as-promised'));

export const identifier = 'correct-identifier';
export const password = 'correct-password';
export const jwtToken = 'foo.bar.yee';

export default () => nock('https://tinycards.duolingo.com/api/1')
  .persist()
  .post('/login')
  .reply((_, body) => (eq(body, JSON.stringify({ identifier, password }))
    ? [
      201, {
        id: 9527,
        email: 'foo@bar.com',
        fullname: 'Nock foo user',
      }, {
        'Set-Cookie': `jwt_token=${jwtToken}`,
      },
    ] : [
      401, {
        message: "Oops, something went wrong! You may be doing something you shouldn't be :)",
      },
    ]
  ));
