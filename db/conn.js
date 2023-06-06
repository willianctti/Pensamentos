const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('pensamentos', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log("Conectamos com sucesso!")


} catch(err) {
    console.log(err)
}

module.exports = sequelize