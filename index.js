const http = require('http');
const fs = require('fs');
const path = require('path');
const { HashingProcess } = require('./Hashing.js');
const { userOrNot } = require('./userOrNot.js');
const crypto = require("crypto");
const mainStorageJsonName = 'storageJSON.json';

const server = http.createServer((req, res) => {
    if (req.method === "GET" && req.url === "/") {
        const documentPath = path.join(__dirname, 'SingIn.html');
        fs.readFile(documentPath, 'utf-8', (err, data) => {
            if (err) {
                res.statusCode = 404;
                res.statusMessage = "Page not found !";
                res.end("Route not found !");
            }
            else {
                res.statusCode = 200;
                res.statusMessage = "Page found successfully ! ";
                res.end(data);
            }
        })
    }
    else if (req.method === "POST" && req.url === "/SingIn.html") {
        let bodyPet = '';
        req.on('data', (chunk) => {
            bodyPet += chunk;
        })
        req.on('end', () => {
            try {
                let objParsing = JSON.parse(bodyPet);
                HashingProcess(objParsing.username, objParsing.password, (err, data) => {
                    if (err) console.log(err);
                    else console.log("Hashed form : ", data);
                })
                res.statusCode = 200;
                res.statusMessage = "Details save safely ! ";
                res.end('Sign up successfully ! ');

            }
            catch (err) {
                res.statusCode = 404;
                res.statusMessage = "Page not found ! ";
            }
        })
    }
    else if (req.method === "GET" && req.url === "/Login.html") {
        fs.readFile(path.join(__dirname, 'Login.html'), 'utf-8', (err, data) => {
            if (err) console.log(err);
            else {
                res.statusCode = 200;
                res.statusMessage = 'Page found !';
                res.end(data);

            }
        })
        res.statusCode = 200;
    }
    else if (req.method === "POST" && req.url === "/Login.html") {
        let detail = '';
        req.on('data', (chunk) => {
            detail += chunk;
        });
        req.on('end', () => {
            try {
                let detailJson = JSON.parse(detail);
                console.log(detailJson.username);
                console.log(detailJson.password);
                let trendTruth = false;
                userOrNot(detailJson.username, detailJson.password, (err, iuser) => {
                    if (err) return;
                    else {
                        if (iuser) {

                            res.statusCode = 200;
                            res.statusMessage = 'Permission granted !';
                            res.end('Welcome back in the Xrypthon home. . .');
                        }
                        else {
                            res.statusCode = 404;
                            res.end('Please try again you might be enter incorrect username or password, or you are no longer user of Xrypthon home');
                        }
                    }
                })

            }
            catch (e) {
                console.log("Error appears while server respond by checking details " + e);
            }
        })
    }
});


server.listen(3000, () => {
    console.log("server is listen on https://localhost:3000");
})