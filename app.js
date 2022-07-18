const http = require('http')
const { stat } = require('node:fs/promises')
const { statSync } = require('node:fs')

const PORT = (process.argv[2] || process.env.PORT || 3000)

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

async function badRequest() {
    return {
        statusCode: 400,
        contentType: "text/html",
        body: null
    }
}

async function htmlContent() {
    const message = 'Html Hello World!'

    return {
        statusCode: 200,
        contentType: "text/html",
        body: message
    }
}

async function jsonContent() {
    const message = {
        message: 'Json Hello World!'
    }

    return {
        statusCode: 200,
        contentType: "application/json",
        body: JSON.stringify(message)
    }
}

async function xmlContent() {
    const message = "<message>Hello World!</message>"

    return {
        statusCode: 200,
        contentType: "application/xml",
        body: message
    }
}

async function favicon() {
    res.statusCode = 200
    res.setHeader('Content-Type', 'image/png')
    //res.write()
    //res.end()
}

const handlers = {
    "/": htmlContent,
    "/html": htmlContent,
    "/json": jsonContent,
    "/xml": xmlContent
}

function service(req, res) {
    console.log(req.url)

    const handler = handlers[req.url] || badRequest

    handler()
        .then(({statusCode, contentType, body}) => {
            res.writeHead(statusCode, { "Content-Type": contentType })
            if (body && body.pipe) body.pipe(res)
            else res.end(body)
        })
}

http.createServer(service).listen(PORT)
