// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('api-gateway');
const users =[
    { "userId":1,
      "userName": "Comercial Fund - Bruno",
      "password": "$2a$12$xPaDtDYys8Fl5hkIP/OfdO7jgVJB7ltKKJuoKyLOw6I9heCd/g5n2",
      "userType": "Comercial Fundiario",
      "responsavelTopografia":"Bruno",
      "email":"alex.matias@pecenergia.com.br"
    },
    { "userId":2,
      "userName": "Bruno",
      "password": "$2a$12$0LJNZmdjw6WD5W8B5IByI.JbuwP45o3ivpgFWWect6PpNxV4gkg0a",
      "userType": "Topografia",
      "email":"alex.matias@pecenergia.com.br"
    },
    { "userId":3,
      "userName": "Luis",
      "password": "$2a$12$E.ppXXtB3q/zr6fRL.HbmeH7UvyYCAHiao/Y3wUhwoCG8p9ZtTLJC",
      "userType": "Resources",
      "email":"alex.matias@pecenergia.com.br"
    }
  ]
  


// Create a new document in the collection.
db.getCollection('users').insertMany(users);