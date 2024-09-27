const myAPIKey = 'e7caa5f08f694add898e03a656bcdd51';

// Inicializa el mapa
const map = L.map('map').setView([-34.901112, -56.164532], 10);

// Agrega las capas del mapa
L.tileLayer(`https://maps.geoapify.com/v1/tile/dark-matter/{z}/{x}/{y}.png?apiKey=${myAPIKey}`, {
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

// Íconos personalizados
const defaultIcon = L.icon({
  iconUrl: 'path/to/default-icon.png',
  iconSize: [38, 95],
});

const hoverIcon = L.icon({
  iconUrl: 'path/to/hover-icon.png',
  iconSize: [38, 95],
});

// Lista de ubicaciones con coordenadas
const locations = [
  {
    name: "Montevideo",
    coords: [-56.164532, -34.901112],
    element: document.querySelector("#location-montevideo")
  },
  {
    name: "Carlsbad",
    coords: [-104.2443, 32.4207],
    element: document.querySelector("#location-carlsbad")
  },
  {
    name: "Hobbs",
    coords: [-103.1361, 32.7092],
    element: document.querySelector("#location-hobbs")
  }
];

// Selección de ubicaciones
let selectedLocation = null;
locations.forEach((location) => {
  location.element.addEventListener("click", () => {
    selectedLocation = location.name;
    centerMap(location.coords[1], location.coords[0]);
    highlightLocation(location.element);
    localStorage.setItem("selectedLocation", selectedLocation);
  });
});

// Función para centrar el mapa en una ubicación
function centerMap(lat, lng) {
  map.setView([lng, lat], 13);
}

// Función para resaltar una ubicación seleccionada
function highlightLocation(selectedElement) {
  locations.forEach((location) => {
    location.element.classList.remove("expanded");
  });
  selectedElement.classList.add("expanded");
}

// Agrega los marcadores al mapa
locations.forEach((location) => {
  const marker = L.marker(location.coords, { icon: defaultIcon }).addTo(map)
    .bindPopup(location.name);

  location.marker = marker;

  marker.on("click", () => {
    location.element.scrollIntoView({ behavior: "smooth" });
    highlightLocation(location.element);
  });

  marker.on("mouseover", function () {
    marker.setIcon(hoverIcon);
  });

  marker.on("mouseout", function () {
    marker.setIcon(defaultIcon);
  });
});

// Manejo de la selección de suscripción
let selectedPlan = null;
const plans = document.querySelectorAll(".subscription-card");
plans.forEach((plan) => {
  plan.addEventListener("click", () => {
    selectedPlan = plan.querySelector("h3").textContent;
    plans.forEach(p => p.classList.remove("expanded"));
    plan.classList.add("expanded");
    localStorage.setItem("selectedPlan", selectedPlan);
  });
});

// Botón de pago
document.getElementById("pay-btn").addEventListener("click", () => {
  const selectedLocation = localStorage.getItem("selectedLocation");
  const selectedPlan = localStorage.getItem("selectedPlan");

  if (selectedLocation && selectedPlan) {
    // Enviar los datos al servidor para realizar el pago
    fetch("procesar_pago.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: selectedLocation,
        plan: selectedPlan
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("Pago realizado con éxito.");
        // Lógica para generar factura aquí
      } else {
        alert("Error en el pago.");
      }
    })
    .catch(error => console.error("Error:", error));
  } else {
    alert("Por favor, selecciona una ubicación y un plan.");
  }
});