import { Question } from './Question';
import { Answer } from './Answer';


export class QAEntry {
    public Question: Question;
    public Answers: Array<Answer>;
    public tags: Array<string>;
    public isAnswered: boolean;
    public isApproved: boolean;
    public answerCount: number;
    public score: number;

    // tslint:disable-next-line: max-line-length
    constructor($Question: Question, $Answers: Array<Answer>, $tags: Array<string>, $isAnswered: boolean, $isApproved: boolean, $answerCount: number, $score: number) {
        this.Question = $Question;
        this.Answers = $Answers;
        this.tags = $tags;
        this.isAnswered = $isAnswered;
        this.isApproved = $isApproved;
        this.answerCount = $answerCount;
        this.score = $score;
    }

}
