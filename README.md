# Unorthodox Jukebox
## Members
- Aedan Cullen
- Austin Hushower
- Rob Gonzalez
- Roy Montemayor
- Thushar Mahesh

## Pitch
In small gatherings, parties, or public spaces, there’s often a single device playing music and many people who want to suggest songs to play. We would like to create a web-based application which allows users to queue songs from their own devices, contributing to a “collaborative playlist” among all users in the same physical area. In this way, people could add their favorite songs to this queue, upvote songs that they want to hear, and see a ranked queue of songs which will be played next (in order of popularity by the vote). Users should be able to add songs to the playlist simply by name, without any requirement that they have a personal Spotify account. 

## [Proposal](https://drive.google.com/file/d/11PouBHV--IruYERH2lmBxIM5_u5gFiMn/view?usp=sharing)


## Running Tests

To run the unittests:

*First time users should install pip on their machines before proceeding*

*Addionally, ensure that the user is currently on the Jukebox directory or the relative file path will have to be changed*
```
sh actions.sh
```

## Demo
### Setup for Running Locally
Prerequisites:
* Open the Spotify web app or Spotify desktop application and log into your spotify premium account.
* Install npm on your machine.

To start the server, run the following command:
```
sh starter.sh Server 5000
```

To start the client, run the following command:

```
sh starter.sh Client 3002
```
This command will open up a new window in the user's web browser

### Running on Jukebox.lol
If you want to run your song queue on our website, simply connect to *www.jukebox.lol*.

### Using the Jukebox
To create a new Jukebox session, one Spotify premium account is required. The user with the premium account should click 
"Create Room" and enter their Spotify credentials. Choose a unique room identifier then click create room.

To join a room which has been created, click "Join Room," then enter a valid unique identifier. Joining a room does not 
require a user to have a Spotify premium account.

Once in a room, use the search bar in the top left corner to search for a song you would like to add. Click on a song to
add it to the queue. Once a song is in the queue, you can use the up and down arrows to upvote or downvote a song. Songs 
in the queue are ordered by net vote count then by time added, so your upvotes directly contribute to which song plays 
next. 

To remove a song, the trash can icon should appear next to any song which you have permissions to remove. Simply click
the trash can icon to remove the song.

#### Note on Permissions
All users can add songs, upvote/downvote songs, and remove the songs which they added. The primary user (the user who 
created the room) functions as a DJ and can remove any song from the queue, in addition to  a regular users permissions.

#### Note on Room Creation
As our app is currently in beta, all accounts which can create rooms *must* be registered directly with Spotify. If you
would like to be added as a user who can create rooms, talk to one of the team members.

#### Note on Mobile
Our application currently has limited support for mobile. We recommend viewing the site in landscape mode. 

