// Please upload a one image and save the image in 4 different size.
// 1024*1024, 768*1024, 600*300, 480*912

const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const multer = require('multer');
const sharp = require("sharp");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, 'public')));

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Please upload valid image", false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

const uploadFiles = upload.array("images");

const uploadImage = (req, res, next) => {
    uploadFiles(req, res, err => {
        if (err) {
            return res.send(err);
        }
        next();
    });
};

const resizeImage = async (req, res, next) => {
    if (!req.files) return next();

    req.body.images = [];
    await Promise.all(
        req.files.map(async file => {
            const filename = file.originalname;
            console.log(filename);
            const newFilename = `image-${filename}-${Date.now()}.jpeg`;

            await sharp(file.buffer)
                .resize(1024, 1024)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile("./public/images/"+ newFilename );

            req.body.images.push(newFilename);
        }),
        req.files.map(async file => {
            const filename = file.originalname;
            console.log(filename);
            const newFilename = `image-${filename}-${Date.now()}.jpeg`;

            await sharp(file.buffer)
                .resize(768, 1024)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile("./public/images/"+ newFilename );

            req.body.images.push(newFilename);
        }),
        req.files.map(async file => {
            const filename = file.originalname;
            console.log(filename);
            const newFilename = `image-${filename}-${Date.now()}.jpeg`;

            await sharp(file.buffer)
                .resize(600, 300)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile("./public/images/"+ newFilename );

            req.body.images.push(newFilename);
        }),
        req.files.map(async file => {
            const filename = file.originalname;
            console.log(filename);
            const newFilename = `image-${filename}-${Date.now()}.jpeg`;

            await sharp(file.buffer)
                .resize(480, 912)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile("./public/images/"+ newFilename );

            req.body.images.push(newFilename);
        })
    );

    next();
};

const getData = async (req, res) => {
    if (req.body.images.length <= 0) {
        return res.status(400).send("Please select image");
    }

    const images = req.body.images;
    return res.status(200).send(`Images uploaded:\n${images}`);
};

app.get('/', function (req, res) {
    res.send("Image test");
})

app.post('/upload', uploadImage, resizeImage, getData);

app.listen(port, function (error) {
    if (error) throw error;
    console.log("Server created Successfully.Port: " + port);
}) 
