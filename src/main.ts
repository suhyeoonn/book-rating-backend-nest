import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  // CORS 활성화
  app.enableCors({
    origin: process.env.CLIENT_DOMAIN,
    credentials: true, // 쿠키 사용 시 필요
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  const config = new DocumentBuilder()
    .setTitle('Book Rating APIs')
    .setDescription(
      'REST API를 통해 사용자는 각 책에 별점을 매기고 리뷰를 남길 수 있으며, JWT 기반 인증으로 보안을 제공합니다.',
    )
    .setVersion('1.0')
    .addCookieAuth('jwt')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 5000, '0.0.0.0');
}
bootstrap();
