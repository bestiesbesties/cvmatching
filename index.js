const fs = require("fs");
const path = require("path");
const child_process = require("child_process");

const express = require("express"); // voor routing
const multer = require("multer"); // voor storage



const app = express();

// MULTER
const storage = multer.diskStorage({
    destination : (req, file, callback) => {
        callback(null, 'uploads/');
    },
    filename : (req, file, callback) => {
        callback(null, "upload-" + file.originalname);
    }
});
const upload = multer({storage});


app.use("/app", express.static(path.join(__dirname, 'app')));

app.get("/", (request, response) => {
    fs.readFile("app/public/home.html", "utf8", (err, data) => {

        if (err) {
            response.status(500).send("Error reading html")
        }
        response.send(data); 
    });
});

app.post("/upload_run", upload.array("files"), (request, response) => {
    console.log("Uploading file");
    console.log("Client request:", request)
    const uploadedFilepath = request.files[0].path

    console.log("Executing procces on file: uploadedFilepath" )
    const python = child_process.exec("python3 main.py -fp '" + uploadedFilepath + "'", (error, stdout, stderr) => {
        console.log("error: ", error)
        console.log("stdout: ", stdout)
        console.log("stderr: ", stderr)
    });

    response.status(200);
});

const PORT = 4500;
app.listen(PORT, () => {
    console.log("Server running on http://localhost:" + PORT)
});