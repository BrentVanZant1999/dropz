initApp = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var uid = user.uid;
      console.log(uid);
      user.getIdToken().then(function(accessToken) {
        document.getElementById('app-header').textContent = 'Signed in';
      });
    }
  }, function(error) {
    console.log(error);
  });
};
window.addEventListener('load', function() {
  initApp()
});
