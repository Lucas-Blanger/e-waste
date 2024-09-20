let index = 0;
const images = document.querySelectorAll('.carousel-images img');
const totalImages = images.length;

function showNextImage() {
    index = (index + 1) % totalImages;
    updateCarousel();
}

function showPrevImage() {
    index = (index - 1 + totalImages) % totalImages;
    updateCarousel();
}

function updateCarousel() {
    const offset = -index * 100;
    document.querySelector('.carousel-images').style.transform = `translateX(${offset}%)`;
}

document.getElementById('next-btn').addEventListener('click', () => {
    console.log("Próxima imagem");
    showNextImage();
});

document.getElementById('prev-btn').addEventListener('click', () => {
    console.log("Imagem anterior");
    showPrevImage();
});

document.getElementById('next-btn').addEventListener('click', showNextImage);
document.getElementById('prev-btn').addEventListener('click', showPrevImage);
setInterval(showNextImage, 3000);

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
    
    fetch('/coordenadas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ latitude: lat, longitude: lon })
    }).then(response => {
        if (response.ok) {
            window.location.href = "/static/rota.html";  
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
