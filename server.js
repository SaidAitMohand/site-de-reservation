const express = require('express');
const app = express();
const port = 3000; 

//middlewares
app.use(express.static('public'));
app.use(express.json());

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
//exemple de quelque utilisateurs
const utilisateurs = [
    {
        name: 'user3',
        username: 'username3',
        password: 'password1',
        role: 'admin'
    },
    {
        name: 'user4',
        username: 'username4',
        password: 'password2',
        role: 'client'
    }
];
//Importation des models
const utilisateurModel = require('./models/utilisateurs') ;
const utilisateur = utilisateurModel(sequelize, DataTypes);  //initialiser le model sequelize 
                                                            // (c'est un peut la table utilisateur mais en objet JS)

//Test de la connection a la DB
sequelize.authenticate()
    .then(() => {console.log('Connection has been established successfully.');})
    .catch(err => {console.error('Unable to connect to the database:', err);});

//synchronisation des models avec la base de donnees &    --->    Ajout de nouveau utilisateur 
/*sequelize.sync({ force: false })
    .then(() => {
        console.log('Database & tables created !!!');
        return utilisateur.bulkCreate(utilisateurs);})
    .then(() => {
        console.log('Utilisateurs added');})
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

//start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
