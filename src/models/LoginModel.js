const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body){
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async register() {
        this.valida();
        if(this.errors.length > 0) return;

        await this.userExists();
        
        if (this.errors.length > 0) return;

        const salt = bcrypt.genSaltSync();
        this.body.password = bcrypt.hashSync(this.body.password, salt);
        
        this.user = await LoginModel.create(this.body);
    }

    async userExists(){
        let users = await LoginModel.findOne({email: this.body.email});
        if(users) this.errors.push("Usuario já existe");
    }

    valida() {
        this.cleanUp();
        if(!validator.isEmail(this.body.email)){
            this.errors.push('E-mail inválido')
        }
        if(this.body.password.length < 3 || this.body.password > 50){
            this.errors.push('A senha precisa ter de 3 a 50 caracteres.')
        }
    }
    cleanUp() {
        for(const key in this.body){
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }
        this.body = {
            email: this.body.email,
            password: this.body.password
        };


    }
}

module.exports = Login;

