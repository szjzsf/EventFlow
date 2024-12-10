document.getElementById('createEventBtn').addEventListener('click', function () {
  const nameElement = document.getElementById('eventName');
  const typeElement = document.getElementById('eventType');
  const descElement = document.getElementById('counter-input'); 
  const utcaElement = document.getElementById('UtcaNev');
  const hazSzamElement = document.getElementById('Hazszam');
  const imgInputElement = document.getElementById('eventImage');
  const isPrivateElement = document.getElementById('privateEvent');
  const dateElement = document.getElementById('eventDate');
  const eventTimeElement = document.getElementById('eventTime');

  const name = nameElement ? nameElement.value : '';
  const type = typeElement ? typeElement.value : '';
  const desc = descElement ? descElement.value : '';
  const utca = utcaElement ? utcaElement.value : '';
  const hazSzam = hazSzamElement ? hazSzamElement.value : '';
  const imgInput = imgInputElement ? imgInputElement : null;
  const isPrivate = isPrivateElement ? isPrivateElement.checked : false;
  const date = dateElement ? dateElement.value : '';
  const time = eventTimeElement ? eventTimeElement.value : '';

  if (imgInput.files.length === 0) {
    alert('Please upload an image for the event!');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const imgSrc = e.target.result;

    // Add event card
    const eventCard = `
     <div class="col-md-3 event-card">
        <div class="card">
          <div class="event-image">
            <img src="${imgSrc}" class="kartya-kep card-img-top" alt="Event Image" />
          </div>
          <div class="card-body">
            <h5 class="card-title">${name}</h5>
            <p class="card-text">Dátum: ${date} ${time}</p>
            <p class="card-text">Helyszín: Miskolc, ${utca}, ${hazSzam}</p>
            <p class="d-inline-block text-truncate card-text" style="max-width: 275px;">${desc}</p>
            <p class="card-text"><small class="text-muted">${isPrivate ? 'Privát esemény' : 'Nyilvános esemény'}</small></p>
          </div>
        </div>
      </div>
    `;

    document.getElementById('eventCards').innerHTML += eventCard;

    // Close modal
    const modalElement = document.getElementById('createEventModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    }
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
      const { imgSrc, name,date,time, utca,hazSzam, desc, isPrivate } = event;
      document.getElementById('eventCards').innerHTML += `
      <div class="col-md-3 event-card">
        <div class="card">
          <div class="event-image">
            <img src="${imgSrc}" class="kartya-kep card-img-top" alt="Event Image" />
          </div>
          <div class="card-body">
            <h5 class="card-title">${name}</h5>
            <p class="card-text">Dátum: ${date} ${time}</p>
            <p class="card-text">Helyszín: Miskolc, ${utca}, ${hazSzam}</p>
            <p class="d-inline-block text-truncate card-text" style="max-width: 275px;">${desc}</p>
            <p class="card-text"><small class="text-muted">${isPrivate ? 'Privát esemény' : 'Nyilvános esemény'}</small></p>
          </div>
        </div>
      </div>`;
    });
  });

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