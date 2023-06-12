const Pensamento = require('../models/Pensamento')
const User = require('../models/User')

const { Op} = require('sequelize')

module.exports = class PensamentoController {
    static async showPensamentos(req, res) {
        let search = ''
        if(req.query.search) {
            search = req.query.search
        }

        let order = 'DESC'
        if(req.query.order === 'old') {
            order = 'ASC'
        } else {
            order = 'DESC'
        }


        const pensamentosData = await Pensamento.findAll({
            include: User,
            where: {
                title: {[Op.like]: `%${search}%`},
            },
            ORDER: [['createdAt', order]]
        })
        const pensamentos = pensamentosData.map((result) => result.get({plain: true}))

        let pensamentosQty = pensamentos.length
        if(pensamentosQty=== 0) {
            pensamentosQty = false
        }


        res.render('pensamentos/home', {pensamentos, search, pensamentosQty})
    }

    static async dashboard(req, res) {
        const userId = req.session.userid
        const user = await User.findOne({
            where: {
                id: userId,
            },
            include: Pensamento, 
            plain: true,
        })

        if(!user) {
            res.redirect('/login')
        }
        const pensamentos = user.Pensamentos.map((result) => result.dataValues)

        let emptyPensamentos = false
        if(pensamentos.length === 0) {
            emptyPensamentos = true
            
        }


        res.render('pensamentos/dashboard', { pensamentos})


    }

    static createPensamento(req, res) {
        res.render('pensamentos/create')
    }

    static async createPensamentoSave(req, res) {
        const pensamento =  {
            title: req.body.title,
            UserId: req.session.userid

        }

        try {
            await Pensamento.create(pensamento)
            req.flash('message', 'Pensamento criado com sucesso!')

            req.session.save(() => {
                res.redirect('/pensamentos/dashboard')
           })

        } catch(error) {
            console.log(error)
        }
    }

    static async removePensamento(req, res) {
        const id = req.body.id
        const UserId = req.session.userid

        try {
            await Pensamento.destroy({where: {id: id, UserId: UserId}})
            req.flash('message', 'Pensamento removido com sucesso!')

            req.session.save(() => {
                res.redirect('/pensamentos/dashboard')
            })
        } catch(error) {
            console.log(error)
        }
    }

    static async updatePensamento(req, res) {
        const id = req.params.id

        const pensamento = await Pensamento.findOne({where: {id: id}, raw: true})

        res.render('pensamentos/edit', { pensamento})
    }

    static async updatePensamentoSave(req, res) {

        const id = req.body.id
        const pensamento  = {
            title: req.body.title
        }

        try {
            await Pensamento.update(pensamento, {where: {id: id}})
            req.flash('message', 'Pensamento alterado com sucesso!')
    
            req.session.save(() => {
                res.redirect('/pensamentos/dashboard')
            })
        } catch(error) {
            console.log(error)
        }
    }
}