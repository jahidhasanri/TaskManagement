import React, { createContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../../firebase.config';
import { GoogleAuthProvider } from 'firebase/auth';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loader, setLoader] = useState(true);
  console.log(user?.displayName);

  const handelRegistWemail = (email, password) => {
    setLoader(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const handelLoginWemail = (email, password) => {
    setLoader(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const handleSingOut = () => {
    setLoader(true);
    return signOut(auth);
  };

  const googleAuthProvider = new GoogleAuthProvider();

  const handelLoginWithGoogle = () => {
    setLoader(true);
    return signInWithPopup(auth, googleAuthProvider);
  };

  const updatedProfile = (name, photoUrl) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoUrl,
    });
  };

  const authInfo = {
    user,
    loader,
    setUser,
    setLoader,
    handelRegistWemail,
    handelLoginWemail,
    handleSingOut,
    handelLoginWithGoogle,
    updatedProfile,
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoader(false); 
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={authInfo}>
      {children} 
    </AuthContext.Provider>
  );
};

export default AuthProvider;
