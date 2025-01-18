fetch('/api/events')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    return response.json();
  })
  .then((data) => {
    console.log(data);
    data.forEach(function (event) {
      const { imgSrc, name, date, time, utca, hazSzam, type, desc, isPrivate } = event;
      const modalId = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const shortDesc = desc.length > 100 ? `${desc.substring(0, 100)}...` : desc;
      document.getElementById('eventCards').innerHTML += `
      <div class="col-md-3 event-card">
        <div class="card h-100" data-bs-toggle="modal" data-bs-target="#${modalId}">
          <div class="event-image">
            <img src="${imgSrc}" class="kartya-kep card-img-top" alt="Event Image" />
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${name}</h5>
            <p class="card-text flex-grow-1">${shortDesc}</p>
            <p class="card-text"><strong>${type}</strong></p>
            <p class="card-text"><small class="text-muted">${isPrivate ? 'Privát esemény' : 'Nyilvános esemény'}</small></p>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="${modalId}Label">${name}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <img src="${imgSrc}" class="img-fluid mb-3" alt="Event Image" />
              <p><strong>Dátum:</strong> ${date}, ${time}</p>
              <p><strong>Helyszín:</strong> Miskolc, ${utca}, ${hazSzam}</p>
              <p><strong>Leírás:</strong> <span class="modal-desc">${desc}</span></p>
              <p><strong>Típus:</strong> ${type}</p>
              <p><strong>Státusz:</strong> ${isPrivate ? 'Privát esemény' : 'Nyilvános esemény'}</p>
            </div>
          </div>
        </div>
      </div>
      `;
    });
  })
  .catch((error) => console.error('Error fetching events:', error));

// Add a new event
function addEvent(eventData) {
  const formData = new FormData();
  formData.append('image', eventData.imageFile);

  // First upload the image
  fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      return response.json();
    })
    .then((imageData) => {
      // Use the uploaded image URL in the event data
      eventData.imgSrc = imageData.imageUrl;
      delete eventData.imageFile;

      return fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to add event');
      }
      return response.json();
    })
    .then((data) => {
      console.log('Event added:', data);
      location.reload(); // Refresh the page to show the new event
    })
    .catch((error) => console.error('Error adding event:', error));
}

document.getElementById('createEventBtn').addEventListener('click', function () {
  const name = document.getElementById('eventName').value;
  const type = document.getElementById('eventType').value;
  const desc = document.getElementById('counter-input').value;
  const utca = document.getElementById('UtcaNev').value;
  const hazSzam = document.getElementById('Hazszam').value;
  const date = document.getElementById('eventDate').value;
  const time = document.getElementById('eventTime').value;
  const isPrivate = document.getElementById('privateEvent').checked;
  const imgInput = document.getElementById('eventImage');

  if (imgInput.files.length === 0) {
    alert('Adj meg egy képet az eseményről!');
    return;
  }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('type', type);
  formData.append('desc', desc);
  formData.append('utca', utca);
  formData.append('hazSzam', hazSzam);
  formData.append('date', date);
  formData.append('time', time);
  formData.append('isPrivate', isPrivate);
  formData.append('image', imgInput.files[0]);

  fetch('/api/events', {
    method: 'POST',
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to add event');
      }
      return response.json();
    })
    .then((data) => {
      console.log('Event added:', data);
      location.reload(); // Refresh the page to show the new event
    })
    .catch((error) => console.error('Error adding event:', error));
});

// User login
function login(username, password) {
  fetch('/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      return response.json();
    })
    .then((data) => {
      alert('Sikeres bejelentkezés');
      console.log('User:', data.user);
    })
    .catch((error) => {
      console.error('Login error:', error);
      alert('Hibás felhasználónév vagy jelszó');
    });
}

document.getElementById('loginBtn').addEventListener('click', () => {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  login(username, password);
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

document.getElementById("eventFilterKoncert").addEventListener("click", () => {
  const eventCards = document.getElementsByClassName("event-card");

  for (let card of eventCards) {
    if (card.textContent.toLowerCase().includes("koncert")) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  }
});

document.getElementById("eventFilterHazibuli").addEventListener("click", () => {
  const eventCards = document.getElementsByClassName("event-card");

  for (let card of eventCards) {
    if (card.textContent.toLowerCase().includes("házibuli")) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  }
});

document.getElementById("eventFilterKertiparty").addEventListener("click", () => {
  const eventCards = document.getElementsByClassName("event-card");

  for (let card of eventCards) {
    if (card.textContent.toLowerCase().includes("kerti party")) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  }
});

document.getElementById("eventFilterRendezveny").addEventListener("click", () => {
  const eventCards = document.getElementsByClassName("event-card");

  for (let card of eventCards) {
    if (card.textContent.toLowerCase().includes("rendezvény")) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  }
});

document.getElementById("eventFilterOsszes").addEventListener("click", () => {
  const eventCards = document.getElementsByClassName("event-card");

  for (let card of eventCards) {
    card.style.display = "block";
  }
});

// Ensure modals are properly handled for ARIA
document.addEventListener('focusin', (event) => {
  const modal = document.querySelector('.modal.show');
  if (modal && !modal.contains(event.target)) {
    event.stopPropagation();
    modal.focus();
  }
});