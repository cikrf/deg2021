import {MigrationInterface, QueryRunner} from "typeorm";

export class init1627404801149 implements MigrationInterface {
    name = 'init1627404801149'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tx_body" ("id" SERIAL NOT NULL, "body" json NOT NULL, CONSTRAINT "PK_4e7c16e8cac943354e2efaa9ec6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "tx_status_enum" AS ENUM('NEW', 'PENDING', 'SUCCESS', 'ERROR', 'RETRY', 'FAIL')`);
        await queryRunner.query(`CREATE TYPE "tx_last_broadcast_error_status_enum" AS ENUM('ALREADY_IN_THE_STATE', 'INVALID_SIGNATURE', 'ALREADY_IN_PROCESSING', 'CONTRACT_NOT_FOUND', 'UNKNOWN')`);
        await queryRunner.query(`CREATE TABLE "tx" ("id" character varying NOT NULL, "contract_id" character varying NOT NULL, "status" "tx_status_enum" NOT NULL DEFAULT 'NEW', "last_broadcast_error_status" "tx_last_broadcast_error_status_enum", "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "modified" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "height" integer, "error_message" character varying, "error_code" integer NOT NULL DEFAULT '0', "resend_counter" integer NOT NULL DEFAULT '0', "resent" TIMESTAMP WITH TIME ZONE, "bodyId" integer, CONSTRAINT "REL_909e2c70c696618dbd92902c1a" UNIQUE ("bodyId"), CONSTRAINT "PK_2e04a1db73a003a59dcd4fe916b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_17db73caa6128aff5b02fc6def" ON "tx" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_77fb23a4bf2e6281acd3cb5484" ON "tx" ("last_broadcast_error_status") `);
        await queryRunner.query(`CREATE INDEX "IDX_a5302bcbd4626da04603581bf2" ON "tx" ("created") `);
        await queryRunner.query(`ALTER TABLE "tx" ADD CONSTRAINT "FK_909e2c70c696618dbd92902c1a1" FOREIGN KEY ("bodyId") REFERENCES "tx_body"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tx" DROP CONSTRAINT "FK_909e2c70c696618dbd92902c1a1"`);
        await queryRunner.query(`DROP INDEX "IDX_a5302bcbd4626da04603581bf2"`);
        await queryRunner.query(`DROP INDEX "IDX_77fb23a4bf2e6281acd3cb5484"`);
        await queryRunner.query(`DROP INDEX "IDX_17db73caa6128aff5b02fc6def"`);
        await queryRunner.query(`DROP TABLE "tx"`);
        await queryRunner.query(`DROP TYPE "tx_last_broadcast_error_status_enum"`);
        await queryRunner.query(`DROP TYPE "tx_status_enum"`);
        await queryRunner.query(`DROP TABLE "tx_body"`);
    }

}
