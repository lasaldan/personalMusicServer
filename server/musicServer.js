/* Private "Radio" Server */
var port = 3000;

var express = require('express');
var busboy = require('connect-busboy');
var tracks = require('./routes/tracks');
var playlists = require('./routes/playlists');
var bodyParser = require('body-parser');
// I'm not sure if using body-parser is a good idea - I've read lots of 
// conflicting information about whether it should still be used or not...

var app = express();

app.use( bodyParser.json() );
app.use( busboy() );

/* Allow for remote REST consumption */
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	next();
});

/* Fire up server */
app.listen(port);

console.log("Server Started: " + makeDateString() );
console.log("Listening on port: " + port);

/* Public Track API endpoints */
app.get('/radio/api/tracks', tracks.findAll);
app.get('/radio/api/tracks/:id', tracks.findById);
app.post('/radio/api/tracks',tracks.add);
app.put('/radio/api/tracks/:id', tracks.update);
app.delete('/radio/api/tracks/:id', tracks.delete);

/* Public Playlist API endpoints */
app.get('/radio/api/playlists', playlists.findAll);
app.get('/radio/api/playlists/tracks/:id', playlists.getTracksFromPlaylist);
app.get('/radio/api/playlists/:id', playlists.findById);
app.post('/radio/api/playlists', playlists.add);
app.put('/radio/api/playlists/:id',playlists.update);
app.delete('/radio/api/playlists/:id', playlists.delete);

function makeDateString() {
	var d = new Date();
	var date = d.getDate();
	var month = d.getMonth()+1;
	var year = d.getFullYear();
	var hour = d.getHours();
	var min = d.getMinutes();
	var sec = d.getSeconds();
	
	return month + "/" + date + "/" + year + " " + hour + ":" + min + ":" + sec;
}
