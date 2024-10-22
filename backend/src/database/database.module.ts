import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drink } from 'src/drinks/entities/drinks.entity';
import { Ingrediente } from 'src/drinks/entities/ingredientes.entity';
import { Tag } from 'src/drinks/entities/tags.entity';
import { Usuario } from 'src/drinks/entities/usuario.entity';
import { DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
        type: 'postgres',
        host: 'viaduct.proxy.rlwy.net',
        port: 27696,
        username: 'postgres',
        password: 'rykdmIMfaVgDDPrYpeNYOSCXNxCDVCLf',
        database: 'railway',
        entities: [Drink,Tag,Ingrediente,Usuario],
        synchronize: false
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
