import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './modules/comments/comments.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { UploadModule } from './upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/health_db'),
    UserModule,
    AuthModule,
    CommentsModule,
    AppointmentsModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
