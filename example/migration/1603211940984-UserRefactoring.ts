import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRefactoring1603211940984 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE user CHANGE name name_migra varchar(255)');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE user CHANGE name_migra name varchar(255)'); // 恢复"up"方法所做的事情
  }

}
