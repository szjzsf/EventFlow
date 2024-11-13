document.getElementById('createEventBtn').addEventListener('click', function() {
    const name = document.getElementById('eventName').value;
    const type = document.getElementById('eventType').value;
    const desc = document.getElementById('eventDesc').value;
    const location = document.getElementById('eventLocation').value;
    const imgInput = document.getElementById('eventImage');
    const isPrivate = document.getElementById('privateEvent').checked;

    const reader = new FileReader();
    reader.onload = function(e) {
        const imgSrc = e.target.result;

        // Eseménykártya hozzáadása
        const eventCard = `
            <div class="col-md-3 event-card">
                <div class="card">
                    <div class="event-image">
                    <img src="${imgSrc} " class="kartya-kep card-img-top" /> <!-- Use the image source from the input -->
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${name}</h5>
                        <p class="card-text">Helyszín: ${location}</p>
                        <p class="d-inline-block text-truncate card-text" style="max-width: 275px;">${desc}</p>
                        <p class="card-text"><small class="text-muted">${isPrivate ? 'Privát esemény' : 'Nyilvános esemény'}</small></p>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('eventCards').innerHTML += eventCard;

        // Modal bezárása
        const modal = bootstrap.Modal.getInstance(document.getElementById('createEventModal'));
        modal.hide();
    };
    reader.readAsDataURL(imgInput.files[0]);
});


//Google Maps
//API KULCS: AIzaSyAiVVtoDyYhSXowhkK285z-U9mOB1z9FkA


// A Google Maps API kulcs
const apiKey = 'AIzaSyAiVVtoDyYhSXowhkK285z-U9mOB1z9FkA'; // Cseréld ki a saját API kulcsodra!

// Függvény a teljes utca név keresésére
function findFullStreetName() {
  const partialStreetName = document.getElementById('streetInput').value;
  const resultDiv = document.getElementById('result');
  
  // Ha nincs megadva név
  if (!partialStreetName.trim()) {
    resultDiv.textContent = "Kérlek, add meg a részleges utcanevet!";
    resultDiv.classList.add('error');
    return;
  }

  // Google Maps Geocoding API hívása
  completeStreetName(partialStreetName, apiKey, (error, fullStreetName) => {
    if (error) {
      resultDiv.textContent = error;
      resultDiv.classList.add('error');
    } else {
      resultDiv.textContent = `A kiegészített utca név: ${fullStreetName}`;
      resultDiv.classList.remove('error');
    }
  });
}

// A geokódoló függvény, ami a Google Maps API-t használja
function completeStreetName(partialStreetName, apiKey, callback) {
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(partialStreetName)}&key=${apiKey}`;

  fetch(geocodeUrl)
    .then(response => response.json())
    .then(data => {
      if (data.status === 'OK') {
        const results = data.results;
        let fullAddress = null;

        // Végigmegyünk az eredményeken, és próbáljuk meg kinyerni az utcát
        for (let result of results) {
          const addressComponents = result.address_components;

          const streetNameComponent = addressComponents.find(component => 
            component.types.includes('route')
          );

          if (streetNameComponent) {
            fullAddress = streetNameComponent.long_name;
            break;
          }
        }

        // A kiegészített cím visszaadása
        if (fullAddress) {
          callback(null, fullAddress);
        } else {
          callback('A teljes cím nem található.', null);
        }
      } else {
        callback('Hiba történt a geokódolás során.', null);
      }
    })
    .catch(error => {
      callback('Hiba történt a kérés feldolgozása során: ' + error, null);
    });
}

(() => {
  const counter = (() => {
    const input = document.getElementById('counter-input'),
      display = document.getElementById('counter-display'),
      changeEvent = (evt) => display.innerHTML = evt.target.value.length,
      getInput = () => input.value,
      countEvent = () => input.addEventListener('keyup', changeEvent),
      init = () => countEvent();

    return {
      init: init
    }

  })();

  counter.init();

})();