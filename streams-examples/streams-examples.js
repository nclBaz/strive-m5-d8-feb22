import request from "request"
import { pipeline } from "stream" // CORE PACKAGE
import fs from "fs"

const url = "https://skimdb.npmjs.com/registry/_changes?include_docs=true"

// ******************************************** TRADITIONAL APPROACH ******************************************

// request.get(url, (err, data) => {
//   if (err) console.log(err)
//   else console.log(data)
// })

// ****************************************** STREAMS APPROACH ************************************************

// SOURCE (http request on npm registry) --> DESTINATION (terminal)

// const source = request.get(url) // READABLE STREAM (http request on npm registry)
// const destination = process.stdout // WRITABLE STREAM (terminal)

// ************************************************************************************************************

// SOURCE (data.json file) --> DESTINATION (terminal)

// const source = fs.createReadStream("data.json")
// const destination = process.stdout // WRITABLE STREAM (terminal)

// ************************************************************************************************************

// SOURCE (data.json file) --> DESTINATION (anoterfile.json)

// const source = fs.createReadStream("data.json") // READABLE STREAM (file on disk)
// const destination = fs.createWriteStream("anotherfile.json") // WRITABLE STREAM (another file on disk)

// ************************************************************************************************************

// SOURCE (http request on npm registry) --> DESTINATION (npm.json)

// const source = request.get(url) // READABLE STREAM (http request on npm registry)
// const destination = fs.createWriteStream("npm.json") // WRITABLE STREAM (another file on disk)

// ************************************************************************************************************

// SOURCE (data.json file) --> TRANSFORM (compress) --> DESTINATION (data.json.gz)

// import { createGzip } from "zlib" // CORE MODULE

// const source = fs.createReadStream("data.json")
// const destination = fs.createWriteStream("data.json.gz") // WRITABLE STREAM (zipped file)
// const transform = createGzip()

// pipeline(source, transform, destination, err => {
//   if (err) console.log(err)
//   else console.log("Stream ended successfully!")
// })

// ************************************************************************************************************

const source = request.get("http://parrot.live")
const destination = process.stdout

pipeline(source, destination, err => {
  if (err) console.log(err)
  else console.log("Stream ended successfully!")
})
