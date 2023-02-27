# Getting Started with Leave Form

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### How to setup `firebase`

Go to [http://firebase.google.com] and log in to your fireabse account.

Now create a new firebase project and add a web app to the current apps, from where you get the `firebaseConfig`, for example:

`const firebaseConfig = {
  apiKey: "AIzaSyCZNV_9grCPxH5Idp0cHUJpKixjtPoWvu8",
  authDomain: "leave-form-6908b.firebaseapp.com",
  projectId: "leave-form-6908b",
  storageBucket: "leave-form-6908b.appspot.com",
  messagingSenderId: "298536241168",
  appId: "1:298536241168:web:890d8d3e30470c491b2295",
  measurementId: "G-3S25VNHCGJ",
};`

replace it with the current in `firebase.js` file in `src` folder. Now you're good to go.
Also please do make sure that you configure firestore in firebase console and make it rules to `true` to allow database CRUDs.
This process setup a database to setup leave requests.
