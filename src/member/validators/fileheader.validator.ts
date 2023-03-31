import { FileValidator } from "@nestjs/common";

export type FileHeaderOptions = {
    headers: string[];
}
export class FileHeaderValidator extends FileValidator<FileHeaderOptions>{
    inputs: any
    constructor(c) {
        super(c);
        this.inputs = c;
        console.log("recieved headers =>", this.inputs);
    }
    isValid(file?: any): boolean | Promise<boolean> {
        //todo: business logic to match header form file with headers recieved from validator class
        //XLSX package to load the file and read the sheet and work with rows and column
        
        console.log(file, this.inputs)
        return true;
    }
    buildErrorMessage(file: any): string {
        return `error: following headers are missing in the file ${JSON.stringify(this.inputs)}`
    }

}