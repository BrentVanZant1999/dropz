//constants declerations
const locateZoom = 18;
const maxMapZoom = 20;
const mymap = L.map('mainMap').setView([32.88025,-117.23752],locateZoom);
var inModal = false;
var markerGroupUI = L.layerGroup().addTo(mymap);
var markerGroupEvents = L.layerGroup().addTo(mymap);

eventMarker = L.Marker.extend({
options: {
title: '',
org: '',
type: '',
description:'',
time:''
}
});

mymap.on('locationerror', onLocationError);
mymap.on('locationfound', onLocationfound);

var orangeIcon = L.icon({
    iconUrl: 'css/markerOrangeIcon.png',
    iconSize:     [40, 53], // size of the icon
    iconAnchor:   [20, 45], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
var pinkIcon = L.icon({
    iconUrl: 'css/markerPinkIcon.png',
    iconSize:     [40, 53], // size of the icon
    iconAnchor:   [20, 45], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
var blueIcon = L.icon({
    iconUrl: 'css/markerBlueIcon.png',
    iconSize:     [40, 53], // size of the icon
    iconAnchor:   [20, 45], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
var redIcon = L.icon({
    iconUrl: 'css/markerRedIcon.png',
    iconSize:     [40, 53], // size of the icon
    iconAnchor:   [20, 45], // point of the icon which will correspond to marker's location
    popupAnchor:  [20, 0] // point from which the popup should open relative to the iconAnchor
});
var greenIcon = L.icon({
    iconUrl: 'css/markerGreenIcon.png',
    iconSize:     [40, 53], // size of the icon
    iconAnchor:   [20, 45], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
var purpleIcon = L.icon({
    iconUrl: 'css/markerPurpleIcon.png',
    iconSize:     [40, 53], // size of the icon
    iconAnchor:   [20, 45], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
var yellowIcon = L.icon({
    iconUrl: 'css/markerYellowIcon.png',
    iconSize:     [40, 53], // size of the icon
    iconAnchor:   [20, 45], // point of the icon which will correspond to marker's location
    popupAnchor:  [20, 0] // point from which the popup should open relative to the iconAnchor
});
//initiate a user marker with a temporary location
var userCreateEventMarker = L.marker([0,0], {
    draggable:true,
    icon:redIcon
}).addTo(markerGroupUI);
//handle drag events
userCreateEventMarker.on('dragend', function(event){
    var userCreateEventMarker = event.target;
});

//put a tile layer on the map
L.tileLayer('https://api.mapbox.com/styles/v1/bvanzant/cjitaouuo4toq2so62d2nn724/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnZhbnphbnQiLCJhIjoiY2ppZTZhdzh2MDZvazN3bXllOTlmYXc4aCJ9.ipjbP-7psE4EN1sVYotlsQ', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: maxMapZoom,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoiYnZhbnphbnQiLCJhIjoiY2ppZTZhdzh2MDZvazN3bXllOTlmYXc4aCJ9.ipjbP-7psE4EN1sVYotlsQ'
}).addTo(mymap);

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
    userCreateEventMarker.setLatLng(e.latlng);
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
       startDatabaseQuery();
    }
  }, function(error) {
    console.log(error);
  });
};

function startDatabaseQuery() {
  var myUserId = firebase.auth().currentUser.uid;
  var currentEvents = firebase.database().ref('events');
  var fetchEvents = function(eventsRef) {
    eventsRef.on('child_added', function(data) {
      var title = data.val().title;
      var org = data.val().org;
      var type = data.val().type;
      var endTime = 5;  //data.val().endTime;
      var lat = data.val().lat;
      var lng = data.val().lng;
      var description = data.val().description;
      createEventMarker(lat,lng,title,org,type,endTime,description);
    });
  }
  fetchEvents(currentEvents);
}

/*
 * Create a marker class.

eventMarker = L.Marker.extend({
   options: {
      title: '',
      org:'',
      endTime: '',
      type: 0,
      description: ''
   }
});
*/
/*
 * Create a marker that store value about an event.
 */
function createEventMarker(lat, lng, titleIn, orgIn, typeIn, timeIn, descriptIn){
switch(typeIn){
  case(1):
  {
    var newMarker = new eventMarker([lat, lng],{
      clickable: true,
      title: titleIn,
      org: orgIn,
      type: typeIn,
      description: descriptIn,
      time: timeIn,
      icon: blueIcon
    }).addTo(markerGroupEvents);
  }
  break;
  case(2):
  {
    var newMarker = new eventMarker([lat, lng],{
      clickable: true,
      title: titleIn,
      org: orgIn,
      type: typeIn,
      description: descriptIn,
      time: timeIn,
      icon: redIcon
    }).addTo(markerGroupEvents);
  }
  break;
  case(3):
  {
    var newMarker = new eventMarker([lat, lng],{
      clickable: true,
      title: titleIn,
      org: orgIn,
      type: typeIn,
      description: descriptIn,
      time: timeIn,
      icon: greenIcon
    }).addTo(markerGroupEvents);
  }
  break;
  case(4):
  {
    var newMarker = new eventMarker([lat, lng],{
      clickable: true,
      title: titleIn,
      org: orgIn,
      type: typeIn,
      description: descriptIn,
      time: timeIn,
      icon: yellowIcon
    }).addTo(markerGroupEvents);
  }
  break;
}

 /*
  var newMarker = new eventMarker([lat,lng]),{
    title:titleIn,
    org:orgIn,
    type:typeIn,
    endTime:timeIn,
    description:descriptIn
  }).addTo(markerGroupEvents);
  */
}



function validateEventInput() {
  var titleInput = document.getElementById("titleEventInput");
  var orgInput = document.getElementById("organizationEventInput");
  var typeInput = document.getElementById("typeEventInput") ;
  var durationInput = document.getElementById("durationEventInput");
  var descriptionInput = document.getElementById("descriptionEventInput");

  if (titleInput.value === ""){
    alert("Event title Needed.");
  }
  if (orgInput.value === ""){
    alert("Event organization needed.");
  }
  if (typeInput.value === ""){
    alert("Event type needed");
  }
  if (durationInput == 0){
    alert("Non zero hour amount needed.")
  }
}

function writeUserEvent(userId, email, displayName ) {
  firebase.database().ref('users/' + userId).set({
    username: displayName,
    email: email
  });
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



window.addEventListener('load', function() {
  initApp();
});
