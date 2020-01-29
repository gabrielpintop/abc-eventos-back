const express = require('express');
const EventsService = require('../services/events');
const { verifyToken } = require('../libraries/jwt');

const eventsApi = (app) => {
    const router = express.Router();
    app.use('/api/events', verifyToken, router);

    const eventsService = new EventsService();

    // Gets all the events
    router.get('', async (req, res, next) => {
        try {
            const events = await eventsService.getEvents(req.decodedToken.sub);
            res.json({
                data: events
            });
        } catch (error) {
            res.status(404).json({
                errors: ['Error cargando los eventos', error]
            });
        }
    });

    // Gets the details of an event
    router.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const event = await eventsService.getEventDetails(req.decodedToken.sub, id);
            if (event) {
                res.json({
                    data: event
                });
            } else {
                res.status(404).json({
                    errors: [`No existe un evento con id ${id}`]
                });
            }
        } catch (error) {
            res.status(400).json({
                errors: [`Error cargando el evento con id ${id}`, error]
            });
        }
    });

    // Creates a new event
    router.post('', async (req, res) => {
        try {
            const { name, category, place, address, startDate, endDate, online } = req.body;
            if (!name || !category || !startDate || !endDate || !place || (!online && !address) || (online && address)) {
                res.status(400).json({
                    errors: [`Por favor verifica los valores ingresados`]
                });
            } else if (endDate <= startDate) {
                res.status(400).json({
                    errors: [`La fecha fin debe ser mayor que la fecha inicio`]
                });
            } else {
                try {
                    const newStartDate = new Date(Number(startDate)).toJSON().slice(0, 19).replace('T', ' ');
                    const newEndDate = new Date(Number(endDate)).toJSON().slice(0, 19).replace('T', ' ');

                    console.log(newStartDate);
                    console.log(newEndDate);


                    const eventId = await eventsService.createEvent(req.decodedToken.sub, { name, category, place, address, startDate: newStartDate, endDate: newEndDate, online });
                    if (eventId) {
                        res.status(201).json({
                            data: eventId
                        });
                    } else {
                        res.status(400).json({
                            errors: [`Error creando el evento`]
                        });
                    }
                } catch (err) {
                    console.log(err);

                    res.status(400).json({
                        errors: [`Error creando el evento`, err]
                    });
                }
            }
        } catch (error) {
            res.status(400).json({
                errors: [`Error creando el evento`, error]
            });
        }
    });

    // Updates an event
    router.put('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const { name, category, place, address, startDate, endDate, online } = req.body;
            if (!id || !name || !category || !startDate || !endDate || !place || (!online && !address) || (online && address)) {
                res.status(400).json({
                    errors: [`Por favor verifica los valores ingresados`]
                });
            } else {
                const eventId = await eventsService.updateEvent(req.decodedToken.sub, id, { name, category, place, address, startDate, endDate, online });
                if (eventId) {
                    res.json({
                        data: 'El evento fue actualizado exitosamente'
                    });
                } else {
                    res.status(400).json({
                        errors: [`Error actualizando el evento`]
                    });
                }
            }
        } catch (error) {
            res.status(400).json({
                errors: [`Error actualizando el evento`, error]
            });
        }
    });

    // Deletes an event
    router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(404).json({
                    errors: [`No se ingreso el id del evento a eliminar`]
                });
            } else {
                const eventId = await eventsService.deleteEvent(req.decodedToken.sub, id);
                if (eventId) {
                    res.status(204).json();
                } else {
                    res.status(400).json({
                        errors: [`Error eliminando el evento`]
                    });
                }
            }
        } catch (error) {
            res.status(400).json({
                errors: [`Error eliminando el evento`, error]
            });
        }
    });

};

module.exports = eventsApi;