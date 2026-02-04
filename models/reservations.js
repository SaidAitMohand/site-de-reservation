module.exports = (sequelize, DataTypes) => {
  return sequelize.define("reservation", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date_debut: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    date_fin: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    statut: {
      type: DataTypes.ENUM("en_attente", "confirmee", "annulee"),
      defaultValue: "en_attente",
    },
    utilisateur_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    salle_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
