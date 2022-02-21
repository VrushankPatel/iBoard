/*
* Dev : use below as encodedIdentifier for localhost
* "aHR0cDovL2xvY2FsaG9zdDo1MDAwL2FwaQ=="
*/

let socketEndPoint = "http://localhost:4001/";

// PROD
const encodedIdentifier1 = "aHR0cHM6Ly9pYm9hcmR4Lmhlcm9rdWFwcC5jb20vYXBp";
const encodedIdentifier2 = "aHR0cHM6Ly9pYm9hcmQtc2VydmVyMi5oZXJva3VhcHAuY29tL2FwaQ=="
socketEndPoint = "https://iboardx-streamer.herokuapp.com/";

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
    },
    copyToClipBoard: (text) => {
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        el.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(el.value);
        document.body.removeChild(el);
    }
};

export default util;