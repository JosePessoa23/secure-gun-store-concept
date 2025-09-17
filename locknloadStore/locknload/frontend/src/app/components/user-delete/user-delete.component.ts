import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/userService';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-user-delete',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-delete.component.html',
  styleUrl: './user-delete.component.css',
})
export class UserDeleteComponent {
  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
    private appComponent: AppComponent
  ) {}

  onSend() {
    const userConfirmed = window.confirm(
      'This action will delete your account and you cant go back, are you sure?'
    );
    if (userConfirmed) {
      alert('Your account will be deleted');
      this.userService.deleteUser().subscribe(
        (response) => {
          this.router.navigate(['/home']);
          this.appComponent.logout();
        },
        (error) => {
          alert('Error deleting user');
        }
      );
    } else {
      alert('Thanks for staying');
      this.router.navigate(['/home']);
    }
  }
}
