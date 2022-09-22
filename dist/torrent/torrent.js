"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTorrent = void 0;
function searchTorrent(magnet, list) {
    for (var i in list) {
        /* console.log("list[i].magnetURI : " +list[i].magnetURI )
        console.log("magnet : " +magnet )
        console.log("compare : "+ list[i].magnetURI.localeCompare(magnet))*/
        if (list[i].magnetURI.localeCompare(magnet) == 0) {
            return true;
        }
    }
    return false;
}
exports.searchTorrent = searchTorrent;
//# sourceMappingURL=torrent.js.map