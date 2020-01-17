const express = require('express')
const bodyParser = require('body-parser')
var AWS = require('aws-sdk');
const app = express()
const port = process.env.PORT;
AWS.config.loadFromPath('./config.json');
app.use(bodyParser.json({
    limit: '50mb',
    extended: true
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));
var entries = []
app.get('/', (request, response) => {
    const html = `
    <html>
        <body>
            <form action="/store" method="get">
                <label>Enter your text</label>
                <input type="text" name=value></input>
            </form>
            <ul>
                ${entries.map((value) => '<li>' + value + '</li>')}
            </ul>
        </body>
    </html>
    `
    console.log('getting')
    response.setHeader('ContentType', 'text/html');
    response.send(html)
})
app.get('/store', (request, response) => {
    let body = request.query
    const value = body.value
    console.log('storing')
    entries.push(value)
    response.redirect('/')
})
app.get('/robots.txt', (request, response) => {
    response.send('/\n/store')
})
app.listen(port, '0.0.0.0', () => console.log(`Example app listening on port ${port}!`))




