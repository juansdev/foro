import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [
    UserService
  ]
})
export class LoginComponent implements OnInit {

  public page_title:String;
  public user:User;
  public status:string;
  public identity:object;
  public token:string;

  constructor(
    private _userService:UserService,
    private _router:Router,
    private _route: ActivatedRoute
  ) {
    this.page_title = "Iniciar sesión";
    this.status = "";
    this.identity = {};
    this.token = "";
    this.user = new User("","","","","","","");
  }

  ngOnInit(): void {
  }

  onSubmit(form:any){
    //CONSEGUIR OBJETO COMPLETO DEL USUARIO LOGUEADO
    this._userService.signup(this.user).subscribe(
      response=>{
        if(response.user && response.user._id){
          //GUARDAMOS EL USUARIO EN UNA PROPIEDAD
          this.identity = response.user;
          //PERSISTENCIA DE DATOS DE USUARIO IDENTIFICADO
          localStorage.setItem("identity",JSON.stringify(this.identity));
          //CONSEGUIR EL TOKEN DEL USUARIO IDENTIFICADO
          this._userService.signup(this.user,true).subscribe(
            response=>{
              if(response.token){
                this.token = response.token;
                //PERSISTENCIA DE TOKEN DEL USUARIO IDENTIFICADO
                localStorage.setItem("token",this.token);
                this.status = "success";
                this._router.navigate(["/inicio"]);
              }
              else this.status = "error";
            },
            error=>{
              this.status = "error";
              console.log(<any>error);
            }
          );

        }
        else this.status = "error";
      },
      error=>{
        this.status = "error";
        console.log(<any>error);
      }
    );
  }

}
