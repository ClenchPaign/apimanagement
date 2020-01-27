import { Component, OnInit, Input } from '@angular/core';
import { ListingService } from '../listing.service';
import { ActivatedRoute } from '@angular/router';
import { QAEntry } from '../QAEntry';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-question-details',
  templateUrl: './question-details.component.html',
  styleUrls: ['./question-details.component.css']
})
export class QuestionDetailsComponent implements OnInit {

  // constructor(iconRegistry: MatIconRegistry,
  //   sanitizer: DomSanitizer, private listingService: ListingService, private router: ActivatedRoute) {
  //   iconRegistry.addSvgIcon(
  //     'thumbs-up',
  //     sanitizer.bypassSecurityTrustResourceUrl('assets/img/examples/thumbup-icon.svg'));
  // }

  constructor(private listingService: ListingService, private router: ActivatedRoute) {}

  response: any;
  @Input() id: string;

  ngOnInit() {
    this.id = this.listingService.id;
    this.router.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
    this.listingService.getQuestionForID(this.id).subscribe(
      data => {
        console.log('Questions for ' + this.id + ' successful ', data);
        this.response = data;
      },
      res => { console.log(res); });
  }
  getQuestion(): QAEntry {
    return this.response;
  }

}
