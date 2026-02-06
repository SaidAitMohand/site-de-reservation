// server.js
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { Sequelize, DataTypes, Op } = require("sequelize");

const JWT_SECRET = "une_cle_secrete_tres_longue__pour_le_projet_12345";
const PORT = 3000;

// --- Middlewares ---
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));

// --- Sequelize ---
const sequelize = new Sequelize("site_reservation", "root", "", {
  host: "localhost",
  dialect: "mariadb",
  dialectOptions: { timezone: "Etc/GMT-2" },
  logging: false,
});

// --- Models ---
const utilisateurModel = require("./models/utilisateurs");
const salleModel = require("./models/salles");
const commentaireModel = require("./models/commentaires");
const reservationModel = require("./models/reservations");

const Utilisateur = utilisateurModel(sequelize, DataTypes);
const Salle = salleModel(sequelize, DataTypes);
const Commentaire = commentaireModel(sequelize, DataTypes);
const Reservation = reservationModel(sequelize, DataTypes);

// --- Relations ---
Utilisateur.hasMany(Salle, { foreignKey: "proprietaire_id" });
Salle.belongsTo(Utilisateur, { foreignKey: "proprietaire_id" });

Utilisateur.hasMany(Commentaire, { foreignKey: "utilisateur_id" });
Commentaire.belongsTo(Utilisateur, { foreignKey: "utilisateur_id" });

Salle.hasMany(Commentaire, { foreignKey: "salle_id" });
Commentaire.belongsTo(Salle, { foreignKey: "salle_id" });

Utilisateur.hasMany(Reservation, { foreignKey: "utilisateur_id" });
Reservation.belongsTo(Utilisateur, { foreignKey: "utilisateur_id" });

Salle.hasMany(Reservation, { foreignKey: "salle_id" });
Reservation.belongsTo(Salle, { foreignKey: "salle_id" });

// --- Protection routes ---
const verifierRole = (rolesAutorises = []) => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Accès refusé" });

    try {
      const userData = jwt.verify(token, JWT_SECRET);
      req.user = userData;

      if (rolesAutorises.length && !rolesAutorises.includes(req.user.role)) {
        return res.status(403).json({ message: "Vous n'avez pas les droits nécessaires." });
      }

      next();
    } catch (err) {
      res.status(401).json({ message: "Badge invalide ou expiré." });
    }
  };
};

// --- Synchronisation & création admin ---
async function creerAdmin() {
  const admin = await Utilisateur.findOne({ where: { role: "admin" } });
  if (!admin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await Utilisateur.create({
      name: "Admin",
      username: "admin",
      password: hashedPassword,
      role: "admin",
      status: true
    });
    console.log("Admin créé (username: admin / password: admin123)");
  }
}

async function synchroniserBaseDeDonnees() {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database synchronisée !!!");
    await creerAdmin();
  } catch (err) {
    console.error("Erreur lors de la synchronisation:", err);
  }
}

synchroniserBaseDeDonnees();

// --- ROUTES ---

// Page d'accueil
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// -------------------- INSCRIPTION --------------------
app.post("/inscription", async (req, res) => {
  try {
    const { name, username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Utilisateur.create({
      name,
      username,
      password: hashedPassword,
      role: role || "client",
      status: true
    });

    res.status(201).json({ message: "Compte créé avec succès !" });
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
});

// -------------------- CONNEXION --------------------
app.post("/connexion", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Utilisateur.findOne({ where: { username } });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });
    if (!user.status) return res.status(403).json({ message: "Ce compte est désactivé." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect." });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "12h" });

    res.json({ message: "Connexion réussie !", token, role: user.role, name: user.name });
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
});

// -------------------- ADMIN DASHBOARD --------------------

// Récupérer tous les utilisateurs
app.get("/admin/users", verifierRole(["admin"]), async (req, res) => {
  try {
    const users = await Utilisateur.findAll({ attributes: { exclude: ["password"] } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
});

// Récupérer toutes les salles
app.get("/admin/salles", verifierRole(["admin"]), async (req, res) => {
  try {
    const salles = await Salle.findAll({
      include: [{ model: Utilisateur, attributes: ["id", "name", "username"] }]
    });
    res.json(salles);
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
});

// -------------------- PROPRIETAIRE --------------------

// Ajouter salle
app.post("/owner/salles", verifierRole(["proprietaire"]), async (req, res) => {
  try {
    const newSalle = await Salle.create({
      ...req.body,
      proprietaire_id: req.user.id
    });
    res.status(201).json(newSalle);
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
});

// Voir ses salles
app.get("/owner/salles", verifierRole(["proprietaire"]), async (req, res) => {
  try {
    const salles = await Salle.findAll({ where: { proprietaire_id: req.user.id } });
    res.json(salles);
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
});

// Modifier salle
app.put("/owner/salles/:id", verifierRole(["proprietaire"]), async (req, res) => {
  try {
    const salleExist = await Salle.findOne({ where: { id: req.params.id, proprietaire_id: req.user.id } });
    if (!salleExist) return res.status(404).json({ message: "Salle introuvable ou accès refusé" });
    await salleExist.update(req.body);
    res.json({ message: "Salle modifiée avec succès" });
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
});

// Supprimer salle
app.delete("/owner/salles/:id", verifierRole(["proprietaire"]), async (req, res) => {
  try {
    const salleExist = await Salle.findOne({ where: { id: req.params.id, proprietaire_id: req.user.id } });
    if (!salleExist) return res.status(404).json({ message: "Salle introuvable ou accès refusé" });
    await salleExist.destroy();
    res.json({ message: "Salle supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
});

// -------------------- CLIENT --------------------

// Ajouter réservation
app.post("/reservations/:salleId", verifierRole(["client"]), async (req, res) => {
  try {
    const { date_debut, date_fin } = req.body;
    const conflit = await Reservation.findOne({
      where: {
        salle_id: req.params.salleId,
        date_debut: { [Op.lt]: date_fin },
        date_fin: { [Op.gt]: date_debut },
      },
    });
    if (conflit) return res.status(400).json({ message: "Salle indisponible" });

    const reservation = await Reservation.create({
      utilisateur_id: req.user.id,
      salle_id: req.params.salleId,
      date_debut,
      date_fin
    });
    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
});

// Voir ses réservations
app.get("/mes-reservations", verifierRole(["client"]), async (req, res) => {
  const reservations = await Reservation.findAll({ where: { utilisateur_id: req.user.id } });
  res.json(reservations);
});

// -------------------- COMMENTAIRES --------------------

// Ajouter commentaire
app.post("/commentaires/:salleId", verifierRole(["client"]), async (req, res) => {
  try {
    const commentaire = await Commentaire.create({
      contenu: req.body.contenu,
      note: req.body.note,
      utilisateur_id: req.user.id,
      salle_id: req.params.salleId
    });
    res.status(201).json(commentaire);
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
});

// Voir commentaires d'une salle
app.get("/salles/:id/commentaires", async (req, res) => {
  const commentaires = await Commentaire.findAll({ where: { salle_id: req.params.id } });
  res.json(commentaires);
});

// -------------------- START SERVER --------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
