document.getElementById('getLocation').addEventListener('click', function() {
    document.getElementById('loading').style.display = 'block';
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        alert("Geolocalização não é suportada pelo seu navegador.");
        document.getElementById('loading').style.display = 'none';
    }
});

function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    window.open(`mapa.html?lat=${latitude}&lng=${longitude}`, '_blank');
    document.getElementById('loading').style.display = 'none';
}
function error() {
    alert("Não foi possível obter sua localização.");
    document.getElementById('loading').style.display = 'none';
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


function scrollToSectionFeedback() {
    const section = document.getElementById("feedback");
    section.scrollIntoView({ behavior: "smooth" });
}

function enviarFeedback() {
    const feedback = document.getElementById("areaFeedback").value;

    fetch('salvarFeedback.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'feedback=' + encodeURIComponent(feedback)
    })
    .then(response => response.text())
    .then(data => {
        console.log('Sucesso:', data);
        alert('Feedback enviado com sucesso!');
        document.getElementById("areaFeedback").value = ''; 
    })
    .catch((error) => {
        console.error('Erro:', error);
    });
}
