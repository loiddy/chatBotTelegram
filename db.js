var mysql = require('mysql')
var pool = null
exports.connect = function (done) {
    pool = mysql.createPool({
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'donuts',
        port: 8889
    })
    done()
}
exports.database = function () {
    return pool
}