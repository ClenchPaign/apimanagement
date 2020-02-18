export class Question {
    public id: string;
    public category: string;
    public question: string;
    public description: string;
    public attachment: string;
    public creationDate: number;
    public ownerId: string;
    public lastModifiedDate: number;


    // tslint:disable-next-line: max-line-length
    constructor($id: string, $category: string, $question: string, $description: string, $attachment: string, $creationDate: number, $ownerId: string, $lastModifiedDate: number) {
        this.id = $id;
        this.category = $category;
        this.question = $question;
        this.description = $description;
        this.attachment = $attachment;
        this.creationDate = $creationDate;
        this.ownerId = $ownerId;
        this.lastModifiedDate = $lastModifiedDate;
    }

}
