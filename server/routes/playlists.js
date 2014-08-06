var mongo = require('mongodb');
var fs = require('fs');
var id3 = require('id3js');
var dbName = "radioDan";
var collectionName = "playlists";

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


exports.getTracksFromPlaylist = function(req, res) {

    var id = req.params.id;
	
	if(id == 'undefined') {
	
		db.collection('tracks', function(err, collection) {
		
			collection.find().toArray(function(err, items) {
			
				res.send(items);
			});
		});
		
	}
	else 
	{
		
		var trackInfo = new Array();
		
		db.collection(collectionName, function(err, collection) {
		
			collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {

				trackCount = item.tracks.length;
				
				if(item.tracks.length == 0)
					res.send([]);
								
				for(i in item.tracks) {
					trackId = item.tracks[i];
					
					db.collection('tracks', function(err, collection) {
					
						collection.findOne({'_id':new BSON.ObjectID( trackId )}, function(err, item) {
						
							// EWWW! Getting pretty deep here...
							trackInfo.push(item);
							
							// Check if we heard back from the last query yet
							if(--trackCount == 0) {
							
								res.send(trackInfo);
								// Phew... probably should rethink this section.
								
							}
							
						});
					});
				}
				
			});
		});
    }
};
 
 
exports.delete = function(req, res) {

    var id = req.params.id;
	
    db.collection(collectionName, function(err, collection) {
	
        collection.remove({'_id':new BSON.ObjectID(id)}, true, function(err, item) {
		
            res.send("Deleted: " + id);
			
        });
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

    var playlist = req.body;
	
	db.collection(collectionName, function(err, collection) {
	
		collection.insert(playlist, {safe:true}, function(err, result) {
		
			if (err) {
			
				res.send({'error': err});
				
			} else {
			
				res.send({'success':'Playlist added'});
				
			}
		});
	});
}


exports.update = function(req, res) {

    var id = req.params.id;
    var playlist = req.body;
	
    db.collection(collectionName, function(err, collection) {
	
        collection.update({'_id':new BSON.ObjectID(id)}, playlist, {safe:true}, function(err, result) {
		
            if (err) {
			
                res.send({'error':'An error has occurred'});
				
            } else {
			
                res.send(playlist);
				
            }
        });
    });
}