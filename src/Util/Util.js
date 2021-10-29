// PROD
const encodedIdentifier1 = "aHR0cHM6Ly9pYm9hcmR4Lmhlcm9rdWFwcC5jb20vYXBp";
// Dev
// const encodedIdentifier = "aHR0cDovL2xvY2FsaG9zdDo1MDAwL2FwaQ=="

const socketEndPoint = "https://iboardx-streamer.herokuapp.com/";

var axios = require('axios');
const util = {
    identifier: atob(encodedIdentifier1),
    socketEndpoint: socketEndPoint,
    awakeEndpoint: () => {
        axios.get(atob(encodedIdentifier1));
        axios.get(socketEndPoint);
    }
};

export default util;