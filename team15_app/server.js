/* server.js for react-express-authentication */
"use strict";

/* Server environment setup */
// To run in development mode, run normally: node server.js
// To run in development with the test user logged in the backend, run: TEST_USER_ON=true node server.js
// To run in production mode, run in terminal: NODE_ENV=production node server.js
const env = process.env.NODE_ENV; // read the environment variable (will be 'production' in production mode)

const USE_TEST_USER = env !== "production" && process.env.TEST_USER_ON; // option to turn on the test user.
const TEST_USER_ID = "5fb8b011b864666580b4efe3"; // the id of our test user (you will have to replace it with a test user that you made). can also put this into a separate configutation file
const TEST_USERNAME = "test@user.com";
//////

const log = console.log;
const path = require("path");

const express = require("express");
// starting the express server
const app = express();

// enable CORS if in development, for React local development server to connect to the web server.
const cors = require("cors");
if (env !== "production") {
  app.use(cors());
}

// mongoose and mongo connection
const { mongoose } = require("./db/mongoose");
mongoose.set("useFindAndModify", false); // for some deprecation issues

// need this for POST'ing images
const fs = require('fs');
const defaultProfilePic = fs.readFileSync('./server_assets/default_profile.txt')

// import the mongoose models
const { Trail } = require("./models/trail");
const { Post } = require("./models/post");
const { Bike } = require("./models/bike");
const { User } = require("./models/user");

//TODO: insert models here

// to validate object IDs
const { ObjectID } = require("mongodb");

// body-parser: middleware for parsing parts of the request into a usable object (onto req.body)
const bodyParser = require('body-parser')
app.use(bodyParser.json({ limit: '25mb', extended: true })) // parsing JSON body
app.use(bodyParser.urlencoded({ limit: '25mb', extended: true })); // parsing URL-encoded form data (from form POST requests)
// express-session for managing user sessions
const session = require("express-session");
const MongoStore = require("connect-mongo"); // to store session information on the database in production
//const fileUpload = require('express-fileupload'); // Todo: Not sure if we need this


function isMongoError(error) { // checks for first error returned by promise rejection if Mongo database suddently disconnects
	return typeof error === 'object' && error !== null && error.name === "MongoNetworkError"
}

// middleware for mongo connection error for routes that need it
const mongoChecker = (req, res, next) => {
	// check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	} else {
		next()
	}
}

// Middleware for authentication of resources
const authenticate = (req, res, next) => {
	if (env !== 'production') {
		next()
	} else if (req.session.user_id) {
		User.findById(req.session.user_id).then((user) => {
			if (!user) {
				return Promise.reject()
			} else {
				req.user = user
				next()
			}
		}).catch((error) => {
			res.status(401).send("Unauthorized")
		})
	} else {
		res.status(401).send("Unauthorized")
	}
}

// Multer middleware for storing uploaded files
// Source: https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/

const multer = require('multer');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './uploads/')
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now())
	}
});

const upload = multer({ storage: storage });


/*** Session handling **************************************/

// Create a session and session cookie
app.use(
	session({
		secret: process.env.SESSION_SECRET || "our hardcoded secret", // make a SESSION_SECRET environment variable when deploying (for example, on heroku)
		resave: false,
		saveUninitialized: false,
		cookie: {
			expires: 60000,
			httpOnly: true
		},
		// store the sessions on the database in production
		store: env === 'production' ? MongoStore.create({
			mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/BikeItPostItAPI'
		}) : null
	})
);

// A route to login and create a session
app.post("/users/login", mongoChecker, async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	try {
		const user = await User.findOne({ username: username, password: password })
		if (user) {
			req.session.user = { _id: user._id, username: user.username, role: user.role };
			res.send({ currentUser: req.session.user });
		} else {
			res.status(401).send('Invalid login credentials')
		}
	} catch (error) {
		if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			log(error)
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	}
});

// A route to logout a user
app.get("/users/logout", (req, res) => {
	// Remove the session
	req.session.destroy(error => {
		if (error) {
			res.status(500).send(error);
		} else {
			res.send()
		}
	});
});

// A route to check if a user is logged in on the session
app.get("/users/check-session", (req, res) => {
	log('req.session', req.session)
	if (req.session.user) {
		res.send({ currentUser: req.session.user });
	} else {
		res.status(401).send();
	}
});

/*********************************************************/

/*** API Routes below ************************************/

// User API Route

/**  Resource routes **/

// ====================== Users ===============

