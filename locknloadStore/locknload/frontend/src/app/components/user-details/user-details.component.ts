import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/userService';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit {


  name = "";
  email = "";
  phoneNumber = "";
  birthDate: Date | null = null;
  address = "";

  ngOnInit() {

    this.userService.getUser().subscribe(
      data => {
        this.name = data.name;
        this.email= data.email;
        this.phoneNumber=data.phoneNumber;
        this.birthDate = data.birthDate ? new Date(data.birthDate) : null;
        this.address = data.morada;
      },
      error => console.error('Error fetching user', error)
    );

  }


  constructor(private http: HttpClient, private userService: UserService, private sanitizer: DomSanitizer) { }

  onNameChange(event: Event): void{
    const inputElement = event.target as HTMLInputElement;
    this.name = inputElement.value;
  }

  onAddressChange(event: Event): void{
    const inputElement = event.target as HTMLInputElement;
    this.address = inputElement.value;
  }

  onPhoneNumberChange(event: Event): void{
    const inputElement = event.target as HTMLInputElement;
    this.phoneNumber = inputElement.value;
  }

  onBirthDateChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const selectedDateStr = inputElement.value;
    const selectedDate = new Date(selectedDateStr);

    if (!isNaN(selectedDate.getTime())) {
      this.birthDate = selectedDate;
    } else {
      console.error('Invalid date selected');
    }
  }

  formatDate(date: Date | null): string {
    if (!date) {
      return '';
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  onSend() {
    const flagName = this.sanitizer.sanitize(1,this.name);
    const flagEmail = this.sanitizer.sanitize(1,this.email);
    const flagPhoneNumber = this.sanitizer.sanitize(1,this.phoneNumber);
    const flagAddress = this.sanitizer.sanitize(1,this.address);
    console.log(flagAddress)
    if(flagName!= "" && flagEmail!="" && flagPhoneNumber!="" && flagAddress!=""){
    const body = {
      name: flagName,
      email: flagEmail,
      phoneNumber: flagPhoneNumber,
      birthDate: this.birthDate,
      morada: flagAddress,
    }
    this.userService.updateUser(body).subscribe(
      response => {
        alert('User updated successfully');
      },
      error => {
        alert('Error updating user');
      }
    );
  }
  }


}
