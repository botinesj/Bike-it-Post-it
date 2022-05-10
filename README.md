# Team15
## BIKE IT POST IT 

- npm install 
- npm run

##### Login Credentials 
Admin 
`Username: admin 
Password: admin`

### Instructions

##### General
The trash can is for deleting posts on the site. Only the admins or the author of the posts can do so. 
To exit popups without an x button, click anywhere on the screen that is outside of the popup

#### User Instructions
#### Registration
- To register click the Register button on the landing page. Here the user can type in their username password and other info the input fields. 
- Users can select their gender from the dropdown menu
- Users can choose to upload a profile picture by clicking the upload picture button
- Once Registered, the user can login by clicking the Login button that appears at the bottom of the page
- To exit this page, the user can click cancel. They will be taken back to the login page 

##### Login 
- The first page a user encounters is the login page. The login page asks for username and password. This takes you to the home page. 
- To login in as an admin, enter `admin` for both username and password
- The admin has access to the Admin Dashboard page. 

##### Home page
- This page contains posts of social nature. 
Eg a biking trips and other activities
- Each post appears as a card on the page. 
- To add a new post, click the “ADD POST” button, enter the desired data in the ensuing popup, and clicking the “ADD POST” button in the popup. 
- To like a post, the user can click the heart button
- To comment on the post, the user can click the message icon. After clicking the icon, a popup appears. On this popup the user can add comments and view other comments of other users. Additionally, the user can click the username beside a comment to be taken to the profile page of that user 
- To visit the profile page of the user who created the post, the user can click the person icon. 
- The user can also view this pop up by clicking on the image
- There will be a pencil icon on the card if the user is the creator of the post. The user can edit the info of the post by clicking this button
- There will be a trash icon on the card if the user is the creator of the post. The user can delete the post by clicking this button

##### Bikes page
- This page contains the bikes of the users registered to the site. This page was created for other users to share their bikes and potentially sell them as well
- If a bike is for sale, there will be a shopping cart icon next to the price listed. Upon clicking the shop icon, a modal will pop up. This modal has the seller’s phone number listed. If the user is entered they can contact the seller by calling them and making the purchase offline 
- There will be a pencil icon on the card if the user is the creator of the bike post. The user can edit the info of the post by clicking this button
- There will be a trash icon on the card if the user is the creator of the bike post. The user can delete the post by clicking this button
- To visit the profile page of the user who created the post, the user can click the person icon. 

##### Trails page
- This page contains all trails that other users have been on.
- Each post represents a trail, which includes some summary information such as average rating, average duration, and a Strava link. 
- Users are able to interact with the post three ways: clicking the “info” icon, clicking the “plus” icon, “edit” icon and “person” icon. 
- Info: clicking this icon, as well as anywhere on the post image, opens a pop-up modal, which will display other users’ statistics on that trail such as their time, comment, and rating.
- Plus: clicking this will allow you to “subscribe” to the trail for viewing later-on. This will then be available in the Profile page.
- Edit: If a user is the original author, they will be able to edit information from the post such as: title, time, rating, as well as the Strava link. 
- Person: To visit the profile page of the user who created the post, the user can click the person icon. 
- Like all the other pages, this page contains a search bar that will search for Trail Titles.
- There is a drop-down menu that sorts the posts depending on the selection: Date Posted, Rating, Name, Duration.

##### Profile Page

- This page displays all of the specified user’s posts (the specified user is determined by the url (/profile/:username). If the url is just /profile, then it is the profile page of the current user), owned bikes and trails (created or followed by the specified user). 
- These can be filtered by type (by clicking the respective pink checkboxes) and/or or a search query (by typing in the search bar)
- The specific user’s profile information is also displayed. If it is the current user’s profile page, some of this information can be edited by clicking the visible “EDIT INFO” button, changing the respective desired data in the ensuing popup, and clicking the “SUBMIT” button in the popup. 
- If it is the current user’s profile page, the user can change their profile picture by hovering over the image and clicking
- If it is the current user’s profile page, similar to the Trails page, the user can add a new trail by clicking the “ADD TRAIL” button, entering the desired data in the ensuing popup, and clicking the “ADD TRAIL” button in the popup. 
- If it is the current user’s profile page, similar to the Bikes page, the user can add a new bike to the ones they own by clicking the “ADD BIKE” button, entering the desired data in the ensuing popup, and clicking the “ADD POST” button in the popup. 
Lastly, the same functionality of the buttons on the post, trail and owned bike cards is also available here


