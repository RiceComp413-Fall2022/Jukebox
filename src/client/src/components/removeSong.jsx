/**
 * Defines components and functions related to removing songs from the song queue. 
 */
import axios from "axios";

/**
 * Calls the backend api with a request to remove a song
 * 
 * Input:
 * 	- userid: id of the user requesting a song to be removed
 * 	- roomid: roomid of the queue that contains the song
 * 	- uri: uri of the song
 * 
 * Ouput:
 * 	True if song could be removed
 * 	False otherwise
 */
export default function remove_song(userid, roomid, uri) 
{
	console.log("in remove song function");

	// send get request to backend
	const reqeust = axios.get('/api/removeSong?userid=' + userid + '&roomid=' + roomid + '&uri=' + uri)
	.then(function(response) {
		// handle response back from server 
		if (response.status == 200) {
			return true;
		} else {
			return false;
		}
	})
}
