import express from "express"
import multer from "multer"
import createError from "http-errors"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { pipeline } from "stream"
import { createGzip } from "zlib"

import { saveUsersAvatars, getBooksReadableStream, getBooks } from "../../lib/fs-tools.js"
import { getPDFReadableStream } from "../../lib/pdf-tools.js"

const filesRouter = express.Router()

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary, // this searches in your process.env for something called CLOUDINARY_URL, which contains your API environment variable
    params: {
      folder: "feb22/books",
    },
  }),
  fileFilter: (req, file, multerNext) => {
    if (file.mimetype !== "image/gif") {
      multerNext(createError(400, "Only GIF allowed!"))
    } else {
      multerNext(null, true)
    }
  },
  limits: { fileSize: 1 * 1024 * 1024 },
}).single("avatar")

filesRouter.post("/:userId/avatar", cloudinaryUploader, async (req, res, next) => {
  // "avatar" needs to match exactly to the field name appended to the FormData object in the FE, otherwise Multer is not going to be able to find the file into the request body
  try {
    console.log("FILE: ", req.file)

    // find user by userId in users.json

    // update avatar field of that user adding "https://res.cloudinary.com/riccardostrive/image/upload/v1652783597/feb22/books/sxmhy9wwa0xukoumv8ur.gif"
    // in FE "https://res.cloudinary.com/riccardostrive/image/upload/v1652783597/feb22/books/sxmhy9wwa0xukoumv8ur.gif"
    res.send()
  } catch (error) {
    next(error)
  }
})

filesRouter.post("/multipleUpload", multer().array("avatars"), async (req, res, next) => {
  try {
    console.log("FILE: ", req.files)

    const arrayOfPromises = req.files.map(file => saveUsersAvatars(file.originalname, file.buffer))

    await Promise.all(arrayOfPromises)

    res.send()
  } catch (error) {
    next(error)
  }
})

filesRouter.get("/booksJSON", (req, res, next) => {
  try {
    // SOURCES (file on disk, http request,...) --> DESTINATIONS (file on disk, terminal, http response, ...)
    // SOURCE (file on disk: books.json) --> DESTINATION (http response: res)

    res.setHeader("Content-Disposition", "attachment; filename=books.json.gz") // This header tells the browser to open the "save file on disk" dialog

    const source = getBooksReadableStream()
    const destination = res
    const transform = createGzip()

    pipeline(source, transform, destination, err => {
      if (err) console.log(err)
    })
  } catch (error) {
    next(error)
  }
})

filesRouter.get("/pdf", async (req, res, next) => {
  try {
    // SOURCE (file on disk: pdf make library output) --> DESTINATION (http response: res)

    res.setHeader("Content-Disposition", "attachment; filename=example.pdf") // This header tells the browser to open the "save file on disk" dialog

    const books = await getBooks()
    const source = getPDFReadableStream(books[0])
    const destination = res

    pipeline(source, destination, err => {
      if (err) console.log(err)
    })
  } catch (error) {
    next(error)
  }
})

export default filesRouter
