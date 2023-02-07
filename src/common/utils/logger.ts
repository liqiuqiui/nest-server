import { ConsoleLogger } from '@nestjs/common';

export class Logger extends ConsoleLogger {
  log(message: any) {
    if (typeof message === 'string') {
      super.log(message);
    } else
      super.log(
        JSON.stringify(message, null, '  ')?.replace(/\"(.*)"(?=:)/g, '$1'),
      );
  }
}
