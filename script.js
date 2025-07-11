const API_URL = 'http://localhost:5000/api/devices';

async function fetchDevices() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const deviceList = document.getElementById('deviceList');
    deviceList.innerHTML = '';

    data.forEach(device => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${device.serialNumber}</td>
        <td>${device.location}</td>
        <td>${device.latitude}</td>
        <td>${device.longitude}</td>
        <td>${device.status}</td>
        <td>
          <button 
            class="btn ${device.status === 'ON' ? 'btn-success' : 'btn-secondary'}"
            onclick="toggleDevice('${device._id}')"
          >
            ${device.status === 'ON' ? 'Turn OFF' : 'Turn ON'}
          </button>
        </td>
      `;
      deviceList.appendChild(row);
    });

  } catch (err) {
    alert('Error fetching devices');
    console.error(err);
  }
}

async function addDevice() {
  const serialNumber = document.getElementById('serialNumber').value;
  const location = document.getElementById('location').value;
  const lat = document.getElementById('latitude').value;
  const lng = document.getElementById('longitude').value;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serialNumber, location, latitude, longitude, status: 'off' })
    });

    if (!response.ok) throw new Error('Failed to add device');

    document.getElementById('serialNumber').value = '';
    document.getElementById('location').value = '';
    fetchDevices();

  } catch (err) {
    alert('Error adding device');
    console.error(err);
  }
}

async function toggleDevice(id) {
  try {
    const res = await fetch(`http://localhost:5000/api/devices/${id}/toggle`, {
      method: 'PATCH',
    });

    if (!res.ok) throw new Error('Failed to toggle');

    await fetchDevices(); // Refresh table to reflect changes
  } catch (err) {
    console.error(err);
    alert("Error toggling device");
  }
}


// Leaflet map
const map = L.map('map').setView([9.05, 7.49], 6); // Centered on Abuja

//L.tileLayer('https://maps.geoapify.com/v1/tile/positron-blue/{z}/{x}/{y}@2x.png?apiKey=YOUR_API_KEY', {
//  attribution: '&copy; OpenStreetMap contributors'
//}).addTo(map);

L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
  subdomains:['mt0','mt1','mt2','mt3']
}).addTo(map);

map.on('click', function (e) {
  document.getElementById('latitude').value = e.latlng.lat;
  document.getElementById('longitude').value = e.latlng.lng;
});

fetchDevices();