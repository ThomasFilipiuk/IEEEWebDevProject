// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { useEffect, useState, useCallback } from 'react';
import { getDatabase, onValue, ref, update} from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDSUV-IAc1sxAblQzUUAQA4oTMo4mMG84",
  authDomain: "ieee22-23.firebaseapp.com",
  databaseURL: "https://ieee22-23-default-rtdb.firebaseio.com",
  projectId: "ieee22-23",
  storageBucket: "ieee22-23.appspot.com",
  messagingSenderId: "563550940369",
  appId: "1:563550940369:web:54922fbe2c49f5bd14a9f0"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

const database = getDatabase(firebase);


export const useDbData = (path) => {
  const [data, setData] = useState();
  const [error, setError] = useState(null);

  useEffect(() => (
    onValue(ref(database, path), (snapshot) => {
     setData( snapshot.val() );
    }, (error) => {
      setError(error);
    })
  ), [ path ]);

  return [ data, error ];
};

const makeResult = (error) => {
  const timestamp = Date.now();
  const message = error?.message || `Updated: ${new Date(timestamp).toLocaleString()}`;
  return { timestamp, error, message };
};

export const useDbUpdate = (path) => {
  const [result, setResult] = useState();
  const updateData = useCallback((value) => {
    update(ref(database, path), value)
    .then(() => setResult(makeResult()))
    .catch((error) => setResult(makeResult(error)))
  }, [database, path]);

  return [updateData, result];
};