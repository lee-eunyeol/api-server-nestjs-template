import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger';
import { SharedModule } from './shared/shared.module';
import { ConfigShared } from './shared/services/config.shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.select(SharedModule).get(ConfigShared);
  await app.listen(3000);

  if (process.env.NODE_ENV !== 'production') {
    setupSwagger(app);
  }
}
bootstrap();
