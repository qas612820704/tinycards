import nock from 'nock';
import { expect, use } from 'chai';
import setupLoginApiMock from './lib/setupLoginApiMock';
import * as apis from '../src/apis';

use(require('chai-as-promised'));


require('dotenv').config();

describe('login api', () => {

  before(() => {
    nock.disableNetConnect();

    setupLoginApiMock();
  });

  it('should be rejected with TypeError when blank identifier, password', async () => {
    await expect(apis.login()).to.be.rejectedWith(TypeError);
  });

  it('should be rejected with ResponseError when pass wrong identifier, password', async () => {
    await expect(apis.login('wrong-identifier', 'wrong-password'))
      .to.be.rejectedWith(apis.ResponseError);
  });

  it('should login succeess when use correct identifier and password', async () => {
    const profile = await apis.login('correct-identifier', 'correct-password');
    expect(profile).to.have.property('id');
    expect(profile).to.have.property('email');
    expect(profile).to.have.nested.property('cookie.jwtToken');
  });

});
