module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "salle",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      nom: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      capacite: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      prix: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },

      proprietaire_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    },
  );
};
