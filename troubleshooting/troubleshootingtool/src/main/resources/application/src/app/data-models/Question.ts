export class Question {
    private id: string;
    private category: string;
    private question: string;
    private description: string;
    private attachment: string;
    private creationDate: number;
    private ownerId: string;
    private lastModifiedDate: number;


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