#### Admin Instructions

##### Administrator Dashboard
- The admin tab is viewable only to users determined as ‘admins’ (user.role). This page allows an admin to view the global count of users, posts, likes and comments and has the capabilities of deleting posts, trails  and or users completely, alongside their corresponding posts and trails. 
- Once this is carried out global counts are updated accordingly.
- As an administrator, you can search and filter through the users signed up to select and inspect the selected user and their posts and trails.This is done via a search bar and list.
As an admin you are also capable of posting and commenting and liking however it is the access to the “dashboard” tab that differs you and your permissions from that of a regular user.

##### Login 
- To login as admin: enter ‘admin’ as the username and ‘admin’ as the password.

##### Home page
- The admin has all the same abilities as a user on this page. However, regardless of whether the admin is the creator of a post, they will be able to edit and delete it.

##### Bikes page
- The admin has all the same abilities as a user on this page. However, regardless of whether the admin is the creator of a bike post, they will be able to edit and delete it.

##### Trails page
- The admin has all the same abilities as a user on this page. However, regardless of whether the admin is the creator of a trail post, they will be able to edit and delete it.

##### Profile Page
- The admin has all the same abilities as a user on this page.
### List of third-party libraries
- Materials UI
- React-Router-Dom


## Route Overview

### User routes


address: "users/login"
- This is a post request for an user to login with their username and password
- request body: {username: <String>, password: <String>}
- response returned: {currentUser: {_id: <ObjectID>,  username: <String>,  role: <String>} }

address: "users/check-session"
  - This is a get request to check the session to check if a user is logged in. The session is stored in the database
  - no data is sent
  - response returned:  {currentUser: {_id: <ObjectID>,  username: <String>,  role: <String>} }

address: “users/logout”
  - This is a get request that destroys the current session and logs out the reason 

address: "api/register"
  - This is a post request for the user to create an account for the app
  - request body: 
  
{
        "username": "admin",
        "password": "admin",
        "role": "admin",
        "name": "John",
        "gender": "Male",
        "location": "Toronto Canada",
        "description": "insert name"
}
 
You can add picture attribute, but it must be in data:image format
Response: user object (the data is too large to show here)
 
address: /api/check-user-exists
  - This is a post request to see if a user with a username exists in the database. This route is called when a new user is typing in a username. The app  checks the database if a user with that username already exists and highlights the page letting the new user know. 
  - This is a post request because the request being made continuously and it was easier to send the data in request body instead of a parameter
  - the response status is 404 if the user does not exist and 200 otherwise.

### Trail Routes

app.post('/api/trails')
app.get('/api/trails')
app.get('/api/trails/:id')
app.delete('/api/trails/:id')
app.patch('/api/trails/edit/:id')
app.post('/api/trails/:id/adduser')

