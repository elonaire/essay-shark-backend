import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Logger, UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { WsGuard } from 'src/auth/ws.guard';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly chartService: ChatService
    ) {}

  @WebSocketServer()
  server;

  private logger: Logger = new Logger('ChatGateway');

  @UseGuards(WsGuard)
  @SubscribeMessage('message')
  async handleMessage(@MessageBody() data: any) {
    let chatCreated = await this.chartService.createChat(data);
    if (chatCreated) {
      this.server.emit('message', chatCreated);
    }
    this.logger.log('data received: ' + data);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    this.logger.log(`Client connected: ${args}`);
  }
}
