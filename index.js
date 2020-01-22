const feathers = require('@feathersjs/feathers')
const express = require('@feathersjs/express')
const socketio = require('@feathersjs/socketio')

class MessageService {

    constructor() {
        this.messages = []
    }
    async find(){
        return this.messages
    }
    async create(data) {
        const message = {
            id: this.messages.length,
            text: data.text
        }
        this.messages.push(message)
        return message
    }
}
// regiser the service with express middlware
const app = express(feathers())
app.use(express.json()) 
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname))

app.configure(express.rest())
app.configure(socketio())

// allow express and feathers to be used too

app.use('/messages', new MessageService())

app.use(express.errorHandler())

app.on('connection', connection => {
    app.channel('everybody').join(connection)
});

app.publish(() => {
    app.channel('everybody')
})

app.listen(3000).on('listening',()=> {
    console.log('Feathers server listining on localhost 3000')
})

app.service('messages').create({
    text: 'Text is moving'
})

// app.service('messages').on('created', ( message ) => {

//     console.log('A new message has been created', message)

// })

// const main = async() => {
//     await app.service('messages').create({
//         text: 'Hello Giordi'
//     })

//     await app.service('messages').create({
//         text: 'Hello Giordi Again'
//     })

//     const messages = await app.service('messages').find()
//     console.log('All messages',  messages)
// }

// main()