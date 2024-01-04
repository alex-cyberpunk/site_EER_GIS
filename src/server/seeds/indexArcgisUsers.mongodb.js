/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('api-gateway');

/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('api-gateway');
db.getCollection('arcgisUsers').createIndex( { "lastUsed": 1 }, { expireAfterSeconds: 60*15 } )
