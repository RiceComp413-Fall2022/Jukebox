/**
 * Usefull functions to use throughout the app.
 */

/**
 * Return dict of song id, without "spotify:track:" to a dict with number of upvotes, the current user upvote status, and isOwnSong, whcih is true if the song
 * was added by thed user
 * 
 * Format:
 * {URI: {'totalUpvotes': TOTAL_UPVOTES, 'userUpvotes': USER_UPVOTES, 'isOwnSong': TRUE_IF_OWN_SONG}}
 */
export default function parseMultSongs(multSongs) {

	let final = {};

	// convert json to obj
	multSongs = JSON.parse(multSongs);

	multSongs.forEach(song => {
		// add uri mapped to upvotes 
		final[RegExp('track:(.*)$').exec(song['uri'])[1]] = {'totalUpvotes': song['upvotes'], 'userUpvotes': song['upvotesByUser'], 'isOwnSong': song['isOwnSong']};
	});

	return final
}
