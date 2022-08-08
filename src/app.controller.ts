import { Controller, Get } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('add-user')
  async addSubscriber(
    @Payload() user: { name: string; id: number },
    @Ctx() context: RmqContext,
  ): Promise<{
    code: number;
    message: string;
    data: any;
  }> {
    console.log('Microservicio recibi el usuario:', user);

    const channel = context.getChannelRef();

    const originalMsg = context.getMessage();

    channel.ack(originalMsg);

    return {
      code: 1002,
      message: 'usuario creado con exito',
      data: 'usuario: ' + JSON.stringify(user) + ', creado con exito',
    };
  }
}
