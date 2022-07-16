const http = require('http')
const { stat } = require('node:fs/promises')
const { statSync } = require('node:fs')

const PORT = (process.argv[2] || process.env.PORT || 3000)
const DEVMODE = process.env.NODE_ENV !== 'production'

/*
    Supported URIs and queries:
        / or /html - response is a text/html content type of hello world!
        /json - response is an application/json content type of hello world!
        /xml - response is an application/xml content type of hello world!
        /favicon.ico - favicon
 */

const faviconSize = function() {
    try {
        return statSync(`${process.env.PWD}/favicon.png`).size
    } catch (err) {
        return null
    }
}()

// let iconSize = null
// stat(`${process.env.PWD}/favicon1.png`,
//     (err, stats) => {
//         if (!err) iconSize = stats.size
//     })

const iconSize = stat(`${process.env.PWD}/favicon.png`)
    .then(stats => { return stats.size })
    .catch(err => { return undefined })

function htmlContent(res) {
    console.log(iconSize)

    res.statusCode = 200
    res.setHeader('Content-Type', "text/html")
    res.end('Hello world!')
}

function jsonContent(res) {
    const helloWorld = { message: "Hello World!" }
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(helloWorld))
}

function xmlContent(res) {
    const helloWorld = "<message>Hello World!</message>"
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/xml')
    res.end(helloWorld)
}

function favicon(res) {
    res.statusCode = 200
    res.setHeader('Content-Type', 'image/png')
    //res.write()
    //res.end()
}

function badRequest(res) {
    res.statusCode = 400
    res.end()
}

const operations = {
    "/": htmlContent,
    "/html": htmlContent,
    "/json": jsonContent,
    "/xml": xmlContent
}

function service(req, res) {
    if (DEVMODE)
        console.log(req.url)

    const operation = operations[req.url] || badRequest

    return operation(res)
}

http.createServer(service).listen(PORT)
