import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "../database/entities/user.entity";

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const env = configService.get<string>("APP_ENV", "local");
  const isLocal = env === "local";

  return {
    type: "postgres",
    host: configService.get<string>("DB_HOST", "localhost"),
    port: configService.get<number>("DB_PORT", 5432),
    username: configService.get<string>("DB_USERNAME", "postgres"),
    password: configService.get<string>("DB_PASSWORD", "password"),
    database: configService.get<string>("DB_DATABASE", "database"),
    ...(!isLocal && {
      ssl: {
        rejectUnauthorized: configService.get<boolean>(
          "DB_SSL_REJECT_UNAUTHORIZED",
          false,
        ),
      },
    }),
    // Configuration SSL pour Neon
    ssl:
      configService.get<string>("DB_SSL") === "true"
        ? {
            rejectUnauthorized: false,
          }
        : false,
    entities: [User],
    synchronize: configService.get<boolean>("DB_SYNCHRONIZE", false),
    autoLoadEntities: configService.get<boolean>("DB_AUTO_LOAD_ENTITIES", true),
  };
};
