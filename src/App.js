import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./Firebase-config";
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {

	const provider = new firebase.auth.GoogleAuthProvider();

	const [user, setUser] = useState({
		isSignedIn: false,
		name: '',
		email: '',
		photo: '',
	});

	const handleSignin = () => {
		console.log('sign in clicked yey');
		firebase.auth().signInWithPopup(provider)
			.then(res => {
				console.log(res.user);
				const { displayName, email, photoURL } = res.user;
				const signedInUser = {
					isSignedIn: true,
					name: displayName,
					photo: photoURL,
					email: email,
				}
				setUser(signedInUser);
			})
			.catch(error => {
				console.log(error);
				console.log(error.message);
			})
	}

	const handleSignOut = () => {
		firebase.auth().signOut()
			.then((res) => {
				console.log(res);
				const signedOutUser = {
					isSignedIn: false,
					name: '',
					email: '',
					password: '',
					photo: '',
				}
				setUser(signedOutUser);
			})

			.catch(error => {
				console.log(error);
			})
	}

	console.log(user);

	const handleSubmit = () => {
		console.log('Form Submitted')
	}

	const handleBlur = (event) => {

		let isFormValid = true;
		if (event.target.type === 'email') {
			isFormValid = /\S+@\S+\.\S+/.test(event.target.value);
		}


		if (event.target.type === 'password') {
			const isPassLValid = (event.target.value).length > 3;
			const isPassHasNum = /[0-9]/g.test(event.target.value);
			const ispassValid = isPassHasNum && isPassLValid;
			isFormValid = ispassValid;
		}

		if (isFormValid) {

		}
	}
	


	return (
		<div className="App">

			{user.isSignedIn ?
				<button onClick={handleSignOut}>Sign Out</button> :
				<button onClick={handleSignin}>Sign In</button>
			}

			{
				user.isSignedIn &&
				<div>
					<img src={user.photo} style={{ marginTop: '20px', borderRadius: '50%' }} alt="user profile pic" />
					<h1>Welcome {user.name}</h1>
				</div>
			}
			<div>
				<h1>Hardcoded Authentication System</h1>

				<form onSubmit={handleSubmit}>
					<input type="email" onBlur={handleBlur} placeholder="Enter Email" required /><br />
					<input type="password" onBlur={handleBlur} name="" placeholder="Enter Password" required />
					<br />
					<input type="submit" value="Submit" />
				</form>
			</div>
		</div>
	);
}

export default App;
