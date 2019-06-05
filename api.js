const ApiBuilder = require("claudia-api-builder"),
    api = new ApiBuilder(),
    AWS = require("aws-sdk"),
    dynamoDb = new AWS.DynamoDB.DocumentClient(),
    uuidV4 = require("uuid/v4"),
    distance = require("./handlers/distance"),
    getLocations = require("./handlers/getLocations"),
    postLocations = require("./handlers/postLocations");

module.exports = api;

let target = {
    lat: 52.502931,
    lng: 13.408249
};

/*
upload file route
The file name is supposed to describe a location; the file should contain latitude, longitude and additional/optional data (this is not further defined). The uploaded file should be formatted in JSON.

*/

api.get("/", () => `Welcome to ${uuidV4()}`);

api.post(
    "/location",
    function(request) {
        var params = {
            TableName: request.env.tableName,
            Item: {
                fileid: uuidV4(),
                name: request.body.name,
                latitude: request.body.latitude,
                longitude: request.body.longitude,
                uploadDate: Date.now()
            }
        };
        return dynamoDb.put(params).promise();
    },
    { success: 201, failure: 400 }
);

/*
validated routes - internal use, IAM profiles and permissions set up for Dynamo DB as well as API gateway
*/

/*
Details of a location: name, latitude, longitude, all additional data, a calculated distance to office
*/
api.get(
    "/location/{id}",
    request => {
        let id, params;
        id = request.pathParams.id;
        params = {
            TableName: request.env.tableName,
            Key: {
                fileid: id
            }
        };

        return dynamoDb
            .get(params)
            .promise()
            .then(response => {
                let parsedResponse = response.Item;
                let originDistance = distance.calcDistance(target, {
                    lat: parsedResponse.latitude,
                    lng: parsedResponse.longitude
                });
                return {
                    ...parsedResponse,
                    distance: originDistance
                };
            });
    },
    {
        authorizationType: "AWS_IAM",
        error: { contentType: "application/json" }
    }
);

/*
All locations
*/
api.get(
    "/locations",
    request => {
        let id, params;
        id = request.pathParams.id;
        params = {
            TableName: request.env.tableName
        };

        return dynamoDb
            .scan(params)
            .promise()
            .then(response => {
                console.log(typeof response, response);
                let results = JSON.stringify(response.Items);
                return response.Items;
            });
    },
    {
        authorizationType: "AWS_IAM",
        success: { contentType: "application/json" },
        error: { contentType: "application/json" }
    }
);

api.addPostDeployConfig("tableName", "DynamoDB Table Name:", "configure-db");
