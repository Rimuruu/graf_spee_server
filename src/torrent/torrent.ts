
import {TorrentType} from './type'
import lodash from 'lodash'
const WebTorrent = require('webtorrent')

export class TorrentManager {
    public torrentList : any;
    public client : any;
    public id :any;
    public constructor(){
        this.torrentList = {};
        this.client = new WebTorrent();
        this.id = 0;
        this.client.on('error',this.errorClient);
    }

    public errorClient(err : any){
        this.torrentList = {}
        this.id = 0;
        console.log(err + " client error");
    }

    public errorTorrent(err : any){
        console.log(err + " torrent error");
    }

    public searchTorrent(magnet : string){
        for(var i in this.torrentList){
        if(this.torrentList[i].magnetURI.localeCompare(magnet)==0){
            return true;
        }
       
    }
     return false;
        }
    
    public torrentReady(id,torrent){
            let t = {
                id : this.torrentList[id].id,
                name : torrent.name, 
                downloadSpeed : torrent.downloadSpeed,
                done : torrent.done,
                downloaded : torrent.downloaded,
                length : torrent.length,
                magnetURI : this.torrentList[id].magnetURI
        };
            console.log('Torrent ' + id + ' running');
        this.torrentList[id] = t;
    }


    public torrentDl(id,torrent,bytes){
        let t = {
            id : this.torrentList[id].id,
            name : torrent.name, 
            downloadSpeed : torrent.downloadSpeed,
            done : torrent.done,
            downloaded : torrent.downloaded,
            length : torrent.length,
            magnetURI : this.torrentList[id].magnetURI
    };
    this.torrentList[id] = t;
}

    public torrentDone(id,torrent){
        let t = {
            id : this.torrentList[id].id,
            name : torrent.name, 
            downloadSpeed : torrent.downloadSpeed,
            done : torrent.done,
            downloaded : torrent.downloaded,
            length : torrent.length,
            magnetURI : this.torrentList[id].magnetURI
    };
        console.log('Torrent ' + id + ' running');
    this.torrentList[id] = t;
}

    public addTorrent(magnet: string){
        if(this.searchTorrent(magnet)){
            console.log("Torrent already exist");
            return "Torrent already exist";
        }
        this.id++;
        let t : TorrentType = {
            id : this.id,
             name : undefined, 
             downloadSpeed : undefined,
             done : undefined,
             downloaded : undefined,
             length : undefined,
             magnetURI : magnet
    };
        this.torrentList[this.id] = t;

        try {
            let torrent = this.client.add(magnet,(lodash.curry(this.torrentReady)(this.id)).bind(this))
            .on('error', this.errorTorrent);
            torrent.on('download',(lodash.curry(this.torrentDl)(this.id,torrent)).bind(this))
            torrent.on('done',(lodash.curry(this.torrentDl)(this.id,torrent)).bind(this))
            console.log('Torrent ' + this.id + ' added');
            return t;
        } catch (error : any) {
            console.log(error +  "error add");
            return error;  
        }


    }

}

