var mongo = require('mongodb');
var fs = require('fs');
var id3 = require('musicmetadata');
var dbName = "radio";
var musicPath = "path/to/music/folder";
var collectionName = "tracks";

var Server = mongo.Server;
var Db = mongo.Db;
var BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db(dbName, server, {w:1});
 
 
db.open(function(err, db) {

    if(!err) {
	
        db.collection(collectionName, {strict:true}, function(err, collection) {
		
            if (err) {
			
                console.warn("The '"+collectionName+"' collection doesn't exist.");
				
            }
        });
    }
});
 
 
exports.findById = function(req, res) {

    var id = req.params.id;
	
    db.collection(collectionName, function(err, collection) {
	
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
		
            res.send(item);
			
        });
    });
};
 
 
exports.delete = function(req, res) {

    var id = req.params.id;
	
	var trackToRemove = db.collection(collectionName, function(err, collection) {
	
        collection.findOne({'_id':new BSON.ObjectID(id)});
		
	});
		
    db.collection(collectionName, function(err, collection) {
	
        collection.remove({'_id':new BSON.ObjectID(id)}, true, function(err, item) {
		
            res.send("Deleted: " + id);
			
        });
    });
	
	fs.unlink(__dirname + musicPath + "/" + trackToRemove['filename'], function (err) {
	
		if (err) 
			console.warn( "Delete Error: " + err);
			
	});
};


exports.findAll = function(req, res) {

    db.collection(collectionName, function(err, collection) {
	
        collection.find().toArray(function(err, items) {
		
            res.send(items);
			
        });
    });
};


exports.add = function(req, res) {

	trackPath = musicPath;
	var fstream;
	var parser;
	req.pipe(req.busboy);
	var filename;
	
	req.busboy.on('finish', function () {
	
		parser = new id3(fs.createReadStream(fullPath));
		parser.on('metadata', function (result) {
		
			var tags = {};
			db.collection(collectionName, function(err, collection) {
			
				tags.title = result.title;
				tags.artists = result.albumartist;
				tags.album = result.album;
				tags.year = result.year;
				tags.track = result.track.no;
				tags.duration = result.duration;
				tags.filename = filename;
				tags.comment = "";
				tags.rating = 3;
				
				collection.insert(tags, {safe:true}, function(err, result) {
				
					if (err) {
					
						res.send({'error':'An error has occurred - ' + err});
						
					}
				});
			});
		});
		
		res.send("done");
	});
	

	req.busboy.on('file', function (fieldname, file, temp_filename) {
	
		temp_filename = temp_filename.replace(/[\ \-\']/g,"_");
		
		filename = temp_filename;
		fullPath = __dirname + trackPath + "/" + temp_filename;
		
		fstream = fs.createWriteStream(fullPath);
		file.pipe(fstream);
		
		file.on('end', function() {
		
		});		
	});
}


exports.update = function(req, res) {

    var id = req.params.id;
    var track = req.body;
	
    db.collection(collectionName, function(err, collection) {
	
        collection.update({'_id':new BSON.ObjectID(id)}, track, {safe:true}, function(err, result) {
		
            if (err) {
			
                res.send({'error':'An error has occurred'});
				
            } else {
			
                res.send(track);
				
            }
        });
    });
}