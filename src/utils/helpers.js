const path = require('path');

function getRootDir(){
    return path.join(__dirname, '../../');
}

module.exports = {
    getRootDir
}