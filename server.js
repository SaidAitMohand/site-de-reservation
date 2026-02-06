const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'une_cle_secrete_tres_longue__pour_le_projet_12345';
const cors = require('cors');
app.use(cors());
const port = 3000; 

//middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Middleware de protection des routes
const verifierRole = (rolesAutorises = []) => {
    return (req, res, next) => {
        // On récupère le token dans le header "Authorization"
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.status(401).json({ message: "Accès refusé " });

        try {
            const donneesBadge = jwt.verify(token, JWT_SECRET);
            req.user = donneesBadge;

            // Vérification du rôle 
            if (rolesAutorises.length && !rolesAutorises.includes(req.user.role)) {
                return res.status(403).json({ message: " Vous n'avez pas les droits nécessaires." });
            }
            next();
        } catch (err) {
            res.status(401).json({ message: "Badge invalide ou expiré." });
        }
    };
};

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


// ++ inscription des utilisateurs 
app.post('/inscription', async(req, res) => {
    try {
        const { name, username, password, role } = req.body;

        // Hachage du mot de passe (Sécurité)
        const hashedPassword = await bcrypt.hash(password, 10);

        const nouveau_utilisateur = await utilisateur.create({
            name,
            username,
            password: hashedPassword,
            role: role || 'client'
        });

        res.status(201).json({ message: 'Compte créé avec succès !' });
    } catch (error) {
        res.status(500).json({ erreur: error.message });
    }
});

// +++ Connexion 
app.post('/connexion', async(req, res) => {
    try {
        const { username, password } = req.body;

        const user = await utilisateur.findOne({ where: { username } });
        if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });

        if (!user.status) return res.status(403).json({ message: "Ce compte est désactivé." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect." });

        // Création du Token JWT
        const token = jwt.sign({ id: user.id, role: user.role },
            JWT_SECRET, { expiresIn: '12h' }
        );

        res.json({
            message: "Connexion réussie !",
            token: token,
            role: user.role,
            name: user.name
        });
    } catch (error) {
        res.status(500).json({ erreur: error.message });
    }
});

        // +++ API utilisateurs +++
app.get('/users', verifierRole(['admin']), (req, res) => {
    utilisateur.findAll({ attributes: { exclude: ['password'] } })
    .then(users => {
         res.json(users);
    })
});
        // +++ API utilisateur par ID +++
app.get('/users/:id', verifierRole(['admin', 'proprietaire']), (req, res)=>{
    utilisateur.findByPk(req.params.id,{ attributes: { exclude: ['password'] } })
    .then(user => {
        if(!user){
            return res.status(404).json({error: 'utilisateur non trouvé'});
        }
        res.json(user);
    })
});

        // +++ API ajouter utilisateur +++
/*app.post('/addUser', (req, res)=>{
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
}); */
// +++ Récupérer toutes les salles pour la carte +++
app.get("/all/salles/map", async(req, res) => {
    try {
        const toutesLesSalles = await salle.findAll({
            attributes: ['id', 'nom', 'latitude', 'longitude', 'prix', 'capacite']
        });
        res.json(toutesLesSalles);
    } catch (error) {
        res.status(500).json({ erreur: error.message });
    }
});

//start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
