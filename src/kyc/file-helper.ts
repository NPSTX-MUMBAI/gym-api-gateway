



export const imageFileFilter = (req:any,file:any,callback:any) => {
    if(file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        req.fileValidationError = 'Only Images Are Allowed';
        return callback(null,false);
    }
    callback(null,true);
};




// export const editFileName = (req,file,callback) => {
//     const name = file.originalname.split('.')[0];
//     const fileExtName = extName(file.originalname);
//     const randomName = Array(4)
//         .fill(null)
//         .map(() => Math.round(Math.random() * 16).toString(16))
//         .join('');
//         callback(null,`${name}-${randomName}${fileExtName}`);


// };

// function extName(originalname: any) {
//     throw new Error("Function not implemented.");
// }

