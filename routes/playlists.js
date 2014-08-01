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
                console.log("The '"+collectionName+"' collection doesn't exist.");
            }
        });
    }
});
 
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving playlist: ' + id);
    db.collection(collectionName, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
 
exports.delete = function(req, res) {
    var id = req.params.id;
    console.log('Deleting playlist: ' + id);
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
	db.collection(collectionName, function(err, collection) {
		collection.insert({"filename":filename}, {safe:true}, function(err, result) {
			if (err) {
				res.send({'error':'An error has occurred - ' + err});
			} else {
				console.log('Success: ' + JSON.stringify(result[0]));
			}
		});
	});
}

exports.update = function(req, res) {
    var id = req.params.id;
    var playlist = req.body;
    console.log('Updating Playlist: ' + id);
    console.log(JSON.stringify(playlist));
    db.collection(collectionName, function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, playlist, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating playlist: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success:' + result + ' document(s) updated');
                res.send(playlist);
            }
        });
    });
}