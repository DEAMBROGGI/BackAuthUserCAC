const bcryptjs = require('bcryptjs')
const Users = require('../models/userModel')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const {google} = require('googleapis') 
const OAuth2 = google.auth.OAuth2

const sendMail = async (email, uniqueString)=>{

    const myOAuth2Client = new OAuth2(
        process.env.GOOGLE_CLIENTID,
        process.env.GOOGLE_SECRET,
        "https://developers.google.com/oauthplayground"
    )

    myOAuth2Client.setCredentials({refresh_token:process.env.GOOGLE_REFRESHTOKEN})

    const accessToken = myOAuth2Client.getAccessToken()

    const transporter = nodemailer.createTransport({

        service: "gmail",
        auth:{
            user:"useremailverifymindhub@gmail.com",
            type: "OAuth2",
            clientId: process.env.GOOGLE_CLIENTID,
            clientSecret:process.env.GOOGLE_SECRET,
            refreshToken: process.env.GOOGLE_REFRESHTOKEN,
            accessToken: accessToken
        },
        tls:{
            rejectUnauthorized: false
        } 
    })

    const mailOptions = {
        from: "useremailverifymindhub@gmail.com",
        to: email,
        subject: "Validacion de mail",
        html:`
        <div>
        <h1><a href=http://localhost:5000/api/users/auth/verifyEmail/${uniqueString}>CLICK </a> para validar tu cuenta</h1>
        </div>
        `
    }

    transporter.sendMail(mailOptions, function(error, response){
        if(error){console.log(error)}
        else{console.log("mensaje enviado")}
    })

}

const userControllers = {


    SignUp: async (req, res) => {

        const { fullName, email, password, from, aplication } = req.body.userData
        const contraseñaHash = bcryptjs.hashSync(password, 10)
        const emailVerify = false
        const uniqueString = crypto.randomBytes(15).toString('hex')
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

                    if(from !== "signUp-form"){
                       userExist.emailVerify = true 
                    }
                    
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
                    aplication,
                    emailVerify,
                    uniqueString
                })

                if (from === "signUp-form") {

                    await nuevoUsuario.save()
                    sendMail(email, uniqueString)
                    //Funcion que envia el mail
                    res.json({
                        success: true,
                        from: from,
                        message: " Revisa tu mail para validarlo y completar el sign up"
                    })
                }
                else {
                    nuevoUsuario.emailVerify = true
                    await nuevoUsuario.save()

                    res.json({
                        success: true,
                        from: from,
                        message: " Felicitaciones creamos tu usuario y agregamos " + from + " a tus metodos para realizar signin"
                    })
                }
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
                    message: "No has realizado sing Up con este email, realizalo antes de hacer sign IN"
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
                            response: { dataUser },
                            message: "Bienvenido Nuevamente " + dataUser.fullName
                        })

                    } else {
                        const contraseñaHash = bcryptjs.hashSync(password, 10)
                        usuario.from.push(from)
                        usuario.password.push(contraseñaHash)

                        await usuario.save()

                        res.json({
                            success: true,
                            from,
                            response: { dataUser },
                            message: "No contaban con " + from + " dentro de tus metodos para realizar Sign In, pero tranquilo ya lo agregamos!!!!!"
                        })
                    }
                } else {

                    if (contraseñaCoincide.length > 0) {
                        res.json({
                            success: true,
                            from,
                            response: { dataUser },
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
    },
    verifyMail: async (req, res)=>{
        const {string} = req.params
        const user = await Users.findOne({uniqueString:string})
        

        try{
        if(user){
            user.emailVerify = true
            await user.save()
            res.redirect("http://localhost:3000/signin")
            // res.json({
            //     success: false,
            //     from: "verify",
            //     message: "Mail verificado correctamente Felicitaciones!!!!!"
            // })  
            
        }else{
            res.json({
                success: false,
                from: "verify",
                message: "Email del usuario no pudo ser verificado"
            })
        }
    }catch(err){console.log(err)}
    }
}

module.exports = userControllers