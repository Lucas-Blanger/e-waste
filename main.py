import folium
from geopy.distance import geodesic
from haversine import haversine

# Pontos de coleta
pontosColeta = [
    {"nome": "ASMAR", "coordenadas": (-29.6834813, -53.8565529)},
    {"nome": "MULTIPLASPEL", "coordenadas": (-29.701601, -53.8431684)},
    {"nome": "MARINGÁ METAIS", "coordenadas": (-29.7120329, -53.8136437)},
    {"nome": "SHOPPING PRAÇA NOVA", "coordenadas": (-29.706964, -53.829359)},
    {"nome": "CAMPUS DA UFSM", "coordenadas": (-29.713287, -53.7176128)},
]

# Função para encontrar o ponto mais próximo
def encontrarPontoMaisProximo(coordenadasInicio, pontos):
    pontoMaisProximo = None
    menorDistancia = float('inf')
    
    for ponto in pontos:
        distancia = haversine(coordenadasInicio, ponto["coordenadas"])  
        if distancia < menorDistancia:
            menorDistancia = distancia
            pontoMaisProximo = ponto
    
    return pontoMaisProximo, menorDistancia

# Função para gerar o mapa com a rota
def gerarMapa(coordenadasInicio, coordenadasFim, nomePonto):
    mapa = folium.Map(location=coordenadasInicio, zoom_start=14)
    
    # Marcador para o ponto de início
    folium.Marker(location=coordenadasInicio, popup="Você", icon=folium.Icon(color='blue')).add_to(mapa)
    
    # Marcador para o ponto final
    folium.Marker(location=coordenadasFim, popup=nomePonto, icon=folium.Icon(color='green')).add_to(mapa)
    
    # Desenhar a rota
    folium.PolyLine(locations=[coordenadasInicio, coordenadasFim], color="red", weight=2.5, opacity=1).add_to(mapa)
    
    # Exibir o mapa
    return mapa


# Coordenadas fornecidas pelo usuário 
pontoUsuario = (-29.682608, -53.8133689)

# Encontrar o ponto mais próximo
pontoMaisProximo, distancia = encontrarPontoMaisProximo(pontoUsuario, pontosColeta)

# Gerar o mapa com a rota
mapa = gerarMapa(pontoUsuario, pontoMaisProximo["coordenadas"], pontoMaisProximo["nome"])

# Salvar o mapa em arquivo HTML
mapa.save("rota.html")

print(f"Rota até o ponto mais próximo: {pontoMaisProximo['nome']}")
print(f"Distância: {distancia:.2f} km")