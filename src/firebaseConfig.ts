import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBJ0pNj_TTLXICT8EbxexWCmiekFwrGVJ4",
  authDomain:  "hamster-and-spacedogs.firebaseapp.com",
  databaseURL: "https://hamster-and-spacedogs-default-rtdb.firebaseio.com",
  projectId: "hamster-and-spacedogs",
  storageBucket:  "hamster-and-spacedogs.firebasestorage.app",
  messagingSenderId: "241271299374",
  appId: "1:241271299374:web:328edf15a0c31a1ffcaebf",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;
