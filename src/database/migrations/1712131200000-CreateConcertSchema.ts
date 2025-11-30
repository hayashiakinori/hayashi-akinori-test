import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConcertSchema1712131200000 implements MigrationInterface {
  name = 'CreateConcertSchema1712131200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const isPostgres = queryRunner.connection.options.type === 'postgres';
    if (isPostgres) {
      await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
      await queryRunner.query(
        `CREATE TYPE "concert_status" AS ENUM('予定', '確定', '終了')`
      );
      await queryRunner.query(
        `CREATE TYPE "attachment_type" AS ENUM('link', 'file', 'other')`
      );
    }

    await queryRunner.query(`
      CREATE TABLE "concerts" (
        "id" uuid PRIMARY KEY DEFAULT ${isPostgres ? 'uuid_generate_v4()' : "(lower(hex(randomblob(16))))"},
        "title" text NOT NULL,
        "date" date NULL,
        "time" time NULL,
        "location" text NULL,
        "repertoire" text NULL,
        "conductor" text NULL,
        "ensemble" text NULL,
        "notes" text NULL,
        "ticketUrl" text NULL,
        "status" ${isPostgres ? 'concert_status' : "text CHECK(status in ('予定','確定','終了'))"} NOT NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "performers" (
        "id" uuid PRIMARY KEY DEFAULT ${isPostgres ? 'uuid_generate_v4()' : "(lower(hex(randomblob(16))))"},
        "name" text NOT NULL,
        "role" text NULL,
        "order" integer NULL,
        "concertId" uuid NOT NULL,
        CONSTRAINT "fk_performer_concert" FOREIGN KEY ("concertId") REFERENCES "concerts"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "attachments" (
        "id" uuid PRIMARY KEY DEFAULT ${isPostgres ? 'uuid_generate_v4()' : "(lower(hex(randomblob(16))))"},
        "label" text NOT NULL,
        "url" text NOT NULL,
        "type" ${isPostgres ? 'attachment_type' : "text CHECK(type in ('link','file','other'))"} NOT NULL,
        "order" integer NULL,
        "concertId" uuid NOT NULL,
        CONSTRAINT "fk_attachment_concert" FOREIGN KEY ("concertId") REFERENCES "concerts"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "idx_performer_concert" ON "performers" ("concertId")`
    );
    await queryRunner.query(
      `CREATE INDEX "idx_attachment_concert" ON "attachments" ("concertId")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "attachments"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "performers"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "concerts"`);
    if (queryRunner.connection.options.type === 'postgres') {
      await queryRunner.query(`DROP TYPE IF EXISTS "attachment_type"`);
      await queryRunner.query(`DROP TYPE IF EXISTS "concert_status"`);
    }
  }
}
