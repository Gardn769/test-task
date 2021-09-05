export default () => ({
  port: process.env.PORT || 3000,
  database: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: Number(process.env.POSTGRES_PORT) || 5433,
    username: process.env.POSTGRES_USER || 'test',
    password: process.env.POSTGRES_PASSWORD || 'test',
    database: process.env.POSTGRES_DB || 'test',
    logging: false,
    autoLoadEntities: true,
    entities: ['dist/**/*.entity{.ts,.js}'],

    synchronize: true,
  },
});
