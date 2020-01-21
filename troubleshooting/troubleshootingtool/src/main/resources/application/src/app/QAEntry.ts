import { Question } from './Question';
import { Answer } from './Answer';


export class QAEntry {
    public Question: Question;
    public Answers: Array<Answer>;
    public tags: Array<string>;
    public isAnswered: boolean;
    public answerCount: number;
    public score: number;
}
