import { setItems } from "./storage.js";

const authSwitchLinks = document.querySelectorAll('.switch');
const authModals = document.querySelectorAll('.auth .modal');
const authWrapper = document.querySelector('.auth');
const loginForm = document.querySelector('.login');
const signOut = document.querySelector('.sign-out');

// toggle auth modals
authSwitchLinks.forEach(link => {
  link.addEventListener('click', () => {
    authModals.forEach(modal => modal.classList.toggle('active'));
  });
});

// login form
loginForm.addEventListener('submit', async (e) => {
  try {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    const user = await firebase.auth().signInWithEmailAndPassword(email, password);
    if (user) {
      const email = user.user.email;
      const token = user.user.refreshToken;
      const uid = user.user.uid;
      setItems({ 'email': email, 'token': token, 'uid': uid });
      document.getElementById('profile-email').innerHTML = email;
      loginForm.reset();
    }
  } catch (error) {
    loginForm.querySelector('.error').textContent = error.message;
  }
});

// sign out
signOut.addEventListener('click', () => {
  firebase.auth().signOut()
    .then(() => console.log('signed out'));
});

// auth listener
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    authWrapper.classList.remove('open');
    authModals.forEach(modal => modal.classList.remove('active'));
  } else {
    authWrapper.classList.add('open');
    authModals[0].classList.add('active');
  }
});
