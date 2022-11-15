/**
 * Usefull functions to use throughout the app.
 */

export default function parseURIList(uris){

	if (uris) {
		uris = JSON.parse(uris);

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

		return final
	}
}