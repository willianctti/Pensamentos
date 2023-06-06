
const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')
const conn = require('./db/conn')

// Models
const Pensamento = require('./models/Pensamento')
const User = require('./models/User')

// Routes 
const pensamentosRoutes = require('./routes/pensamentosRoutes')
const PensamentoController = require('./controllers/PensamentoController')


const app = express()

// Template Engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

// Resposta do body
app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

// Session Middleware
app.use(
    session({
        name: "session",
        secret: "nosso_secret",
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function() {},
            path: require('path').join(require('os').tmpdir(), 'sessions')
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    })
)

// Public Path
app.use(express.static('public'))

// Flash Messages
app.use(flash())

// Set Session to res
app.use((req, res, next) => {
    if(req.session.userid) {
        res.locals.session = req.session
    }
    next()
})

// Routes
app.use("/pensamentos", pensamentosRoutes)
app.get("/", PensamentoController.showPensamentos)


conn
    .sync()
    .then(() => {
        app.listen(3000)
    })
    .catch((err) => console.log(err))