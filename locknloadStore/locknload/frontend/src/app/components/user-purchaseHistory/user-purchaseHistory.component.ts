import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/orderService';
import { OrderDTO } from '../../dto/orderDTO';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-purchaseHistory.component.html',
  styleUrl: './user-purchaseHistory.component.css',
})
export class UserPurchaseHistoryComponent implements OnInit {
  orders: OrderDTO[] = [];

  constructor(private http: HttpClient, private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getOrders().subscribe(
      (data) => (this.orders = data),
      (error) => console.error('Error fetching orders', error)
    );
  }
}
