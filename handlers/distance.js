module.exports.calcDistance = (p1, p2) => {
    function rad(x) {
        return (x * Math.PI) / 180;
    }
    var radius = 6378137; // Earth’s mean radius in meter

    var dLat = rad(p2.lat - p1.lat);
    var dLong = rad(p2.lng - p1.lng);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.lat)) *
            Math.cos(rad(p2.lat)) *
            Math.sin(dLong / 2) *
            Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = radius * c;
    return d; // returns the distance in meter
};
