## Description

This web application lets users manage books that they have read or wish to 
read, as well as connect with other users to discuss their favorite books. The 
main features of this app are outlined below.

### Home
The main landing page. Shows a short description of the app and a search bar 
for looking up books.

### Profile
Contains the current user's information, books read list, books to read list,
and communities. Also allows the user to view other users' profiles and see 
their books lists and their communities.

For every user, the ISBN of the books in their lists are stored in the database.
The OpenLibrary Books API is used to gather and display information about the 
books in the user's lists.

### Community
The community feature allows each user to discuss with other users. Users can 
create discussion thread and add comments. This feature is somewhat similar to
Reddit without subreddits, but rather, all discussions belong to the same top
level category. Discussion titles and comments are stored in the database.

### Login
Users can create accounts to manage their books lists and to participate in
discussions. Accounts are stored in the database. 

### Search
Users can search for books and add them to their profiles using the search bar
in the navigation bar at the top, or the search bar in the home page. The
OpenLibrary Search API is used to implement this functionality.

## Server-side Components

### Session Management
This application uses a simple session management system. In the server side,
a dictionary is kept in memory in which the key is the cookie for a given user
and the value is the username. Whenever a user logs in, that user is given a 
randomly generate cookie. For every time the user visits the website, as long 
as the cookie is in the dictionary, the user is going to be logged in. When the 
user logs out, the cookie is deleted from the dictionary.

One downside to this approach is that whenever the server has to be restarted,
all the cookie are deleted since they are stored in memory. Therefore, all 
users must log in again and obtain a new cookie.

### Database
This application uses MongoDB to store user and community data. For the user 
data, the username, email, password, books read, reading list, and communuties
are stored in the database. Authentication is done by checking if a username
and password combination exists in the database. This is a simple way of 
implementing authentication, however, since everything is stored as plain text,
data is not stored safely on the database

For communities, the name of the discussion thread, admin, description, and 
messages are stored in the database. 

### REST API
The OpenLibrary API only supports GET requests, however, this back end of this
application implements all of the CRUD operations. The following are examples
for each operation:

#### GET
- /users/:username : Returns user information for username
- /communities : Returns all of the discussion threads in the community
- /communities/:cid : Returns information about discussion thread with id cid
in the community

#### POST
- /communities : Creates a new discussion thread
- /communities/:cid : Creates a new post in the discussion thread with is cid
- /register : Creates a new user
- /login : Logs a user in

#### PUT
- /users/:username/books-read/:books : Adds book(s) to a user's books read 
list, where books is a comma delimited list of ISBNs
- /users/:username/books-to-read/:books : Similat to the one above, but
add the books to the reading list instead

#### DELETE
- /users/:username/books-to-read/:books : Removes book(s) from the user's 
reading list

## Unimplemented Features
- Profile pictures : due to the complexity of storing images and the shortage
of time, every user has a placeholder image as their profile pictures.
