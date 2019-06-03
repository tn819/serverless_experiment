const ApiBuilder = require("claudia-api-builder"),
    api = new ApiBuilder(),
    superb = require("superb");

module.exports = api;

//Please develop an API that enables an external/unknown user to upload files. The file name is supposed to describe a location; the file should contain latitude, longitude and additional/optional data (this is not further defined). The uploaded file should be formatted in JSON.

api.get("/", () => "Welcome to ");

api.post("/location", function(request) {
    return new Promise(function(resolve, reject) {
        // some asynchronous operation
    }).then(() => request.queryString.name + " was saved");
});

/*
validated routes
Please develop a second API for internal use. The user should be able to consume the uploades data via two endpoints.

*/

api.get(
    "/location/:id",
    function(request) {
        return request.queryString.name + " is amazing";
    },
    { authorizationType: "AWS_IAM" }
);

/*
Details of a location: name, latitude, longitude, all additional data, a calculated distance to our office (bee line distance, no map service; lat: 52.502931, lng: 13.408249).
*/
api.get(
    "/locations/",
    function(request) {
        return request.queryString.name + " is amazing";
    },
    { authorizationType: "AWS_IAM" }
);
