# CI/CD Pipeline

* Create Github repository
* Create CircleCI integration
* Attach CircleCI with Github
* Add Slack Integration
* Push code to repository with CircleCi yaml config

``` javascript
const express = require('express')

const app = express()
const port = process.env.PORT || 8080

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
                ${entries.map((value) => '<li>' + value + '</li>').join('')}
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

const server = app.listen(port, () => console.log( `Example app listening on port ${port}!` ))

module.exports = server;
```

``` json
{
  "name": "test-sec",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "jest",
    "start": "node index.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "jest": "^24.9.0",
    "supertest": "^4.0.2"
  }
}
```

* Add Tests in build Stage 

``` javascript
const request = require('supertest');
const server = require('../index');

describe('GET Endpoints', () => {
    it('Getting the /', async () => {
        const res = await request(server).get('/')
        expect(res.statusCode).toEqual(200)
    })
})
server.close()
```

``` yaml
version: 2.1
orbs:
  heroku: circleci/heroku@0.0.10
workflows:
  build_deploy:
    jobs:

      - build

jobs:
  build:
    docker:

      - image: circleci/node

    working_directory: ~/repo
    steps:

      - checkout
      - run: yarn install
      - run: yarn test  

```

* Create Heroku App and Copy the API_KEY and APP_NAME to circleCi
* Add deploy_production stage and make it depends on build stage

``` yaml
workflows:
  build_deploy:
    jobs:

      - build
      - deploy_production:

        requires:

          - build

```

``` yaml
deploy_production:
    environment:
      HEROKU_APP_NAME: production-workshop
    executor: heroku/default
    steps:

      - checkout
      - heroku/install
      - heroku/deploy-via-git:

          only-branch: master
```
