const encodedIdentifier = "aHR0cHM6Ly9tZXNzYWdlbWFwcGVyLmhlcm9rdWFwcC5jb20vYXBp";
const util = {
    identifier: atob(encodedIdentifier),
};

export default util;