import {
  CollectionReference,
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from '@firebase/firestore';
import { Firestore, collectionData, docData } from '@angular/fire/firestore';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Pokemon {
  height: number;
  id: string;
  description: string;
  imgUrl: string;
  name: string;
  type: string;
  weight: number;
}

@Injectable({
  providedIn: 'root',
})
export class PokedexFirestoreService {
  public pokemonCollection: CollectionReference<DocumentData>;

  constructor(public readonly firestore: Firestore) {
    this.pokemonCollection = collection(this.firestore, 'produse');
  }

  log(){
console.log(this.pokemonCollection)

  }
  getAll() {
    return collectionData(this.pokemonCollection, {
      idField: 'ean',
    }) as Observable<any[]>;
  }

  get(id: string) {
    const pokemonDocumentReference = doc(this.firestore, `produse/${id}`);
    return docData(pokemonDocumentReference, { idField: 'ean' });
  }

  create(pokemon: any) {
    return addDoc(this.pokemonCollection, pokemon);
  }

  update(pokemon: any) {
    const pokemonDocumentReference = doc(
      this.firestore,
      `pokemon/${pokemon.id}`
    );
    return updateDoc(pokemonDocumentReference, { ...pokemon });
  }

  delete(id: string) {
    const pokemonDocumentReference = doc(this.firestore, `produse/${id}`);
    return deleteDoc(pokemonDocumentReference);
  }
}
