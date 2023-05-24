# microservice
micro-project
Application de gestion des régimes et des plats
Cette application vous permet de gérer les données des régimes et des plats en utilisant une combinaison 
de REST, gRPC et GraphQL. Vous pouvez insérer des données dans les tables "Régime" et "Plat" en utilisant différentes méthodes d'API.

#Fonctionnalités:
Insertion,récupération et recherche de données dans la table "Régime" via l'API REST, gRPC et GraphQL.
Insertion rcupération et recherche de données dans la table "Plat" via l'API REST, gRPC et GraphQL.
#Technologies utilisées:
Node.js
Express.js
REST
gRPC
GraphQL
Base de données (MySQL)

#Configuration:
Clonez ce référentiel sur votre machine locale.
Installez les dépendances en exécutant la commande suivante :
  npm install
.Configurez la connexion à votre base de données dans le fichier de configuration approprié.
.Assurez-vous que les ports appropriés sont ouverts pour les différentes API (REST, gRPC, GraphQL).
  
#Utilisation:
1-Démarrez le serveur en exécutant la commande suivante :
node server.js
2-Accédez aux différentes API pour insérer des données dans les tables "Régime" et "Plat" :
#REST API :
POST /regime - Insérer un nouveau régime.
POST /plat - Insérer un nouveau plat.
GET /regimes/:id : Récupère un régime spécifique en utilisant son identifiant.
GET /plats/:id : Récupère un plat spécifique en utilisant son identifiant.

#Exemple de requête POST pour insérer un régime via l'API REST :
POST /regime
Content-Type: application/json

{
  "title": "Régime alimentaire",
  "description": "Description du régime 1"
}

Auteur: Gares Hela



