const http = require('http')
const { stat, open } = require('node:fs/promises')

const PORT = (process.argv[2] || process.env.PORT || 3000)

/*
    Supported URIs and queries:
        / or /html - response is a text/html content type of hello world!
        /json - response is an application/json content type of hello world!
        /xml - response is an application/xml content type of hello world!
        /favicon.ico - favicon
 */

async function badRequest() {
    return {
        statusCode: 400,
        headers: {
            "Content-Type": "text/html",
            "Content-Length": 0
        },
        body: null
    }
}

async function htmlContent() {
    const message = 'Html Hello World!'

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "text/html"
        },
        body: message
    }
}

async function jsonContent() {
    const message = {
        message: 'Json Hello World!'
    }

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "text/html"
        },
        body: JSON.stringify(message)
    }
}

async function xmlContent() {
    const message = "<message>Hello World!</message>"

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "text/html"
        },
        body: message
    }
}

async function favicon() {
    const FAVICON_PATH = `${process.env.PWD}/favicon.png`
    const faviconSize = (await stat(FAVICON_PATH)).size
    const faviconReadStream = await open(FAVICON_PATH)
        .then(fileHander => fileHander.createReadStream())

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "image/png",
            "Content-Length": faviconSize
        },
        body: faviconReadStream
    }
}

const handlers = {
    "/": htmlContent,
    "/html": htmlContent,
    "/json": jsonContent,
    "/xml": xmlContent,
    "/favicon.ico": favicon
}

function service(req, res) {
    console.log(req.url)

    const handler = handlers[req.url] || badRequest

    handler()
        .then(({statusCode, headers, body}) => {
            const resHeaders = Object.assign({}, headers)
            if (!resHeaders["Content-Length"]) resHeaders["Content-Length"] = body ? body.length : 0
            res.writeHead(statusCode, resHeaders)

            if (body && body.pipe) body.pipe(res)
            else res.end(body)
        })
}

http.createServer(service).listen(PORT)
