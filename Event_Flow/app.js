document.getElementById('createEventBtn').addEventListener('click', function () {
  const name = document.getElementById('eventName').value;
  const type = document.getElementById('eventType').value;
  const desc = document.getElementById('eventDesc').value;
  const utca = document.getElementById('UtcaNev').value;
  const hazSzam = document.getElementById('Hazszam').value;
  const imgInput = document.getElementById('eventImage');
  const isPrivate = document.getElementById('privateEvent').checked;


  if (imgInput.files.length === 0) {
    alert('Please upload an image for the event!');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const imgSrc = e.target.result;

    const newEvent = {
      name: name,
      type: type,
      description: desc,
      location: location,
      image: imgSrc,
      isPrivate: isPrivate,
      date: new Date().toISOString().split('T')[0], // Example: Add today's date
    };

    // Send to server
    fetch('/addEvent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEvent),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to save event');
        }
        return response.json();
      })
      .then((data) => {
        alert(data.message);

        // Optionally, reload events or append the new one to the UI
        document.getElementById('eventCards').innerHTML += `
        <div class="col-md-3 event-card">
        <div class="card">
          <div class="event-image">
            <img src="${imgSrc}" class="kartya-kep card-img-top" alt="Event Image" />
          </div>
          <div class="card-body">
            <h5 class="card-title">${name}</h5>
            <p class="card-text">Helyszín: Miskolc, ${utca}, ${hazSzam}</p>
            <p class="d-inline-block text-truncate card-text" style="max-width: 275px;">${desc}</p>
            <p class="card-text"><small class="text-muted">${isPrivate ? 'Privát esemény' : 'Nyilvános esemény'}</small></p>
          </div>
        </div>
      </div>`;
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Failed to save the event. Please try again later.');
      });
  };
  reader.readAsDataURL(imgInput.files[0]);
});
 

(() => {
  const counter = (() => {
    const input = document.getElementById('counter-input');
    const display = document.getElementById('counter-display');

    const changeEvent = (evt) => {
      display.innerHTML = evt.target.value.length;
    };

    const countEvent = () => {
      input.addEventListener('keyup', changeEvent);
    };

    const init = () => countEvent();

    return {
      init: init,
    };
  })();

  counter.init();
})();

// Display events from JSON

fetch("./database.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    data.forEach(function (event) {
      const { imgSrc, name, location, desc, isPrivate } = event;
      document.getElementById('eventCards').innerHTML += `
      <div class="col-md-3 event-card">
        <div class="card">
          <div class="event-image">
            <img src="${imgSrc}" class="kartya-kep card-img-top" alt="Event Image" />
          </div>
          <div class="card-body">
            <h5 class="card-title">${name}</h5>
            <p class="card-text">Helyszín: Miskolc, ${utca}, ${hazSzam}</p>
            <p class="d-inline-block text-truncate card-text" style="max-width: 275px;">${desc}</p>
            <p class="card-text"><small class="text-muted">${isPrivate ? 'Privát esemény' : 'Nyilvános esemény'}</small></p>
          </div>
        </div>
      </div>`;
    });
  });






//LÉTREHOZÁS HELYSZÍN

document.addEventListener("DOMContentLoaded", () => {
  let streetNames = [];

  // Fetch street names from the TXT file
  fetch("Miskolc_utcanevek.txt")
    .then(response => response.text())
    .then(data => {
      // Split the text file content into an array
      streetNames = data.split("\n").map(name => name.trim());
    })
    .catch(error => console.error("Error fetching street names:", error));

  const locationInput = document.getElementById("UtcaNev");
  const autocompleteList = document.createElement("div");
  autocompleteList.className = "autocomplete-list";
  locationInput.parentElement.appendChild(autocompleteList);

  // Autocomplete logic for the location input field
  locationInput.addEventListener("input", () => {
    const query = locationInput.value.toLowerCase();
    autocompleteList.innerHTML = ""; // Clear previous suggestions

    if (query) {
      const matches = streetNames.filter(name => name.toLowerCase().includes(query));

      matches.forEach(match => {
        const item = document.createElement("div");
        item.className = "autocomplete-item";
        item.textContent = match;

        item.addEventListener("click", () => {
          locationInput.value = match;
          autocompleteList.innerHTML = ""; // Clear suggestions
        });

        autocompleteList.appendChild(item);
      });
    }
  });

  // Close the autocomplete list when clicking outside the input
  document.addEventListener("click", (event) => {
    if (!locationInput.contains(event.target) && !autocompleteList.contains(event.target)) {
      autocompleteList.innerHTML = ""; // Clear suggestions
    }
  });
});
