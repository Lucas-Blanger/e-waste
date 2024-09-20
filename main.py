from flask import Flask, request, jsonify, render_template
import folium
from haversine import haversine
import osmnx as ox
import networkx as nx

app = Flask(__name__)

pontosColeta = [
    {"nome": "ASMAR", "coordenadas": (-29.6834813, -53.8565529)},
    {"nome": "MULTIPLASPEL", "coordenadas": (-29.701601, -53.8431684)},
    {"nome": "MARINGÁ METAIS", "coordenadas": (-29.7120329, -53.8136437)},
    {"nome": "SHOPPING PRAÇA NOVA", "coordenadas": (-29.706964, -53.829359)},
    {"nome": "CAMPUS DA UFSM", "coordenadas": (-29.713287, -53.7176128)},
]

user_location = None

def encontrarPontoMaisProximo(coordenadasInicio, pontos):
    pontoMaisProximo = None
    menorDistancia = float('inf')
    
    for ponto in pontos:
        distancia = haversine(coordenadasInicio, ponto["coordenadas"])
        if distancia < menorDistancia:
            menorDistancia = distancia
            pontoMaisProximo = ponto
    
    return pontoMaisProximo, menorDistancia

def gerarMapaComRota(coordenadasInicio, coordenadasFim, nomePonto):
    G = ox.graph_from_point(coordenadasInicio, dist=5000, network_type='walk')

    # Encontrar os nós mais próximos no grafo para as coordenadas de início e fim
    origem = ox.nearest_nodes(G, coordenadasInicio[1], coordenadasInicio[0])
    destino = ox.nearest_nodes(G, coordenadasFim[1], coordenadasFim[0])

    # Calcular a rota mais curta
    rota = nx.shortest_path(G, origem, destino, weight='length')

    # Obter as coordenadas da rota
    coordenadasRota = [(G.nodes[n]['y'], G.nodes[n]['x']) for n in rota]

    # Gerar o mapa com a rota
    mapa = folium.Map(location=coordenadasInicio, zoom_start=14)
    
    # Marcador para o ponto de início
    folium.Marker(location=coordenadasInicio, popup="Você", icon=folium.Icon(color='blue')).add_to(mapa)
    
    # Marcador para o ponto final
    folium.Marker(location=coordenadasFim, popup=nomePonto, icon=folium.Icon(color='green')).add_to(mapa)
    
    # Desenhar a rota no mapa
    folium.PolyLine(locations=coordenadasRota, color="red", weight=2.5, opacity=1).add_to(mapa)
    
    return mapa

@app.route('/')
def index():
    return render_template('index.html')  

@app.route('/coordenadas', methods=['POST'])
def coordenadas():
    global user_location
    data = request.json
    user_location = (data['latitude'], data['longitude'])
    return jsonify(success=True)

@app.route('/rota')
def rota():
    if user_location:
        pontoMaisProximo, distancia = encontrarPontoMaisProximo(user_location, pontosColeta)
        mapa = gerarMapaComRota(user_location, pontoMaisProximo["coordenadas"], pontoMaisProximo["nome"])
        mapa.save("static/rota.html")  
        return render_template('rota.html', ponto=pontoMaisProximo['nome'], distancia=distancia)
    else:
        return "Localização não encontrada", 400
    
if __name__ == '__main__':
    app.run(debug=True)
