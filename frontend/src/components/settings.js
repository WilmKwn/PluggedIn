import React, {useEffect, useState} from "react";
import { signOut } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
<<<<<<< Updated upstream
import axios from 'axios';
import SecondaryBanner from './SecondaryBanner';
=======
import { RecaptchaVerifier, multiFactor, PhoneAuthProvider , PhoneMultiFactorGenerator  } from "firebase/auth";

import axios from "axios";
import SecondaryBanner from "./SecondaryBanner";
import SecondaryBottomBar from "./SecondaryBottomBar";
>>>>>>> Stashed changes
import "../App.css";
import '../index.css';
import SecondaryBottomBar from "./SecondaryBottomBar";


const Settings = () => {
<<<<<<< Updated upstream
    return (
=======
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  
  const [recaptchaResponse, setRecaptchaResponse] = useState();
  const [solvedRecaptcha, setSolvedRecaptcha] = useState(false);
  const handleSubmit = () => {
    // Implement your submission logic here
    // For this example, let's just log the email and password
    console.log("Email:", email);
    console.log("Password:", password);
  };

  // Delete does not work in backend

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your Account?")) {
      // User clicked OK, perform the delete operation
      console.log("Deleting user with ID:", userId);
      axios.delete(`http://localhost:5001/user/${userId}`)
        .then(navigate("/"))
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }
//   console.log("guh")
//   auth.settings.appVerificationDisabledForTesting = false;
//   const appVerificationDisabledForTesting = auth.settings.appVerificationDisabledForTesting;
//   console.log(  auth.settings.appVerificationDisabledForTesting)
//   //auth.settings.appVerificationDisabledForTesting = true;
  
//   const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
//     'size': 'normal',
//     'callback': (response) => {
//       // reCAPTCHA solved, allow signInWithPhoneNumber.
//       // ...
//     },
//     'expired-callback': () => {
//       // Response expired. Ask user to solve reCAPTCHA again.
//       // ...
//     }
//   });

// multiFactor(localStorage.getItem("user")).getSession()
//   .then(function (multiFactorSession) {
//   // ...
//   const phoneInfoOptions = {
//     phoneNumber: phone,
//     session: multiFactorSession
//   };
//   const phoneAuthProvider = new PhoneAuthProvider(auth);
//   return phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);
// }).then(function (verificationId) {
//       // verificationId will be needed to complete enrollment.
//       const cred = PhoneAuthProvider.credential(verificationId, 654321);

//       const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
//       multiFactor(localStorage.getItem("user")).enroll(multiFactorAssertion, "mfa");

// });
// const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', undefined, auth);
// multiFactor(localStorage.getItem("user")).getSession()
//     .then(function (multiFactorSession) {
//         // Specify the phone number and pass the MFA session.
//         const phoneInfoOptions = {
//             phoneNumber: phone,
//             session: multiFactorSession
//         };

//         const phoneAuthProvider = new PhoneAuthProvider(auth);

//         // Send SMS verification code.
//         return phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);
//     }).then(function (verificationId) {
//         // Ask user for the verification code. Then:
//         const cred = PhoneAuthProvider.credential(verificationId, 654321);
//         const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

//         // Complete enrollment.
//         return multiFactor(localStorage.getItem("user")).enroll(multiFactorAssertion, "Plugged");
//     });

// const recaptchaVerifier = new RecaptchaVerifier(auth,'recaptcha-container', {
  
      
//       'size': 'normal',
//       'callback': (response) => {
//         // reCAPTCHA solved, allow signInWithPhoneNumber.
//         // ...
//       },
//       'expired-callback': () => {
//         // Response expired. Ask user to solve reCAPTCHA again.
//         // ...
//       }
//     });
const handleMulti = async () => {
  const user = localStorage.getItem("user");
  console.log(auth.currentUser)
multiFactor(auth.currentUser).getSession()
    .then(async function (multiFactorSession) {
        // Specify the phone number and pass the MFA session.
        console.log(phone);
        const phoneInfoOptions = {
            phoneNumber: phone,
            session: multiFactorSession
        };

        const phoneAuthProvider = new auth.PhoneAuthProvider();
        var verificationCode = window.prompt('Please enter the verification ' +
        'code that was sent to your mobile device.');
        // Send SMS verification code.
        const cred = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, verificationCode);
        return phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, verificationCode);
    }).then(function (verificationId) {
        // Ask user for the verification code. Then:
        const cred = PhoneAuthProvider.credential(verificationId, 654321);
        const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

        // Complete enrollment.
        return multiFactor(auth.currentUser).enroll(multiFactorAssertion, "Plugg");
    });
  }
// recaptchaVerifier.render()
//     .then(function (widgetId) {
//         window.recaptchaWidgetId = widgetId;
//     });
//     //setRecaptchaResponse(recaptcha.getResponse(window.recaptchaWidgetId));
//     setRecaptchaResponse(recaptchaVerifier.verify());

  


  
  // catch (error) {
  //   console.error("Error Phone verify: ", error);
  //   recaptchaVerifier.clear();
  // }
  


  return (
    <div>
      <head>
            <script>window.flutterfire_web_sdk_version = '9.22.1';</script>
      </head>
      <SecondaryBanner />
      <div className="settings-container">
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h1 style={{ fontWeight: "bold" }}>User's Full Name</h1>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginRight: "10px", padding: "5px" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "5px" }}
          />
          
          
        </div>
        <div className="flex">
        <button type="button" onClick={handleMulti}>
            MFA
          </button>
          <input
            type="phone"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ padding: "5px" }}
          />
          <input
            type="code"
            placeholder="mfa code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ padding: "5px" }}/>
        </div>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button onClick={handleSubmit} style={{ padding: "10px 20px", fontSize: "16px" }}>Submit</button>
        </div>
>>>>>>> Stashed changes
        <div>
            <SecondaryBanner />
            <SecondaryBottomBar />
        </div>
    );
};
export default Settings;