import { WebSocketServer } from "ws"
import express from "express"
//enter stuff in terminal to access database
// import commandar from "commander"
import chalk from "chalk"

const app = express()
app.use('/', express.static('public'))
//dynamic urls
let clients = []

const wss = new WebSocketServer({ port: 8080, path: '/socket' }, () => { console.log('Socket started') })

function wrap(tab, date, time, ms, ip, name='unkown'){
	
}

function kick(ws){
	ws.send('Nice try ;)')
	ws.close()
}

wss.on('connection', (ws, rawSocket) => {
	let client = rawSocket.socket.remoteAddress.split(':')[3]
	let tab, date, time, ms
	console.log(chalk.blue(`Client: `) + chalk.green(`${client} connected to socket`))
	clients.push(client)
	ws.on('message', (msg) => {
		let auth = msg.toString().split('/')[0]
		let prefix = msg.toString().split('/')[1]
		let data = msg.toString().split('/')[2]
		if (auth == process.env['password']) {
			switch (prefix) {
			case 'date':
				date = data
				break
			case 'tab':
				tab = data
				break
			case 'time':
				time = data
				break
			case 'ms':
				ms = data
		}
		}else{
			console.log(chalk.blue('Client: ') + client + chalk.red(' Unauthorized'))
			kick(ws)
			console.log(chalk.blue('Client: ') + client + chalk.red(' Kicked'))
			clients.splice(clients.indexOf(client), 1)
		}
		console.log(`${client}: ` +chalk.blue(msg.toString()))
	})

	ws.on('close', () => {
		console.log(chalk.blue(`Client: `) + client + chalk.red(` disconnected`))
		clients.splice(clients.indexOf(client), 1)
		if(client == process.env['julian']){
			wrap(tab, date, time, ms, client, 'julian')	
		}else{
			wrap(tab, date, time, ms, client)
		}
	})
	setInterval(() => {
		if (clients.length > 0) {
			console.log('Clients: ' + clients)
		} else {
			console.log('No clients connected')
		}
	}, 30000)
})
