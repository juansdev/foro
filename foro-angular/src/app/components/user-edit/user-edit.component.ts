import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { UserService } from 'src/app/services/user.service';
import { global } from 'src/app/services/global';
import { User } from "../../models/user";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers:[
    UserService
  ]
})
export class UserEditComponent implements OnInit {

  public page_title:string;
  public status: string;
  public user: User;
  public identity;
  public token;
  public afuConfig:any;
  public url;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _userService: UserService
  ) {
    this.page_title = "Ajustes de usuario";
    this.status = "";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = this.identity;
    this.url = global.url;
    this.afuConfig = {
      multiple: false,//un solo archivo
      formatsAllowed: ".jpg,.jpeg,.png,.gif",//formatos permitidos
      maxSize: '50',//maximo de 50 megas
      uploadAPI: {
        url: this.url + 'upload-avatar',
        headers: {
          Authorization: this.token,
        },
        responseType: 'json',
      },
      theme: 'attachPin',
      hideProgressBar: false,
      hideResetBtn: true,
      hideSelectBtn: false,
      attachPinText: 'Subir archivo',
      replaceTexts: {
        selectFileBtn: 'Seleccione un archivo',
        resetBtn: 'Reiniciar',
        uploadBtn: 'Subir',
        dragNDropBox: 'Arrastre y suelte',
        attachPinBtn: 'Sube tu avatar',
        afterUploadMsg_success: 'Subida exitosa !',
        afterUploadMsg_error: 'Subida erronea !',
        sizeLimit: 'peso excedido',
      },
    }
  }

  ngOnInit(): void {
  }

  onSubmit(form:any){
    this._userService.update(this.user).subscribe(
      response=>{
        if(!response.user) this.status = "error";
        else{
          this.status = "success";
          localStorage.setItem("identity",JSON.stringify(this.user));
        }
      },
      error=>{
        this.status = "error";
        console.log(<any>error);
      }
    );
  }

  avatarUpload(data:any) {
    let data_obj = data.body;
    this.user.image = data_obj.user.image;
  }

}
