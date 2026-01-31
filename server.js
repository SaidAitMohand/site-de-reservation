const express = require('express');
const app = express();
const port = 3000; 

//middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ORM Sequelize configuration ----------
const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize(
    'site_reservation',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mariadb',
        dialectOptions: 
        {
            timezone: 'Etc/GMT-2',
        },
        logging: false,
    }
)
//Importation des models
const utilisateurModel = require('./models/utilisateurs') ;
const utilisateur = utilisateurModel(sequelize, DataTypes);  //initialiser le model sequelize 
                                                            // (c'est un peut la table utilisateur mais en objet JS)
const salleModel = require('./models/salles'); 
const salle = salleModel(sequelize, DataTypes); //On fait la même chose pour la table salles (toujours en objet JS)
//Test de la connection a la DB
sequelize.authenticate()
    .then(() => {console.log('Connection has been established successfully.');})
    .catch(err => {console.error('Unable to connect to the database:', err);});

/*synchronisation des models avec la base de donnees 

    ps: ce code est a utiliser une seule fois pour creer les tables dans la BDD

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synchronisee !!!');})
    .catch(err => {
        console.error('Error creating database & tables:', err);});
 
*/
    //---------------- Starting the server and defining routes ----------------
//les routes
        // +++ page d'accueil +++
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
        // +++ API utilisateurs +++
app.get('/users', (req, res)=>{
    utilisateur.findAll()
    .then(users => {
         res.json(users);
    })
});
        // +++ API utilisateur par ID +++
app.get('/users/:id', (req, res)=>{
    utilisateur.findByPk(req.params.id)
    .then(user => {
        if(!user){
            return res.status(404).json({error: 'utilisateur non trouvé'});
        }
        res.json(user);
    })
});

        // +++ API ajouter utilisateur +++
app.post('/addUser', (req, res)=>{
    utilisateur.create(req.body)
    .then((user)=>{
        res.status(201).json({
            message: 'Utilisateur ajouté avec succès',
            nouveau_Utilisateur: user
        });
    })
    .catch((error)=>{
        res.status(500).json({
            erreur: error.message
        })
    });
});
//start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
