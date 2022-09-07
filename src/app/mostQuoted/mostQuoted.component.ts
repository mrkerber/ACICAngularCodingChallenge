import { Component, OnInit } from '@angular/core';
import { LineOfBusiness } from '../LineOfBusiness';
import { LineOfBusinessService } from '../lineOfBusiness.service';

import { RecentQuoteService } from '../recentQuote.service';

@Component({
   selector: 'app-mostQuoted',
   templateUrl: './mostQuoted.component.html',
   styleUrls: [ './mostQuoted.component.css' ]
})
export class MostQuotedComponent implements OnInit {
   LOBQuoteCounts: { lineOfBusinessId: number, count: number}[] = [];
   linesOfBusinessSorted: LineOfBusiness[] = [];
   
   constructor(
      private recentQuoteService: RecentQuoteService,
      private lineOfBusinessService: LineOfBusinessService
   ) {}

   ngOnInit(): void {
      this.getLOBQuoteCounts();
   }

   //Fetch all recent quotes and tally
   getLOBQuoteCounts(): void {
      this.recentQuoteService.getAllRecentQuotes()
         .subscribe(recentQuotes => {
            //Iterate through all recent quotes
            for (let i=0; i<recentQuotes.length; i++) {
               let lineOfBusinessId = recentQuotes[i].lineOfBusiness;
               let countsUpdated: boolean = false;
               
               //If LOB has already been added to tally, iterate the quote count
               for(let j=0; j<this.LOBQuoteCounts.length; j++) {
                  if(lineOfBusinessId == this.LOBQuoteCounts[j].lineOfBusinessId){
                     this.LOBQuoteCounts[j].count += 1;
                     countsUpdated = true;
                  }
               }
               //If LOB has not been added to tally, insert with a quote count of 1
               if(!countsUpdated) {
                  let countObject = {
                     lineOfBusinessId: lineOfBusinessId,
                     count: 1
                  };
                  this.LOBQuoteCounts.push(countObject);
               }
            }
            this.getPopularLinesOfBusiness();
         });
   }

   //Sort descending for LOBs with most quotes, then fetch details for the top two
   getPopularLinesOfBusiness(): void {
      this.LOBQuoteCounts.sort((a,b) => {
         return b.count - a.count
      })
      this.lineOfBusinessService.getLineOfBusiness(this.LOBQuoteCounts[0].lineOfBusinessId)
         .subscribe(lineOfBusiness => this.linesOfBusinessSorted.push(lineOfBusiness))
      this.lineOfBusinessService.getLineOfBusiness(this.LOBQuoteCounts[1].lineOfBusinessId)
         .subscribe(lineOfBusiness => this.linesOfBusinessSorted.push(lineOfBusiness))
   }
}