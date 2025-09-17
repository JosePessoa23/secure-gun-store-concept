import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LicenseService } from '../../services/licenseService';
import { lastValueFrom } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { ApplicationStatusDTO } from '../../dto/applicationStatusDTO';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private licenseService: LicenseService,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      birthDate: ['', Validators.required],
      medicalCertificate: [null, Validators.required],
      documentId: [null, Validators.required],
      dataConsent: [false, Validators.requiredTrue]
    });
  }


  onFileSelected(event: Event, controlName: string): void {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];
    const maxFileSize = 10 * 1024 * 1024;

    if (file && file.type === 'application/pdf') {
      if (file.size <= maxFileSize) {
        this.form.get(controlName)?.setValue(file);
      } else {
        inputElement.value = '';
        alert('O tamanho do arquivo excede o limite de 10 MB.');
      }
    } else {
      inputElement.value = '';
      alert('Por favor, selecione um arquivo PDF.');
    }
  }

  async uploadFile() {
    console.log(this.form.valid);
    if (this.form.valid) {
      const formData = this.form.value;
  
      if (formData.medicalCertificate && formData.documentId) {
        const reader = new FileReader();
        const medicalCertificateFile = formData.medicalCertificate;
        const documentIdFile = formData.documentId;
  
        const medicalCertificateArrayBuffer = await this.readFileAsArrayBuffer(medicalCertificateFile);
        const documentIdArrayBuffer = await this.readFileAsArrayBuffer(documentIdFile);

        console.log(medicalCertificateArrayBuffer)
        console.log(documentIdArrayBuffer)
        const flagName = this.sanitizer.sanitize(1,formData.name);
        const flagEmail = this.sanitizer.sanitize(1,formData.email);
        const flagAddress = this.sanitizer.sanitize(1,formData.address);
  
        if(flagName!=null && flagEmail!=null && flagAddress!=null){
        try {
          const response = await lastValueFrom(
            this.licenseService.uploadFile(
              new Uint8Array(medicalCertificateArrayBuffer),
              medicalCertificateFile.name,
              new Uint8Array(documentIdArrayBuffer),
              documentIdFile.name,
              formData.name,
              formData.email,
              formData.address,
              formData.birthDate,
              formData.dataConsent
            )
          );
          alert('Pedido enviado com sucesso');
          window.location.reload();
        
        } catch (error) {
          alert('Erro ao enviar arquivo' + error);
        }
      }
      } else {
        alert('Por favor, selecione os arquivos necessários');
      }
    } else {
      alert('Por favor, preencha todos os campos obrigatórios');
    }
  }

  readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file as ArrayBuffer'));
        }
      };
      reader.onerror = () => {
        reject(reader.error);
      };
      reader.readAsArrayBuffer(file);
    });
}
}
