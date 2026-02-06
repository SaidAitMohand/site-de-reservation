const express = require("express");
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'une_cle_secrete_tres_longue__pour_le_projet_12345';
const cors = require('cors');
const port = 3000; 
const cors = require('cors');

//middlewares
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));


// Middleware de protection des routes
const verifierRole = (rolesAutorises = []) => {
  return (req, res, next) => {
    // On récupère le token dans le header "Authorization"
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Accès refusé " });

    try {
      const donneesBadge = jwt.verify(token, JWT_SECRET);
      req.user = donneesBadge;

      // Vérification du rôle
      if (rolesAutorises.length && !rolesAutorises.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: " Vous n'avez pas les droits nécessaires." });
      }
      next();
    } catch (err) {
      res.status(401).json({ message: "Badge invalide ou expiré." });
    }
  };
};
//ORM Sequelize configuration ----------
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("site_reservation", "root", "", {
  host: "localhost",
  dialect: "mariadb",
  dialectOptions: {
    timezone: "Etc/GMT-2",
  },
  logging: false,
});
//Importation des models
const utilisateurModel = require("./models/utilisateurs");
const utilisateur = utilisateurModel(sequelize, DataTypes); //initialiser le model sequelize
// (c'est un peut la table utilisateur mais en objet JS)
const salleModel = require("./models/salles");
const salle = salleModel(sequelize, DataTypes); //On fait la même chose pour la table salles (toujours en objet JS)
//Test de la connection a la DB
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

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
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// ++ inscription des utilisateurs
app.post("/inscription", async (req, res) => {
  try {
    const { name, username, password, role } = req.body;

    // Hachage du mot de passe (Sécurité)
    const hashedPassword = await bcrypt.hash(password, 10);

    const nouveau_utilisateur = await utilisateur.create({
      name,
      username,
      password: hashedPassword,
      role: role || "client",
    });

    res.status(201).json({ message: "Compte créé avec succès !" });
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
});

// +++ Connexion
app.post("/connexion", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await utilisateur.findOne({ where: { username } });
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable." });

    if (!user.status)
      return res.status(403).json({ message: "Ce compte est désactivé." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Mot de passe incorrect." });

    // Création du Token JWT
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "12h",
    });

    res.json({
      message: "Connexion réussie !",
      token: token,
      role: user.role,
      name: user.name,
    });
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
});

// +++ API utilisateurs +++
app.get("/users", verifierRole(["admin"]), (req, res) => {
  utilisateur
    .findAll({ attributes: { exclude: ["password"] } })
    .then((users) => {
      res.json(users);
    });
});
// +++ API utilisateur par ID +++
app.get("/users/:id", verifierRole(["admin", "proprietaire"]), (req, res) => {
  utilisateur
    .findByPk(req.params.id, { attributes: { exclude: ["password"] } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "utilisateur non trouvé" });
      }
      res.json(user);
    });

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

        // +++ API modifier l'etat d'un utilisateur +++
app.put('/users/:id/status', async(req, res)=>{
    const {id} = req.params;
    const {status} = req.body;
    try{
        await utilisateur.update(
            {status: status},
            {where: {id: id}}
        );
        const updatedUser = await utilisateur.findByPk(id);
        res.json(updatedUser);
        
    }catch(error) {
        res.status(500).json({
            erreur: error.message
        });
    };
});

// API REST pour les salles

//route 1 : Ajouter une salle (POST)

app.post("/owner/salles", verifierRole(["proprietaire"]), async (req, res) => {
  try {
    const nouvelleSalle = await salle.create({
      nom: req.body.nom,
      description: req.body.description,
      capacite: req.body.capacite,
      prix: req.body.prix,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      proprietaire_id: req.user.id,
    });

    res.status(201).json({
      message: "Salle ajoutée avec succès",
      salle: nouvelleSalle,
    });
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
});

//Route2 : Voir les salles (GET)
app.get("/owner/salles", verifierRole(["proprietaire"]), async (req, res) => {
  try {
    const salles = await salle.findAll({
      where: { proprietaire_id: req.user.id },
    });

    res.json(salles);
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
});

//route3 : Modifier une Salle avec son ID (PUT)

app.put(
  "/owner/salles/:id",
  verifierRole(["proprietaire"]),
  async (req, res) => {
    try {
      const salleExistante = await salle.findOne({
        where: {
          id: req.params.id,
          proprietaire_id: req.user.id,
        },
      });

      if (!salleExistante) {
        return res
          .status(404)
          .json({ message: "Salle introuvable ou accès refusé" });
      }

      await salleExistante.update(req.body);

      res.json({ message: "Salle modifiée avec succès" });
    } catch (error) {
      res.status(500).json({ erreur: error.message });
    }
  },
);

//route 4: supprimer une Salle avec son ID (DELETE)

app.delete(
  "/owner/salles/:id",
  verifierRole(["proprietaire"]),
  async (req, res) => {
    try {
      const salleExistante = await salle.findOne({
        where: {
          id: req.params.id,
          proprietaire_id: req.user.id,
        },
      });

      if (!salleExistante) {
        return res
          .status(404)
          .json({ message: "Salle introuvable ou accès refusé" });
      }

      await salleExistante.destroy();

      res.json({ message: "Salle supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ erreur: error.message });
    }
  },
);

//start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
