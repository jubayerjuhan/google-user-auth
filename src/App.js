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
		password: '',
		errors: '',
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
					photo: '',
				}
				setUser(signedOutUser);
			})

			.catch(error => {
				console.log(error);
			})
	}

	// console.log(user);

	const handleSubmit = (e) => {
		console.log(user.name, user.email, user.password);
		if (user.email && user.password) {
			console.log("submitting");

			firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
				.then((userCredential) => {
					// Signed in 
					const user = userCredential.user;
					// ...
					console.log(user)
					const newUserInfo = { ...user };
					newUserInfo.errors = '';
					setUser(newUserInfo)
				})
				.catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;

					const newUserInfo = {...user};
					newUserInfo.errors = error.message;
					setUser(newUserInfo);

					// ..
					console.log(errorCode, errorMessage);
				});
		}
		e.preventDefault();
	}

	const handleBlur = (event) => {
		// debugger;
		let isFieldValid = true;
		if (event.target.name === 'email') {
			isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
		}


		if (event.target.name === 'password') {
			const isPassLValid = (event.target.value).length > 3;
			const isPassHasNum = /[0-9]/g.test(event.target.value);
			const ispassValid = isPassHasNum && isPassLValid;
			isFieldValid = ispassValid;
		}
		console.log(isFieldValid)

		if (isFieldValid) {
			const newUserInfo = { ...user };
			newUserInfo[event.target.name] = event.target.value;
			setUser(newUserInfo);
		}
		// console.log(event.key)
	}

	// console.log(user.name)
	// console.log('pass', user.password)

	// debugger;

	return (
		<div className="App">

			{user.isSignedIn ?
				<button onClick={handleSignOut}>Sign Out</button> :
				<button onClick={handleSignin}>Sign In</button>
			}
			{
				user.errors ? 
				<h1>{user.errors}</h1>:
				<></>
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
					<input type="name" name="name" onBlur={handleBlur} placeholder="Enter Name" /> <br />
					<input type="email" name="email" onBlur={handleBlur} placeholder="Enter Email" required /><br />
					<input type="password" name="password" onBlur={handleBlur} placeholder="Enter Password" required />
					<br />
					<input id='submit-btn' type="submit" value="Submit" />
				</form>
			</div>
		</div>

	);
}

export default App;
