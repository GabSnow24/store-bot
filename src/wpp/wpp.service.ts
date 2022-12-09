import { Injectable } from '@nestjs/common';
import { CreateWppDto } from './dto/create-wpp.dto';
import { UpdateWppDto } from './dto/update-wpp.dto';
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@adiwajshing/baileys'
import { Boom } from '@hapi/boom'


@Injectable()
export class WppService {
  private socket: any

  async connAndCreate() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    this.socket = makeWASocket({
      printQRInTerminal: true,
      auth: state
    })
    this.socket.ev.on('connection.update', (update: { connection: any; lastDisconnect: any; }) => {
      const { connection, lastDisconnect } = update
      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason?.loggedOut
        console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect)
        // reconnect if not logged out
        if (shouldReconnect) {
          this.connAndCreate()
        }
      } else if (connection === 'open') {
        console.log('opened connection')
      }
    })
    this.socket.ev.on('creds.update', async () => {
      await saveCreds()
    })
    this.socket.ev.on('messages.upsert', async (m: { messages: { key: { remoteJid: any; }; }[]; }) => {
      console.log(JSON.stringify(m, undefined, 2))

      console.log('replying to', m.messages[0].key.remoteJid)
      await this.socket.sendMessage(m.messages[0].key.remoteJid!, { text: 'Hello there!' })
    })
  }

  findAll() {
    return `This action returns all wpp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wpp`;
  }

  update(id: number, updateWppDto: UpdateWppDto) {
    return `This action updates a #${id} wpp`;
  }

  remove(id: number) {
    return `This action removes a #${id} wpp`;
  }
}
