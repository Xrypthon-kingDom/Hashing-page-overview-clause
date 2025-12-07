// promises async await optimized version . . .
const crypto = require("crypto");
const fs = require("fs").promises;
const mainStorageJsonName = "storageJSON.json";

async function HashingProcess(username, password) {
    // Generate separate salts
    const userSalt = crypto.randomBytes(8).toString("hex");
    const passSalt = crypto.randomBytes(8).toString("hex");

    // Promisify scrypt
    const scryptAsync = (text, salt) =>
        new Promise((resolve, reject) => {
            crypto.scrypt(text, salt, 64, (err, derivedKey) => {
                if (err) reject(err);
                else resolve(`${salt}:${derivedKey.toString("hex")}`);
            });
        });

    const usernameHash = await scryptAsync(username.toString(), userSalt);
    const passwordHash = await scryptAsync(password.toString(), passSalt);

    let existingData = [];

    // Read storage file
    try {
        const fileData = await fs.readFile(mainStorageJsonName, "utf-8");
        existingData = JSON.parse(fileData);
        if (!Array.isArray(existingData)) existingData = [];
    } catch (e) {
        existingData = []; // File missing = new array
    }

    // Add new object
    const userObject = { username: usernameHash, password: passwordHash };
    existingData.push(userObject);

    // Write updated file
    await fs.writeFile(
        mainStorageJsonName,
        JSON.stringify(existingData, null, 2)
    );

    return userObject;
}

module.exports = { HashingProcess };




// const crypto = require("crypto");
// const fs = require("fs");
// const mainStorageJsonName = 'storageJSON.json';

// function HashingProcess(username, password, callback) {
//     const salt = crypto.randomBytes(8).toString('hex');
//     let storeObject = {};
//     crypto.scrypt(username.toString(), salt, 64, (err, usernameHash) => {
//         if (err) return callback(err);
//         storeObject.username = `${salt}:${usernameHash.toString('hex')}`;
//         crypto.scrypt(password.toString(), salt, 64, (err, passwordHash) => {
//             if (err) return callback(err);
//             storeObject.password = `${salt}:${passwordHash.toString('hex')}`;
//             fs.readFile(mainStorageJsonName, 'utf-8', (err, data) => {
//                 let tempArray = [];
//                 if (!err && data) {
//                     try {
//                         tempArray = JSON.parse(data);
//                         if (!Array.isArray(tempArray)) {
//                             tempArray = [];
//                         }
//                     }
//                     catch (e) {
//                         tempArray = [];
//                     }
//                 }
//                 tempArray.push(storeObject);
//                 fs.writeFile(mainStorageJsonName, JSON.stringify(tempArray, null, 2), (err) => {
//                     if (err) return callback(err);
//                     callback(null, storeObject)
//                 })
//             })
//         })
//     })
// }
// module.exports = { HashingProcess };