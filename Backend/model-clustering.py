from sklearn.metrics import silhouette_score
from sklearn.impute import SimpleImputer
import numpy as np
import pandas as pd
import requests
import json

from sklearn.preprocessing import LabelEncoder, OneHotEncoder
from sklearn.cluster import KMeans

# Cargar los datos de las trazas desde un archivo CSV
traces_data = pd.read_csv('traces.csv')
# Calcular la frecuencia de acciones específicas
filtered_traces = traces_data[(traces_data['verb'] == 'dragged') & (
    traces_data['object_type'] == 'tsiuna')]
machista_traces = traces_data[(traces_data['verb'] == 'selected') & (
    traces_data['object_type'] == 'machista')]

# Mapeo de las características
feature_mapping = {
    'actor': LabelEncoder(),
    'verb': LabelEncoder(),
    'object': LabelEncoder(),
    'target': LabelEncoder(),
    'object_type': LabelEncoder()
}

# Realizar el mapeo de características
for feature, encoder in feature_mapping.items():
    encoded_feature = encoder.fit_transform(traces_data[feature])
    traces_data[feature] = encoded_feature

# Codificar las características categóricas con one-hot encoding
encoder = OneHotEncoder(sparse=False)
categorical_features = ['actor', 'verb', 'object', 'target', 'object_type']
encoded_features = encoder.fit_transform(traces_data[categorical_features])
encoded_features_df = pd.DataFrame(
    encoded_features, columns=encoder.get_feature_names_out(categorical_features))
traces_data = pd.concat([traces_data, encoded_features_df], axis=1)
traces_data.drop('idtraces', axis=1, inplace=True)


# Obtener las características numéricas y codificadas
numeric_features = ['session_id', 'timestamp', 'success']
encoded_features = traces_data.drop(numeric_features, axis=1)

# Agrupar las trazas por usuario y obtener las características agregadas por usuario
user_features = encoded_features.groupby('user_id').mean()

# Calcular las interacciones totales por usuario
user_interactions = traces_data.groupby('user_id').size()
machista_frequency = machista_traces.groupby('user_id').size()

user_features['machista_frequency'] = machista_frequency
user_features['interactions_total'] = user_interactions
user_features['machista_frequency'].fillna(0, inplace=True)


action_frequency = filtered_traces.groupby('user_id').size()
user_features['action_frequency'] = action_frequency
user_features['action_frequency'].fillna(0, inplace=True)


# Crear un imputador para llenar los valores NaN con la media de cada columna
imputer = SimpleImputer(strategy='mean')
user_features_imputed = imputer.fit_transform(user_features)
# Aplicar el algoritmo de K-means a los usuarios
kmeans = KMeans(n_clusters=3, random_state=42, n_init=100)
kmeans.fit(user_features_imputed)


# Obtener las etiquetas de los clusters asignados a cada usuario
user_cluster_labels = kmeans.labels_

# Crear un diccionario para almacenar la asignación de clusters por usuario
user_cluster_mapping = {user_id: cluster_label for user_id,
                        cluster_label in zip(user_features.index, user_cluster_labels)}

# Agregar la asignación de clusters al DataFrame de las trazas
traces_data['user_cluster_label'] = traces_data['user_id'].map(
    user_cluster_mapping)

# Agrupar por user_id y ver en qué cluster está cada id_user
grouped_data = traces_data.groupby('user_id')['user_cluster_label'].apply(list)

# Agrupar por user_id y ver en qué cluster está cada id_user
grouped_data = traces_data.groupby(
    'user_id')['user_cluster_label'].apply(lambda x: x.iloc[0])

# Ver los resultados


user_cluster_labels = kmeans.labels_
cluster_info = {}
unique_clusters = np.unique(user_cluster_labels)

for cluster_label in unique_clusters:
    cluster_info[cluster_label] = {}
for user_id, cluster_label in grouped_data.items():
    # Obtener las características del usuario
    user_row = user_features.loc[user_id]

    # Inicializar la clave 'users' si no existe
    if 'users' not in cluster_info[cluster_label]:
        cluster_info[cluster_label]['users'] = []

    # Agregar el usuario al clúster correspondiente
    cluster_info[cluster_label]['users'].append(user_id)

    # Actualizar las características promedio del clúster
    if 'average_features' not in cluster_info[cluster_label]:
        cluster_info[cluster_label]['average_features'] = user_row
    else:
        cluster_info[cluster_label]['average_features'] += user_row
cluster_list = []
# Calcular las características promedio dividiendo entre el número de usuarios en cada clúster
for cluster_label, info in cluster_info.items():
    num_users = len(info['users'])
    info['average_features'] /= num_users
for cluster_label, info in cluster_info.items():
    print("Cluster:", cluster_label)
    print("Número de usuarios:", len(info['users']))
    print("Características promedio:")
    print(info['average_features'])
    print("---")
    result_obj = {"cluster": str(cluster_label), "users": str(len(
        info['users'])), "machista_frequency": str(info['average_features']['machista_frequency']),
        "interactions_total": str(info['average_features']['interactions_total']),
        "action_frequency": str(info['average_features']['action_frequency'])}
    cluster_list.append(result_obj)


silhouette_avg = silhouette_score(user_features_imputed, user_cluster_labels)
print("Coeficiente de Silueta:", silhouette_avg)

# Convertir los resultados a un diccionario
results_list = []
print(grouped_data)
for user_id, cluster_label in grouped_data.items():
    result_obj = {"id": user_id, "cluster": cluster_label}
    results_list.append(result_obj)
# Enviar los resultados al endpoint
endpoint = "http://localhost:4000/api/model"
headers = {"Content-Type": "application/json"}

# Convert int32 to int for JSON serialization
silhouette_avg = float(silhouette_avg)

# Convert the results to a dictionary
results_dict = {
    "user_list": results_list,
    "clusters": cluster_list,
    "silhouette_avg": silhouette_avg
}

response = requests.post(endpoint, data=json.dumps(
    results_dict), headers=headers)

# Verificar el código de respuesta de la solicitud POST
if response.status_code == 200:
    print("Resultados enviados correctamente.")
else:
    print("Error al enviar los resultados:", response.status_code)
