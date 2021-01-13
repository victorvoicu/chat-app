let x = 1
//init tooltips
$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

//preia metoda io din script-ul socket.io din index.ejs,porneste conexiunea pt view
const socket = io();

socket.on('VcountUpdated', function (count) {
  console.log('v count updated', count);
})

$('#buton1').click(function (e) {
  e.preventDefault();
  console.log('v emitted requestIncrement');
  socket.emit('requestIncrement')
});

socket.on('message', function (param1) {
  console.log('am primit de la server ', param1)
})

socket.on('chatmessage',function (param1) {
  let x=document.createElement('p')
  x.innerHTML=param1

  document.querySelector('#message').append(x)
  })
 
//trimite mesaj din textarea
$('#msgform').submit(function (e) {
  e.preventDefault();
  console.log('trimit', $('#textarea1').val());
 
  socket.emit('sendMessage', $('#textarea1').val(),
    function (msgFromServerCallback) {
      console.log('message was delivered and confirmed by server');
      console.log(msgFromServerCallback.status, msgFromServerCallback)
    })

  document.querySelector('#msgform').reset()
  document.querySelector('#textarea1').focus() 
  // $('#textarea1').focus(); //jquery equivalent
});

$('#textarea1').keypress(function (e) {
  if (e.key == 'Enter') {
    $('#butonsend').click()
    return false //termina event listener, muta cursorul 
    //la inceputul textarea
     
     
  }
});

// let linkLocatie

function geoFindMe() {

  // const status = document.querySelector('#status');
  // const mapLink = document.querySelector('#map-link');

  // mapLink.href = '';
  // mapLink.textContent = '';
  document.querySelector('#find-me').disabled = true
  document.querySelectorAll('form > *').forEach(e => e.disabled = true)

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // status.textContent = '';
    // mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    // linkLocatie=`https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`
    let linkLocatie = `www.google.ro/maps/@${latitude},${longitude}`
    // mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
    //  socket.emit('sendLocation',linkLocatie)
    socket.emit('sendLocation', {
      latitude: latitude,
      longitude: longitude
    }, 
      function (param1) { console.log(param1) }
    )
    document.querySelector('#find-me').disabled = false
    document.querySelectorAll('form > *').forEach(e => e.disabled = false)

  }

  function error() {
    status.textContent = 'Unable to retrieve your location';
  }

  if (!navigator.geolocation) {
    status.textContent = 'Geolocation is not supported by your browser';
  } else {
    status.textContent = 'Locating…';
    navigator.geolocation.getCurrentPosition(success, error);
  }

}

$('#find-me').click(function (e) {
  e.preventDefault();
  geoFindMe()
});

 