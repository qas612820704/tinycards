import * as apis from './apis';

export default (...args) => new Tinycards(...args);

class Tinycards {
  constructor(identifier, password, ...args) {
    this.profilePromise = apis.login(identifier, password, ...args);
  }
  async getProfile() {
    return await this.profilePromise;
  }
}
