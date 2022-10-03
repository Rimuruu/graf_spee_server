"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TorrentManager = void 0;
const WebTorrent = require('webtorrent');
const parseTorrent = require('parse-torrent');
class TorrentManager {
    constructor(path) {
        this.torrentList = {};
        this.client = new WebTorrent();
        this.id = 0;
        this.client.on('error', this.errorClient);
        this.path = path;
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
            let parsed = parseTorrent(this.torrentList[i].magnetURI);
            //console.log("COMPARE " +parsed.infoHash +" "+magnet.infoHash)
            if (parsed.infoHash.localeCompare(magnet.infoHash) == 0) {
                return true;
            }
        }
        return false;
    }
    torrentMeta(id, torrent) {
        let t = {
            id: id,
            name: torrent.name,
            downloadSpeed: torrent.downloadSpeed,
            done: torrent.done,
            downloaded: torrent.downloaded,
            length: torrent.length,
            magnetURI: torrent.magnetURI
        };
        console.log('Torrent ' + id + ' metadata ready');
        this.torrentList[id] = t;
    }
    torrentDl(id, torrent, bytes) {
        let t = {
            id: id,
            name: torrent.name,
            downloadSpeed: torrent.downloadSpeed,
            done: torrent.done,
            downloaded: torrent.downloaded,
            length: torrent.length,
            magnetURI: torrent.magnetURI
        };
        this.torrentList[id] = t;
    }
    torrentDone(id, torrent) {
        console.log("on done " + this + " " + id);
        let t = {
            id: id,
            name: torrent.name,
            downloadSpeed: torrent.downloadSpeed,
            done: torrent.done,
            downloaded: torrent.downloaded,
            length: torrent.length,
            magnetURI: torrent.magnetURI
        };
        console.log('Torrent ' + id + ' done ' + t.magnetURI);
        torrent.files.forEach(function (file) {
            console.log("file " + file.path);
        });
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
            magnetURI: parseTorrent.toMagnetURI(magnet)
        };
        this.torrentList[this.id] = t;
        try {
            let instance = this;
            let torrent = instance.client.add(magnet, { path: this.path }, function (torrent) { instance.torrentMeta(instance.id, torrent); })
                .on('error', instance.errorTorrent);
            torrent.on('download', function (bytes) { instance.torrentDl(instance.id, torrent, bytes); });
            torrent.on('done', function () { instance.torrentDone(instance.id, torrent); });
            console.log('Torrent ' + instance.id + ' added');
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