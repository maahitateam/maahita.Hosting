import { post } from "./api.js";
const loadDocument = function () {
  const requestModal = document.querySelector('.new-request');
  const requestForm = document.querySelector('.add-session');
  const notification = document.querySelector('.notification');
  const db = firebase.firestore();
  const uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16).toUpperCase();
    });
  }
  requestModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('new-request')) {
      requestModal.classList.remove('open');
    }
  });

  // add a new request
  const submitForm = async (e) => {
    e.preventDefault();
    let session = {
      title: requestForm.title.value,
      theme: requestForm.theme.value,
      description: requestForm.description.value,
      date: firebase.firestore.Timestamp.fromDate(new Date(requestForm.date.value)),
      presenter: requestForm.presenter.value,
      status: 1,
      duration: '40 min'
    };
    await db.collection('sessions').doc(uuid()).set(session);
    requestForm.reset();
    requestModal.classList.remove('open');
  };

  // notification
  const showNotification = (message) => {
    notification.textContent = message;
    notification.classList.add('active');
    setTimeout(() => {
      notification.classList.remove('active');
      notification.textContent = '';
    }, 4000);
  };

  document.getElementById('addSession').addEventListener('click', submitForm);
}

document.onload = loadDocument();

