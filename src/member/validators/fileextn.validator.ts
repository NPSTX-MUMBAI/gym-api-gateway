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
        if (fileType.mime == 'application/vnd.oasis.opendocument.spreadsheet' || fileType.ext == "xlsx") {
            return true
        } else {
            return false;
        }
    }

    buildErrorMessage(file: any): string {
        return `error: only supported extensions is ${this.recievedInputs.extensions.map((ext) => ext)}`;
    }

}