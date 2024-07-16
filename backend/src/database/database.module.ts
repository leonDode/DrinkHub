import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drink } from 'src/drinks/entities/drinks.entity';
import { Ingrediente } from 'src/drinks/entities/ingredientes.entity';
import { Tag } from 'src/drinks/entities/tags.entity';
import { DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
        type: 'postgres',
        host: 'viaduct.proxy.rlwy.net',
        port: 27696,
        username: 'postgres',
        password: 'rykdmIMfaVgDDPrYpeNYOSCXNxCDVCLf',
        database: 'railway',
        entities: [Drink,Tag,Ingrediente],
        synchronize: true
}

@Module({
    imports: [TypeOrmModule.forRootAsync({
        useFactory: () => {
            return {
                ...dataSourceOptions

            }
        } 
    })]
})
export class DatabaseModule {}
