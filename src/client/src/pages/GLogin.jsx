import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
import React from "react";

import { reducerCases } from "../utils/Constants";
import { useStateProvider } from "../utils/StateProvider";

/**
 * Button to login with the google SSO 
 */
export default function GLogin(props) {
	const [{}, dispatch] = useStateProvider();

	const initClient = () => {
		gapi.client.init({
			clientId: props.clientId,
			scope: 'https://www.googleapis.com/auth/userinfo.profile'
		});
	};

	gapi.load('client:auth2', initClient);

	const onSuccess = (res) => {
		console.log('successfly used Google SSO, current client GoogleId:', res['googleId']);	

		// set userid to be google user id 
		dispatch({
		type: reducerCases.SET_UUID,
		setUUID: res['googleId'],
		});
	};

	const onFailure = (err) => {
		console.log('Failed to login with Google SSO:', err);
	};

	return (
		<GoogleLogin
			clientId={props.clientId}
			buttonText="Sign in with Google"
			onSuccess={onSuccess}
			onFailure={onFailure}
			cookiePolicy={'single_host_origin'}
			isSignedIn={true}
		/>
	);
}