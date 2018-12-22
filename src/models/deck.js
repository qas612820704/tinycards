import FormData from 'form-data';
import { forEach, mapValues } from 'lodash';

export default class Deck {
  constructor(data) {
    this.update({
      // TODO: imgageFile: null,
      private: false,
      ttsLanguages: [],
      name: '',
      blacklistedSideIndices: [],
      blacklistedQuestionTypes: [],
      shareable: false,
      gradingModes: [],
      description: '',
      fromLanguage: 'en',
      ...data,
    });
  }

  update({ id, cards, ...data }) {
    this.id = this.id || id;
    this.cards = this.cards || cards || [];
    this.data = { ...this.data, ...data };
  }

  addCard(front, back) {
    this.cards = [
      ...this.cards,
      {
        sides: [
          { concepts: [{ fact: { type: 'TEXT', text: front } }] },
          { concepts: [{ fact: { type: 'TEXT', text: back } }] },
        ],
      },
    ];
  }

  toJson() {
    const {
      private: _p,
      ttsLanguages,
      name,
      blacklistedSideIndices,
      blacklistedQuestionTypes,
      shareable,
      gradingModes,
      description,
      fromLanguage,
    } = this.data;

    return {
      private: _p,
      ttsLanguages,
      name,
      blacklistedSideIndices,
      blacklistedQuestionTypes,
      shareable,
      gradingModes,
      description,
      fromLanguage,
      cards: this.cards,
    };
  }

  toFormData() {
    if (this.cards.length < 2) throw new TypeError('Deck must have more than 2 cards');

    const formData = new FormData();

    const stringifiedJson = mapValues(this.toJson(), (val) => {
      if (
        !(typeof val === 'string')
      ) return JSON.stringify(val);
      return val;
    });

    forEach(stringifiedJson, (val, field) => {
      formData.append(field, val);
    });

    return formData;
  }
}
