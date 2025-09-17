import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Weapon } from '../../models/weapon.model';
import { ShoppingCartService } from '../../services/shopping-cart-service.service';
@Component({
  selector: 'weapon-card',
  templateUrl: './weapon-card.component.html',
  styleUrl: './weapon-card.component.css'
})
export class WeaponCardComponent {
  @Input() weapon!: Weapon;
  weaponsSrc = 'assets/images/weapons/';

  constructor(private shoppingCartService: ShoppingCartService) {}

  onAddToCart() {
    this.shoppingCartService.addToCart(this.weapon);
  }
}
