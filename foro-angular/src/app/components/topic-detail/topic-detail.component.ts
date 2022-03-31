import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { TopicService } from 'src/app/services/topic.service';
import { UserService } from 'src/app/services/user.service';
import { global } from 'src/app/services/global';
import { CommentService } from 'src/app/services/comment.service';
import { Topic } from 'src/app/models/topic';
import { Comment } from "src/app/models/comment";

@Component({
  selector: 'app-topic-detail',
  templateUrl: './topic-detail.component.html',
  styleUrls: ['./topic-detail.component.css'],
  providers: [
    TopicService,
    UserService,
    CommentService
  ]
})
export class TopicDetailComponent implements OnInit {

  public topic: any;
  public status: String;
  public comment: Comment;
  public identity:any;
  public token;
  public url;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _topicService: TopicService,
    private _userService: UserService,
    private _commentService: CommentService
  ) {
    this.status = "";
    this.identity = {};
    this.token = this._userService.getToken();
    this.comment = new Comment("","","",this.identity._id);
    this.url = global.url;

    if(this.identity) this._userService.getIdentity();
  }

  ngOnInit(): void {
    this.getTopic();
  }

  getTopic(){
    this._route.params.subscribe(params=>{
      const id = params["id"];
      this._topicService.getTopic(id).subscribe(
        response=>{
          if(response.topic) this.topic = response.topic;
          else this._router.navigate(["/inicio"]);
        },
        error=>{
          console.log(<any>error);
          this.status = "error";
        }
      );
    });
  }

  onSubmit(form:any){
    this._commentService.add(this.token, this.comment, this.topic._id).subscribe(
      response=>{
        if(!response.topic) this.status = "error";
        else{
          this.topic = response.topic;
          this.status = "success";
          form.reset();
        }
      },
      error=>{
        this.status = "error";
        console.log(<any>error);
      }
    );
  }

  deleteComment(id:any){
    this._commentService.delete(this.token,this.topic._id,id).subscribe(
      response=>{
        if(!response.topic) this.status = "error";
        else{
          this.topic = response.topic;
          this.status = "success";
        }
      },
      error=>{
        this.status = "error";
        console.log(<any>error);
      }
    )
  }

}
