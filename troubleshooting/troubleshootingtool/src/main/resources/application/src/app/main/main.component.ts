import { Component, OnInit } from '@angular/core';
import { ListingService } from '../listing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddQuestionDialogComponent } from '../add-question-dialog/add-question-dialog.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  category: any;
  cats: string[];
  constructor(private listingService: ListingService, private route: ActivatedRoute, public dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    this.category = this.listingService.category;
    this.route.paramMap.subscribe(params => {
      this.category = params.get('category');
    });
  }

  addQAEntry() {
    this.openOptions();
    this.router.navigateByUrl('/main/add_qna');
  }
  addQuestion(){
    this.openOptions();
    this.router.navigateByUrl('/main/add_q');
  }
  // openDialog(): void {
  //   const dialogRef = this.dialog.open(AddQuestionDialogComponent, {
  //     width: '900px',
  //     data: { category: this.cats }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('result:' + result);
  //     this.openOptions();
  //     if (this.cats.includes(result) || result === '' || result === undefined) {
  //       console.log('category already exist or question not added');
  //     } else {
  //       this.cats.push(result);
  //     }

  //     //   this.route.navigateByUrl('/categories', { skipLocationChange: true })
  //     //     .then(() => this.route.navigate(['/categories']));
  //   });
  // }

  openOptions() {
    console.log('hello from options');
    const options = document.getElementById('options');
    if (options.style.visibility === 'visible') {
      options.style.visibility = 'collapse';
      options.style.display = 'none';
    } else {
      options.style.visibility = 'visible';
      options.style.display = 'flex';
    }
  }
  getCategory(): string {
    this.category = this.listingService.category;
    return this.category;
  }
}
