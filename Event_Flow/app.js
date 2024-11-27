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

(() => {
  const counter = (() => {
    const input = document.getElementById('counter-input'),
      display = document.getElementById('counter-display'),
      changeEvent = (evt) => display.innerHTML = evt.target.value.length,
      //getInput = () => input.value,
      countEvent = () => input.addEventListener('keyup', changeEvent),
      init = () => countEvent();

    return {
      init: init
    }

  })();

  counter.init();

})();



//események megjelenítése a jsonból
/*fetch("./database.json").then(response => response.json()).then(data => {
  console.log(data);
  data.map(function(event) {
    document.getElementById('eventCards').innerHTML += `
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
          </div>`})});*/