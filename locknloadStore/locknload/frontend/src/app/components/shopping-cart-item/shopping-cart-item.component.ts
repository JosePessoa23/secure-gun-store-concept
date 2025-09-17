import { Component, Input } from '@angular/core';
import { ShoppingItem } from '../../models/shopping-item.model';
import { ShoppingCartService } from '../../services/shopping-cart-service.service';
import { FeatureManager } from '../feature-manager';
import { FeatureService } from '../../services/features.service';

@Component({
  selector: 'shopping-cart-item',
  templateUrl: './shopping-cart-item.component.html',
  styleUrl: './shopping-cart-item.component.css',
})
export class ShoppingCartItemComponent extends FeatureManager {
  @Input() item!: ShoppingItem;
  weaponsSrc = 'assets/images/weapons/';

  constructor(
    private shoppingCartService: ShoppingCartService,
    featureService: FeatureService
  ) {
    super(featureService);
  }

  removeFromCart(): void {
    this.shoppingCartService.removeFromCart(this.item.weapon);
  }

  incrementQuantity(): void {
    this.shoppingCartService.incrementQuantity(this.item.weapon);
  }

  decrementQuantity(): void {
    if (this.item.quantity > 1) {
      this.shoppingCartService.decrementQuantity(this.item.weapon);
    } else {
      this.removeFromCart();
    }
  }
}
