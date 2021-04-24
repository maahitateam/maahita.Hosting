const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16).toUpperCase();
  });
};
var app = new Vue({
  el: '#app',
  data: {
    docs: []
  },
  methods: {
    upvoteRequest(id) {
      //console.log(id);
      const upvote = firebase.functions().httpsCallable('upvote');
      upvote({ id })
        .catch(error => {
          showNotification(error.message);
        });
    },
    getStatusString(status) {
      if (status === 1) return 'created';
      else if (status === 3) return 'started';
      else if (status === 4) return 'completed';
      else if (status === 5) return 'cancelled';
      else if (status === 6) return 'inprogress';
    },
    startSession: async function (id, sessionTitle) {
      const uid = uuid();
      const db = firebase.firestore();
      await db.collection('sessions').doc(id).set({
        meetingID: uid,
        status: 3, // started
        startedon: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      document.getElementById(id).innerText = `https://meetings.maahita.com/${uid}`;
      // call notification function

      const response = await fetch('https://us-central1-mahita-2c3b1.cloudfunctions.net/sendStartSessionNotification', {
        method: 'POST',
        body: JSON.stringify({ title: sessionTitle })
      });
      const result = await response.json();
      if (result) {
        alert('Notification delivered to all devices');
      }
    },
    cancelSession: async function (id, sessionTitle) {
      const uid = uuid();
      const db = firebase.firestore();
      await db.collection('sessions').doc(id).set({
        meetingID: uid,
        status: 5, // started
        startedon: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      document.getElementById(id).innerText = uid;

      const response = await fetch('https://us-central1-mahita-2c3b1.cloudfunctions.net/sendCancelSessionNotification', {
        method: 'POST',
        body: JSON.stringify({ title: sessionTitle })
      });
      const result = await response.json();
      if (result) {
        alert('Notification delivered to all devices');
      }
    },
    stopSession: async function (doc) {
      try {
        const db = firebase.firestore();
        const attendees = doc.attendees;
        const batch = db.batch();
        const dbRef = db.collection('sessions').doc(doc.id);
        batch.update(dbRef, { status: 4, completedon: firebase.firestore.FieldValue.serverTimestamp() });
        attendees.forEach(attendee => {
          batch.set(db.collection('sessions').doc(doc.id).collection('feedback').doc(attendee), {
            'issubmitted': false,
            'requestedon': firebase.firestore.FieldValue.serverTimestamp(),
            'id': attendee
          });
        });
        const response = await batch.commit();
        if (response) {
          console.log(response);
        }
      } catch (error) {
        console.error(error);
      }
    },
    addSession: function (e) {
      const requestModal = document.querySelector('.new-request');
      requestModal.classList.add('open');
    }
  },
  mounted() {
    const ref = firebase.firestore().collection('sessions');
    ref.onSnapshot(snapshot => {
      let docs = [];
      snapshot.forEach(doc => {
        let tempDoc = doc.data();
        let tdate = new Date(tempDoc.date.seconds * 1000);
        tempDoc.tdate = tdate.toString();
        tempDoc.month = tdate.toLocaleString('default', { month: 'short' }); tdate.getMonth();
        tempDoc.day = tdate.getDate();
        tempDoc.time = tdate.toLocaleTimeString();
        // tempDoc.meetingLink = tempDoc.meetingID ? `https://meetings.maahita.com/${tempDoc.meetingID}` : '';
        docs.push({ ...tempDoc, id: doc.id });
      });
      this.docs = docs.sort((a, b) => (new Date(b.tdate)) - (new Date(a.tdate)));
    });
  }
});