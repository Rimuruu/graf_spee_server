"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const torrent_1 = require("./torrent/torrent");
const config_json_1 = __importDefault(require("./config.json"));
const WebTorrent = require('webtorrent');
let app = (0, express_1.default)();
const client = new WebTorrent();
let torrentList = {};
let id = 0;
const basicAuth = require('express-basic-auth');
app.use(basicAuth(config_json_1.default.AUTH));
app.use(express_1.default.json());
app.get('/', function (req, res) {
    res.send('GET request to the homepage');
});
client.on('error', function (err) {
    console.log("Client destroy : fatal error");
});
app.post('/torrent', function (req, res) {
    if ((0, torrent_1.searchTorrent)(req.body.magnet, torrentList)) {
        console.log("Torrent already exist");
        res.send({ "message": "Torrent already exist" });
    }
    else {
        let idT = id++;
        let t = {
            id: idT,
            name: undefined,
            downloadSpeed: undefined,
            done: undefined,
            downloaded: undefined,
            length: undefined,
            magnetURI: req.body.magnet
        };
        torrentList[idT] = t;
        try {
            client.add(req.body.magnet, function (torrent) {
                t = {
                    id: idT,
                    name: torrent.name,
                    downloadSpeed: torrent.downloadSpeed,
                    done: torrent.done,
                    downloaded: torrent.downloaded,
                    length: torrent.length,
                    magnetURI: t.magnetURI
                };
                torrentList[idT] = t;
            });
        }
        catch (error) {
            console.log("error add  ");
        }
        res.send({ "id": idT, "message": "Torrent added" });
    }
});
app.get('/torrent', function (req, res) {
    console.log(torrentList);
    res.send(torrentList);
});
app.get('/torrent/:id', function (req, res) {
    console.log(torrentList[req.params.id]);
    res.send(torrentList[req.params.id]);
});
console.log("listen");
app.listen(config_json_1.default.SERVER.PORT, config_json_1.default.SERVER.IP);
//# sourceMappingURL=main.js.map