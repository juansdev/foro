import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Topic } from "../../../models/topic";
import { UserService } from "../../../services/user.service";
import { TopicService } from "../../../services/topic.service";

@Component({
  selector: 'app-edit',
  templateUrl: '../add/add.component.html',
  styleUrls: ['../add/add.component.css'],
  providers: [
    UserService,
    TopicService
  ]
})
export class EditComponent implements OnInit {

  public page_title:string;
  public topic: Topic;
  public identity;
  public token;
  public status:string;
  public is_edit: boolean;

  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _topicService: TopicService
  ) {
    this.page_title = "Editar tema";
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();
    this.topic = new Topic("","","","","","",this.identity._id,"");
    this.status = "";
    this.is_edit = true;
  }

  ngOnInit(): void {
    this.getTopic();
  }

  getTopic(){
    this._route.params.subscribe(params=>{
      let id = params["id"];
      this._topicService.getTopic(id).subscribe(
        response=>{
          if(!response.topic){
            this._router.navigate(["/panel"]);
            this.status = "error";
          }
          else{
            this.topic = response.topic;
          }
        },
        error=>{
          console.log(<any>error);
          this.status = "error";
        }
      );
    });
  }

  onSubmit(form:any){
    const id = this.topic._id;
    this._topicService.update(this.token,id,this.topic).subscribe(
      response=>{
        if(response.topic){
          this.status = "success";
          this.topic = response.topic;
        }
        else{
          this.status = "error";
        }
      },
      error=>{
        console.log(<any>error);
        this.status = "error";
      }
    );
  }

}
