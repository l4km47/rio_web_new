const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // use uuid to generate a unique filename

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/www/wwwroot/riogamers.lk/public/"); // specify the upload directory
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname); // get the file extension
    const filename = uuidv4() + extension; // generate a unique filename using uuid
    cb(null, filename); // use the generated filename for the uploaded file
  },
});

// Set up Multer upload middleware
const upload = multer({ storage: storage });

module.exports = upload;
