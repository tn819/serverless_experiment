# Serverless file upload setup with Claudia + Node

1. route for user location json file upload
2. internal api for getting all locations
3. internal api for getting location details

##build steps
configure AWS and get necessary authorizations

1. https://github.com/claudiajs/claudia-api-builder/blob/master/docs/authorization.md

-   I used AWS cli and passed in key/secret directly, but many options
-   authentication in this version is AWS_IAM, permissions are summarized here: https://docs.aws.amazon.com/apigateway/latest/developerguide/permissions.html

install packages

```
npm install
```

create endpoint via AWS claudia

```
npm run create
```

use created URL with routes (AWS_IAM authorized profile needed for gets)

```
POST: /location
GET: /location/{id}
GET: /locations

```
