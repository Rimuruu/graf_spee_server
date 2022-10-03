import express from 'express'
import { TorrentManager } from './torrent/torrent';
import config from './config.json'
const parseTorrent = require('parse-torrent')
const path = require('node:path');
let app = express();
let currentPath = path.join(__dirname+'\\cache');
console.log(currentPath);
let tm : TorrentManager = new TorrentManager(currentPath);


const basicAuth = require('express-basic-auth')
app.use(basicAuth(config.AUTH))
app.use(express.json())
app.get('/', function (req, res) {
  res.send('GET request to the homepage');
});

app.post('/torrent', function (req, res) {
      let unify = parseTorrent(req.body.magnet);
      //console.log(unify)
       let response = tm.addTorrent(unify)  
       res.send(response);

    
});

app.get('/torrent', function (req, res) {
    
   console.log(tm.torrentList);
  res.send( tm.torrentList);
});

app.get('/torrent/:id', function (req, res) {
    
   console.log(tm.torrentList[req.params.id]);
  res.send( tm.torrentList[req.params.id]);
});



console.log("Listen " +config.SERVER.IP+":"+config.SERVER.PORT)
app.listen(config.SERVER.PORT,config.SERVER.IP)