app.post('/api/register', upload.single('picture'), mongoChecker, async (req, res) => {
	log(req.body)

    const profilePic = req.body.picture ? req.body.picture : defaultProfilePic;

	// check if username is being used 
	try {
		const doc = await User.findOne({ username: req.body.username })

		if (!doc) {
			const user = new User({
				username: req.body.username,
				password: req.body.password,
				role: req.body.role,
				name: req.body.name,
				gender: req.body.gender,
				location: req.body.location,
				description: req.body.description,
				picture: profilePic
			})
			const newUser = await user.save()
			res.send(newUser)
		} else {
			res.status(409).send('Username is taken')
		}
	} catch (error) {
		if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			log(error)
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	}
})

// a GET route to get all users
app.get('/api/users', authenticate, mongoChecker, async (req, res) => {

	// Get the users
	try {
		const users = await User.find()
		res.send({ users })
	} catch (error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}
  
});

// a Get route to get user by username
app.post('/api/check-user-exists', mongoChecker, async (req, res) => {
	const username = req.body.username

	try {
		const user = await User.findOne({ username: username })
		if(user) {
			res.status(200).send('user found')
		} else {
			res.status(404).send('does not exist')
		}
	} catch (error) {
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}
})

// a GET route to get a user by its id 
app.get('/api/users/:id', authenticate, mongoChecker, async (req, res) => {
	const id = req.params.id

	if (!ObjectID.isValid(id)) {
		res.status(404).send()
		return;
	}

	try {
		const user = await User.findOne({ _id: id })
		if (!user) {
			res.status(404).send('Resource not found')
		} else {
			res.send(user)
		}
	} catch (error) {
		log(error)
		res.status(500).send('Internal Server Error')
	}

})

// DELETE route for deleting users
app.delete('/api/users/:id', authenticate, mongoChecker, async (req, res) => {

	const id = req.params.id
	log("User to be deleted: ", id)

	// Validate id
	if (!ObjectID.isValid(id)) {
		res.status(404).send('Resource not found')
		return;
	}

	// Delete a user by their id
	try {
		const user = await User.findById(id)
		if (!user) {
			res.status(404).send('User not found')  // could not find this user
		} else {
			log("Removing user ", id)
			const result = await User.deleteOne({ _id: id });
			res.status(200).send(result)
		}
	} catch (error) {
		log(error)
		res.status(500).send() // server error, could not delete.
	}

})

// PATCH route for editing user content
/* 
*/
app.patch('/api/users/edit/:id', authenticate, mongoChecker, async (req, res) => {
	const id = req.params.id

    // Validate id
    if (!ObjectID.isValid(id)) {
      res.status(404).send("Resource not found");
      return;
    }

	// If id valid, findById
	try {

		await User.findOneAndUpdate(
			{ _id: id },
			{ "$set": { "name": req.body.name, "gender": req.body.gender, "location": req.body.location, "description": req.body.description, "picture": req.body.picture } },
			function (err, result) {
				if (err) {
					res.send(err);
				} else {
					res.send(result);
				}
			}
		);

	} catch (error) {
		log(error)
		res.status(500).send('Internal Server Error')  // server error
	}

})

// ================== TRAILS  ================== //

// a POST route to *create* a trail
app.post('/api/trails', authenticate, upload.single('picture'), mongoChecker, async (req, res) => {
	log(`Adding Trail ${req.body.title}`)
	log('Adding File', req.file)

	// Create a new trail using the Trail mongoose model
	const trail = new Trail({
		title: req.body.title,
		picture: req.body.picture,
		author: req.body.author,
		strava: req.body.strava,
		users: req.body.users,
		times: req.body.times,
		ratings: req.body.ratings,
		date: req.body.date
	})

	// Save trail to the database
	// async-await version:
	try {
		const result = await trail.save()
		res.send(result)
	} catch (error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}

})

// a GET route to get all trails
app.get('/api/trails', authenticate, mongoChecker, async (req, res) => {

	// Get the trails
	try {
		const trails = await Trail.find()
		res.send({ trails })
	} catch (error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}

})

// a GET route to get *specific* trail
app.get('/api/trails/:id', authenticate, mongoChecker, async (req, res) => {

  // Validate id
  if (!ObjectID.isValid(id)) {
    res.status(404).send("Resource not found");
    return;
  }

	// Get the trails
	try {
		const trail = await Trail.findById(id)
		res.send({ trail })
	} catch (error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}

})

// DELETE route for deleting trails
app.delete('/api/trails/:id', authenticate, mongoChecker, async (req, res) => {

	const id = req.params.id
	log("Trail to be deleted: ", id)

	// Validate id
	if (!ObjectID.isValid(id)) {
		res.status(404).send('Resource not found')
		return;
	}

	// Delete a trail by their id
	try {
		const trail = await Trail.findById(id)
		if (!trail) {
			res.status(404).send('Trail not found')  // could not find this trail
		} else {
			log("Removing trail ", id)
			const result = await Trail.deleteOne({ _id: id });
			res.status(200).send(result)
		}
	} catch (error) {
		log(error)
		res.status(500).send() // server error, could not delete.
	}

})

