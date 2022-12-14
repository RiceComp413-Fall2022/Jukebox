/**
 * Handles displaying the upvotes for the song.
 */
import axios from "axios";
import { TiArrowDownOutline, TiArrowUpOutline, TiArrowUpThick, TiArrowDownThick } from 'react-icons/ti';
import { IconContext } from "react-icons";

import { useStateProvider } from "../utils/StateProvider";

/**
 *	Sends an upvote request for the given song, in the given room, by the given user 
 *
 * @param {String} uri  Song to upvote
 * @param {String} userid User who would like to upvote this song
 * @param {String} roomid Room that the user is in  
 */
function send_upvote(uri, userid, roomid) {
	axios.get(`/upvoteSong?uri=${uri}&userid=${userid}&roomid=${roomid}`);
}

/**
 *	Sends an downvote request for the given song, in the given room, by the given user 
 *
 * @param {String} uri  Song to downvote
 * @param {String} userid User who would like to downvote this song
 * @param {String} roomid Room that the user is in  
 */
function send_downvote(uri, userid, roomid) {
	axios.get(`/downvoteSong?uri=${uri}&userid=${userid}&roomid=${roomid}`);
}

/**
 * Component for displaying the upvotes for the song.
 * 
 * @param {int} prop.upvotes Number of upvotes
 * @returns A React Component representing the number of upvotes for the song
 */
export default function Upvotes(props) {
	const [{ setGroup, setUUID }] = useStateProvider();

	// check upvote status given and change arrow fills and functions accordingly
	if (props.upvoteStatus == 1) {
		// song is upvoted

		return (
			<IconContext.Provider value={{ size: "2em", style: { margin: '.25em' } }}>
				<div className="col">
					<TiArrowUpThick onClick={() => send_downvote(props.uri, setUUID, setGroup)} />
					{props.upvotes}
					<TiArrowDownOutline onClick={() => {
							send_downvote(props.uri, setUUID, setGroup);
							send_downvote(props.uri, setUUID, setGroup);
						}
					} />
				</div>
			</IconContext.Provider>
		);
	}
	else if (props.upvoteStatus == 0) {
		// song is neither upvoted nor downvoted

		return (
			<IconContext.Provider value={{ size: "2em", style: { margin: '.25em' } }}>
				<div className="col">
					<TiArrowUpOutline onClick={() => send_upvote(props.uri, setUUID, setGroup)} />
					{props.upvotes}
					<TiArrowDownOutline onClick={() => send_downvote(props.uri, setUUID, setGroup)} />	
				</div>
			</IconContext.Provider>
		);
	}
	else if (props.upvoteStatus == -1) {
		// song is currently downvoted

		return (
			<IconContext.Provider value={{ size: "2em", style: { margin: '.25em' } }}>
				<div className="col">
					<TiArrowUpOutline onClick={() => {
							send_upvote(props.uri, setUUID, setGroup);
							send_upvote(props.uri, setUUID, setGroup);
						}
					} />
					{props.upvotes}
					<TiArrowDownThick onClick={() => send_upvote(props.uri, setUUID, setGroup)} />
				</div>
			</IconContext.Provider>
		);
	}
}