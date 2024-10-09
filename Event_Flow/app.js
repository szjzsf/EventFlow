/*document.getElementById('createEventBtn').addEventListener('click', function() {
    const name = document.getElementById('eventName').value;
    const type = document.getElementById('eventType').value;
    const desc = document.getElementById('eventDesc').value;
    const location = document.getElementById('eventLocation').value;
    const imgSrc = document.getElementById('eventImage').value; // Assuming 'eventImage' is an input field for image source
    const isPrivate = document.getElementById('privateEvent').checked;

    


    // Eseménykártya hozzáadása
    const eventCard = `
        <div class="col-md-3 event-card">
            <div class="card">
                <div class="event-image">
                <img src="${imgSrc}" /> <!-- Use the image source from the input -->
                </div>
                <div class="card-body">
                    <h5 class="card-title">${name}</h5>
                    <p class="card-text">Helyszín: ${location}</p>
                    <p class="card-text">Leírás: ${desc}</p>
                    <p class="card-text"><small class="text-muted">${isPrivate ? 'Privát esemény' : 'Nyilvános esemény'}</small></p>
                </div>
            </div>
        </div>
    `;
   
    document.getElementById('eventCards').innerHTML += eventCard;

    // Modal bezárása
    const modal = bootstrap.Modal.getInstance(document.getElementById('createEventModal'));
    modal.hide();
});*/

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
                    <img src="${imgSrc} " class="col-md-12" /> <!-- Use the image source from the input -->
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${name}</h5>
                        <p class="card-text">Helyszín: ${location}</p>
                        <p class="card-text">Leírás: ${desc}</p>
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


    
