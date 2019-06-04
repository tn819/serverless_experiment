const ApiBuilder = require("claudia-api-builder"),
    api = new ApiBuilder(),
    AWS = require("aws-sdk"),
    dynamoDb = new AWS.DynamoDB.DocumentClient(),
    uuidV4 = require("uuid/v4"),
    calcDistance = require("./handlers/distance").calcDistance(),
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
        // return dynamo result directly
        console.log(request.body);
        return dynamoDb.put(params).promise();
    },
    { success: 201, failure: 400 }
);

/*
validated routes - internal use
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
            .then(response => response.Item);
    },
    {
        authorizationType: "AWS_IAM",
        success: { contentType: "application/json" },
        error: { contentType: "application/json" }
    }
);

/*
Details of a location: name, latitude, longitude, all additional data, a calculated distance to our office (bee line distance, no map service; lat: 52.502931, lng: 13.408249).
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
                let adjustedResponse = response.Items.map(item => {
                    let { latitude: lat, longitude: lng } = JSON.parse(item);
                    let itemLocation = { lat, lng };
                    let distanceFromDestination = calcDistance(
                        itemLocation,
                        target
                    );
                    return {
                        ...item,
                        distance: distanceFromDestination
                    };
                });
                console.log(adjustedResponse);
                return adjustedResponse;
            });
    },
    {
        authorizationType: "AWS_IAM",
        error: { contentType: "application/json" }
    }
);

api.addPostDeployConfig("tableName", "DynamoDB Table Name:", "configure-db");
