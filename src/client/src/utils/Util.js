/**
 * Usefull functions to use throughout the app.
 */

/**
 * Return dict of song id, without "spotify:track:" to a dict with number of upvotes and the current user upvote status 
 * 
 * Format:
 * {URI: {'total_upvotes': TOTAL_UPVOTES, 'user_upvotes': USER_UPVOTES}}
 */
export default function parseURIList(uris) {

	console.log('Uri list: ', uris);

	let final = {};

	// convert json to obj
	uris = JSON.parse(uris);

	uris.forEach(song => {
		// add uri mapped to upvotes 
		final[RegExp('track:(.*)$').exec(song['uri'])[1]] = {'total_upvotes': song['upvotes'], 'user_upvotes': song['upvotesByUser']};
	});

	return final
}
