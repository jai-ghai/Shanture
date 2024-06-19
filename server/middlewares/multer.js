// singleUpload.js
import multer from "multer";

const storage = multer.memoryStorage();
const singleUpload = multer({ storage }).single("panFile");

export default singleUpload;
