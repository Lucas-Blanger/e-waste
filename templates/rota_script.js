const pontosDeColeta = [
    { lat: -29.6834813, lng: -53.8565529, nome: "ASMAR" },
    { lat: -29.701601, lng: -53.8431684, nome: "MULTIPLASPEL" },
    { lat: -29.712002, lng: -53.8135676, nome: "MARINGÁ METAIS" },
    { lat: -29.706964, lng: -53.829359, nome: "SHOPPING PRAÇA NOVA" },
    { lat: -29.7137182, lng: -53.7212777, nome: "Anexo A - Centro de Tecnologia" },
    { lat: -29.7144052, lng: -53.7179593, nome: "Subsolo do Hospital Universitário (Husm)" },
    { lat: -29.7216763, lng: -53.7147912, nome: "Comitê Ambiental da Casa do Estudante (CEU)" },
    { lat: -29.7146546, lng: -53.7166214, nome: "Centro de Ciências Naturais e Exatas (CCNE)" }

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
        language: 'pt',
        maxZoom: 20,
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
    window.location.href = "index.html";
});