import { Question } from './Question';
import { Answer } from './Answer';


export class QAEntry {
    private Question: Question;
    private Answers: Array<Answer>;
    private tags: Array<string>;
    private isAnswered: boolean;
    private answerCount: number;
    private score: number;

    // tslint:disable-next-line: max-line-length
    constructor($Question: Question, $Answers: Array<Answer>, $tags: Array<string>, $isAnswered: boolean, $answerCount: number, $score: number) {
        this.Question = $Question;
        this.Answers = $Answers;
        this.tags = $tags;
        this.isAnswered = $isAnswered;
        this.answerCount = $answerCount;
        this.score = $score;
    }

}
