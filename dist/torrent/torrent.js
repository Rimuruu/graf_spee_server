"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TorrentManager = void 0;
const lodash_1 = __importDefault(require("lodash"));
const WebTorrent = require('webtorrent');
class TorrentManager {
    constructor() {
        this.torrentList = {};
        this.client = new WebTorrent();
        this.id = 0;
        this.client.on('error', this.errorClient);
    }
    errorClient(err) {
        this.torrentList = {};
        this.id = 0;
        console.log(err + " client error");
    }
    errorTorrent(err) {
        console.log(err + " torrent error");
    }
    searchTorrent(magnet) {
        for (var i in this.torrentList) {
            if (this.torrentList[i].magnetURI.localeCompare(magnet) == 0) {
                return true;
            }
        }
        return false;
    }
    torrentReady(id, torrent) {
        let t = {
            id: this.torrentList[id].id,
            name: torrent.name,
            downloadSpeed: torrent.downloadSpeed,
            done: torrent.done,
            downloaded: torrent.downloaded,
            length: torrent.length,
            magnetURI: this.torrentList[id].magnetURI
        };
        console.log('Torrent ' + id + ' running');
        this.torrentList[id] = t;
    }
    torrentDl(id, torrent, bytes) {
        let t = {
            id: this.torrentList[id].id,
            name: torrent.name,
            downloadSpeed: torrent.downloadSpeed,
            done: torrent.done,
            downloaded: torrent.downloaded,
            length: torrent.length,
            magnetURI: this.torrentList[id].magnetURI
        };
        this.torrentList[id] = t;
    }
    torrentDone(id, torrent) {
        let t = {
            id: this.torrentList[id].id,
            name: torrent.name,
            downloadSpeed: torrent.downloadSpeed,
            done: torrent.done,
            downloaded: torrent.downloaded,
            length: torrent.length,
            magnetURI: this.torrentList[id].magnetURI
        };
        console.log('Torrent ' + id + ' running');
        this.torrentList[id] = t;
    }
    addTorrent(magnet) {
        if (this.searchTorrent(magnet)) {
            console.log("Torrent already exist");
            return "Torrent already exist";
        }
        this.id++;
        let t = {
            id: this.id,
            name: undefined,
            downloadSpeed: undefined,
            done: undefined,
            downloaded: undefined,
            length: undefined,
            magnetURI: magnet
        };
        this.torrentList[this.id] = t;
        try {
            let torrent = this.client.add(magnet, (lodash_1.default.curry(this.torrentReady)(this.id)).bind(this))
                .on('error', this.errorTorrent);
            torrent.on('download', (lodash_1.default.curry(this.torrentDl)(this.id, torrent)).bind(this));
            console.log('Torrent ' + this.id + ' added');
            return t;
        }
        catch (error) {
            console.log(error + "error add");
            return error;
        }
    }
}
exports.TorrentManager = TorrentManager;
//# sourceMappingURL=torrent.js.map