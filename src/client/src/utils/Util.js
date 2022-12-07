/**
 * Usefull functions to use throughout the app.
 */

/**
 * Return dict of song id, without "spotify:track:" to the number of upvotes for the song
 */
export default function parseURIList(uris) {

	let final = {};

	// convert json to obj
	uris = JSON.parse(uris);

	uris.forEach(song => {
		// add uri mapped to upvotes 
		final[RegExp('track:(.*)$').exec(song['uri'])[1]] = song['upvotes']
	});

	return final
}