app.post('/api/trails’) 
  - This is a POST request used for creating trails
  - request body: {title: <String>, picture: <String>, author: <String>, strava: <String>, users: <Array>, times: <Array>, ratings: <Array>, date: <String>}
  - response returned: {trail: {_id: <ObjectID>,  {title: <String>, picture: <String>, author: <String>, strava: <String>, users: <Array>, times: <Array>, ratings: <Array>, date: <String>}}
 }

app.get('/api/trails')
  - This is a GET request that gets all the trails in the database
  - response returned: { [{_id: <ObjectID>, title: <String>, picture: <String>, author: <String>, strava: <String>, users: <Array>, times: <Array>, ratings: <Array>, date: <String> … }]}
 
app.get('/api/trails/:id')
  - This is a GET request that gets a specific trail in the database
  - response returned: {trail: {_id: <ObjectID>,  {title: <String>, picture: <String>, author: <String>, strava: <String>, users: <Array>, times: <Array>, ratings: <Array>, date: <String>}}
 }

app.delete('/api/trails/:id')
  - This is a DELETE request that remove a specific trail from the database
  - Response returned: { "n": 1, "ok": 1, "deletedCount": 1 }


app.patch('/api/trails/edit/:id')
  - This is a PATCH request that edits a specific trail in the database
  - request body: {title: <String>, times: <Array>, ratings: <Array>, strava: <String>}
  - response returned: {trail: {_id: <ObjectID>,  {title: <String>, picture: <String>, author: <String>, strava: <String>, users: <Array>, times: <Array>,    ratings: <Array>, date: <String>}}
 }

app.post('/api/trails/:id/adduser')
  - This is a POST route for adding users to trail's user list. This happens when they try making a trailpost that already exists.
  - request body: {username: <String>, times: <Array>, ratings: <Array>}
  - response returned: {trail: {_id: <ObjectID>,  {title: <String>, picture: <String>, author: <String>, strava: <String>, users: <Array>, times: <Array>, ratings: <Array>, date: <String>}}
 }


### Bike Routes

app.post('/api/bikes)
- This is a post request that creates a bike and sends it to the database
- request body: {model: <String>, owner: <String>, description: <String>, contactNumber: <String>, price: <String>, purchasedOn: <String>, canBuy: <Boolean>, picture: <String>, date: <String>}
- response returned: {bike: {_id: <ObjectID>,  {model: <String>, owner: <String>, description: <String>, contactNumber: <String>, price: <String>, purchasedOn: <String>, canBuy: <Boolean>, picture: <String>, date: <String>}}

app.get('/api/bikes)
- This is a get request that gets all the bikes in the database
- response returned: An array of all the bike objects

app.get('/api/bikes/:id')
- This is a get request that gets a specific bike in the database
- This API expects the id of the bike object that we want to get
- response returned: The bike object with the provided id: {bike: {_id: <ObjectID>,  {model: <String>, owner: <String>, description: <String>, contactNumber: <String>, price: <String>, purchasedOn: <String>, canBuy: <Boolean>, picture: <String>, date: <String>}}

app.delete('/api/bikes/:id')
- This is a delete request that remove a specific bike from the database
- This API expects the id of the bike object that we want to get rid of
- response returned:
{
   "n": 1,
   "ok": 1,
   "deletedCount": 1
}

app.patch('/api/bikes/edit/:id')
- This is a patch request that edits a specific bike in the database
- This API expects the id of the bike object that we want to edit
- request body: {model: <String>, contactNumber: <String>, price: <String>, description: <String>, canBuy: <Boolean>} These are the changes that are to be made to the bike object with the specified id
- response returned: {bike: {_id: <ObjectID>,  {model: <String>, owner: <String>, description: <String>, contactNumber: <String>, price: <String>, purchasedOn: <String>, canBuy: <Boolean>, picture: <String>, date: <String>}}
 

### Home/Post Routes


Post object {
        "title": "",
       "author": "",
      "caption": "”,
      "content": "",
      "picture": "",
       "date": "”,
      "likes": ,
      "comments": "” 
}
 
 
app.post('/api/posts’) 
- Creates a new post object and stores it to the posts collection to then be displayed. Used when adding a post with the ``add posts`` button on the home page. 
Returns the post object created and added.

app.get('/api/posts')
- Gets all posts from the database, used to load posts onto the home page and to get insights in the administrator dashboard. Used to filter created posts by a user on their profile page
Returns an array of post objects.

app.get('/api/posts/:id')
- Gets a post using its ID from the database, used to load the post modal when clicking on a post on the home page.
Returns a post object.

app.delete('/api/posts/:id')
- FInds and delete a post using its ID from the database. Used to delete individual posts from the posts and profile page by its corresponding author as well as by the admin users. Executed by clicking the bin icon on a post displayed.
Returns the post object deleted.

app.patch('/api/posts/edit/:id')
- Finds and updates a post using its ID from the database. Used to update information and content of an individual post in the home and  profile page by its corresponding author.Executed by clicking the edit icon on a post displayed and updating information.
Returns the updated post object..

app.post('/api/posts/:id')
- Finds and adds/pushes a comment to  a post using its ID from the database. Used  when adding comments to a post after clicking on it via its modal. Can be done by both any users and admin. Also functions through the admin dashboard page.
Returns the updated post object with the updated array of comments.

LOCAL SETUP

#### Steps to run web-app locally
Clone repository
The web app is configured to deploy on a local database: uri in db/mongoose.js 
To configure the web app to your own database cd into file and replace this with one's own mongo database URI.
Once in the root folder and after configured Mongo Paths:
``npm install ``
``nodemon server.js`` or ``node server.js`` to start the server 
cd client
``npm install`` 
``npm start`` to start the front end
Type in http://localhost:3000/ to access the website


