/**
 * Usefull functions to use throughout the app.
 */

import { ConnectingAirportsOutlined } from "@mui/icons-material"

/**
 * Takes a json object with spotify uris and and creates a list of just the non-"spotify:track:" for all of the uris
 */
export default function parseURIList(uris){
	let parseVal2 = []

	if (uris) {
		parseVal2 = JSON.parse(uris)
		let final = []
		let songs = []
		for(let i = 0; i < parseVal2.length; i ++) {
			songs.push(parseVal2[i].uri)
		}

		for (const track of songs){
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

		console.log(final)
		return final
	}
}