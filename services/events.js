const mysql = require('../libraries/mysql');

class EventsService {

    constructor() {
        this.table = 'events';
    }

    // Gets all the events from an user
    getEvents(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await mysql.connect();
                const query = `SELECT id, name, category, start_date, place, online FROM ${this.table} WHERE user_id = ? ORDER BY creation_date DESC`;
                connection.query(query, [userId], (err, results, fields) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    } else {
                        resolve(results);
                    }
                });
                connection.release();
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    }

    // Gets the event details
    getEventDetails(userId, eventId) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await mysql.connect();
                const query = `SELECT * FROM ${this.table} WHERE id = ? AND user_id = ?`;
                connection.query(query, [eventId, userId], (err, results, fields) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    } else {
                        resolve(results[0]);
                    }
                });
                connection.release();
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    }

    // Creates a new event
    createEvent(userId, { name, category, place, address, startDate, endDate, online }) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await mysql.connect();
                let query = `INSERT INTO ${this.table} (name, category, place, address, start_date, end_date, online, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
                connection.query(query, [name, category, place, address ? address : null, startDate, endDate, Number(online), userId], (err, results, fields) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    } else {
                        if (results.insertId) {
                            resolve(results.insertId);
                        } else {
                            resolve(null);
                        }
                    }
                });
                connection.release();
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    }

    // Updates an event
    updateEvent(userId, eventId, { name, category, place, address, startDate, endDate, online }) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await mysql.connect();
                let query = `UPDATE ${this.table} SET name = ?, category = ?, place = ?, address = ?, start_date = ?, end_date = ?, online = ? WHERE id = ? AND user_id = ?;`;
                connection.query(query, [name, category, place, address ? address : null, startDate, endDate, Number(online), eventId, userId], (err, results, fields) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    } else {
                        if (results.affectedRows) {
                            resolve(results.affectedRows);
                        } else {
                            resolve(null);
                        }
                    }
                });
                connection.release();
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    }

    // Deletes an event
    deleteEvent(userId, eventId) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await mysql.connect();
                let query = `DELETE FROM ${this.table} WHERE id = ? AND user_id = ?`;
                connection.query(query, [eventId, userId], (err, results, fields) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    } else {
                        if (results.affectedRows) {
                            resolve(results.affectedRows);
                        } else {
                            resolve(null);
                        }
                    }
                });
                connection.release();
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    }
}

module.exports = EventsService;