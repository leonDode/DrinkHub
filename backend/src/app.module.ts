import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrinksModule } from './drinks/drinks.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DrinksModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
