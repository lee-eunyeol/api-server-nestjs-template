import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  //https://socket.io/docs/v4/using-multiple-nodes/#enabling-sticky-session
  transports: ['websocket'],
})
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('Init');
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client Disconnected : ${client.id}`);
  }

  handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    console.log(`Client Connected : ${client.id}`);
  }
  @SubscribeMessage('events')
  findAll(@MessageBody() data: any, @ConnectedSocket() socket: Socket): Observable<WsResponse<number>> {
    console.log(socket.id);
    return from([1, 2, 3]).pipe(map((item) => ({ event: 'events', data: item })));
    // const event = 'events'; 동기적 emit
    // return { event, data };
  }
}
