import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // register properties
  name: String;
  username: String;
  email: String;
  password: String;

  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private flashMessagesService: FlashMessagesService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onRegSubmit(){
    // user properties
    const user = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password
    }

    // check for required fields
    if(!this.validateService.validateReg(user)){
      this.flashMessagesService.show("Please fill in all fields", {cssClass: 'alert-danger', timeout: 2500});
      return false;
    }

    // validate email
    if(!this.validateService.validateEmail(user.email)){
      this.flashMessagesService.show("Please use a valid email", {cssClass: 'alert-danger', timeout: 2500});
      return false;
    }

    // register user
    this.authService.regUser(user).subscribe(data => {
      if(data.success){
        this.flashMessagesService.show("You are now registered", {cssClass: 'alert-success', timeout: 2500});
        this.router.navigate(['/login']);
      }
      else {
        this.flashMessagesService.show("Oops... something went wrong. Try registering again.", {cssClass: 'alert-danger', timeout: 2500});
        this.router.navigate(['/register']);
      }
    });
  }

}
