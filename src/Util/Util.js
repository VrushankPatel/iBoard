// Dev
// const encodedIdentifier = "aHR0cDovL2xvY2FsaG9zdDo1MDAwL2FwaQ=="
// const socketEndPoint = "http://localhost:4001/";

// PROD
const encodedIdentifier1 = "aHR0cHM6Ly9jYXJuZWEuaGVyb2t1YXBwLmNvbS9pYm9hcmQ=";
const encodedIdentifier2 = "aHR0cHM6Ly9jYXJuZWEuaGVyb2t1YXBwLmNvbS9pYm9hcmQy"
const socketEndPoint = "https://iboardx-streamer.herokuapp.com/";

const getUrlByGMTFn = () => {
    const currentDate = new Date().getDate();
    if (currentDate <= 15) return encodedIdentifier1;
    else return encodedIdentifier2;
}

var axios = require('axios');
const util = {
    identifier: atob(getUrlByGMTFn()),
    socketEndpoint: socketEndPoint,
    awakeEndpoint: () => {
        axios.get(atob(getUrlByGMTFn()));
        axios.get(socketEndPoint);
    }
};

export default util;