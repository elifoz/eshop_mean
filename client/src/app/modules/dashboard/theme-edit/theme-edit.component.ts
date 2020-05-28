import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs';
import {  take } from 'rxjs/operators';

import * as fromRoot from '../../../store/reducers';
import * as actions from '../../../store/actions';
import { languages } from '../../../shared/constants';
import { ThemeService } from '../../../services/theme.service';


@Component({
  selector: 'app-theme-edit',
  templateUrl: './theme-edit.component.html',
  styleUrls: ['./theme-edit.component.scss'],
})
export class ThemeEditComponent {
  themes$: Observable<any>;
  themesEditForm: FormGroup;
  languageOptions = languages;
  choosenLanguageSub$ = new BehaviorSubject(languages[0]);
  newTheme = '';
  chosenTheme = '';
  sendRequest = false;

  constructor(
      private store: Store<fromRoot.State>,
      private fb: FormBuilder,
      private themeService: ThemeService,
      ) {
    this.store.dispatch(new actions.GetThemes());

    this.themesEditForm = this.fb.group({
      titleUrl: ['', Validators.required],
      active  : false,
      primaryColor: '#222222',
      secondaryColor: '#cccccc',
      backgroundColor: '#eeeeee',
      mainBackground: ''
    });

    this.themes$ = this.store.select(fromRoot.getThemes);

    this.themesEditForm.valueChanges.subscribe(values => {
      this.themeService.setColor(values.primaryColor, 'primary-color');
      this.themeService.setColor(values.secondaryColor, 'secondary-color');
      this.themeService.setColor(values.backgroundColor, 'background-color');
      this.themeService.setThemeColor(values.primaryColor, 'theme-primary');
      this.themeService.setThemeColor(values.secondaryColor, 'theme-secondary');
    })
  }

  addTheme(): void {
    if (this.newTheme) {
      this.themesEditForm.get('titleUrl').setValue(this.newTheme);
    }
  }

  choseTheme(): void {
    if (this.chosenTheme) {
      this.themesEditForm.get('titleUrl').setValue(this.chosenTheme);
      this.themes$.pipe(take(1)).subscribe((themes) => {
        const foundTheme = themes.find((theme) => theme.titleUrl === this.chosenTheme);
        this.themesEditForm.get('active').setValue(!!foundTheme.active);
        this.themesEditForm.get('primaryColor').setValue(foundTheme.styles.primaryColor || '');
        this.themesEditForm.get('secondaryColor').setValue(foundTheme.styles.secondaryColor || '');
        this.themesEditForm.get('backgroundColor').setValue(foundTheme.styles.backgroundColor || '');
        this.themesEditForm.get('mainBackground').setValue(foundTheme.styles.mainBackground || '');
      });
    }
  }

  saveTheme(): void {
    const formValues = this.themesEditForm.value;
    const request = {
      titleUrl: formValues.titleUrl,
      active  : formValues.active,
      styles: {
        primaryColor: formValues.primaryColor,
        secondaryColor: formValues.secondaryColor,
        backgroundColor: formValues.backgroundColor,
        mainBackground: formValues.mainBackground,
      }
    }
    this.store.dispatch(new actions.AddOrEditTheme(request));
    this.sendRequest = true;
  }

  removeTheme(): void {
    this.store.dispatch(new actions.RemoveTheme(this.chosenTheme));
    this.sendRequest = true;
  }

}
