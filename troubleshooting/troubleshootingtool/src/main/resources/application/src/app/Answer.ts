export class Answer {
    private id: string;
    private description: string;
    private postedDate: number;
    private ownerUserId: string;
    private ownerUserName: string;
    private lastEditedDate: number;
    private voteCount: number;
    private isApproved: boolean;

    // tslint:disable-next-line: max-line-length
    constructor($id: string, $description: string, $postedDate: number, $ownerUserId: string, $ownerUserName: string, $lastEditedDate: number, $voteCount: number, $isApproved: boolean) {
        this.id = $id;
        this.description = $description;
        this.postedDate = $postedDate;
        this.ownerUserId = $ownerUserId;
        this.ownerUserName = $ownerUserName;
        this.lastEditedDate = $lastEditedDate;
        this.voteCount = $voteCount;
        this.isApproved = $isApproved;
    }

}