// PATCH route for editing trail content
/* 
Request body expects:
{
	"title": <title>
	"times": <time> // change the time on index 0
	"rating": <rating>
	"strava": <strava>
}
*/
app.patch('/api/trails/edit/:id', authenticate, mongoChecker, async (req, res) => {
	const id = req.params.id

    // Validate id
    if (!ObjectID.isValid(id)) {
      res.status(404).send("Resource not found");
      return;
    }

	// If id valid, findById
	try {

		await Trail.findOneAndUpdate(
			{ _id: id },
			{ "$set": { "title": req.body.title, "times.0": req.body.times, "ratings.0": req.body.ratings, "strava": req.body.strava } },
			function (err, result) {
				if (err) {
					res.send(err);
				} else {
					res.send(result);
				}
			}
		);

	} catch (error) {
		log(error)
		res.status(500).send('Internal Server Error')  // server error
	}

})

// POST route for adding user to trail's user list. This happens when they try making a trailpost that already exists.
app.post('/api/trails/:id/adduser', authenticate, mongoChecker, async (req, res) => {

  // check if ID valid
  if (!ObjectID.isValid(id)) {
    res.status(404).send(); // if invalid id, definitely can't find resource, 404.
    return; // so that we don't run the rest of the handler.
  }


	// If id valid, findById
	try {
		const trail = await Trail.findById(id)
		if (!trail) {
			res.status(404).send('Trail not found')  // could not find this trail
		} else {
			trail.users.push(req.body.username) // TODO: change this to the correct attributes when User Schema done.
			trail.times.push(req.body.times)
			trail.ratings.push(req.body.ratings)
			const out = await trail.save()
			res.send(out)
		}
	} catch (error) {
		log(error)
		res.status(500).send('Internal Server Error')  // server error
	}

})

// PATCH route for following a trail
app.patch('/api/users/follow/:id', authenticate, mongoChecker, async (req, res) => {

  // check if ID valid
  if (!ObjectID.isValid(uid)) {
    res.status(404).send(); // if invalid id, definitely can't find resource, 404.
    return; // so that we don't run the rest of the handler.
  }

	// If id valid, findById
	try {
		const user = await User.findById(uid)
		if (!user) {
			res.status(404).send('User not found')  // could not find this trail
		} else {
			user.followingTrails.push(req.params.id) // TODO: change this to the correct attributes when User Schema done.
			const out = await user.save()
			res.send(out)
		}
	} catch (error) {
		log(error)
		res.status(500).send('Internal Server Error')  // server error
	}

})

// DELETE route for unfollowing a trail
app.delete('/api/users/unfollow/:id', authenticate, mongoChecker, async (req, res) => {

	const uid = req.body.user_id

	// check if ID valid 
	if (!ObjectID.isValid(uid)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
	}

	// If id valid, findById
	try {
		const user = await User.findById(uid)
		if (!user) {
			res.status(404).send('User not found')  // could not find this trail
		} else {

			const trail = req.params.id // need to remove this from followingTrails
			user.followingTrails = user.followingTrails.filter(x => x != trail)
			const out = await user.save()
			res.send(out)
		}
	}catch (error) {
		log(error)
		res.status(500).send('Internal Server Error')  // server error
  	}
});

// ================== BIKES ================== //
// a POST route to *create* a Bike
app.post('/api/bikes', upload.single('picture'), authenticate, mongoChecker, async (req, res) => {

	const bike = new Bike({
		model: req.body.model,
		owner: req.body.owner,
		description: req.body.description,
		contactNumber: req.body.contactNumber,
		price: req.body.price,
		purchasedOn: req.body.purchasedOn,
		canBuy: req.body.canBuy,
		picture: req.body.picture,
		date: req.body.date
	})

	try {
		const newBike = await bike.save()
		res.send(newBike)
	} catch (error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}

})

// a GET route to get all bikes 
app.get('/api/bikes', authenticate, mongoChecker, async (req, res) => {
	try {
		const bikes = await Bike.find()
		res.send({ bikes })
	} catch (error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}
});

// a GET route to get a bike by its id 
app.get('/api/bikes/:id', authenticate, mongoChecker, async (req, res) => {
	const id = req.params.id

	if (!ObjectID.isValid(id)) {
		res.status(404).send()
		return;
	}

	try {
		const bike = await Bike.findOne({ _id: id })
		if (!bike) {
			res.status(404).send('Resource not found')
		} else {
			res.send(bike)
		}
	} catch (error) {
		log(error)
		res.status(500).send('Internal Server Error')
	}

})

