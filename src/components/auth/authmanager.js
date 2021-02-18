import firebase from 'firebase';
import FirebaseCredentials from '../../constants/firebase';
import AuthMessages from '../../constants/authmessages';
import axios from 'axios';

const AuthManager = {
  signIn,
  signUp,
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

const getSigninToken = async email => {
  try {
    let res = await axios.post('', { email: email });
    res = JSON.parse(res);
    return res.msg == AuthMessages.SIGNINJWTTOKENFAILED ? null : res.token;
  } catch (error) {
    return null;
  }
};

const getSignoutToken = async email => {
  try {
    let res = await axios.post('', { email: email });
    res = JSON.parse(res);
    return res.msg == AuthMessages.SIGNOUTJWTTOKENFAILED ? null : res.token;
  } catch (error) {
    return null;
  }
};

const fetchUserByEmail = async email => {
  try {
    let user = await axios.post('', { email: email });
    return user;
  } catch (error) {
    return null;
  }
};

const createUser = async (name, email, password) => {
  try {
    let user = await axios.post('', {
      name: name,
      email: email,
      password: password,
    });
    return user ? true : false;
  } catch (error) {
    return false;
  }
};

const signIn = async (name, email, password) => {
  try {
    let user = await fetchUserByEmail(email);
    if (!user) return false;
    user = JSON.parse(user);
    if (user.msg == AuthMessages.USERNOTFOUND) return false;
    if (name != user.user.displayName) return false;
    let signinstatus = await auth.signInWithEmailAndPassword(email, password);
    console.log(signinstatus);
  } catch (error) {
    return false;
  }
};

const signUp = async (name, email, password) => {
  let status = await createUser(name, email, password);
  return status;
};

const updateUser = async (name, email, password) => {};

const removeUser = async (name, email, password) => {};

export default AuthManager;
