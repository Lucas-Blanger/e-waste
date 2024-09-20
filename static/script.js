function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocalização não é suportada neste navegador.");
    }
}

function showPosition(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    
    // Enviar coordenadas para o backend
    fetch('/coordenadas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ latitude: lat, longitude: lon })
    }).then(response => {
        if (response.ok) {
            window.location.href = "/static/rota.html";  // Redireciona para a página do mapa
        }
    }).catch(error => console.log("Erro ao enviar coordenadas:", error));
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("Permissão para obter localização negada.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Localização indisponível.");
            break;
        case error.TIMEOUT:
            alert("O pedido de localização expirou.");
            break;
        case error.UNKNOWN_ERROR:
            alert("Erro desconhecido.");
            break;
    }
}