import { collection, getDocs, addDoc } from '@firebase/firestore';
import { auth, db } from '../../../firebase';
import React, { useContext, useEffect, useState } from 'react'
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css'
import { AuthContext } from 'auth';
import { codedata, logindata } from 'types/interfaces';
import { Auth2FA, LoginFields } from 'screens/components/global/fields';
import { faLock, faUser, faUserAlt, faUserCircle, faUsersRectangle } from '@fortawesome/free-solid-svg-icons';
import { generateRandomKey } from '../../../firebase/function';
import { Alert, Button, Stack, TextField } from '@mui/material';
import FormHeader from 'screens/components/FormHeader';

let md5 = require('md5')

export default function Login({}) {

  const [verification, setverification] = useState('');
  const [username, setusername] = useState('');
  const [forgotten, setforgotten] = useState(false)
  const [loginpassword, setloginPassword] = useState('');
  const { currentUser } = useContext(AuthContext);
  const [toast, settoast] = useState('');
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false)
  const [submitted, setsubmitted] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    const getUserData = async () => {
   try {
 
     const querySnapshot = await getDocs(collection(db, 'user'));
     querySnapshot.forEach((doc: any) => {
       // console.log(doc.id, ' => ', doc.data());
     });
   } catch (error) {
     console.log(error);
     console.log('Error getting user documents: ', error);
   }
 };
 
 getUserData();
   if(currentUser != null){
     navigate("/admin/statistics");
   }
   }, [currentUser]);

   const checkStatus = async (e: any) => {
    e.preventDefault()
    seterror(false)
    setloading(true)
    setsubmitted(true)
    if(username.length === 0 || loginpassword.length === 0) {
      return
    }
    settoast('checking email...')
    const querySnapshot = await getDocs(collection(db, "user"));
    const userData: logindata[] = [];
  
    querySnapshot.forEach((doc) => {
      if (doc.data().username === username) {
        userData.push({
            id: doc.data().id,
            username: doc.data().username,
            type: doc.data().type,
            email: doc.data().email,
            
        });
      }
    });

    if (userData.length > 0) {
      settoast('verifying credentials...')
      const isAdmin = userData.some((user) => user.type === "admin");
      console.log(isAdmin);
      if (isAdmin) {
        const email = userData[0].email;
        const password = loginpassword;
        settoast('logging in...')
        await signInWithEmailAndPassword(auth, email, password).then(() => {
          setloading(false)
          setsubmitted(false)
          navigate("/admin/submissions")
        }).catch((error: any) => {
          console.log(error)
          if(error == 'FirebaseError: Firebase: Error (auth/invalid-login-credentials).'){
          settoast('username and password did not matched.')
          seterror(true)
        }
        })
      } else {
        settoast('The provided username used in a non-admin account')
        seterror(true)
      }
    } else {
      settoast('username provided have no account with us')
      seterror(true)
    }
  }
  

  return (
    <div draggable = {false} className="unauthorized-container">
      {forgotten &&      
        <Alert 
          variant='filled' 
          severity='error' 
        >
          NOTE: if forgotten password, Please contact your Administrator.
        </Alert>
      }      
<div className='login-container-row img-bck'>
        <img width={350}  draggable = {false} src='https://i.imgur.com/HZdBITp.png' />
        <h1>VIQUMO ADMIN SYSTEM</h1>
        <p>vidarsson online</p>
      </div>
      <div className='login-container-row'>
        <div className='login-box'>
          <h1>ADMIN ACCOUNT</h1>
          <Stack sx={{width: '75%'}} direction="column" spacing={2} marginTop={2}>
								{/* <FormHeader inputLabel = 'Username' /> */}
								<TextField
										sx={{width: '100%'}}
										type='text'
										value={username}
                    label='User Name'
                    variant='outlined'
										placeholder='Enter Persons Onboard'
										onChange = {(e) => setusername(e.target.value)}
										error = {submitted && username.length === 0}
										helperText = {submitted && username.length === 0 && 'username must not be empty'}
								/>
						</Stack>
            <Stack  sx={{width: '75%', marginBottom: 1}} direction="column" spacing={2} marginTop={2}>
								{/* <FormHeader inputLabel = 'Password' /> */}
								<TextField
										sx={{width: '100%'}}
										type='password'
                    label='Password'
                    variant='outlined'
										value={loginpassword}
										placeholder='Enter Persons Onboard'
										onChange = {(e) => setloginPassword(e.target.value)}
										error = {submitted && loginpassword.length === 0}
										helperText = {submitted && loginpassword.length === 0 && 'Password must not be empty'}
								/>
						</Stack>
          <a onClick={() => setforgotten(!forgotten)}>Forgot password?</a>
          <Button variant='contained' onClick={checkStatus}>Login</Button>
          {loading && <p style={{color: error ? 'red' : 'black', fontSize: 12, textAlign: 'center'}}>{toast}</p>}
        </div>
      </div>
    </div>
  )
}