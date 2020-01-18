# DevSecOps

## Inheritance
* Add yaml for retire

``` yaml
inheritance_security_check:
  docker:
    - image: circleci/node
  working_directory: ~/repo
  steps:
    - checkout
    - run: yarn install
    - run: yarn inheritance-security-check
```

* In the package json
```
"inheritance-security-check": "retire"
```

* to trigger error 
```
 "express": "4.0.0"
```

## SECRETS
* Add AWS secret `config.json` 

``` json
{
  "accessKeyId": "AKIARDFK4ZBOFXBYQHZG",
  "secretAccessKey": "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",
  "region": "us-east-1"
}
```

* index.js

``` javascript
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');
```

* add step in the pipeline

``` yaml
secrets_check:
  docker:
    - image: circleci/node
  working_directory: ~/repo
  steps:
    - checkout
    - run:
        name: Installing Git Secrets
        command: |
          git clone https://github.com/awslabs/git-secrets.git git-secrets
          cd git-secrets && sudo make install && cd .. && rm -rf git-secrets
    - run:
        name: Adding Git Secrets providers
        command: "git secrets --register-aws"
    - run:
        name: Secrets check
        command: "git secrets --scan"
```

## DAST
* Add Staging heroku app and circleCI workflow
```yaml
deploy_staging:
  executor: heroku/default
  steps:
    - checkout
    - heroku/install
    - heroku/deploy-via-git:
        only-branch: master
```

* Create Vaddy app
 
* Crawl manually using proxy

* Put the get route
```javascript
app.get('/vaddy-6be70de085b485c.html', (request, response) => {
    response.send('6be70de085b485c')
})
```
* Now we are able to trigger vaddy on the staging environment from web interface
* Create workflow DAST vaddy

```yaml
vaddy:
  docker:
    - image: circleci/node
  steps:
    - run:
        name: Cloning Vaddy
        command: "git clone https://github.com/vaddy/go-vaddy.git"
    - run:
        name: Security check
        command: |
          cd ./go-vaddy/bin/
          ./vaddy-linux-64bit"
```

* XSS vulnerability to fix it we use sanitize
```
npm install --save sanitizer
```

```javascript
const sanitizer = require('sanitizer');
${entries.map((value) => '<li>' + sanitizer.escape(value) + '</li>').join('')}
```
* XSS Gone and project deployed to production
