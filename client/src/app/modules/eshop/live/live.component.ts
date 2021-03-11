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
  constructor(
    private store: Store<fromRoot.State>,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {
    this.loading$ = this.store.select(fromRoot.getEshopLoading);
    this.error$ = this.store.select(fromRoot.getEshopError);
  }


  const socket = io('http://localhost:5001'); //location of where server is hosting socket app
/* socket.on('chat-message', data =>{
    console.log(data);
}); */

// query DOM
const message = document.getElementById('message');
const handle = document.getElementById('handle');
const button =  document.getElementById('submit');
const output = document.getElementById('output');
const typing = document.getElementById('typing');


// Emit events

button.addEventListener('click', () =>
{
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    })
    document.getElementById('message').value="";

}) 

message.addEventListener('keypress',() =>{
socket.emit('userTyping',handle.value)
})

// Listen to events

socket.on('chat', (data)=>{
    typing.innerHTML="";
    output.innerHTML += '<p> <strong>' + data.handle + ': </strong>' + data.message + '</p>'
})

socket.on('userTyping',(data)=>{
    typing.innerHTML='<p style="color:green"><i><em><b>' + data+ '</b> kullanıcısı yazıyor...</em></></p>'


})


  

  
  

