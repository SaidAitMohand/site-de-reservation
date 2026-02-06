const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "une_cle_secrete_tres_longue__pour_le_projet_12345";
const cors = require("cors");
app.use(cors());
const port = 3000;

// middlewares globaux
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

//Configuration de l'ORM squelize pour le BDD
const { Sequelize, DataTypes, Op } = require("sequelize"); // Op est obligatoire pour les dates( [Op.lt] et [Op.gt] )
const sequelize = new Sequelize("site_reservation", "root", "", {
  host: "localhost",
  dialect: "mariadb",
  dialectOptions: {
    timezone: "Etc/GMT-2",
  },
  logging: false,
});

//Importation des models sequelize
const utilisateurModel = require("./models/utilisateurs");
const utilisateur = utilisateurModel(sequelize, DataTypes);
const salleModel = require("./models/salles");
const salle = salleModel(sequelize, DataTypes);
const commentaireModel = require("./models/commentaires");
const Commentaire = commentaireModel(sequelize, DataTypes);
const reservationModel = require("./models/reservations");
const Reservation = reservationModel(sequelize, DataTypes);

//Test de la connexion a la DB
sequelize
  .authenticate()
  .then(() => {
    console.log("Connexion reussie à la BDD");
  })
  .catch((err) => {
    console.error("erreur de connexion à la BDD :", err);
  });

/*synchronisation des models avec la base de donnees 

    ps: ce code est a utiliser une seule fois pour creer les tables dans la BDD

sequelize.sync({ alter: true })
    .then(() => {
        console.log('BDD synchronisee !!!');})
    .catch(err => {
        console.error('Erreur lors de la création des tables', err);});
 
*/

//relations squelize afin d'eviter le bug lors des jointures entres tables

utilisateur.hasMany(salle, { foreignKey: "proprietaire_id" });
salle.belongsTo(utilisateur, { foreignKey: "proprietaire_id" });

utilisateur.hasMany(Commentaire, { foreignKey: "utilisateur_id" });
Commentaire.belongsTo(utilisateur, { foreignKey: "utilisateur_id" });

salle.hasMany(Commentaire, { foreignKey: "salle_id" });
Commentaire.belongsTo(salle, { foreignKey: "salle_id" });

utilisateur.hasMany(Reservation, { foreignKey: "utilisateur_id" });
Reservation.belongsTo(utilisateur, { foreignKey: "utilisateur_id" });

salle.hasMany(Reservation, { foreignKey: "salle_id" });
Reservation.belongsTo(salle, { foreignKey: "salle_id" });

//--------------------les routes----------------------------------------------------------------------------------------------------

// page d'accueil

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

//inscription des utilisateurs
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

//Connexion
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

//API utilisateurs
app.get("/users", verifierRole(["admin"]), (req, res) => {
  utilisateur
    .findAll({ attributes: { exclude: ["password"] } })
    .then((users) => {
      res.json(users);
    });
});
// API utilisateur par ID
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

// API pour les salles

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

// +++ Récupérer toutes les salles pour la carte +++
app.get("/all/salles/map", async (req, res) => {
  try {
    const toutesLesSalles = await salle.findAll({
      attributes: ["id", "nom", "latitude", "longitude", "prix", "capacite"],
    });
    res.json(toutesLesSalles);
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
});

//Routes pour les commentaires

//Un client ajoute un commentaire (POST )
app.post(
  "/commentaires/:salleId",
  verifierRole(["client"]),
  async (req, res) => {
    try {
      const commentaire = await Commentaire.create({
        contenu: req.body.contenu,
        note: req.body.note,
        utilisateur_id: req.user.id,
        salle_id: req.params.salleId,
      });

      res.status(201).json(commentaire);
    } catch (error) {
      res.status(500).json({ erreur: error.message });
    }
  },
);

// Voir (GET) commentaires sur une salle par tous le monde (client-proprietaire-admin)
app.get("/salles/:id/commentaires", async (req, res) => {
  const commentaires = await Commentaire.findAll({
    where: { salle_id: req.params.id },
  });
  res.json(commentaires);
});

// Un proprietaire voit (GET) les commentaires de SES salles

app.get(
  "/owner/commentaires",
  verifierRole(["proprietaire"]),
  async (req, res) => {
    const commentaires = await Commentaire.findAll({
      include: [
        {
          model: salle,
          where: { proprietaire_id: req.user.id },
        },
      ],
    });
    res.json(commentaires);
  },
);

//Routes des reservations
//Création d'une réservation de la part d'un client (POST)
app.post(
  "/reservations/:salleId",
  verifierRole(["client"]),
  async (req, res) => {
    const { date_debut, date_fin } = req.body;

    const conflit = await Reservation.findOne({
      where: {
        salle_id: req.params.salleId,
        date_debut: { [Op.lt]: date_fin },
        date_fin: { [Op.gt]: date_debut },
      },
    });

    if (conflit) {
      return res.status(400).json({ message: "Salle indisponible" });
    }

    const reservation = await Reservation.create({
      utilisateur_id: req.user.id,
      salle_id: req.params.salleId,
      date_debut,
      date_fin,
    });

    res.status(201).json(reservation);
  },
);

//Un client consulte (GET) ses reservations

app.get("/mes-reservations", verifierRole(["client"]), async (req, res) => {
  const reservations = await Reservation.findAll({
    where: { utilisateur_id: req.user.id },
  });
  res.json(reservations);
});

// un proprietaire consulte (GET) les reservations de ses salles

app.get(
  "/owner/reservations",
  verifierRole(["proprietaire"]),
  async (req, res) => {
    const reservations = await Reservation.findAll({
      include: [
        {
          model: salle,
          where: { proprietaire_id: req.user.id },
        },
      ],
    });
    res.json(reservations);
  },
);

// calcul du revenu total du proprietaire

app.get("/owner/revenus", verifierRole(["proprietaire"]), async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      include: [
        {
          model: salle,
          where: { proprietaire_id: req.user.id },
          attributes: ["prix", "nom"],
        },
      ],
    });

    let revenuTotal = 0;

    const details = reservations.map((r) => {
      const dateDebut = new Date(r.date_debut);
      const dateFin = new Date(r.date_fin);

      //Math.max sert à compter au moins un jour de reservation même si le nombre d'heures est inferieur à 24h
      const dureeJours = Math.max(
        1,
        Math.ceil((dateFin - dateDebut) / (1000 * 60 * 60 * 24)), // Conertir le resultat de la soustraction en nombre de jours
      );
      const montant = dureeJours * r.salle.prix;
      revenuTotal += montant;

      return {
        salle: r.salle.nom,
        date_debut: r.date_debut,
        date_fin: r.date_fin,
        duree_jours: dureeJours,
        prix_jour: r.salle.prix,
        montant,
      };
    });

    res.json({
      proprietaire_id: req.user.id,
      revenu_total: revenuTotal,
      details,
    });
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
});

//start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
