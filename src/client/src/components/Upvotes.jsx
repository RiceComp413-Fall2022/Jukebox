/**
 * Handles displaying the upvotes for the song.
 */
import { TiArrowDownOutline, TiArrowUpOutline } from 'react-icons/ti'; 
import { IconContext } from "react-icons";

/**
 * Component for displaying the upvotes for the song.
 * 
 * @param {int} prop.upvotes Number of upvotes
 * @returns A React Component representing the number of upvotes for the song
 */
export default function Upvotes(props) {
	return (
		<IconContext.Provider value={{ size: "2em", style: { margin: '.25em' } }}>
			<div className="col">
				<TiArrowUpOutline/>
				{props.upvotes}	
				<TiArrowDownOutline/>
			</div>
		</IconContext.Provider>
	)
}