import {MigrationInterface, QueryRunner} from "typeorm";

export class init1625214342849 implements MigrationInterface {
    name = 'init1625214342849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blocks" ("height" integer NOT NULL, "signature" bytea NOT NULL, "time_stamp" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_50fcf07511f97f0c50f28fa26d2" PRIMARY KEY ("height"))`);
        await queryRunner.query(`CREATE TABLE "master" ("id" character varying NOT NULL, "contract_id" bytea NOT NULL, "poll_id" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'pollInitiated', "public_key" bytea NOT NULL, "private_key" bytea NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_45f872cd1256f3670aee18244c1" UNIQUE ("contract_id"), CONSTRAINT "UQ_78ff5dc0e49e53f74ffa0c16c2d" UNIQUE ("poll_id"), CONSTRAINT "PK_1ad656927ad7cd2b8a20c27e44c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tx" ("index" SERIAL NOT NULL, "height" integer NOT NULL, "contract_id" bytea NOT NULL, "operation" character varying NOT NULL, "sender_public_key" bytea NOT NULL, "tx_id" bytea NOT NULL, "params" json NOT NULL, "diff" json NOT NULL, "time_stamp" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_f13704b875bb56e1c40d6c6790c" PRIMARY KEY ("index"))`);
        await queryRunner.query(`CREATE INDEX "IDX_744f64759bf8f4ecbf65d31835" ON "tx" ("height") `);
        await queryRunner.query(`CREATE INDEX "IDX_7cc07a8f938a4491f4cbacaf28" ON "tx" ("sender_public_key") `);
        await queryRunner.query(`CREATE INDEX "IDX_b9dc071fcba80730f71be896f8" ON "tx" ("time_stamp") `);
        await queryRunner.query(`CREATE INDEX "IDX_fd0160260a6b89fb9292acb646" ON "tx" ("contract_id", "operation") `);
        await queryRunner.query(`CREATE TABLE "vote" ("index" SERIAL NOT NULL, "height" integer NOT NULL, "contract_id" bytea NOT NULL, "sender_public_key" bytea NOT NULL, "time_stamp" TIMESTAMP WITH TIME ZONE NOT NULL, "failed" boolean NOT NULL, "valid" boolean NOT NULL DEFAULT false, "processed" boolean NOT NULL DEFAULT false, "tx_id" bytea NOT NULL, "vote" bytea NOT NULL, "retry" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_c630f7364ebb0c91d431679011f" PRIMARY KEY ("index"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7c78f682dd1d6d2f283e461d59" ON "vote" ("height") `);
        await queryRunner.query(`CREATE INDEX "IDX_35e0ce508e77782272516d3f2d" ON "vote" ("contract_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_fba2d5c3d582b5930abfefc40b" ON "vote" ("sender_public_key") `);
        await queryRunner.query(`CREATE INDEX "IDX_462ffab9559e7e642705eecd88" ON "vote" ("time_stamp") `);
        await queryRunner.query(`CREATE INDEX "IDX_c0e0874e7c567f2c1de3ece5b9" ON "vote" ("processed") WHERE NOT "processed"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_c0e0874e7c567f2c1de3ece5b9"`);
        await queryRunner.query(`DROP INDEX "IDX_462ffab9559e7e642705eecd88"`);
        await queryRunner.query(`DROP INDEX "IDX_fba2d5c3d582b5930abfefc40b"`);
        await queryRunner.query(`DROP INDEX "IDX_35e0ce508e77782272516d3f2d"`);
        await queryRunner.query(`DROP INDEX "IDX_7c78f682dd1d6d2f283e461d59"`);
        await queryRunner.query(`DROP TABLE "vote"`);
        await queryRunner.query(`DROP INDEX "IDX_fd0160260a6b89fb9292acb646"`);
        await queryRunner.query(`DROP INDEX "IDX_b9dc071fcba80730f71be896f8"`);
        await queryRunner.query(`DROP INDEX "IDX_7cc07a8f938a4491f4cbacaf28"`);
        await queryRunner.query(`DROP INDEX "IDX_744f64759bf8f4ecbf65d31835"`);
        await queryRunner.query(`DROP TABLE "tx"`);
        await queryRunner.query(`DROP TABLE "master"`);
        await queryRunner.query(`DROP TABLE "blocks"`);
    }

}
