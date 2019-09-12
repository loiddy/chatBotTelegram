var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//bot

const Telegraf = require('telegraf')
const botModel = require('./models/bot')


//----------*  insertar el API_Key del bot aqui *----------//
BOT_TOKEN = '';
//----------*  y tu Webhook *----------//
WEBHOOK = '';

const bot = new Telegraf(BOT_TOKEN)
app.use(bot.webhookCallback('/bot'))
bot.telegram.setWebhook('WEBHOOK')

app.post('/bot', (req, res) => {
  res.send('Hello World!')
})

bot.command('info', (ctx) => ctx.reply('Info. Comando /random +msg para enviar un msg a un usuario random'))
bot.command('creators', (ctx) => ctx.reply('Realizado por Rocío, Rubén, Alba y David'))

bot.command('start', (ctx) => {
  // console.log(ctx.from)
  if (ctx.from.id == 899052999) {
    ctx.reply(`${ctx.from.first_name} Flipado, sal del chat inmediatamente y a trabajar!!`)
  }
  botModel.insert(ctx.from).then((rows) => {
    // res.send({ ok: 'Inserción correcta' })
    console.log('OK')
  }).catch((err) => {
    // res.send({ ok: err });
    console.log('KO', err)
  })
})

bot.command('random', (ctx) => {

  let mensaje = ctx.message.text
  var mensajeL = mensaje.replace('/random', '');

  botModel.recuIds().then((rows) => {
    console.log(rows.length);
    var idTelegram = rows[Math.floor(Math.random() * rows.length)]
    bot.telegram.sendMessage(idTelegram.telegram_id, mensajeL).then((res) => {
      console.log('OK', res)
    }).catch((err) => {
      console.log(err)
    })

  }).catch((err) => {
    console.log(err)
  })
})

bot.on('animation', (ctx) => {
  console.log('DOCUMENTTTT: ', ctx.message.document.file_id)
  bot.telegram.sendAnimation(828145620, ctx.message.document.file_id).then((res) => {
    console.log('OK', res)
  }).catch((err) => {
    console.log(err)
  })
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);



app.post('/enviomsg', (req, res) => {
  // res.json(req.body)
  botModel.recuIds().then((rows) => {
    for (let row of rows) {
      bot.telegram.sendMessage(row['telegram_id'], req.body.mensaje).then((res) => {
        console.log('OK', res)
      }).catch((err) => {
        console.log(err)
      })
    }
  }).catch((err) => {
    console.log(err)
  })

})
app.get('/admin', (req, res) => {
  res.render('mensaje');
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;