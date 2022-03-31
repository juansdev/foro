import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { User } from 'src/app/models/user';
import { global } from 'src/app/services/global';
import { TopicService } from 'src/app/services/topic.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers:[
    UserService,
    TopicService
  ]
})
export class ProfileComponent implements OnInit {
  public user: any;
  public topics: any;
  public url: string;
  public status: string;

  constructor(
    private _userService: UserService,
    private _topicService: TopicService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.user = new User("","","","","","","");
    this.url = global.url;
    this.status = "";
  }

  ngOnInit(): void {
    this._route.params.subscribe(params=>{
      let userId = params["id"];
      this.getUser(userId);
      this.getTopics(userId);
    });
  }

  getUser(userId:any){
    this._userService.getUser(userId).subscribe(
      response=>{
        if(response.user){
          this.user = response.user;
          console.log(this.user);
          this.status = "success";
        }
        else{
          this.status = "error";
          this._router.navigate(["/inicio"]);
        }
      },
      error=>{
        console.log(<any>error);
        this.status = "error";
      }
    )
  }

  getTopics(userId:any){
    this._topicService.getTopicsByUser(userId).subscribe(
      response=>{
        if(response.topics){
          this.topics = response.topics;
          console.log(this.topics);
          this.status = "success";
        }
        else this.status = "error";
      },
      error=>{
        console.log(<any>error);
      }
    );
  }

}
