import { Injectable } from '@angular/core';
import { Weapon } from '../models/weapon.model';
import { Subject } from 'rxjs';
import { ShoppingCart } from '../models/shopping-cart.model';
import { ShoppingItem } from '../models/shopping-item.model';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  private shoppingCart: ShoppingCart = new ShoppingCart([]);
  private cartUpdated = new Subject<void>();
  cartUpdated$ = this.cartUpdated.asObservable();

  constructor() {
    // Load items from local storage on initialization
    const storedItems = localStorage.getItem('cartItems');
    if (storedItems) {
      const items = JSON.parse(storedItems);
      this.shoppingCart.items = items;
    }
  }

  addToCart(weapon: Weapon): void {
    this.shoppingCart.addItem(weapon);
    this.cartUpdated.next(); // Emit event
    this.saveToLocalStorage();
  }

  getItems(): ShoppingItem[] {
    return this.shoppingCart.getShoppingItems();
  }

  clearCart(): void {
    this.shoppingCart = new ShoppingCart([]);
    this.saveToLocalStorage();
  }

  private saveToLocalStorage() {
    const items = this.shoppingCart.getShoppingItems();
    localStorage.setItem('cartItems', JSON.stringify(items));
  }

  removeFromCart(weapon: Weapon): void {
    const item = this.shoppingCart
      .getShoppingItems()
      .find((i) => i.weapon.name === weapon.name);
    if (item) {
      this.shoppingCart.removeItem(item);
      this.cartUpdated.next(); // Emit event
      this.saveToLocalStorage();
    }
  }

  incrementQuantity(weapon: Weapon): void {
    const item = this.shoppingCart
      .getShoppingItems()
      .find((i) => i.weapon.name === weapon.name);
    if (item) {
      item.quantity++;
      this.cartUpdated.next(); // Emit event
      this.saveToLocalStorage();
    }
  }

  decrementQuantity(weapon: Weapon): void {
    const item = this.shoppingCart
      .getShoppingItems()
      .find((i) => i.weapon.name === weapon.name);
    if (item) {
      item.quantity--;
      if (item.quantity === 0) {
        this.removeFromCart(weapon);
      }
      this.cartUpdated.next(); // Emit event
      this.saveToLocalStorage();
    }
  }
}
