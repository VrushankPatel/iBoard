// PROD
const encodedIdentifier = "aHR0cHM6Ly9pYm9hcmR4Lmhlcm9rdWFwcC5jb20vYXBp";

// Dev
// const encodedIdentifier = "aHR0cDovL2xvY2FsaG9zdDo1MDAwL2FwaQ=="
var axios = require('axios');
const util = {
    identifier: atob(encodedIdentifier),
    socketEndpoint: "https://iboardx-streamer.herokuapp.com/",
    awakeEndpoint: () => {
        axios.get(atob(encodedIdentifier));
    }
};

export default util;