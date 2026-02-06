module.exports = (sequelize, DataTypes) => {
    return sequelize.define('commentaire', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        contenu: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        note: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1,
                max: 5
            }
        },
        utilisateur_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        salle_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: true
    });
};
