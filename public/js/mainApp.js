//constants declerations
const locateZoom = 10;
const maxMapZoom = 18;
const mymap = L.map('mainMap');
var inModal = false;

mymap.on('locationerror', onLocationError);
mymap.on('locationfound', onLocationfound);

var orangeIcon = L.icon({
    iconUrl: 'css/markerOrangeIcon.png',
    iconSize:     [40, 53], // size of the icon
    iconAnchor:   [25, 45], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
var pinkIcon = L.icon({
    iconUrl: 'css/markerPinkIcon.png',
    iconSize:     [40, 53], // size of the icon
    iconAnchor:   [25, 45], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
var marker = L.marker([51.5, -0.09], {
    draggable:true,
    icon:pinkIcon
}).addTo(mymap);
marker.on('dragend', function(event){
    var marker = event.target;
});

//put a tile layer on the map
L.tileLayer('https://api.mapbox.com/styles/v1/bvanzant/cjitaouuo4toq2so62d2nn724/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnZhbnphbnQiLCJhIjoiY2ppZTZhdzh2MDZvazN3bXllOTlmYXc4aCJ9.ipjbP-7psE4EN1sVYotlsQ', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: maxMapZoom,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoiYnZhbnphbnQiLCJhIjoiY2ppZTZhdzh2MDZvazN3bXllOTlmYXc4aCJ9.ipjbP-7psE4EN1sVYotlsQ'
}).addTo(mymap);

locateClientUser();

//location button init
$('#locator').on('click', function(){
  locateClientUser();
});
$('#eventCreateButton').on('click', function(){
  if (inModal === false) {
    $('#eventModal').modal('show');
  }
});

//map functions
function locateClientUser() {
  mymap.locate({setView:true, mapZoom:locateZoom});
}
function onLocationfound(e){
    marker.setLatLng(e.latlng);
}
function onLocationError(e) {
    alert("Location Database error");
  }

initApp = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
       var displayName = user.displayName;
       var email = user.email;
       var uid = user.uid;
         firebase.database();
       writeUserData(uid, email, displayName);
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

/*
function displayUserData(userId, displayName ) {
  const idPlacement = document.getElementById('user-id-placement');
  const usernamePlacement = document.getElementById('user-name-placement');
  idPlacement.textContent = userId;
  usernamePlacement.textContent = displayName;
}
*/

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

//event marker decleration --> extended from leaflet marker.
eventMarker = L.CircleMarker.extend({
   options: {
      title: 'Loading title',
      time: 'Loading time',
      duration: 0,
      type:"Social",
      description: 'Loading description'
   }
});

window.addEventListener('load', function() {
  initApp();
});
