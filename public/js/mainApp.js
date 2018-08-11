//constants declerations
const locateZoom = 18;
const maxMapZoom = 20;
const mymap = L.map('mainMap').setView([32.88025,-117.23752],locateZoom);


var inModal = false;
var hasLocation = false;
var tempLat = 0;
var tempLng = 0;

var markerGroupEvents = L.layerGroup().addTo(mymap);
var markerGroupUI;
var markerUI;

map.options.minZoom = 8;
map.options.maxZoom = maxMapZoom;

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

//setup the ui icon definitions
var creatingIcon = L.icon({
    iconUrl: 'css/markerCreating.png',
    iconSize:     [64, 64], // size of the icon
    iconAnchor:   [32, 64], // point of the icon which will correspond to marker's location
    popupAnchor:  [32, 10] // point from which the popup should open relative to the iconAnchor
});
var academicIcon = L.icon({
    iconUrl: 'css/markerAcademic.png',
    iconSize:     [64, 64], // size of the icon
    iconAnchor:   [32, 64], // point of the icon which will correspond to marker's location
    popupAnchor:  [32, 10] // point from which the popup should open relative to the iconAnchor
});
var marketIcon = L.icon({
    iconUrl: 'css/markerMarket.png',
    iconSize:     [64, 64], // size of the icon
    iconAnchor:   [32, 64], // point of the icon which will correspond to marker's location
    popupAnchor:  [32, 10] // point from which the popup should open relative to the iconAnchor
});
var socialIcon = L.icon({
    iconUrl: 'css/markerSocial.png',
    iconSize:     [64, 64], // size of the icon
    iconAnchor:   [32, 64], // point of the icon which will correspond to marker's location
    popupAnchor:  [32, 10] // point from which the popup should open relative to the iconAnchor
});
var sportingIcon = L.icon({
    iconUrl: 'css/markerSporting.png',
    iconSize:     [64, 64], // size of the icon
    iconAnchor:   [32, 64], // point of the icon which will correspond to marker's location
    popupAnchor:  [32, 10] // point from which the popup should open relative to the iconAnchor
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
    if (hasLocation === false) {
      createNewEventMarker();
      toggleButtons();
    }
    else {
      $('#eventCreateModal').modal('show');
      var latLng = markerUI.getLatLng();
      tempLng = latLng.lng;
      tempLat = latLng.lat;
      inModal = true;
      toggleButtons();
    }
  }
});

$('#cancelEventCreation').on('click', function(){
 console.log("exiting");
  mymap.removeLayer(markerGroupUI);
  hasLocation=false;
  inModal=false;
});
$('#submitEvent').on('click', function(){
  console.log("Firing")
  if (validateEventInput()) {
    mymap.removeLayer(markerGroupUI);
    writeUserEvent();
    hasLocation=false;
    inModal=false;
  }
});

$('#eventCancelButton').on('click', function(){
  cancelButton();
});

//cancelButton
function cancelButton(){
  toggleButtons();
  mymap.removeLayer(markerGroupUI);
  inModal = false;
  hasLocation = false;
}
/*
 * Create a new event markers
 */
function createNewEventMarker() {
  //initiate a user marker with a temporary location
  markerGroupUI = L.layerGroup().addTo(mymap);
  markerUI = L.marker(mymap.getCenter(), {
      draggable:true,
      icon:creatingIcon
  }).addTo(markerGroupUI);
  //handle drag events
  markerUI.on('dragend', function(event){
      var userCreateEventMarker = event.target;
  });
}
/*
 * Update the event modal
 */
function updateEventModal(title,organization,description,type) {
  //initiate a user marker with a temporary location
  document.getElementById("eventTitlePlace").innerHTML = title;
  document.getElementById("eventOrganizationPlace").innerHTML = organization;
  document.getElementById("eventInfoDescription").innerHTML = description;
  document.getElementById("eventTypePlace").classList.remove('fa-book');
  document.getElementById("eventTypePlace").classList.remove('fa-volleyball-ball');
  document.getElementById("eventTypePlace").classList.remove('fa-tag');
  document.getElementById("eventTypePlace").classList.remove('fa-users');
  switch(type){
    case(1):
    {
      document.getElementById("eventTypePlace").classList.add('fa-users');
    }
    break;
    case(2):
    {
      document.getElementById("eventTypePlace").classList.add('fa-volleyball-ball');
    }
    break;
    case(3):
    {
      document.getElementById("eventTypePlace").classList.add('fa-book');
    }
    break;
    case(4):
    {
      document.getElementById("eventTypePlace").classList.add('fa-tag');
    }
    break;
  }
}

