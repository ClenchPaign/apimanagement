import { Component, OnInit, Input } from '@angular/core';
import { ListingService } from '../listing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QAEntry } from '../data-models/QAEntry';
import { Question } from '../data-models/Question';
import { Answer } from '../data-models/Answer';
import { Guid } from "guid-typescript";

@Component({
  selector: 'app-question-details',
  templateUrl: './question-details.component.html',
  styleUrls: ['./question-details.component.css']
})
export class QuestionDetailsComponent implements OnInit {

  constructor(private listingService: ListingService, private router: Router, private route: ActivatedRoute) { }

  response: any;
  postedDate: any;
  ans_count:number;
  @Input() id: string;

  ngOnInit() {

    this.id = this.listingService.id;
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
    this.listingService.getQuestionForID(this.id).subscribe(
      data => {
        console.log('Questions for ' + this.id + ' successful ', data);
        this.response = data;
      },
      res => { console.log(res); });
  }

  display(){
   (document.getElementById('display') as HTMLInputElement).style.display = "block";
 }




  getQuestion(): QAEntry {
    return this.response;
  }
  onTagClick(tag: string) {
    console.log('clicked ' + tag);
    this.listingService.keyword = tag;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/search/' + tag]));
    // this.router.navigateByUrl('/cat');
  }


  post_ans(){
    
    const answer= (document.getElementById('answer') as HTMLInputElement).value;
    if(answer == ""){
      alert("Please add your answer");
    }
    else
    {
    const d=new Date();
    const creationDate=d.getMilliseconds();
    this.ans_count=0;
    const ques=new Question(this.id,this.response.Question.category,this.response.Question.question,this.response.Question.description,this.response.Question.attachment,this.response.Question.creationDate,this.response.Question.ownerId,this.response.Question.lastModifiedDate);
    const ans=new Answer(Guid.create().toString(),answer,creationDate,"y509478","preethi",creationDate,0,false);
    // this.response.Answers.push(ans);
    let answers :Array<Answer> ;
    answers = this.response.Answers;
    answers.push(ans);
    this.ans_count=this.ans_count+1;
    const qa=new QAEntry(ques,answers,this.response.tags,true,this.ans_count,0);
    console.log("QA NTRY",qa);
    this.listingService.post_answer(qa,this.id).subscribe(
    data => { console.log('put Request is successful ',data)}
   );
   (document.getElementById('display') as HTMLInputElement).style.display = "none";
   (document.getElementById('answer') as HTMLInputElement).value="";
  }
}
}
