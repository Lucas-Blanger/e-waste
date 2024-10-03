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

let currentIndex = 0;
    const images = document.querySelectorAll('.carousel-image');
    const totalImages = images.length;

    function showImage(index) {
        images.forEach((img, i) => {
            img.style.display = (i === index) ? 'block' : 'none';
        });
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % totalImages;
        showImage(currentIndex);
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        showImage(currentIndex);
    }

    setInterval(nextImage, 4000); 

    // Eventos para os botões de navegação
    document.getElementById('nextBtn').addEventListener('click', nextImage);
    document.getElementById('prevBtn').addEventListener('click', prevImage);

    showImage(currentIndex);
function toggleInfo(index) {
    const info = document.getElementById(`info-${index}`);
    const isVisible = info.style.display === "block";

    document.querySelectorAll('.point-info').forEach(el => el.style.display = 'none');

    if (!isVisible) {
        info.style.display = "block";
    }
}

function scrollToSectionPoints() {
    const section = document.getElementById("points-section");
    section.scrollIntoView({ behavior: "smooth" });
}

function scrollToSectionAbout() {
    const section = document.getElementById("sobre");
    section.scrollIntoView({ behavior: "smooth" });
}

document.getElementById("button-prefeitura").addEventListener("click", function() {
    window.open("https://www.santamaria.rs.gov.br/descarte-legal", "_blank");
});