
import {TorrentType} from './type'
import lodash from 'lodash'
const WebTorrent = require('webtorrent')
const parseTorrent = require('parse-torrent')
export class TorrentManager {
    public torrentList : any;
    public client : any;
    public id :any;
    public path :string;
    public constructor(path : string ){
        this.torrentList = {};
        this.client = new WebTorrent();
        this.id = 0;
        this.client.on('error',this.errorClient);
        this.path = path;
    }

    public errorClient(err : any){
        this.torrentList = {}
        this.id = 0;
        console.log(err + " client error");
    }

    public errorTorrent(err : any){
        console.log(err + " torrent error");
    }

    public searchTorrent(magnet : any){
        for(var i in this.torrentList){
            let parsed = parseTorrent(this.torrentList[i].magnetURI);
            //console.log("COMPARE " +parsed.infoHash +" "+magnet.infoHash)
        if(parsed.infoHash.localeCompare(magnet.infoHash)==0){
            return true;
        }
       
    }
     return false;
        }
    
    public torrentMeta(id: number,torrent :any){
            let t = {
                id : id,
                name : torrent.name, 
                downloadSpeed : torrent.downloadSpeed,
                done : torrent.done,
                downloaded : torrent.downloaded,
                length : torrent.length,
                magnetURI : torrent.magnetURI
        };
            console.log('Torrent ' + id + ' metadata ready');
        this.torrentList[id] = t;
    }


    public torrentDl(id: number,torrent:any,bytes:number){
        let t = {
            id : id,
            name : torrent.name, 
            downloadSpeed : torrent.downloadSpeed,
            done : torrent.done,
            downloaded : torrent.downloaded,
            length : torrent.length,
            magnetURI : torrent.magnetURI
    };
    this.torrentList[id] = t;
}

    public torrentDone(id: number,torrent:any){
        console.log("on done " + this+ " " + id )
        let t = {
            id : id,
            name : torrent.name, 
            downloadSpeed : torrent.downloadSpeed,
            done : torrent.done,
            downloaded : torrent.downloaded,
            length : torrent.length,
            magnetURI : torrent.magnetURI
    };
        console.log('Torrent ' + id + ' done ' + t.magnetURI);
        torrent.files.forEach(function(file){
           console.log("file " + file.path)
         })
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
             magnetURI : parseTorrent.toMagnetURI(magnet)
    };
        this.torrentList[this.id] = t;

        try {
            let instance = this;
            let torrent = instance.client.add(magnet,{path : this.path},function(torrent){instance.torrentMeta(instance.id,torrent)})
            .on('error', instance.errorTorrent);
            torrent.on('download',function(bytes){instance.torrentDl(instance.id,torrent,bytes)});
            torrent.on('done',function(){instance.torrentDone(instance.id,torrent)});    
            console.log('Torrent ' + instance.id + ' added');
            return t;
        } catch (error : any) {
            console.log(error +  "error add");
            return error;  
        }


    }

}

