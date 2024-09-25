import os
from flask import Flask, request, jsonify, render_template
import folium
from haversine import haversine
import osmnx as ox
import networkx as nx

app = Flask(__name__)

# Lista de pontos de coleta
pontos_coleta = [
    {"nome": "ASMAR", "coordenadas": (-29.6834813, -53.8565529)},
    {"nome": "MULTIPLASPEL", "coordenadas": (-29.701601, -53.8431684)},
    {"nome": "MARINGÁ METAIS", "coordenadas": (-29.7120329, -53.8136437)},
    {"nome": "SHOPPING PRAÇA NOVA", "coordenadas": (-29.706964, -53.829359)},
    {"nome": "CAMPUS DA UFSM", "coordenadas": (-29.713287, -53.7176128)},
]

# Variável global para armazenar a localização do usuário
user_location = None

def calcular_distancia(coordenadas_inicio, pontos):
    """Calcula o ponto de coleta mais próximo com base nas coordenadas."""
    try:
        ponto_mais_proximo = min(pontos, key=lambda ponto: haversine(coordenadas_inicio, ponto["coordenadas"]))
        menor_distancia = haversine(coordenadas_inicio, ponto_mais_proximo["coordenadas"])
        return ponto_mais_proximo, menor_distancia
    except ValueError:
        return None, float('inf')

def gerar_mapa(coordenadas_inicio, coordenadas_fim, nome_ponto):
    """Gera o mapa com a rota entre o ponto inicial e final."""
    try:
        # Criação da rede de ruas
        G = ox.graph_from_point(coordenadas_inicio, dist=5000, network_type='drive', retain_all=True, simplify=True)
        G = ox.add_edge_speeds(G)
        G = ox.add_edge_travel_times(G)

        # Encontrar nós mais próximos no grafo
        origem = ox.nearest_nodes(G, coordenadas_inicio[1], coordenadas_inicio[0])
        destino = ox.nearest_nodes(G, coordenadas_fim[1], coordenadas_fim[0])

        # Calcula a rota mais rápida
        rota = nx.shortest_path(G, origem, destino, weight='travel_time')
        coordenadas_rota = [(G.nodes[n]['y'], G.nodes[n]['x']) for n in rota]

        # Gera o mapa
        mapa = folium.Map(location=coordenadas_inicio, zoom_start=14)
        folium.Marker(location=coordenadas_inicio, popup="Você", icon=folium.Icon(color='blue')).add_to(mapa)
        folium.Marker(location=coordenadas_fim, popup=nome_ponto, icon=folium.Icon(color='green')).add_to(mapa)
        folium.PolyLine(locations=coordenadas_rota, color="red", weight=2.5).add_to(mapa)

        return mapa
    except Exception as e:
        print(f"Erro ao gerar o mapa: {e}")
        return None

@app.route('/')
def index():
    """Renderiza a página inicial."""
    return render_template('index.html')

@app.route('/coordenadas', methods=['POST'])
def receber_coordenadas():
    """Recebe as coordenadas do usuário e atualiza a variável global."""
    global user_location
    data = request.json
    user_location = (data.get('latitude'), data.get('longitude'))
    if user_location:
        print(f"Coordenadas recebidas: {user_location}")
        return jsonify(success=True)
    return jsonify(success=False), 400

@app.route('/rota')
def gerar_rota():
    """Gera a rota e retorna o mapa."""
    if not user_location:
        return "Localização não encontrada", 400

    ponto_mais_proximo, distancia = calcular_distancia(user_location, pontos_coleta)
    
    if ponto_mais_proximo:
        mapa = gerar_mapa(user_location, ponto_mais_proximo["coordenadas"], ponto_mais_proximo["nome"])
        if mapa:
            # Garante que o diretório 'static' exista
            caminho_arquivo = os.path.join('static', 'rota.html')
            if not os.path.exists('static'):
                os.makedirs('static')
            
            # Salva o mapa em 'rota.html'
            mapa.save(caminho_arquivo)
            print("Arquivo rota.html salvo com sucesso.")
            return render_template('rota.html', ponto=ponto_mais_proximo['nome'], distancia=distancia)
        else:
            return "Erro ao gerar o mapa", 500
    else:
        return "Nenhum ponto de coleta encontrado", 404
if __name__ == '__main__':
    app.run(debug=True)
