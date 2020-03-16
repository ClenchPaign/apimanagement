export class ImageModel {
    public id: string;
    public fileName: string;
    public base64Image: string;
    constructor($id: string, $fileName: string, $base64Image: string) {
        this.id = $id;
        this.fileName = $fileName;
        this.base64Image = $base64Image;
    }
}
export class AnswerFiles {
    public id: string;
    public imageModelList: ImageModel[];
    constructor($id: string, $imageModelList: ImageModel[]) {
        this.id = $id;
        this.imageModelList = $imageModelList;
    }
}
