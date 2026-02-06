module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "salle", {
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

            // C'est le prix par journée
            prix: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },

                // Paramètres pour la localisation
            latitude: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },

            longitude: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },

            // --- NOUVELLES COLONNES AJOUTÉES ---
            img: {
                type: DataTypes.STRING,
                allowNull: true, // Peut être vide au début
            },

            types: {
                type: DataTypes.TEXT, // Stocke les catégories (Mariage, Dîner, etc.) en format JSON
                allowNull: true,
            },
            // ------------

            proprietaire_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        }, {
            timestamps: false, // On garde false comme dans ton code de base
        },
    );
};