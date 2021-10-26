// PROD
const encodedIdentifier1 = "aHR0cHM6Ly9pYm9hcmR4Lmhlcm9rdWFwcC5jb20vYXBp";
const encodedIdentifier2 = "aHR0cHM6Ly9pYm9hcmQtc2VydmVyMi5oZXJva3VhcHAuY29tL2FwaQ=="
// Dev
// const encodedIdentifier = "aHR0cDovL2xvY2FsaG9zdDo1MDAwL2FwaQ=="

const getUrlByGMTFn = () => {
    const gmtHour = new Date().toUTCString().split(" ")[4].split(":")[0];
    if (gmtHour >= 7 && gmtHour <= 19) {
        return atob(encodedIdentifier1);
    }
    return atob(encodedIdentifier2);
}

const socketEndPoint = "https://iboardx-streamer.herokuapp.com/";

var axios = require('axios');
const util = {
    identifier: getUrlByGMTFn(),
    socketEndpoint: socketEndPoint,
    awakeEndpoint: () => {
        axios.get(getUrlByGMTFn());
        axios.get(socketEndPoint);
    }
};

export default util;