/// a DELETE route to remove a bike by their id.
app.delete('/api/bikes/:id', authenticate, async (req, res) => {
	const id = req.params.id

  // Validate id
  if (!ObjectID.isValid(id)) {
    res.status(404).send("Resource not found");
    return;
  }

	// Delete a bike by their id
	try {
		const bike = await Bike.findById(id)
		if (!bike) {
			res.status(404).send('Trail not found')  // could not find this bike
		} else {
			log("Removing trail ", id)
			const result = await Bike.deleteOne({ _id: id });
			res.status(200).send(result)
		}
	} catch (error) {
		log(error)
		res.status(500).send() // server error, could not delete.
	}
})

app.patch('/api/bikes/edit/:id', authenticate, mongoChecker, async (req, res) => {
	const id = req.params.id

    // Validate id
    if (!ObjectID.isValid(id)) {
      res.status(404).send("Resource not found");
      return;
    }

	// If id valid, findById
	try {

		await Bike.findOneAndUpdate(
			{ _id: id },
			{ "$set": { "model": req.body.model, "contactNumber": req.body.contactNumber, "price": req.body.price, "description": req.body.description, "canBuy": req.body.canBuy } },
			function (err, result) {
				if (err) {
					res.send(err);
				} else {
					res.send(result);
				}
			}
		);

	} catch (error) {
		log(error)
		res.status(500).send('Internal Server Error')  // server error
	}

})

// ================== POSTS ================== //
// a POST route to *create* a POST
app.post('/api/posts', upload.single('picture'), authenticate, mongoChecker, async (req, res) => {

	const post = new Post({
		title: req.body.title,
		author: req.body.author,
		caption: req.body.caption,
		content: req.body.content,
		picture: req.body.picture,
		date: req.body.date,
		likes: 0,
		comments: []
	})

	try {
		const newPost = await post.save()
		res.send(newPost)
	} catch (error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}

})

// a GET route to get all posts 
app.get('/api/posts', authenticate, mongoChecker, async (req, res) => {
	try {
		const posts = await Post.find()
		res.send({ posts })
	} catch (error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}
});

// a GET route to get a post by its id 
app.get('/api/posts/:id', authenticate, mongoChecker, async (req, res) => {
	const id = req.params.id

	if (!ObjectID.isValid(id)) {
		res.status(404).send()
		return;
	}

	try {
		const post = await Post.findOne({ _id: id })
		if (!post) {
			res.status(404).send('Resource not found')
		} else {
			res.send(post)
		}
	} catch (error) {
		log(error)
		res.status(500).send('Internal Server Error')
	}

})

/// a DELETE route to remove a post by their id.
app.delete('/api/posts/:id', authenticate, async (req, res) => {
	const id = req.params.id

  // Validate id
  if (!ObjectID.isValid(id)) {
    res.status(404).send("Resource not found");
    return;
  }

	// Delete a post by their id
	try {
		const post = await Post.findById(id)
		if (!post) {
			res.status(404).send('Trail not found')  // could not find this post
		} else {
			log("Removing trail ", id)
			const result = await Post.deleteOne({ _id: id });
			res.status(200).send(result)
		}
	} catch (error) {
		log(error)
		res.status(500).send() // server error, could not delete.
	}
})

app.patch('/api/posts/edit/:id', authenticate, mongoChecker, async (req, res) => {
	const id = req.params.id

    // Validate id
    if (!ObjectID.isValid(id)) {
      res.status(404).send("Resource not found");
      return;
    }

	// If id valid, findById
	try {

		await Post.findOneAndUpdate(
			{ _id: id },
			{ "$set": { "title": req.body.title, "caption": req.body.caption, "content": req.body.content } },
			function (err, result) {
				if (err) {
					res.send(err);
				} else {
					res.send(result);
				}
			}
		);

	} catch (error) {
		log(error)
		res.status(500).send('Internal Server Error')  // server error
	}

})

/// Route for adding comment to a particular post.
app.post('/api/posts/:id', authenticate, mongoChecker, async (req, res) => {
	const id = req.params.id

	const comment = {
		creator: req.body.creator,
		text: req.body.text
	}

	try {
		const post = await Post.findOne({ _id: id })
		console.log(comment)
		post.comments.push(comment);
		console.log(post.comments)
		const newPost = await post.save()
		res.send(newPost)
	} catch (error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}

})

/*** Webpage routes below **********************************/
// Serve the build
app.use(express.static(path.join(__dirname, "/client/build")));

// All routes other than above will go to index.html
app.get("*", (req, res) => {
    // check for page routes that we expect in the frontend to provide correct status code.
    const goodPageRoutes = ["/", "/home", "/bike", "/trail", "/profile", '/AdminDashboard'];
    if (!goodPageRoutes.includes(req.url)) {
        // if url not in expected page routes, set status to 404.
        res.status(404);
    }

    // send index.html
    res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

/*************************************************/
// Express server listening...
const port = process.env.PORT || 5001;
app.listen(port, () => {
	log(`Listening on port ${port}...`);
});
