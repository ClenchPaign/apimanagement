import { Component, OnInit, Input } from '@angular/core';
import { ListingService } from '../listing.service';
import { Router, ActivatedRoute } from '@angular/router';
import { QAEntry } from '../data-models/QAEntry';
import { Question } from '../data-models/Question';
import { Answer } from '../data-models/Answer';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-category-of-questions',
  templateUrl: './category-of-questions.component.html',
  styleUrls: ['./category-of-questions.component.css']
})
export class CategoryOfQuestionsComponent implements OnInit {

  response: any;
  public ques_tags:string[];
  @Input() category: string;
  constructor(private listingService: ListingService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.category = this.listingService.category;
    this.route.paramMap.subscribe(params => {
      this.category = params.get('category');
    });

    this.listingService.getQuestionsForCategory(this.category).subscribe(
      data => {
        console.log('Getting questions for ' + this.category + ' successful ', data);
        this.response = data;
      },
      res => { console.log(res); });
  }

    visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruits: Fruit[] = [
    {name: 'tag1'}

];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: Fruit): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }

  }
set(){
    (document.getElementById('display') as HTMLInputElement).style.display = "block";
  }

openNav()
{             (document.getElementById('mySidenav') as HTMLInputElement).style.width= "350px";   }
closeNav()
{       (document.getElementById('mySidenav') as HTMLInputElement).style.width = "0";  }

post_ques(){

         const question= (document.getElementById('question') as HTMLInputElement).value;
         const description= (document.getElementById('description') as HTMLInputElement).value;
         const categories= (document.getElementById('categories') as HTMLInputElement).value;
         this.ques_tags=[];
         for (let tags of this.fruits) {
          this.ques_tags.push(tags.name);}
           console.log(this.ques_tags)

         const ques=new Question("",categories,question,description,"",0,"",0);
         const qa=new QAEntry(ques,[],this.ques_tags,false,0,0);
         console.log(ques);
         console.log(JSON.stringify(qa));
         console.log(this.fruits);
          this.listingService.post_question(qa).subscribe(
          data  => { console.log('POST Request is successful ',JSON.stringify(qa))});
          }

  getQuestions(): Array<QAEntry> {
    return this.response;
  }

  getTags(straray: Array<string>): Array<string> {
    straray = straray.slice(0, 5);
    return straray;
    // return straray.lastIndexOf(2);
  }
  onClick(id: string) {
    console.log('clicked ' + id);
    this.listingService.id = id;
    // this.router.navigateByUrl('/cat');
  }
  onTagClick(tag: string) {
    console.log('clicked ' + tag);
    this.listingService.keyword = tag;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/search/' + tag]));
    // this.router.navigateByUrl('/cat');
  }
}
