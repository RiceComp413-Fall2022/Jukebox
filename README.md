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

## Running Basic Demo
To start the server, which currently serves a simple Hello World demo:
```
sh starter.sh Server 3001
```
This command will start the server on port 3001. 

To start the client, run the following:

* Users must have npm installed to execute this script. *
```
sh starter.sh Client 3002
```
This will start the client on port 3002. 

