"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const torrent_1 = require("./torrent/torrent");
const config_json_1 = __importDefault(require("./config.json"));
const parseTorrent = require('parse-torrent');
const path = require('node:path');
let app = (0, express_1.default)();
let currentPath = path.join(__dirname + '\\cache');
console.log(currentPath);
let tm = new torrent_1.TorrentManager(currentPath);
const basicAuth = require('express-basic-auth');
app.use(basicAuth(config_json_1.default.AUTH));
app.use(express_1.default.json());
app.get('/', function (req, res) {
    res.send('GET request to the homepage');
});
app.post('/torrent', function (req, res) {
    let unify = parseTorrent(req.body.magnet);
    //console.log(unify)
    let response = tm.addTorrent(unify);
    res.send(response);
});
app.get('/torrent', function (req, res) {
    console.log(tm.torrentList);
    res.send(tm.torrentList);
});
app.get('/torrent/:id', function (req, res) {
    console.log(tm.torrentList[req.params.id]);
    res.send(tm.torrentList[req.params.id]);
});
console.log("Listen " + config_json_1.default.SERVER.IP + ":" + config_json_1.default.SERVER.PORT);
app.listen(config_json_1.default.SERVER.PORT, config_json_1.default.SERVER.IP);
//# sourceMappingURL=main.js.map