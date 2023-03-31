import { FileValidator } from "@nestjs/common";
import * as FileType from 'file-type';

export type FileExtensionValidationOptions = {
    extensions: string[];
}

export class FileExtensionValidator extends FileValidator<FileExtensionValidationOptions>  {

    recievedInputs: any;

    constructor(c) {
        super(c);
        this.recievedInputs = c;

    }

    async isValid(file?: any): Promise<boolean> {
        const fileType = await FileType.fromFile(file.path);
        console.log("mime=>", fileType.mime);
        console.log("ext=>", fileType.ext);
        return true;

        /* const fileName: string = file.originalname;
         const tmp = fileName.split('.');
         console.log(this.recievedInputs);
         return this.recievedInputs.extensions.includes(tmp[1]);*/

    }

    buildErrorMessage(file: any): string {
        return `error: only supported extensions is ${this.recievedInputs.extensions.map((ext) => ext)}`;
    }

}