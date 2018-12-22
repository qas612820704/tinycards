import { Deck } from './models';
import * as apis from './apis';

export default class Tinycards {
  constructor(...args) {
    if (args.length === 0) {
      throw TypeError('Tinycards need argument');
    } else if (args.length === 1) {
      const profile = args[0];
      this.profilePromise = new Promise(resolve => resolve(profile));
    } else {
      const [identifier, password, ...restArgs] = args;
      this.profilePromise = apis.login(identifier, password, ...restArgs);
    }
  }

  async getProfile() {
    return this.profilePromise;
  }

  async getDeck(deckId) {
    const profile = await this.profilePromise;
    const deckData = await apis.getDeck(profile, deckId);
    return new Deck(deckData);
  }

  async getDecks() {
    const { id } = await this.profilePromise;
    return apis.getDecks(id);
  }

  async createDeck(deck) {
    const profile = await this.profilePromise;
    const { id: deckId } = await apis.createDeck(profile, deck);
    return this.getDeck(deckId);
  }

  async updateDeck(deck) {
    const profile = await this.profilePromise;
    const { id: deckId } = await apis.updateDeck(profile, deck);
    return this.getDeck(deckId);
  }

  async deleteDeck(deckId) {
    const profile = await this.profilePromise;
    const deletedDeck = await apis.deleteDeck(profile, deckId);
    return new Deck(deletedDeck);
  }
}
