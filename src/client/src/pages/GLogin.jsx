import { GoogleLogin } from 'react-google-login';

/**
 * Button to login with the google SSO 
 */
export default function GLogin(props) {
	const onSuccess = (res) => {
		console.log('success:', res);
	};

	const onFailure = (err) => {
		console.log('failed:', err);
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