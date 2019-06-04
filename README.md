# Serverless file upload setup with Claudia + Node

1. route for user location json file upload
2. internal api for getting all locations
3. internal api for getting location details

## build steps

configure AWS and get necessary authorizations

-   general overview: https://github.com/claudiajs/claudia-api-builder/blob/master/docs/authorization.md
-   I used AWS cli and passed in key/secret directly, but many options
-   authentication in this version is AWS_IAM, permissions are summarized here: https://docs.aws.amazon.com/apigateway/latest/developerguide/permissions.html

install packages

```
npm install
```

creates endpoint in AWS API Gateway, Dynamo DB authorizations for user

```
npm run create
```

update endpoint

```
npm run update
```

use created URL with routes (AWS_IAM authorized profile needed for gets)

```
POST: /location
```

expects JSON with this body:

```
{
    name: "test",
    latitude: number,
    longitude: number
}
```

```
GET: /location/{id}
GET: /locations
```
