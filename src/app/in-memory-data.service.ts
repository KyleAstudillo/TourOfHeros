import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Hero } from './hero';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const heroes = [
      { id: 11, name: 'Hazel' },
      { id: 12, name: 'Black' },
      { id: 13, name: 'Colombian' },
      { id: 14, name: 'Pumpkin' },
      { id: 15, name: 'Egg Nog' },
      { id: 16, name: 'Black Berry' },
      { id: 17, name: 'Vanilla' },
      { id: 18, name: 'Carmel' },
      { id: 19, name: 'White Bean' },
      { id: 20, name: 'Cat poop' }
    ];
    return {heroes};
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(heroes: Hero[]): number {
    return heroes.length > 0 ? Math.max(...heroes.map(hero => hero.id)) + 1 : 11;
  }
}
