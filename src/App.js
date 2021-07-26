import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./Firebase-config";

firebase.initializeApp(firebaseConfig);

function App() {

  const provider = new firebase.auth.GoogleAuthProvider();

  const handleSignin = () => {
    console.log('sign in clicked yey');
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName, email, photoURL} = res.additionalUserInfo.profile;
      console.log(res);
      console.log(displayName, email, photoURL);
    })
  }
  return (
    <div className="App">
      <button onClick={handleSignin} className>Sign In</button>
    </div>
  );
}

export default App;
