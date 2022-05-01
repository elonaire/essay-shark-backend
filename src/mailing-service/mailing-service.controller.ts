import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MailBody } from './mail.entity';
import { MailingServiceService } from './mailing-service.service';

@ApiTags('Mailing')
@Controller('mailing-service')
export class MailingServiceController {
    constructor(
        private readonly mailerService: MailingServiceService
    ) {}

    @Post('send-mail')
    sendEMail(@Body() mailDetails: MailBody): Promise<any> {
        return this.mailerService.sendEMail(mailDetails);
    }
}
