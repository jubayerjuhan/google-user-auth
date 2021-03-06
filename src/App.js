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
		success: false,
		photo: '',
		loginSuccess: false,
	});

	const [newUser, setNewUser] = useState(false)

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
		if (newUser && user.email && user.password) {
			console.log("submitting");

			firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
				.then((res) => {
					// Signed in 
					// ...
					console.log(res.user)
					const newUserInfo = { ...user };
					newUserInfo.errors = '';
					newUserInfo.success = true;
					updateUserInfo(user.name)
					setUser(newUserInfo);
				})
				.catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;

					const newUserInfo = { ...user };
					newUserInfo.errors = error.message;
					newUserInfo.success = false;
					setUser(newUserInfo);

					// ..
					console.log(errorCode, errorMessage);
				});
		}

		if (!newUser && user.email && user.password) {
			console.log('Logging In...');

			firebase.auth().signInWithEmailAndPassword(user.email, user.password)
				.then((userCredential) => {
					// Signed in
					const user = userCredential.user;

					const userInfo = { ...user }
					userInfo.loginSuccess = true;
					setUser(userInfo);
					console.log(user);
					// ...
				})
				.catch((error) => {
					const errorCode = error.code;
					console.log(errorCode);
					const errorMessage = error.message;

					const userInfo = { ...user };
					userInfo.errors = error.message;
					userInfo.loginSuccess = false;
					setUser(userInfo);
					console.log(errorMessage);

				});
		}
		e.preventDefault();
	}

	const handleBlur = (event) => {
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

	const updateUserInfo = name => {
		const user = firebase.auth().currentUser;

		user.updateProfile({
			displayName: name,
		}).then(() => {
			// Update successful
			console.log('username updated successful')
			// ...
		}).catch((error) => {
			// An error occurred
			console.log(error)
			// ...
		});
	}
	return (
		<div className="App">

			{user.isSignedIn ?
				<button onClick={handleSignOut}>Sign Out With Google</button> :
				<button onClick={handleSignin}>Sign In With Google</button>
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

				<input type="checkbox" name="newUser" onChange={() => setNewUser(!newUser)} />
				<label htmlFor="newUser">New Use Sign Up</label>	{console.log(newUser)}

				<form onSubmit={handleSubmit}>
					{newUser &&
						<>
							<input type="name" name="name" onBlur={handleBlur} placeholder="Enter Name" /> <br />
						</>
					}
					<input type="email" name="email" onBlur={handleBlur} placeholder="Enter Email" required /><br />
					<input type="password" name="password" onBlur={handleBlur} placeholder="Enter Password" required />
					<br />
					<p><small>Pass Rules: Greater Than 6 char and must have 1 num</small></p>
					<input id='submit-btn' type="submit" value="Submit" />
				</form>

				<p style={{ color: 'red' }}>{user.errors}</p>
				{
					user.success &&
					<p style={{ color: 'green' }}>User Created Successfully</p>
				}
				{
					user.loginSuccess &&
					<p style={{ color: 'green' }}>Logged In Successfully</p>
				}
			</div>
		</div>

	);
}

export default App;
