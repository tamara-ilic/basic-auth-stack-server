const express = require('express')
const multer = require('multer')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3100

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads')
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage })

app.use(express.static('uploads'))

app.get('/', (req, res) => {
    console.log(__dirname)
    console.log(`${req.method} ${req.url} request received`)
    res.sendFile(`${__dirname}/file-form.html`)
})

app.post(
    '/upload-profile-pic',
    upload.single('profile_pic'),
    (req, res, next) => {
        if (!req.file) {
            res.send('No file received')
            return
        }
        console.log(`${req.method} ${req.url} request received`)
        console.log(`file: ${JSON.stringify(req.file)}`)
        res.send(`<h2>Here is the image:</h2> <img src=${req.file.filename} alt='something' />`)    
    }
)

app.listen(PORT, () => console.log(`Started listening on PORT ${PORT}`))