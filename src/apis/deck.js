import fetch from 'node-fetch';
import { serialize as cookieSerializer } from 'cookie';
import { API_PREFIX, ResponseError } from './index';

const logger = require('debug')('api:decks');

function generateHeaderByUser(user) {
  if (!user) return {};

  return {
    cookie: cookieSerializer('jwt_token', user.cookie.jwtToken),
  };
}

export async function getDecks(userId) {
  logger(`getDecks userId:${userId}`);
  const response = await fetch(`${API_PREFIX}/decks?userId=${userId}`);

  if (!response.ok) throw new ResponseError('getDecks failed');

  return response.json();
}
export async function getDeck(user = null, deckId) {
  logger(`getDeck deckId:${deckId}`);

  const response = await fetch(`${API_PREFIX}/decks/${deckId}?expand=true`, {
    headers: generateHeaderByUser(user),
  });

  if (!response.ok) {
    logger(`${response.status} ${response.statusText} ${await response.text()}`);
    throw new ResponseError('getDeck failed');
  }

  return response.json();
}
export async function createDeck(user, deck) {
  logger(`createDeck user: ${user.email}, deck: ${deck.name}`);

  const form = deck.toFormData();

  const response = await fetch(`${API_PREFIX}/decks`, {
    method: 'post',
    headers: generateHeaderByUser(user),
    body: form,
  });

  if (!response.ok) {
    logger(`${response.status} ${response.statusText} ${await response.text()}`);
    throw new ResponseError('createDeck failed');
  }

  return response.json();
}
export async function updateDeck(user, deck) {
  logger(`updateDeck user: ${user.email}, deckId: ${deck.id}`);

  const form = deck.toFormData();

  const response = await fetch(`${API_PREFIX}/decks/${deck.id}`, {
    method: 'patch',
    headers: generateHeaderByUser(user),
    body: form,
  });

  if (!response.ok) {
    logger(`${response.status} ${response.statusText} ${await response.text()}`);
    throw new ResponseError('updateDeck failed');
  }

  return response.json();
}
export async function deleteDeck(user, deckId) {
  logger(`deleteDeck user: ${user.email}, deckId: ${deckId}`);

  const response = await fetch(`${API_PREFIX}/decks/${deckId}`, {
    method: 'delete',
    headers: generateHeaderByUser(user),
  });

  if (!response.ok) {
    logger(`${response.status} ${response.statusText} ${await response.text()}`);
    throw new ResponseError('deleteDeck failed');
  }

  return response.json();
}
export default {};
