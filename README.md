**Documentation du projet "Plateforme de réservation de salles" :**

Ce projet consiste à concevoir et developper une plateforme full-stack de réservation de salles basée sur un frontend intercatif et un backend RESTful.  

**Architecture du projet :**  

Vue d'ensemble:  

Le projet suit une architecture client-serveur et sépare le front-end, le back-end et la base de données.  

[Utilisateur Frontend]   

      | requêtes HTTP (fetch/axios avec JWT)  
      
      v
[Backend Express + Node.js]   

      | logique métier, vérification, CRUD  
      
      v
[Base de données MariaDB/MySQL via Sequelize]   

      | stockage et récupération des données  
      
      v
[Réponse JSON] -> frontend -> affichage utilisateur  


1.Front-end :  

    Fonctionnalités principales :  
    
       - Page d’accueil affichant les salles disponibles.  
       
       - Formulaire d’inscription et de connexion.  
       
            Client :  
            
                - Rechercher et filtrer les salles.  
                
                - Visualiser les salles sur une carte.  
                
                - Réserver une salle et consulter l’historique de reservations.  
                
                - Laisser des commentaires.  
                
            Propriétaire :  
            
                - Ajouter, modifier, supprimer SES salles.  
                
                - Voir les commentaires et avis des clients.  
                
                - Consulter les statistiques (nombre de réservations, total des revenus).  
                
            Administrateur :  
            
                - Gérer les comptes utilisateurs.  
                
                - Supprimer ou modérer les annonces et commentaires.    
                
    Technologies utilisées :  
    
            - React.js : Bilblothèque pour construire une interface utilisateur dynamique  
            
                         commandes : |nmp create vite@latest client  
                         
                                     |cd client  
                                     
                                     |npm install  
                                     
            - react-router-dom : Pour gerer la navigation et les routes.  
            
                                 Commande :|npm install react-router-dom  
                                 
            - Tailwind CSS v4 : framework CSS pour la réactivité et le style.  
            
                                Commandes: |npm install -D tailwindcss postcss autoprefixer  
                                
                                           |npx tailwindcss init -p  
                                           
            - Leaflet : Pour afficher une carte interactive et visualiser les salles.  
            
                        Commande : |npm install leaflet  
                        

2.Backend :
    Fonctionnalités principales:
    - Authentification et gestion des rôles avec JWT.
    - Routes CRUD pour les salles, utilisateurs, réservations et commentaires.
    - Vérification des conflits de réservation.
    - Calcul des revenus pour chaque propriétaire.
    - Gestion des images de salles avec Multer.
    Technologies deployées :
            - Node.js et express : serveur web et routes API REST.
                                   commande: |npm install express
            - Sequelize : ORM pour intéragir avec la base de données MariaDB/MySQL.
                          Commande: |npm install sequelize mariadb
            - bcryptjs : Hacher les mots de passes des utilisateurs.
                          Commande: |npm install bcryptjs
            - jsonwebtoken (JWT): Pour generer des tokens d'authentification sécurisés.
                          Commande: |npm install jsonwebtoken
            - cors : Pour permettre au frontend d'acceder à l'API depuis un autre domaine/port
                     Commande: |npm install cors
            - multer : Pour gerer l'upload et le stockage des images de salles sur le serveur.
                       Commande: |npm install multer
            - path : Module Node.js natif utilisé pour récuperer le chemin vers le dossier uploads ou les images sont stockées.
    Sécurité :
            - Clé secrète codée en dur utilisée pour signaler les token JWT.
            - Middleware "verifierRole" pour vérifier le rôle des utilisateurs avant l'accès à certaines routes.

3. Base de données : (SQL)
   - phpMyAdmin : interface graphique pour administrer la base de données.
   - Modèles : utilisateurs, salles, reservations et commentaires.
   - Relations :
         Utilisateur 1→N Salle
         Utilisateur 1→N Reservation
         Salle 1→N Reservation
         Salle 1→N Commentaire
         Utilisateur 1→N Commentaire

**Lancement du serveur** : Commande: |node server.js

