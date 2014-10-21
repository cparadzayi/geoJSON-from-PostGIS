var express = require('express');
var pg = require("pg");
var db = require("./db"); //database credentials
var dbgeo = require("dbgeo");
var app = express();

var connectString = 'tcp://' + db.username + ':' + db.password + '@localhost/postgres';

app.use('/client', express.static(__dirname + '/client'));

app.get('/api', function (req, res) {
	var queryList = 'SELECT gid, name, ST_AsGeoJSON(the_geom) AS geometry FROM pop_places LIMIT 100';
	pg.connect(connectString, function(err, client, done) {
		if(err) { return console.error('erreur de connection au serveur', err); }
		client.query(queryList, null, function(err, result) {
			done();
			if(err) { return console.error('erreur dans la requête', err); }
			var data = result.rows;
			dbgeo.parse({
				"data": data,
				"callback": function(error, result) {
					if (error) {console.log(error);} 
					else {res.send(result);}   
			  	}
			});
		});
	});
});

app.listen(3000, function() { console.log('Listening on 3000'); });
