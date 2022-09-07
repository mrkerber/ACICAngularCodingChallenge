import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { LineOfBusiness } from '../LineOfBusiness';
import { LineOfBusinessService } from '../lineOfBusiness.service';

import { RecentQuote } from '../RecentQuote';
import { RecentQuoteService } from '../recentQuote.service';

@Component({
  selector: 'app-lineOfBusiness-detail',
  templateUrl: './lineOfBusiness-detail.component.html',
  styleUrls: [ './lineOfBusiness-detail.component.css' ]
})
export class LineOfBusinessDetailComponent implements OnInit {
  lineOfBusiness: LineOfBusiness | undefined;
  recentQuotes: RecentQuote[] = [];

  constructor(
    private route: ActivatedRoute,
    private lineOfBusinessService: LineOfBusinessService,
    private recentQuoteService: RecentQuoteService,
    private location: Location
  ) {}

  // MK: Resolved issue where detail page would not redirect to a new LOB detail from within page
  ngOnInit(): void {
    this.route.paramMap.subscribe((params)=>
      {
        const id = parseInt(params.get('id')!, 10)
        this.getLineOfBusiness(id);
        this.getRecentQuotes(id); 
      })
  }

  getLineOfBusiness(id: number): void {
    this.lineOfBusinessService.getLineOfBusiness(id)
      .subscribe(lineOfBusiness => this.lineOfBusiness = lineOfBusiness);
  }

  getRecentQuotes(lineOfBusinessId: number): void {
    this.recentQuoteService.getRecentQuotes(lineOfBusinessId)
      .subscribe(recentQuotes => this.recentQuotes = recentQuotes);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.lineOfBusiness) {
      this.lineOfBusinessService.updateLineOfBusiness(this.lineOfBusiness)
        .subscribe(() => this.goBack());
    }
  }
}
