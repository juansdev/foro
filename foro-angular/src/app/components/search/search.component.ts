import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Topic } from 'src/app/models/topic';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-search',
  templateUrl: '../topics/topics.component.html',
  styleUrls: ['../topics/topics.component.css'],
  providers: [
    TopicService
  ]
})
export class SearchComponent implements OnInit {

  public page_title: string;
  public topics: any;
  public status: any;
  public no_paginate:boolean;
  public totalPages: any;
  public page;
  public next_page;
  public prev_page;
  public number_pages:Array<number>;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _topicService: TopicService
  ) {
    this.page_title = "";
    this.page = "";
    this.next_page = 1;
    this.prev_page = 1;
    this.number_pages = [];
    this.status = "";
    this.no_paginate = true;
  }

  ngOnInit(): void {
    this._route.params.subscribe(params=>{
      const search = params["search"];
      this.page_title = "Resultados encontrados de: "+search;
      this.getTopics(search);
    })
  }

  getTopics(search:any){
    this._topicService.search(search).subscribe(
      response=>{
        if(response.topics) {
          this.topics = response.topics;
          console.log(this.topics);
        }
        else this.status = "error";
      },
      error=>{
        console.log(<any>error);
        this.status = "error";
      }
    );
  }

}
