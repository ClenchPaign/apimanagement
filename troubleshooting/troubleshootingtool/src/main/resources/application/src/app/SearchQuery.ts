export class SearchQuery {
    public category: string;
    public tags: Array<string>;
    public keyword: Array<string>;

    constructor(category: string, tags: Array<string>, keyword: Array<string>) {
        this.category = category;
        this.tags = tags;
        this.keyword = keyword;
    }
}

