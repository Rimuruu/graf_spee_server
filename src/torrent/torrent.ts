



export function searchTorrent(magnet : string ,list : any){
    for(var i in list){
        /* console.log("list[i].magnetURI : " +list[i].magnetURI )
        console.log("magnet : " +magnet )
        console.log("compare : "+ list[i].magnetURI.localeCompare(magnet))*/
    if(list[i].magnetURI.localeCompare(magnet)==0){
        return true;
    }
   
}
 return false;
}