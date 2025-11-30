import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class CreateConcerts1720000000000 implements MigrationInterface {
  name = 'CreateConcerts1720000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const isPostgres = queryRunner.connection.driver.options.type === 'postgres';

    if (isPostgres) {
      await queryRunner.query(
        `CREATE TYPE "concert_status_enum" AS ENUM('予定', '確定', '終了')`
      );
      await queryRunner.query(
        `CREATE TYPE "attachment_type_enum" AS ENUM('link', 'document', 'other')`
      );
    }

    await queryRunner.createTable(
      new Table({
        name: 'concerts',
        columns: [
          {
            name: 'id',
            type: isPostgres ? 'serial' : 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: isPostgres ? 'increment' : undefined
          },
          { name: 'title', type: 'text', isNullable: false },
          { name: 'date', type: 'date', isNullable: true },
          { name: 'time', type: 'time', isNullable: true },
          { name: 'location', type: 'text', isNullable: true },
          { name: 'repertoire', type: 'text', isNullable: true },
          { name: 'conductor', type: 'text', isNullable: true },
          { name: 'ensemble', type: 'text', isNullable: true },
          { name: 'notes', type: 'text', isNullable: true },
          { name: 'ticketUrl', type: 'text', isNullable: true },
          {
            name: 'status',
            type: isPostgres ? 'concert_status_enum' : 'text',
            default: `'予定'`
          },
          new TableColumn({
            name: 'created_at',
            type: isPostgres ? 'timestamptz' : 'datetime',
            default: isPostgres ? 'now()' : "datetime('now')"
          }),
          new TableColumn({
            name: 'updated_at',
            type: isPostgres ? 'timestamptz' : 'datetime',
            default: isPostgres ? 'now()' : "datetime('now')"
          })
        ]
      })
    );

    await queryRunner.createTable(
      new Table({
        name: 'performers',
        columns: [
          {
            name: 'id',
            type: isPostgres ? 'serial' : 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: isPostgres ? 'increment' : undefined
          },
          { name: 'concert_id', type: 'integer' },
          { name: 'name', type: 'text' },
          { name: 'role', type: 'text', isNullable: true },
          { name: 'order', type: 'integer', isNullable: true }
        ],
        foreignKeys: [
          {
            columnNames: ['concert_id'],
            referencedTableName: 'concerts',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE'
          }
        ]
      })
    );

    await queryRunner.createTable(
      new Table({
        name: 'attachments',
        columns: [
          {
            name: 'id',
            type: isPostgres ? 'serial' : 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: isPostgres ? 'increment' : undefined
          },
          { name: 'concert_id', type: 'integer' },
          { name: 'label', type: 'text' },
          { name: 'url', type: 'text' },
          {
            name: 'type',
            type: isPostgres ? 'attachment_type_enum' : 'text',
            default: `'link'`
          },
          { name: 'order', type: 'integer', isNullable: true }
        ],
        foreignKeys: [
          {
            columnNames: ['concert_id'],
            referencedTableName: 'concerts',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE'
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const isPostgres = queryRunner.connection.driver.options.type === 'postgres';

    await queryRunner.dropTable('attachments');
    await queryRunner.dropTable('performers');
    await queryRunner.dropTable('concerts');

    if (isPostgres) {
      await queryRunner.query(`DROP TYPE "attachment_type_enum"`);
      await queryRunner.query(`DROP TYPE "concert_status_enum"`);
    }
  }
}
