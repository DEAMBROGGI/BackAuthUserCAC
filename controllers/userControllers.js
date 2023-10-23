const bcryptjs = require('bcryptjs')
const Users = require('../models/userModel')
const User = require('../models/userModel')

const userControllers = {

   
    SignUp: async (req, res) => {
        const {fullName, email, password, from, aplication} = req.body.userData
        const contraseñaHash = bcryptjs.hashSync(password, 10)
        try {
            const userExist = await Users.findOne({email})

            if(userExist){
                if(userExist.from.indexOf(from) !== -1){
                    res.json({
                        success:false,
                        from:from,
                        message: "Ya realizaste sign up mediante " +from+ " por favor realiza singin"
                    })
                }
                else{

                    userExist.from.push(from)
                    userExist.password.push(contraseñaHash)

                    await userExist.save()

                    res.json({
                        success:true,
                        from: from,
                        message: "Se agrego "+from+" a tus metodos para realizar signin"
                    })
                }

            }
            else{

                const nuevoUsuario = new User({
                    fullName,
                    email,
                    password:[contraseñaHash],
                    from:[from],
                    aplication
                })

                await nuevoUsuario.save()

                res.json({
                    success: true,
                    from: from,
                    message: " Felicitaciones creamos tu usuario y agregamos " +from+ " a tus metodos para realizar signin"
                })

            }
        

        }
        catch (error) {
            console.log(error)
            res.json({ success: false, message: "Algo a salido mal intentalo en unos minutos" })
        }
    }
}

module.exports = userControllers