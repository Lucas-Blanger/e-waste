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

var map = L.map('map').setView([-29.6912468, -53.7889229], 12); // Coordenadas (latitude, longitude)

// Adiciona o tile do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);


L.marker([-29.6834813, -53.8565529]).addTo(map)
    .bindPopup(`
        <strong>Asmar</strong><br>
        Telefone: (55) 98111-0146<br>
        Horário: 9h - 18h
    `)


L.marker([-29.701601, -53.8431684]).addTo(map)
    .bindPopup(`
        <strong>MULTIPLASPEL</strong><br>
        Telefone e WhatsApp: (55) 3212-6074<br>
        Horário: 9h - 18h
    `)


L.marker([-29.712002, -53.8135676]).addTo(map)
    .bindPopup(`
        <strong>MARINGÁ METAIS</strong><br>
        Telefone: (55) 3213-2074<br>
        Horário: 9h - 18h
    `)


L.marker([-29.706964, -53.829359]).addTo(map)
    .bindPopup(`
        <strong>SHOPPING PRAÇA NOVA</strong><br>
        Horário: 9h - 18h
    `)



L.marker([-29.706964, -53.829359]).addTo(map)
    .bindPopup(`
        <strong>SHOPPING PRAÇA NOVA</strong><br>
        Horário: 9h - 18h
    `)


L.marker([-29.7137182, -53.7212777]).addTo(map)
    .bindPopup(`
        <strong>Anexo A - Centro de Tecnologia</strong><br>
        Horário: 9h - 18h
    `)

L.marker([-29.7144052, -53.7179593]).addTo(map)
    .bindPopup(`
        <strong>Subsolo do Hospital Universitário (Husm)</strong><br>
        Horário: 9h - 18h
    `)

    
L.marker([-29.7216763, -53.7147912]).addTo(map)
    .bindPopup(`
        <strong>Comitê Ambiental da Casa do Estudante (CEU)</strong><br>
        Horário: 9h - 18h
    `)


L.marker([-29.7146546, -53.7166214]).addTo(map)
    .bindPopup(`
        <strong>Centro de Ciências Naturais e Exatas (CCNE)</strong><br>
        Horário: 9h - 18h
    `)


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
