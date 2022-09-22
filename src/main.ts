import express from 'express'
import {searchTorrent} from './torrent/torrent'
import {TorrentType} from './torrent/type'
import config from './config.json'
const WebTorrent = require('webtorrent')
let app = express();
const client = new WebTorrent()
let torrentList = {}
let id = 0;

const basicAuth = require('express-basic-auth')
app.use(basicAuth(config.AUTH))
app.use(express.json())
app.get('/', function (req, res) {
  res.send('GET request to the homepage');
});
client.on('error', function (err) {
    console.log("Client destroy : fatal error");
})
app.post('/torrent', function (req, res) {
    if(searchTorrent(req.body.magnet,torrentList)){
      console.log("Torrent already exist")
      res.send({"message":"Torrent already exist"});
    }
    else{
            let idT = id++;
    let t : TorrentType = {
                   id : idT,
                    name : undefined, 
                    downloadSpeed : undefined,
                    done : undefined,
                    downloaded : undefined,
                    length : undefined,
                    magnetURI : req.body.magnet
           };
    torrentList[idT] = t;
    
    try {
        client.add(req.body.magnet, function (torrent) {
           t = {
                   id : idT,
                    name : torrent.name, 
                    downloadSpeed : torrent.downloadSpeed,
                    done : torrent.done,
                    downloaded : torrent.downloaded,
                    length : torrent.length,
                    magnetURI : t.magnetURI
           };
         torrentList[idT] = t;
    }
  )    
    } catch (error : any) {
        console.log("error add  ");  
    }
    
  res.send({"id" : idT,"message":"Torrent added"});

    }
});

app.get('/torrent', function (req, res) {
    
   console.log(torrentList);
  res.send( torrentList);
});

app.get('/torrent/:id', function (req, res) {
    
   console.log(torrentList[req.params.id]);
  res.send( torrentList[req.params.id]);
});



console.log("listen")
app.listen(config.SERVER.PORT,config.SERVER.IP)
