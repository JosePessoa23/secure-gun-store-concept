import { Weapon } from "./weapon.model";

export class ShoppingItem {
  weapon: Weapon;
  quantity: number;

  constructor(weapon: Weapon, quantity: number) {
    this.weapon = weapon;
    this.quantity = quantity;
  }

  addQuantity() {
    console.log("Adding quantity");
    this.quantity += 1;
  }

  getSubtotal(): number {
    return this.weapon.price * this.quantity;
  }

  removeQuantity() {
    this.quantity -= 1;
  }
}
