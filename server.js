// -------------------- IMPORTS --------------------
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const { Sequelize, DataTypes, Op } = require("sequelize");

const app = express();
const port = 4000;

const JWT_SECRET = "une_cle_secrete_tres_longue__pour_le_projet_12345";

// -------------------- MIDDLEWARE --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));

app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// -------------------- MULTER (UPLOAD IMAGES) --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// -------------------- SEQUELIZE CONFIG --------------------
const sequelize = new Sequelize("site_reservation", "root", "", {
  host: "localhost",
  dialect: "mariadb",
  dialectOptions: { timezone: "Etc/GMT-2" },
  logging: false,
});

// -------------------- MODELS --------------------
const utilisateurModel = require("./models/utilisateurs");
const salleModel = require("./models/salles");
const commentaireModel = require("./models/commentaires");
const reservationModel = require("./models/reservations");

const utilisateur = utilisateurModel(sequelize, DataTypes);
const salle = salleModel(sequelize, DataTypes);
const Commentaire = commentaireModel(sequelize, DataTypes);
const Reservation = reservationModel(sequelize, DataTypes);

// -------------------- RELATIONS --------------------
// 
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

// -------------------- AUTH MIDDLEWARE --------------------
const verifierRole = (rolesAutorises = []) => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Accès refusé" });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      if (rolesAutorises.length && !rolesAutorises.includes(req.user.role)) {
        return res.status(403).json({ message: "Accès interdit" });
      }

      next();
    } catch (err) {
      res.status(401).json({ message: "Token invalide ou expiré" });
    }
  };
};

// -------------------- ROUTES AUTH --------------------
app.post("/inscription", async (req, res) => {
  try {
    const { name, username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await utilisateur.create({
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

app.post("/connexion", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await utilisateur.findOne({ where: { username } });

    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    if (!user.status) return res.status(403).json({ message: "Compte désactivé" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.json({
      message: "Connexion réussie",
      token,
      role: user.role,
      name: user.name
    });
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
});

// -------------------- ROUTES SALLES (PUBLIC & CLIENT) --------------------
// Pour afficher les salles sur le Dashboard Client
app.get("/salles", async (req, res) => {
  try {
    const salles = await salle.findAll(); // Tu peux ajouter { where: { status: 'Validée' } } si tu veux
    res.json(salles);
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
});

// -------------------- ROUTES RESERVATION (CLIENT) --------------------
// Voir ses propres réservations
app.get("/client/mes-reservations", verifierRole(["client"]), async (req, res) => {
  try {
    const mesReservations = await Reservation.findAll({
      where: { utilisateur_id: req.user.id },
      include: [{ model: salle, attributes: ['nom', 'img', 'prix'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(mesReservations);
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
});

// Créer une réservation
app.post("/reservations/:salleId", verifierRole(["client"]), async (req, res) => {
  try {
    const { date_debut, date_fin } = req.body;

    const conflit = await Reservation.findOne({
      where: {
        salle_id: req.params.salleId,
        [Op.or]: [
          { date_debut: { [Op.between]: [date_debut, date_fin] } },
          { date_fin: { [Op.between]: [date_debut, date_fin] } }
        ]
      }
    });

    if (conflit) return res.status(400).json({ message: "La salle est déjà occupée à ces dates" });

    const reservation = await Reservation.create({
      utilisateur_id: req.user.id,
      salle_id: req.params.salleId,
      date_debut,
      date_fin,
      status: "En attente"
    });

    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
});

// -------------------- ROUTES PROPRIETAIRE --------------------
// Créer une salle
app.post("/owner/salles", verifierRole(["proprietaire"]), upload.array("photos", 5), async (req, res) => {
  try {
    const { nom, description, capacite, prix, latitude, longitude } = req.body;
    const nouvelleSalle = await salle.create({
      nom,
      description,
      capacite: parseInt(capacite) || 0,
      prix: parseFloat(prix) || 0,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      img: req.files?.length ? `/uploads/${req.files[0].filename}` : null,
      proprietaire_id: req.user.id
    });
    res.status(201).json({ message: "Salle créée", salle: nouvelleSalle });
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
});

// Voir ses propres salles
app.get("/owner/salles", verifierRole(["proprietaire"]), async (req, res) => {
  const salles = await salle.findAll({ where: { proprietaire_id: req.user.id } });
  res.json(salles);
});

// -------------------- ROUTES ADMIN --------------------
app.get("/admin/users", verifierRole(["admin"]), async (req, res) => {
  const users = await utilisateur.findAll();
  res.json(users);
});

app.get("/admin/salles", verifierRole(["admin"]), async (req, res) => {
  const salles = await salle.findAll();
  res.json(salles);
});

app.put("/admin/users/:id/status", verifierRole(["admin"]), async (req, res) => {
  await utilisateur.update({ status: req.body.status }, { where: { id: req.params.id } });
  res.json({ message: "Statut utilisateur mis à jour" });
});

// -------------------- TEST DB & START --------------------
sequelize.authenticate()
  .then(() => {
    console.log("Connecté à la base de données");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("Base synchronisée");
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
  })
  .catch(err => console.error("Erreur DB:", err));