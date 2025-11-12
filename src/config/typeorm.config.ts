// import { DataSourceOptions } from 'typeorm';
// import { ConfigService } from '@nestjs/config';

// export const getDatabaseConfig = (
//   configService: ConfigService,
// ): DataSourceOptions => ({
//   type: 'postgres',
//   url: configService.get<string>('DATABASE_URL'),
//   entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//   synchronize: configService.get<string>('NODE_ENV') !== 'production',
//   logging: configService.get<string>('NODE_ENV') === 'development',
//   ssl: configService.get<string>('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
// });

// src/config/typeorm.config.ts
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    type: 'postgres',
    url: configService.get<string>('DATABASE_URL'),
    ssl: configService.get<string>('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
    autoLoadEntities: true,
    synchronize: false,
    migrationsRun: false,
    logging: configService.get<string>('NODE_ENV') !== 'production',
    // In development TypeORM will pick up entities from compiled dist if you build; autoLoadEntities will use runtime entities.
  }),
};
