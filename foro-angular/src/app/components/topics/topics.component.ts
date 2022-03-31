import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.css'],
  providers: [
    TopicService
  ]
})
export class TopicsComponent implements OnInit {

  public page_title: string;
  public topics: any;
  public totalPages: any;
  public page;
  public next_page;
  public prev_page;
  public number_pages:Array<number>;
  public status:string;
  public no_paginate:boolean;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _topicService: TopicService
  ) {
    this.page_title = "Temas";
    this.totalPages = [];
    this.page = "";
    this.next_page = 1;
    this.prev_page = 1;
    this.number_pages = [];
    this.status = "";
    this.no_paginate = true;
  }

  ngOnInit(): void {
    this._route.params.subscribe(params=>{
      let page = +params["page"];
      if(!page){
        page = 1;
        this.prev_page = 1;
        this.next_page = 2;
      }
      this.getTopics(page);
    })
  }

  getTopics(page=1){
    this._topicService.getTopics(page).subscribe(
      response=>{
        if(response.topics){
          this.status = "success";
          this.topics = response.topics;
          console.log(response);
          //Navegación de paginación
          this.totalPages = response.totalPage;
          let number_pages = [];
          for (let index = 0; index < this.totalPages; index++) {
            number_pages.push(index+1);
          }
          this.number_pages = number_pages;
          if(page>=2)this.prev_page = page-1;
          else this.prev_page = 1;
          if(page< this.totalPages) this.next_page = page+1;
          else this.next_page = this.totalPages;
        }
        else{
          this._router.navigate(["/inicio"]);
        }
      },
      error=>{
        console.log(<any>error);
        this.status = "error";
      }
    );
  }

}
