import firebase from 'firebase';
import FirebaseCredentials from '../../constants/firebase';
import AuthMessages from '../../constants/authmessages';
import axios from 'axios';

const AuthManager = {
  signIn,
  signUp,
  signOut,
  updateUser,
  removeUser,
};

const firebaseConfig = {
  apiKey: FirebaseCredentials.APIKEY,
  authDomain: FirebaseCredentials.AUTHDOMAIN,
  projectId: FirebaseCredentials.PROJECTID,
  storageBucket: FirebaseCredentials.STORAGEBUCKET,
  messagingSenderId: FirebaseCredentials.MEASSAGINGSENDERID,
  appId: FirebaseCredentials.APPID,
  measurementId: FirebaseCredentials.MEASUREMENTID,
};

const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();

// const getSigninToken = async email => {
//   try {
//     let res = await axios.post('', { email: email });
//     res = JSON.parse(res);
//     return res.msg == AuthMessages.SIGNINJWTTOKENFAILED ? null : res.token;
//   } catch (error) {
//     return null;
//   }
// };

// const getSignoutToken = async email => {
//   try {
//     let res = await axios.post('', { email: email });
//     res = JSON.parse(res);
//     return res.msg == AuthMessages.SIGNOUTJWTTOKENFAILED ? null : res.token;
//   } catch (error) {
//     return null;
//   }
// };

const fetchUserByEmail = async email => {
  try {
    let user = await axios.post('', { email: email });
    return user;
  } catch (error) {
    return null;
  }
};

const createUser = async (email, password) => {
  try {
    let user = await axios.post('http://18.207.251.49:4011/auth/addUser', {
      email: email,
      password: password,
    });
    return user ? true : false;
  } catch (error) {
    return false;
  }
};

async function signIn(email, password) {
  try {
    let user = await fetchUserByEmail(email);
    if (!user) return false;
    user = JSON.parse(user);
    if (user.msg == AuthMessages.USERNOTFOUND) return false;
    let credentials = await auth.signInWithEmailAndPassword(email, password);
    if (credentials.IsValid()) return true;
    else return false;
  } catch (error) {
    return false;
  }
}

async function signUp(email, password) {
  let status = await createUser(email, password);
  return status;
}

async function signOut() {
  try {
    await auth.signOut();
    return true;
  } catch (error) {
    return false;
  }
}

async function updateUser(email, password) {
  console.log(email, password);
}

async function removeUser(email, password) {
  console.log(email, password);
}

export default AuthManager;
