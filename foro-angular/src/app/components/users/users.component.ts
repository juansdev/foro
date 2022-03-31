import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { global } from 'src/app/services/global';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers:[
    UserService
  ]
})
export class UsersComponent implements OnInit {
  public page_title:string;
  public users: any;
  public url: string;

  constructor(
    private _userService: UserService
  ) {
    this.users = new User("","","","","","","");
    this.url = global.url;
    this.page_title = "Compañeros";
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    this._userService.getUsers().subscribe(
      response=>{
        if(response.users){
          this.users = response.users;
          console.log(this.users);
        }
      },
      error=>{
        console.log(<any>error);
      }
    );
  }

}
