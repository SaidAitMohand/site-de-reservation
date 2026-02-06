# Documentation du projet  
## Plateforme de réservation de salles

---

## Présentation du projet

Ce projet consiste à concevoir et développer une **plateforme full-stack de réservation de salles**, basée sur un **frontend interactif** et un **backend RESTful**.  
La plateforme permet aux propriétaires de proposer des salles à louer, aux clients de les réserver et de laisser des avis, et aux administrateurs de gerer l’ensemble du système.

---

## Architecture du projet

### Vue d’ensemble

Le projet suit une **architecture client–serveur** et sépare entre le frontend, le backend et la base de données.


      [Utilisateur Frontend]   
      | requêtes HTTP (fetch avec JWT)  
      v
      [Backend Express + Node.js]   
      | logique métier, vérification, CRUD  
      v
      [Base de données MariaDB/MySQL via Sequelize]   
      | stockage et récupération des données  
      v
      [Réponse JSON] -> frontend -> affichage utilisateur  



---

## 1. Frontend

### Fonctionnalités principales

- Page d’accueil affichant les salles disponibles.
- Formulaire d’inscription et de connexion.

**Client :**
- Rechercher et filtrer les salles.
- Visualiser les salles sur une carte interactive.
- Réserver une salle et consulter l’historique de ses réservations.
- Laisser des commentaires.

**Propriétaire :**
- Ajouter, modifier et supprimer ses propres salles.
- Consulter les commentaires des clients.
- Visualiser les statistiques (nombre de réservations, total des revenus).

**Administrateur :**
- Gérer les comptes utilisateurs.
- Supprimer ou modérer les annonces ou commentaires.

---

### Technologies utilisées

- **React.js** : bibliothèque pour construire une interface utilisateur dynamique.  
  ```bash
  npm create vite@latest client
  cd client
  npm install

- **react-router-dom** : Pour gerer la navigation et les routes.  
  ```bash
  npm install react-router-dom  
- **Tailwind CSS v4** : framework CSS pour la réactivité et le style.  
  ```bash
      npm install -D tailwindcss postcss autoprefixer  
      npx tailwindcss init -p

- **Leaflet** : Pour afficher une carte interactive et visualiser les salles.  
  ```bash
  npm install leaflet        

## 2.Backend :
### Fonctionnalités principales:
   - Authentification et gestion des rôles avec JWT.
   - Routes CRUD pour les salles, utilisateurs, réservations et commentaires.
   - Vérification des conflits de réservation.
   - Calcul des revenus pour chaque propriétaire.
   - Gestion des images de salles avec Multer.
### Technologies deployées :
   - **Node.js et express** : serveur web et routes API REST.
       ```bash
       npm install express
   - **Sequelize** : ORM pour intéragir avec la base de données MariaDB/MySQL.
     ```bash
     npm install sequelize mariadb
   - **bcryptjs** : Hacher les mots de passes des utilisateurs.
     ```bash
     npm install bcryptjs
   - **jsonwebtoken (JWT)**: Pour generer des tokens d'authentification sécurisés.
     ```bash
     npm install jsonwebtoken
   - **cors** : Pour permettre au frontend d'acceder à l'API depuis un autre domaine/port
     ```bash
     npm install cors
   - **multer** : Pour gerer l'upload et le stockage des images de salles sur le serveur.
     ```bash
     npm install multer
   - **path** : Module Node.js utilisé pour récuperer le chemin vers le dossier uploads ou les images sont stockées.
     
### Sécurité :
- Clé secrète codée en dur utilisée pour signaler les token JWT.
- Middleware "verifierRole" pour vérifier le rôle des utilisateurs avant l'accès à certaines routes.

## 3. Base de données : (SQL)
   - **phpMyAdmin** : interface graphique pour administrer la base de données.
   - **Modèles** : utilisateurs, salles, reservations et commentaires.
   - **Relations** :
         - Utilisateur 1→N Salle
         - Utilisateur 1→N Reservation
         - Salle 1→N Reservation
         - Salle 1→N Commentaire
         - Utilisateur 1→N Commentaire

**Lancement du serveur** : 
        
        ```bash
          node server.js

## Diagramme UML :


<img width="1816" height="1054" alt="625972659_1199673548999219_6277959421632264574_n" src="https://github.com/user-attachments/assets/a6ab54f3-f4bf-4302-ad00-1ad8a64e6c43" />
