// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQ5G0U8_26WdvFn-_l5EAQ9BDcATMiKEs",
  authDomain: "pluggedin-53437.firebaseapp.com",
  projectId: "pluggedin-53437",
  storageBucket: "pluggedin-53437.appspot.com",
  messagingSenderId: "448925506157",
  appId: "1:448925506157:web:e2ad34fd1d744adfc5bd64",
  measurementId: "G-E54E7XMQE1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the auth service
const auth = getAuth(app);

const storage = getStorage();

// Export the auth service
export { auth, app, storage, ref, uploadBytes, getDownloadURL };
