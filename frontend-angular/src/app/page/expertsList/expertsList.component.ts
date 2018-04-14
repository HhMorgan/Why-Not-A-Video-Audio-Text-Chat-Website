import { Component, OnInit } from '@angular/core';

import { APIService } from '../../@core/service/api.service';
import { APIData  , User , Tags } from '../../@core/service/models/api.data.structure'

@Component({
    selector: 'app-expertsList',
    templateUrl: './template/expertsList.component.html',
    styleUrls: ['./template/expertsList.component.scss']
})


export class ExpertsListComponent implements OnInit {
    requests: any;
    private tagName;

    constructor(private apiService:APIService){}

    ngOnInit()
    {
        this.tagSearch();
    }
    tagSearch(){
        const tag = <Tags>{};
        tag.name = this.tagName;
        this.apiService.viewSuggestedExperts(tag).subscribe((response:APIData)=>{
            console.log(response);
            this.requests = response.data;
        });
    }



    myEvent(event)
{}
}
