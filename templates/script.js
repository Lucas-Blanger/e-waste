document.getElementById('getLocation').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        alert("Geolocalização não é suportada pelo seu navegador.");
    }
});

function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Redirecionar para a página do mapa com as coordenadas na URL
    window.location.href = `mapa.html?lat=${latitude}&lng=${longitude}`;
}

function error() {
    alert("Não foi possível obter sua localização.");
}