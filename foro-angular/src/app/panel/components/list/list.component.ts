import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from "../../../services/user.service";
import { TopicService } from "../../../services/topic.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [
    UserService,
    TopicService
  ]
})
export class ListComponent implements OnInit {

  public page_title:string;
  public identity;
  public token;
  public status:string;
  public topics:any;

  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _topicService: TopicService
  ) {
    this.page_title = "Crear nuevo tema";
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();
    this.status = "";
  }

  ngOnInit(): void {
    this.getTopics();
  }

  getTopics(){
    let userId = this.identity._id;
    this._topicService.getTopicsByUser(userId).subscribe(
      response=>{
        if(response.topics){
          this.topics = response.topics;
          this.status = "success";
        }
        else this.status = "error";
      },
      error=>{
        console.log(<any>error);
      }
    )
  }

  deleteTopic(id:any){
    this._topicService.delete(this.token,id).subscribe(
      response=>{
        this.getTopics();
        this.status = "success";
      },
      error=>{
        console.log(<any>error);
        this.status = "error";
      }
    )
  }

}
