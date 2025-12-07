const fs = require("fs");
const crypto = require("crypto");

function userOrNot(username, password, callback) {
    let jsonReading = fs.readFile('./storageJSON.json', 'utf-8', (err, data) => {

        if (err) return callback(null, false);

        function makeHash(entity, salt, originalHash) {
            let entityHash = crypto.scryptSync(entity, salt, 64).toString('hex');
            if (entityHash === originalHash) return true;
            return false;
        }
        let jsonParseArray = JSON.parse(data);
        for (let ele of jsonParseArray) {

            let usernameObjKey = ele.username;
            let passwordObjKey = ele.password;
            let [usernameSalt, usernameHash] = usernameObjKey.split(':');
            let [passwordSalt, passwordHash] = passwordObjKey.split(':');
            if (makeHash(username, usernameSalt, usernameHash) && makeHash(password, passwordSalt, passwordHash)) {
                return callback(null, true);
            }
        }
        return callback(null, false);
    })
};

module.exports = { userOrNot };