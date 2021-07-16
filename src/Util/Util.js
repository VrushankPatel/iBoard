const encodedIdentifier = "aHR0cHM6Ly9pYm9hcmR4Lmhlcm9rdWFwcC5jb20vYXBp";
var axios = require('axios');
const util = {
    identifier: atob(encodedIdentifier),
    awakeEndpoint: () => {
        axios.get(atob(encodedIdentifier));
    }
};

export default util;