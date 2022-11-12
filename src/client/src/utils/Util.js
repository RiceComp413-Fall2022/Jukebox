/**
 * Usefull functions to use throughout the app.
 */

/**
 * Takes a json object with spotify uris and and creates a list of just the non-"spotify:track:" for all of the uris
 */
export default function parseURIList(uris){
	let parseVal2 = []

	if (uris) {
		parseVal2 = JSON.parse(uris).uris
		let final = []
		for (const track of parseVal2){
			let temp = ''
			let canAdd = false
			for(let itr = 0; itr < track.length; itr++){
				if (track[itr-1] == ':' && track[itr- 2] == 'k'){
					canAdd = true
				}

				if(canAdd) {
					temp += track[itr]
				}
			}
			final.push(temp)
		}      

		return final
	}
}