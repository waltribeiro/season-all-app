var uuidv1  = require('uuid/v1');
var bcrypt  = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
    var Accounts = sequelize.define("Accounts", {
        uuid: {
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV1,
          isUnique :true
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 30]
            }
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 30]
            }
        },
        street: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 30]
            }
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 30]
            }
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 2]
            }
        },
        zip: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                len: [5]
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            isEmail: {msg: "Email address must be valid"},
            validate: {
                len: [1, 30]
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [10]
            }
        },
        // this is the password field
        account_key: {
            type: DataTypes.STRING,
            required: true,
            validate: {
                len: [8, 20]
            }
        }

    });
    // methods ======================
      // generating a hash
      Accounts.generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    // checking if password is valid
    Accounts.prototype.validPassword = function(password) {
        return bcrypt.compareSync(password, this.account_key);
    };

    Accounts.associate = function(models) {
        Accounts.hasMany(models.Trail, {
          onDelete: "cascade"
        });
    };

  return Accounts;
}