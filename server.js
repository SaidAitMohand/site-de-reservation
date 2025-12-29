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
        name: 'nordine',
        username: 'said123',
        password: 'password1',
        role: 'admin'
    },
    {
        name: 'samy',
        username: 'amine456',
        password: 'password2',
        role: 'client'
    }
];
//Importation des models
const utilisateurModel = require('./models/utilisateurs') ;
const utilisateur = utilisateurModel(sequelize, DataTypes);

//Test de la connection a la DB
sequelize.authenticate()
    .then(() => {console.log('Connection has been established successfully.');})
    .catch(err => {console.error('Unable to connect to the database:', err);});

//synchronisation des models avec la base de donnees
sequelize.sync({ force: false })
    .then(() => {
        console.log('Database & tables created !!!');
        return utilisateur.bulkCreate(utilisateurs);})
    .then(() => {console.log('Utilisateurs added');})
    .catch(err => {console.error('Error creating database & tables:', err);});



    //---------- Starting the server and defining routes ---------
//les routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

/*app.get('/requete', (req, res) => {
    //res.sendFile(__dirname + '/public/index.html');
    req.getConnection((err, connection) => {
        if (err) console.error(err);
        else{
            connection.query('SELECT * FROM utilisateurs', (err, result)=>{
                if(err) console.error(err);
                else {
                    console.log(result);
                    res.json(result);
                }
            });
        }
    });
});
*/

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
