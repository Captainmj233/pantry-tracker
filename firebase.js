import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB0sMBBV25PrKVWFvnoCACNVf1nDeX3-ZE",
    authDomain: "inventory-manager-3f36c.firebaseapp.com",
    projectId: "inventory-manager-3f36c",
    storageBucket: "inventory-manager-3f36c.appspot.com",
    messagingSenderId: "1067730156933",
    appId: "1:1067730156933:web:22bef45961d9c2be5698ec",
    measurementId: "G-H4B581D13R"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const firestore = getFirestore(app);

export { firestore };