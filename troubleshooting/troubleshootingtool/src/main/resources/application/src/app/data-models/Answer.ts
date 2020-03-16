export class Answer {
    public id: string;
    public description: string;
    public postedDate: number;
    public ownerUserId: string;
    public ownerUserName: string;
    public lastEditedDate: number;
    public attachment: string;
    public voteCount: number;
    public isApproved: boolean;

    // tslint:disable-next-line: max-line-length
    constructor(
        $id: string,
        $description: string,
        $postedDate: number,
        $ownerUserId: string,
        $ownerUserName: string,
        $lastEditedDate: number,
        $attachment: string,
        $voteCount: number,
        $isApproved: boolean) {
        this.id = $id;
        this.description = $description;
        this.postedDate = $postedDate;
        this.ownerUserId = $ownerUserId;
        this.ownerUserName = $ownerUserName;
        this.lastEditedDate = $lastEditedDate;
        this.attachment = $attachment;
        this.voteCount = $voteCount;
        this.isApproved = $isApproved;
    }

}
