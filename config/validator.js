const joi = require("joi")

const validator = (req, res, next) => {
    
    const schema = joi.object({
        fullName: joi.string()
            .required(),
        email: joi.string() 
        .email({minDomainSegments:2})
        .required()
        .messages({
            'string.email':'formato incorrecto de mail'
        }),
        password: joi.string() 
            .min(8)
            .max(30)
            .pattern(new RegExp(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/))
            .required()
            .messages({
                'string.min': 'el password debe tener un minimo de 8 caracteres',
                'string.max': 'el password debe tener un maximo de 30 caracteres',
                'string.pattern.base':'el password debe contener mayuscula, minuscula y numeros'
            }),
        from: joi.string()
            .required(),
        aplication: joi.string()
            .required()


    })
    const validation = schema.validate(req.body.userData, { abortEarly: false })
    if (validation.error) {
        return res.json({
            success: false,
            from: "validador",
            message: validation.error.details
        })
    }
    next()
}
module.exports = validator