
initApp = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
       var displayName = user.displayName;
       var email = user.email;
       var uid = user.uid;
         firebase.database();
       writeUserData(uid, email, displayName);
       displayUserData(uid, displayName);
       startDatabaseQueries();
    }
  }, function(error) {
    console.log(error);
  });
};

function startDatabaseQueries() {
  var myUserId = firebase.auth().currentUser.uid;
}

function writeUserData(userId, email, displayName ) {

  firebase.database().ref('users/' + userId).set({
    username: displayName,
    email: email
  });
}
function displayUserData(userId, displayName ) {
  const idPlacement = document.getElementById('user-id-placement');
  const usernamePlacement = document.getElementById('user-name-placement');
//  const getInfoButton = document.getElementById('get-info');
//  const eventInfoPlacement = document.getElementById('event-info-placement');
  idPlacement.textContent = userId;
  usernamePlacement.textContent = displayName;
}
function writeEventData(ownerId, ownerName, title, type, description, time, duration, location) {
  firebase.database().ref('events/' + userId).set({
    ownerName: displayName,
    eventTitle: title,
    eventType: type,
    eventDescription: description,
    eventTime: time,
    eventDuration: duration,
    eventLocation: location
  });
}

window.addEventListener('load', function() {
  initApp()
});
