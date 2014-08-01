var mongo = require('mongodb');
var fs = require('fs');
var id3 = require('id3js');
var dbName = "radioDan";
var musicPath = "/var/www/radio/music";
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
                console.log("The '"+collectionName+"' collection doesn't exist.");
            }
        });
    }
});
 
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving track: ' + id);
    db.collection(collectionName, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
 
exports.delete = function(req, res) {
    var id = req.params.id;
    console.log('Deleting track: ' + id);
	
	var trackToRemove = db.collection(collectionName, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)});
	});
		
    db.collection(collectionName, function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, true, function(err, item) {
            res.send("Deleted: " + id);
        });
    });
	
	fs.unlink(filePath + "/" + trackToRemove['filename'], function (err) {
		if (err) 
			console.log( "Delete Error: " + err);
		else
			console.log('Successfully deleted ' + trackToRemove['filename']);
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
	req.pipe(req.busboy);
	
	req.busboy.on('finish', function () {
		console.log("finished");
		res.send("done");
	});
	

	req.busboy.on('file', function (fieldname, file, filename) {
		console.log("Uploading: " + filename); 
		fullPath = __dirname + trackPath + filename;
		fstream = fs.createWriteStream(fullPath);
		file.pipe(fstream);
			
		// TODO: Possible race condition? It seems to read the ID3 tags before
		// the file is fully uploaded. Maybe the ID3 information comes at the
		// very start of the file and just happens to have enough on the first read
		id3({ file: fullPath, type: id3.OPEN_LOCAL }, function(err, tags) {
				
			db.collection(collectionName, function(err, collection) {
				tags.filename = filename;
				
				collection.insert(tags, {safe:true}, function(err, result) {
					if (err) {
						res.send({'error':'An error has occurred - ' + err});
					} else {
						console.log('Success: ' + JSON.stringify(result[0]));
					}
				});
			});
			
		});
		
	});
}

exports.update = function(req, res) {
    var id = req.params.id;
    var track = req.body;
    console.log('Updating Track: ' + id);
    console.log(JSON.stringify(track));
    db.collection(collectionName, function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, track, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating track: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(track);
            }
        });
    });
}