/*
 * function to toggle buttons to remove and add styles to buttons.
 */
function toggleButtons(){
    if (hasLocation === false){
      document.getElementById("eventCreateButtonIcon").classList.remove('fa-plus');
      document.getElementById("eventCreateButtonIcon").classList.add('fa-check');
      document.getElementById("eventCancelButton").classList.remove('invis');
      document.getElementById("eventCancelButton").classList.add('vis');
      hasLocation = true;
    }
    else {
      document.getElementById("eventCreateButtonIcon").classList.remove('fa-check');
      document.getElementById("eventCreateButtonIcon").classList.add('fa-plus');
      document.getElementById("eventCancelButton").classList.remove('vis');
      document.getElementById("eventCancelButton").classList.add('invis');
      hasLocation = false;
    }
}
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
 * Create a marker that store value about an event.
 */
function createEventMarker(lat, lng, titleIn, orgIn, typeIn, timeIn, descriptIn){
  var newMarker;
  switch(typeIn){
    case(1):
    {
      newMarker = new eventMarker([lat, lng],{
        clickable: true,
        title: titleIn,
        org: orgIn,
        type: typeIn,
        description: descriptIn,
        time: timeIn,
        icon: socialIcon
      }).on('click', handleMarkerClick);
    }
    break;
    case(2):
    {
      newMarker = new eventMarker([lat, lng],{
        clickable: true,
        title: titleIn,
        org: orgIn,
        type: typeIn,
        description: descriptIn,
        time: timeIn,
        icon: sportingIcon
      }).on('click', handleMarkerClick);
    }
    break;
    case(3):
    {
      newMarker = new eventMarker([lat, lng],{
        clickable: true,
        title: titleIn,
        org: orgIn,
        type: typeIn,
        description: descriptIn,
        time: timeIn,
        icon: academicIcon
      }).on('click', handleMarkerClick);
    }
    break;
    case(4):
    {
      newMarker = new eventMarker([lat, lng],{
        clickable: true,
        title: titleIn,
        org: orgIn,
        type: typeIn,
        description: descriptIn,
        time: timeIn,
        icon: marketIcon
      }).on('click', handleMarkerClick);
    }
    break;
  }
  newMarker.addTo(markerGroupEvents);
}

function handleMarkerClick(e) {
  updateEventModal(this.options.title,this.options.org,this.options.description,this.options.type);
  $('#modalEventInfo').modal('show');
}

function validateEventInput() {
  var titleInput = document.getElementById("titleEventInput");
  var orgInput = document.getElementById("organizationEventInput");
  var typeInput = document.getElementById("typeEventInput") ;
  var durationInput = document.getElementById("durationEventInput");
  var descriptionInput = document.getElementById("descriptionEventInput");

  if (titleInput.value === ""){
    alert("Event title Needed.");
    return false;
  }
  else if (orgInput.value === ""){
    alert("Event organization needed.");
    return false;
  }
  else if (typeInput.value === ""){
    alert("Event type needed");
    return false;
  }
  else if (durationInput.value == 0){
    alert("Non zero hour amount needed.");
    return false;
  }
  return true;
}

function writeUserEvent() {
  var myUserName = firebase.auth().currentUser.displayName;
  var eventsRef = firebase.database().ref('events');
  var titleInput = document.getElementById("titleEventInput");
  var orgInput = document.getElementById("organizationEventInput");
  var typeInput = document.getElementById("typeEventInput") ;
  var durationInput = document.getElementById("durationEventInput");
  var descriptionInput = document.getElementById("descriptionEventInput");
  eventsRef.push ({
   title: titleInput.value,
   owner: myUserName,
   description: descriptionInput.value,
   lat: tempLat,
   lng: tempLng,
   type: parseInt(typeInput.value),
   org: orgInput.value
});
}

function writeUserData(userId, email, displayName ) {
  firebase.database().ref('users/' + userId).set({
    username: displayName,
    email: email
  });
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
  initApp();
});
