/**
 * Defines components and functions related to removing songs from the song queue. 
 */
import axios from "axios";
import React from "react";
import { IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { red } from '@mui/material/colors';

/**
 * Component for the remove song button. 
 * 
 * Props:
 * 	uri: The uri of the song to remove
 *  roomid: The id of the room that the song queue is a part of
 *  userid: Id of the current user  
 *  color: The color of the remove song button, should be mui color 
 */
class RemoveButton extends React.Component 
{
	constructor(props) {
		super(props);

		this.state = {failed: false}
		this.removeSong = this.removeSong.bind(this);
	}

	/**
	 * Calls the backend api with a request to remove a song
	 */
	removeSong() {
		// send get request to backend to remove song

		/** USER ID IS HARDCODED RIGHT NOW BECAUSE WE DONT ACTUALLY HAVE USER IDs SET UP */
		axios.get('/removeSong?userid=101&roomid=' + this.props.roomId + '&uri=' + this.props.uri)
		.catch((error) => {
			if (error.response.status === 400) {
				// could not remove song, need to notify user
				this.setState({failed: true});
			}
		});
	}

	/**
	 * The thing that shows up when this component. Creates a delete button that calls removeSong on click. 
	 */
	render() {
		return (
			<div className="remove">
				<IconButton aria-label="delete">
					{/* if the state is failed switch to a red button */}
					{
						this.state.failed ? 
						<Delete sx={{ color: red[500] }} /> :
						<Delete sx={{ color: this.props.color }} onClick={this.removeSong} />
					}
				</IconButton>
			</div>
		);
	}

	/**
	 * This is used to keep the button red for a little if it was a failed removal, but then change it back.
	 * This will be called directly after render. 
	 */
	componentDidUpdate() {
		if (this.state.failed) {

			// leave the button red for a little then switch it back
			setTimeout(function() { 
				this.setState({failed: false}) 
			}.bind(this), 100)

		}
	}
}

export default RemoveButton;