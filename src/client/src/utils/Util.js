/**
 * Usefull functions to use throughout the app.
 */

import { ConnectingAirportsOutlined } from "@mui/icons-material"

/**
 * Takes a json object with spotify song info and and creates a comma seperated string of the non-"spotify:track:" for all of the uris
 */
export default function parseURIList(uris){

	if (uris) {
		uris = JSON.parse(uris);

		uris = uris.map((x) => {
		    return RegExp('track:(.*?$)').exec(x['uri'])[1]
		})	
    
		return uris.join(',');
	}
}