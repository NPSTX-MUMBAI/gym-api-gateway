import { FileValidator } from "@nestjs/common";

export type FileExtensionValidationOptions = {
    extensions: string[];
}

export class FileExtensionValidator extends FileValidator<FileExtensionValidationOptions>  {

    recievedInputs: any;

    constructor(c) {
        super(c);
        this.recievedInputs = c;

    }

    isValid(file?: any): boolean | Promise<boolean> {
        console.log(file);
        const fileName: string = file.originalname;
        const tmp = fileName.split('.');
        console.log(this.recievedInputs);
        return this.recievedInputs.extensions.includes(tmp[1]);
    }

    buildErrorMessage(file: any): string {
        return `error: only supported extensions is ${this.recievedInputs.extensions.map((ext) => ext)}`;
    }

}