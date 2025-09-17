import { ShoppingItem } from "./shopping-item.model";
import { Weapon } from "./weapon.model";

export class ShoppingCart {
  items: ShoppingItem[];

  constructor(items: ShoppingItem[]) {
    this.items = items;
  }

  // add item receives a Weapon and a quantity
  // if the item is already in the cart, it increases the quantity
  // otherwise, it adds a new item to the cart
  addItem(weapon: Weapon, quantity=1) {
    const existingItem = this.items.find((i) => i.weapon.name === weapon.name);
    if (existingItem) {
      existingItem.addQuantity();
    } else {
      this.items.push(new ShoppingItem(weapon, quantity));
    }
  }

  removeItem(item: ShoppingItem) {
    this.items = this.items.filter((i) => i !== item);
  }

  getItems(): Weapon[] {
    return this.items.map((i) => i.weapon);
  }

  getShoppingItems(): ShoppingItem[] {
    return this.items;
  }
}
