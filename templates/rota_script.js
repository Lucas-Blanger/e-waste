const pontosDeColeta = [
    { lat: -29.6834813, lng: -53.8565529, nome: "ASMAR" },
    { lat: -29.701601, lng: -53.8431684, nome: "MULTIPLASPEL" },
    { lat: -29.706964, lng: -53.829359, nome: "SHOPPING PRAÇA NOVA" },
    { lat: -29.713287, lng: -53.7176128, nome: "CAMPUS DA UFSM" }
];

// Função para calcular a distância entre dois pontos (Haversine formula)
function calcularDistancia(lat1, lng1, lat2, lng2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLng / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function initMap() {
    const urlParams = new URLSearchParams(window.location.search);
    const userLat = parseFloat(urlParams.get('lat'));
    const userLng = parseFloat(urlParams.get('lng'));

    const userLocation = [userLat, userLng];

    // Encontrar o ponto de coleta mais próximo
    let pontoMaisProximo = pontosDeColeta[0];
    let menorDistancia = calcularDistancia(userLat, userLng, pontoMaisProximo.lat, pontoMaisProximo.lng);

    pontosDeColeta.forEach(ponto => {
        const distancia = calcularDistancia(userLat, userLng, ponto.lat, ponto.lng);
        if (distancia < menorDistancia) {
            menorDistancia = distancia;
            pontoMaisProximo = ponto;
        }
    });

    // Criar o mapa centrado na localização do usuário
    const map = L.map('map').setView(userLocation, 11);

    // Carregar o mapa do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 15,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Marcador para a localização do usuário
    L.marker(userLocation).addTo(map).bindPopup('Sua localização').openPopup();

    // Marcador para o ponto de coleta mais próximo
    const coletaMarker = L.marker([pontoMaisProximo.lat, pontoMaisProximo.lng]).addTo(map);
    coletaMarker.bindPopup(pontoMaisProximo.nome).openPopup();

    // Traçar a rota usando OSRM
    const routingControl = L.Routing.control({
        waypoints: [
            L.latLng(userLat, userLng),
            L.latLng(pontoMaisProximo.lat, pontoMaisProximo.lng)
        ],
        router: L.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1'
        }),
        createMarker: function() { return null; } // Remove os marcadores da rota
    }).addTo(map);
}

// Iniciar o mapa ao carregar a página
window.onload = initMap;

document.getElementById("voltar").addEventListener("click", function() {
    window.open("index.html", "_blank");
});