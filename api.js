const ApiBuilder = require("claudia-api-builder"),
    api = new ApiBuilder(),
    AWS = require("aws-sdk"),
    dynamoDb = new AWS.DynamoDB.DocumentClient(),
    calcDistance = require("./handlers/distance");
(getLocations = require("./handlers/getLocations")),
    (postLocations = require("./handlers/postLocations"));

module.exports = api;

//Please develop an API that enables an external/unknown user to upload files. The file name is supposed to describe a location; the file should contain latitude, longitude and additional/optional data (this is not further defined). The uploaded file should be formatted in JSON.

api.get("/", () => "Welcome to ");

api.post(
    "/location",
    function(request) {
        var params = {
            TableName: request.env.tableName,
            Item: {
                fileid: request.body.fileId,
                latitude: request.body.latitude,
                longitude: request.body.longitude,
                uploadDate: Date.now()
            }
        };
        // return dynamo result directly
        return dynamoDb.put(params).promise();
    },
    { success: 201 }
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
    { authorizationType: "AWS_IAM" }
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
            .query(params)
            .promise()
            .then(response =>
                response.Items.forEach(item => {
                    item["distance"] = calcDistance(
                        {
                            lat: item.latitude,
                            lng: item.longitude
                        },
                        {
                            lat: 52.502931,
                            lng: 13.408249
                        }
                    );
                })
            );
    },
    { authorizationType: "AWS_IAM" }
);

api.addPostDeployConfig("tableName", "DynamoDB Table Name:", "configure-db");
