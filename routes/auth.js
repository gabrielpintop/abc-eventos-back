const express = require('express');
const UsersService = require('../services/users');
const bcrypt = require('bcrypt');
const { signToken } = require('../libraries/jwt');

const authApi = (app) => {
    const router = express.Router();
    app.use('/api/auth', router);

    const usersService = new UsersService();

    router.post('/signUp', async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({
                    errors: [`El correo y la contraseña son requeridos`]
                });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const userId = await usersService.createUser(email.toLowerCase(), hashedPassword);
                if (userId) {
                    res.status(201).json({
                        data: 'Cuenta creada exitosamente'
                    });
                } else {
                    res.status(400).json({
                        errors: [`Error creando la cuenta`]
                    });
                }
            }
        } catch (error) {
            res.status(400).json({
                errors: [`Error creando la cuenta`, error]
            });
        }
    });

    router.post('/signIn', async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({
                    errors: [`El correo y la contraseña son requeridos`]
                });
            } else {
                const user = await usersService.getUser(email.toLowerCase());
                if (user) {
                    if (await bcrypt.compare(password, user.password)) {
                        delete user.password;
                        res.json({
                            data: signToken({ sub: user.id, email: user.email })
                        });
                    } else {
                        res.status(400).json({
                            errors: [`Credenciales inválidas`]
                        });
                    }
                } else {
                    res.status(400).json({
                        errors: [`Credenciales inválidas`]
                    });
                }
            }
        } catch (error) {
            res.status(400).json({
                errors: [`No fue posible iniciar sesión`, error]
            });
        }
    });
};

module.exports = authApi;