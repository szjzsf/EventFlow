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
    alert('Adj meg egy képet az eseményről!');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
  const imgSrc = e.target.result;
  const modalId = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const shortDesc = desc.length > 100 ? `${desc.substring(0, 100)}...` : desc;
  
   // Add event card
  const eventCard = `
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


// ...existing code...

// login
function login(username, password) {
  // Fetch the users data from the JSON file
  fetch('./users.json')
    .then(response => response.json())
    .then(users => {
      // Find the user with the matching username and password
      const user = users.find(user => user.username === username && user.password === password);
      
      if (user) {
        alert('Sikeres bejelentkezés');
        // Perform actions after successful login
      } else {
        alert('Hibás felhasználónév vagy jelszó');
        // Perform actions after failed login
      }
    })
    .catch(error => {
      console.error('Unexpected error occurred:', error);
    });
}

// Ensure the DOM is fully loaded before adding event listeners


  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const username = document.getElementById('loginUsername').value;
      const password = document.getElementById('loginPassword').value;
      
      login(username, password);
    });
  }

    

