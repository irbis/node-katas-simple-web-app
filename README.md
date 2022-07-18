Simple web application to kata nodejs server and Promises while reading the 
files.

Application supports the following URI:
* / - returns content type text/html, body "Hello World!"
* /html - returns content type text/html, body "Hello World!"
* /json - returns content type application/json, body "{'message': 'Hello 
World!'}"
* /xml - returns content type application/xml, body "<message>Hello 
World</message>"
* /favicon.ico - returns content type 'image/png' and content of file 
favicon.png

All requests return calculated HTTP header Content-Length.