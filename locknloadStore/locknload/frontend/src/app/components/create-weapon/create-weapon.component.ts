import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { WeaponService } from '../../services/weaponService';
import { TuiAlertService } from '@taiga-ui/core';
import { Weapon } from '../../models/weapon.model';
import { TuiFileLike } from '@taiga-ui/kit';
import { Subject, switchMap, of, Observable, timer, map, finalize } from 'rxjs';
import { FeatureManager } from '../feature-manager';
import { FeatureService } from '../../services/features.service';

@Component({
  selector: 'create-weapon',
  templateUrl: './create-weapon.component.html',
  styleUrl: './create-weapon.component.css',
})
export class CreateWeaponComponent extends FeatureManager {
  form: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required),
  });

  constructor(
    private service: WeaponService,
    private fb: FormBuilder,
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    featureService: FeatureService
  ) {
    super(featureService);
  }

  readonly rejectedFiles$ = new Subject<TuiFileLike | null>();
  readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  readonly loadedFiles$ = this.form
    .get('image')!
    .valueChanges.pipe(
      switchMap((file) => (file ? this.makeRequest(file) : of(null)))
    );

  onReject(file: TuiFileLike | readonly TuiFileLike[]): void {
    this.rejectedFiles$.next(file as TuiFileLike);
  }

  removeFile(): void {
    this.form.get('image')!.setValue(null);
  }

  clearRejected(): void {
    this.removeFile();
    this.rejectedFiles$.next(null);
  }

  makeRequest(file: TuiFileLike): Observable<TuiFileLike | null> {
    this.loadingFiles$.next(file);

    return timer(1000).pipe(
      map(() => {
        if (Math.random() > 0.5) {
          return file;
        }

        this.rejectedFiles$.next(file);

        return null;
      }),
      finalize(() => this.loadingFiles$.next(null))
    );
  }

  submit(): void {
    const imageField = this.form.get('image')!.value as TuiFileLike;
    const weapon = new Weapon(
      this.form.value.name,
      this.form.value.price,
      this.form.value.description,
      imageField.name
    );
    this.service.createWeapon(weapon).subscribe(() => {
      this.alerts
        .open('Weapon created successfully', {
          status: 'success',
        })
        .subscribe();
    });
    setTimeout(() => {
      this.form.reset();
    }, 2000);
  }
}
