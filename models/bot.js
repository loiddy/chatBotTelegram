const db = require('../db')

let insert = (pRows) => {
    return new Promise((resolve, reject) => {
        db.database().query('INSERT INTO chocolate (username,  first_name, last_name, telegram_id) VALUES (?, ?, ?, ?)', [pRows.username, pRows.first_name, pRows.last_name, pRows.id], (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
}
let recuIds = (pRows) => {
    return new Promise((resolve, reject) => {
        db.database().query('SELECT telegram_id from chocolate ', (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
}


module.exports = {
    insert: insert,
    recuIds: recuIds
}