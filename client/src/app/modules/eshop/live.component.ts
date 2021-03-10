import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { ReCaptchaV3Service } from 'ng-recaptcha';

import * as actions from '../../../store/actions';
import * as fromRoot from '../../../store/reducers';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss'],
})
export class LiveComponent {
  loading$: Observable<boolean>;
  error$: Observable<string>;
  sendRequestSub$ = new BehaviorSubject(false);
  contactForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private store: Store<fromRoot.State>,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {
    this.loading$ = this.store.select(fromRoot.getEshopLoading);
    this.error$ = this.store.select(fromRoot.getEshopError);
  }


  
    };
