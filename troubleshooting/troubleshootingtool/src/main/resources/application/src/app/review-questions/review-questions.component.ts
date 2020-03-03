import { Component, OnInit } from '@angular/core';
import { ListingService } from '../listing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QAEntry } from '../data-models/QAEntry';

@Component({
  selector: 'app-review-questions',
  templateUrl: './review-questions.component.html',
  styleUrls: ['./review-questions.component.css']
})
export class ReviewQuestionsComponent implements OnInit {

  constructor(private listingService: ListingService, private route: ActivatedRoute,private router: Router) { }
  response: any;
  public isAdmin:any;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const reload = params['reload'];
      // console.log('reload-' + reload);
    });
    this.listingService.getAllReviewQuestions().subscribe(
      data => {
        console.log('Getting review questions successful ', data);
        this.response = data;
        // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        //   this.router.navigate(['/main/dashboard/review']);
        // });
      },
      res => { console.log(res); });
      this.isAdmin=localStorage.getItem('isAdmin');
      console.log('admin or not ', this.isAdmin);
      if (this.isAdmin==="false"){

        (document.getElementById('ques')as HTMLAnchorElement).setAttribute("disabled","true");
        // (document.getElementById('review_ques') as HTMLDivElement).setAttribute("disabled","true");
      }
     
  }
}
