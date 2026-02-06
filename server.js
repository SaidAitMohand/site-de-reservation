const express = require("express");
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { Sequelize, DataTypes, Op } = require("sequelize");

const JWT_SECRET = 'une_cle_secrete_tres_longue__pour_le_projet_12345';
const port = 4000; 

// --- Middlewares ---
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration CORS (Une seule fois !)
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

// --- Sequelize Configuration ---
const sequelize = new Sequelize("site_reservation", "root", "", {
  host: "localhost",
  dialect: "mariadb",
  dialectOptions: { timezone: "Etc/GMT-2" },
  logging: false,
});

// --- Importation des modèles ---
const utilisateurModel = require("./models/utilisateurs");
const salleModel = require("./models/salles");
const commentaireModel = require("./models/commentaires");
const reservationModel = require("./models/reservations");

const utilisateur = utilisateurModel(sequelize, DataTypes);
const salle = salleModel(sequelize, DataTypes);
const commentaire = commentaireModel(sequelize, DataTypes);
const reservation = reservationModel(sequelize, DataTypes);

// --- Relations ---
utilisateur.hasMany(salle, { foreignKey: "proprietaire_id" });
salle.belongsTo(utilisateur, { foreignKey: "proprietaire_id" });

// --- Middleware de protection ---
const verifierRole = (rolesAutorises = []) => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Accès refusé" });

    try {
      const donneesBadge = jwt.verify(token, JWT_SECRET);
      req.user = donneesBadge;

      if (rolesAutorises.length && !rolesAutorises.includes(req.user.role)) {
        return res.status(403).json({ message: "Vous n'avez pas les droits nécessaires." });
      }
      next();
    } catch (err) {
      res.status(401).json({ message: "Badge invalide ou expiré." });
    }
  };
};

// --- Sync & Auth Test ---
sequelize.authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    return sequelize.sync({ alter: true });
  })
  .then(() => console.log("Database synchronisée !!!"))
  .catch(err => console.error("Erreur DB:", err));

// -------------------- ROUTES AUTH --------------------

app.post("/inscription", async (req, res) => {
  try {
    const { name, username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await utilisateur.create({
      name, username, password: hashedPassword, role: role || "client", status: true
    });
    res.status(201).json({ message: "Compte créé avec succès !" });
  } catch (error) { res.status(500).json({ erreur: error.message }); }
});

app.post("/connexion", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await utilisateur.findOne({ where: { username } });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });
    if (!user.status) return res.status(403).json({ message: "Ce compte est désactivé." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect." });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "12h" });
    res.json({ message: "Connexion réussie !", token, role: user.role, name: user.name });
  } catch (error) { res.status(500).json({ erreur: error.message }); }
});

// -------------------- ROUTES ADMIN (DASHBOARD) --------------------

// Récupérer tous les utilisateurs (pour ta table de gauche)
// Remarque bien le /admin/users ici !
app.get("/admin/users", verifierRole(["admin"]), async (req, res) => {
  try {
    const users = await utilisateur.findAll({ attributes: { exclude: ["password"] } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
});
// Récupérer toutes les salles (pour ta table de droite)
app.get("/admin/salles", verifierRole(["admin"]), async (req, res) => {
  try {
    const salles = await salle.findAll({
      include: [{ model: utilisateur, attributes: ["name"] }]
    });
    res.json(salles);
  } catch (error) { res.status(500).json({ erreur: error.message }); }
});

// Modifier l'état d'un utilisateur (Bannir/Réactiver)
app.put('/admin/users/:id/status', verifierRole(["admin"]), async (req, res) => {
  try {
    await utilisateur.update({ status: req.body.status }, { where: { id: req.params.id } });
    res.json({ message: "Statut utilisateur mis à jour" });
  } catch (error) { res.status(500).json({ erreur: error.message }); }
});

// Modifier l'état d'une salle (Valider/Désactiver)
app.put('/admin/salles/:id/status', verifierRole(["admin"]), async (req, res) => {
  try {
    await salle.update({ status: req.body.status }, { where: { id: req.params.id } });
    res.json({ message: "Statut salle mis à jour" });
  } catch (error) { res.status(500).json({ erreur: error.message }); }
});

// -------------------- ROUTES PROPRIETAIRE --------------------

app.post("/owner/salles", verifierRole(["proprietaire"]), async (req, res) => {
  try {
    const nouvelleSalle = await salle.create({
      ...req.body,
      proprietaire_id: req.user.id,
    });
    res.status(201).json({ message: "Salle ajoutée", salle: nouvelleSalle });
  } catch (error) { res.status(500).json({ erreur: error.message }); }
});

app.get("/owner/salles", verifierRole(["proprietaire"]), async (req, res) => {
  try {
    const salles = await salle.findAll({ where: { proprietaire_id: req.user.id } });
    res.json(salles);
  } catch (error) { res.status(500).json({ erreur: error.message }); }
});

// -------------------- ROUTES PUBLIQUES --------------------

app.get("/all/salles/map", async(req, res) => {
  try {
    const toutesLesSalles = await salle.findAll({
      attributes: ['id', 'nom', 'latitude', 'longitude', 'prix', 'capacite']
    });
    res.json(toutesLesSalles);
  } catch (error) { res.status(500).json({ erreur: error.message }); }
});

app.get("/", (req, res) => { res.sendFile(__dirname + "/public/index.html"); });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});