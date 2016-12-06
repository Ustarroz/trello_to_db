var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var fs = require("fs");
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var request = require('request');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';

// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
      return;
  }
    // Authorize a client with the loaded credentials, then call the
  // Google Sheets API.
    authorize(JSON.parse(content), list_product_backlog);
    authorize(JSON.parse(content), list_story_backlog);
    authorize(JSON.parse(content), list_organisation_sages2);
    authorize(JSON.parse(content), list_fonctionnalité_backlog);
    authorize(JSON.parse(content), list_mantis_backlog);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
    function authorize(credentials, callback) {
	var clientSecret = credentials.installed.client_secret;
	var clientId = credentials.installed.client_id;
	var redirectUrl = credentials.installed.redirect_uris[0];
	var auth = new googleAuth();
	var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile('sheets.googleapis.com-nodejs-quickstart.json', function(err, token) {
      if (err) {
	  getNewToken(oauth2Client, callback);
      } else {
	  oauth2Client.credentials = JSON.parse(token);
	  callback(oauth2Client);
      }
  });
};

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
    var authUrl = oauth2Client.generateAuthUrl({
	access_type: 'offline',
	scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function(code) {
	rl.close();
	oauth2Client.getToken(code, function(err, token) {
	    if (err) {
		console.log('Error while trying to retrieve access token', err);
		return;
	    }		    
	    oauth2Client.credentials = token;
	    storeToken(token);
	    callback(oauth2Client);
		});	
    });
};
			    

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}


/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function list_product_backlog(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: '1rTZAdGI-5rMOLT0qVZWen5K4mzKx_0As16qpjaGgHAk',
    range: 'A:F',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var rows = response.values;
    if (rows.length == 0) {
      console.log('No data found.');
    } else {
	var tab = [];
	for (var i = 0; i < rows.length; i++) {
            tab[i] = rows[i];
	}
	MongoClient.connect('mongodb://extractor/product_backlog', function(err, db) {
	    if (err) throw err;
	    db.createCollection('product_backlog', function(err, collection) {});
	    if (err) throw err;
	    var collection = db.collection('product_backlog');
	    var obj = JSON.stringify(tab);
	    Schema = mongoose.Schema;
	    var JSONSchema = new Schema({
		created_at: Date,
		updated_at: Date,
		json: Object
	    });
	    mongoose.model(obj,JSONSchema);
	    collection.insert(mongoose.model(obj,JSONSchema));    
	});        
    }        
  });
}

function list_story_backlog(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: '1pu1lIj5HgeHfT8yU1gkZi5hd_sD9SXw9oK56A5Gob1M',
    range: 'A:F',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var rows = response.values;
    if (rows.length == 0) {
      console.log('No data found.');
    } else {
	var tab = [];
	for (var i = 0; i < rows.length; i++) {
            tab[i] = rows[i];
	}
	MongoClient.connect('mongodb://extractor/story_backlog', function(err, db) {
	    if (err) throw err;
	    db.createCollection('product_backlog', function(err, collection) {});
	    if (err) throw err;
	    var collection = db.collection('test');
	    var obj = JSON.stringify(tab);
	    Schema = mongoose.Schema;
	    var JSONSchema = new Schema({
		created_at: Date,
		updated_at: Date,
		json: Object
	    });
	    mongoose.model(obj,JSONSchema);
	    collection.insert(mongoose.model(obj,JSONSchema));    
	})
    }
  })
}

  function list_fonctionnalité_backlog(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: '1JqVsNzh5WCJKW_HSER9a2orH0FV1TsSxRFtkU6qnIYA',
    range: 'A:F',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var rows = response.values;
    if (rows.length == 0) {
      console.log('No data found.');
    } else {
	var tab = []       ;
	for (var i = 0; i < rows.length; i++) {
            tab[i] = rows[i];
	}
	MongoClient.connect('mongodb://extractor/fonctionnalité_backlog', function(err, db) {
	    if (err) throw err;
	    db.createCollection('fonctionnalité_backlog', function(err, collection) {});
	    if (err) throw err;
	    var collection = db.collection('fonctionnalité_backlog');
	    var obj = JSON.stringify(tab);
	    Schema = mongoose.Schema;
	    var JSONSchema = new Schema({
		created_at: Date,
		updated_at: Date,
		json: Object
	    });
	    mongoose.model(obj,JSONSchema);
	    collection.insert(mongoose.model(obj,JSONSchema));    
	})
    }
  })
}
   
function list_mantis_backlog(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: '1Y8YrEKCdboKLwsl-Jkciyrvr0HCQsrypYziHm23JC14',
    range: 'A:F',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var rows = response.values;
    if (rows.length == 0) {
      console.log('No data found.');
    } else {
	var tab = [];
	for (var i = 0; i < rows.length; i++) {
            tab[i] = rows[i];
	}
	MongoClient.connect('mongodb://extractor/mantis_backlog', function(err, db) {
	    if (err) throw err;
	    db.createCollection('mantis_backlog', function(err, collection) {});
	    if (err) throw err;
	    var collection = db.collection('mantis_backlog');
	    var obj = JSON.stringify(tab);
	    Schema = mongoose.Schema;
	    var JSONSchema = new Schema({
		created_at: Date,
		updated_at: Date,
		json: Object
	    });
	    mongoose.model(obj,JSONSchema);
	    collection.insert(mongoose.model(obj,JSONSchema));    
	})
    }
  })
}

function list_organisation_sages2(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: '1dZ8pq9aDvdIrmj2WlZtHB-c4rfkSvO6taI02nG3XIVc',
    range: 'A:F',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var rows = response.values;
    if (rows.length == 0) {
      console.log('No data found.');
    } else {
	var tab = [];
	for (var i = 0; i < rows.length; i++) {
            tab[i] = rows[i];
	}
	MongoClient.connect('mongodb://extractor/organisation_sages2', function(err, db) {
	    if (err) throw err;
	    db.createCollection('organisation_sages2', function(err, collection) {});
	    if (err) throw err;
	    var collection = db.collection('test');
	    var obj = JSON.stringify(tab);
	    Schema = mongoose.Schema;
	    var JSONSchema = new Schema({
		created_at: Date,
		updated_at: Date,
		json: Object
	    });
	    mongoose.model(obj,JSONSchema);
	    collection.insert(mongoose.model(obj,JSONSchema));    
	})
    }
  })
}
