const bcryptjs = require('bcryptjs')
const Users = require('../models/userModel')

const userControllers = {


    SignUp: async (req, res) => {

        const { fullName, email, password, from, aplication } = req.body.userData
        const contraseñaHash = bcryptjs.hashSync(password, 10)
        try {
            const userExist = await Users.findOne({ email })

            if (userExist) {
                if (userExist.from.indexOf(from) !== -1) {
                    res.json({
                        success: false,
                        from: from,
                        message: "Ya realizaste sign up mediante " + from + " por favor realiza singin"
                    })
                }
                else {

                    userExist.from.push(from)
                    userExist.password.push(contraseñaHash)

                    await userExist.save()

                    res.json({
                        success: true,
                        from: from,
                        message: "Se agrego " + from + " a tus metodos para realizar signin"
                    })
                }

            }
            else {

                const nuevoUsuario = new Users({
                    fullName,
                    email,
                    password: [contraseñaHash],
                    from: [from],
                    aplication
                })

                await nuevoUsuario.save()

                res.json({
                    success: true,
                    from: from,
                    message: " Felicitaciones creamos tu usuario y agregamos " + from + " a tus metodos para realizar signin"
                })

            }


        }
        catch (error) {
            console.log(error)
            res.json({ success: false, message: "Algo a salido mal intentalo en unos minutos" })
        }
    },

    SignIn: async (req, res) => {
        const { email, password, from } = req.body.userData

        try {
            const usuario = await Users.findOne({ email })

            if (!usuario) {
                res.json({
                    success: false,
                    from: from,
                    message: "No has realizado sung Up con este email, realizalo antes de hacer sign IN"
                })
            } else {
                const contraseñaCoincide = usuario.password.filter(pass => bcryptjs.compareSync(password, pass))
                const dataUser = {
                    id: usuario._id,
                    fullName: usuario.fullName,
                    email: usuario.email,
                    from: from
                }

                if (from !== 'signUp-form') {

                    if (contraseñaCoincide.length > 0) {

                        res.json({
                            success: true,
                            from,
                            response: {dataUser},
                            message: "Bienvenido Nueavamente " + dataUser.fullName
                        })

                    } else {
                        const contraseñaHash = bcryptjs.hashSync(password, 10)
                        usuario.from.push(from)
                        usuario.password.push(contraseñaHash)

                        await usuario.save()

                        res.json({
                            success: true,
                            from,
                            response: {dataUser},
                            message: "No contaban con " + from + " dentro de tus metodos para realizar Sign In, pero tranquilo ya lo agregamos!!!!!"
                        })
                    }
                } else {
                    
                    if (contraseñaCoincide.length > 0) {
                        res.json({
                            success: true,
                            from,
                            response: {dataUser},
                            message: "Bienvenido Nuevamente " + dataUser.fullName
                        })

                    } else {
                        
                            res.json({
                                success: false,
                                from,
                                message: "El usuario o password no coinciden"
                            })
                        

                    }
                }
            }

        } catch (err) {
            res.jsonj({
                success: false,
                from: from,
                message: "Ups algo salio mal, reintentalo en unos minutos",
                response: err
            })
        }
    }
}

module.exports = userControllers