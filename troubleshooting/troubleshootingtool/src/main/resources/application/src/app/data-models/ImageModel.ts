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
