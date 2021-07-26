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
					email: email,
					photo: photoURL,
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
				photo: '',
			}
			setUser(signedOutUser);
		})

		.catch(error => {
			console.log(error);
		})
	}

	console.log(user);

	return (
		<div className="App">
			
			{	user.isSignedIn ?	
				<button onClick={handleSignOut}>Sign Out</button>:
				<button onClick={handleSignin}>Sign In</button>
			}

			{
				user.isSignedIn &&
				<div>
					<img src={user.photo} style={{ marginTop: '20px', borderRadius: '50%' }} alt="user profile pic" />
					<h1>Welcome {user.name}</h1>
				</div>
			}
		</div>
	);
}

export default App;
