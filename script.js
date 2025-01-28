let selectedDate;
let selectedYear;
let selectedMonth;
let selectedDay;
let selectedCamera = 'FHAZ'; 

function navigateToPage() {
  const pic_of_day = document.getElementById("drop-down");
  const url = pic_of_day.value;
  if (url) {
    window.location.href = url;
  }
}

function fetchPhotos(selectedYear, selectedDay, selectedMonth) {
  fetch(
    `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?camera=${selectedCamera}&earth_date=${selectedYear}-${selectedMonth}-${selectedDay}&api_key=p1q6pMejk5MK07v8psflT6wWzBFDOQ57HEaF6hav`
  )
    .then((res) => res.json())
    .then((data) => {
      const container = document.querySelector("#photos-container");
      container.innerHTML = "";
      
      if (data.photos.length === 0) {
        container.innerHTML = `<p>No photos available from ${selectedCamera} on this date. Please try another date or camera.</p>`;
        return;
      }

      const photoCount = Math.min(6, data.photos.length);
      for (let i = 0; i < photoCount; i++) {
        const photo = data.photos[i].img_src;
        const img = document.createElement("img");
        img.src = photo;
        img.alt = `Mars Rover photo from ${selectedCamera}`;
        document.getElementById("photos-container").appendChild(img);
      }
    })
    .catch(error => {
      console.error('Error fetching photos:', error);
      const container = document.querySelector("#photos-container");
      container.innerHTML = '<p>Error loading photos. Please try again later.</p>';
    });
}

flatpickr("#date-picker", {
  dateFormat: "Y-m-d",
  minDate: "1900-01-01",
  maxDate: "2100-12-31",
  onChange: (selectedDates, dateStr) => {
    selectedDate = dateStr;
    const date = new Date(selectedDates[0]);

    selectedYear = date.getFullYear();
    selectedMonth = date.getMonth() + 1;
    selectedDay = date.getDate();
    
    fetchPhotos(selectedYear, selectedDay, selectedMonth);
  },
});

function selectCamera() {
  const selection = document.getElementById("selectCamera");
  selectedCamera = selection.value;
  // Refetch photos with new camera selection if a date is already selected
  if (selectedYear && selectedMonth && selectedDay) {
    fetchPhotos(selectedYear, selectedDay, selectedMonth);
  }
}
