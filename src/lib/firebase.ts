// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-EtlNOvp4z4D02eJVTOxw7Z7fE7awJGA",
  authDomain: "pytorch-flow.firebaseapp.com",
  projectId: "pytorch-flow",
  storageBucket: "pytorch-flow.firebasestorage.app",
  messagingSenderId: "204396463993",
  appId: "1:204396463993:web:69887c5e909f4ddf6b91a8",
  measurementId: "G-022SZBTJTB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

export const db = getFirestore(app);

export const projectsRef = collection(db, "projects");
export const importedProjectsRef = collection(db, "importedProjects");
