import { Injectable } from '@nestjs/common';
import * as oracledb from 'oracledb';

import { envs } from '../../../config/environment-vars';

export type OracleConfig = {
  user: string;
  password: string;
  connectString: string;
};

@Injectable()
export class OracleLibrary {
  private readonly config: OracleConfig;
  private pool: oracledb.Pool;

  constructor() {
    this.config = {
      user: envs.oracleUser,
      password: envs.oraclePassword,
      connectString: envs.oracleConnectString,
    };
    this.initializePool();
  }

  private async initializePool() {
    this.pool = await oracledb.createPool(this.config);
  }

  private buildWhereClause(filters: Record<string, any>): {
    clause: string;
    values: any[];
  } {
    const keys = Object.keys(filters);
    if (keys.length === 0) return { clause: '', values: [] };

    const clause = keys.map((key) => `${key} = :${key}`).join(' AND ');
    const values = keys.map((key) => ({ name: key, value: filters[key] }));

    return { clause: `WHERE ${clause}`, values };
  }

  async getRecord(
    tableName: string,
    filters: Record<string, any>,
    fields: string[] = ['*'],
    orderBy?: string[],
  ): Promise<any> {
    const { clause, values } = this.buildWhereClause(filters);
    const orderClause = orderBy ? `ORDER BY ${orderBy.join(', ')}` : '';
    const selectFields = fields.join(', ');
    const sqlQuery = `SELECT ${selectFields} FROM ${tableName} ${clause} ${orderClause} FETCH NEXT 1 ROWS ONLY`;
    const connection = await this.pool.getConnection();
    const result = await connection.execute(
      sqlQuery,
      values.reduce((acc, param) => {
        acc[param.name] = param.value;
        return acc;
      }, {}),
    );
    await connection.close();
    return result.rows ? result.rows[0] : null;
  }

  async listRecords(
    tableName: string,
    filters: Record<string, any>,
    fields: string[] = ['*'],
    orderBy?: string[],
  ): Promise<any[]> {
    const { clause, values } = this.buildWhereClause(filters);
    const orderClause = orderBy ? `ORDER BY ${orderBy.join(', ')}` : '';
    const selectFields = fields.join(', ');
    const sqlQuery = `SELECT ${selectFields} FROM ${tableName} ${clause} ${orderClause}`;
    const connection = await this.pool.getConnection();
    const result = await connection.execute(
      sqlQuery,
      values.reduce((acc, param) => {
        acc[param.name] = param.value;
        return acc;
      }, {}),
    );
    await connection.close();
    return result.rows ?? [];
  }

  async listRecordsPaginated(
    tableName: string,
    filters: Record<string, any>,
    limit: number,
    offset: number,
    fields: string[] = ['*'],
    orderBy?: string[],
  ): Promise<any[]> {
    const { clause, values } = this.buildWhereClause(filters);
    const orderClause = orderBy ? `ORDER BY ${orderBy.join(', ')}` : '';
    const selectFields = fields.join(', ');
    const sqlQuery = `SELECT ${selectFields} FROM ${tableName} ${clause} ${orderClause} OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`;
    const connection = await this.pool.getConnection();
    const result = await connection.execute(sqlQuery, {
      ...values.reduce((acc, param) => {
        acc[param.name] = param.value;
        return acc;
      }, {}),
      offset,
      limit,
    });
    await connection.close();
    return result.rows ?? [];
  }

  async insertRecord(
    tableName: string,
    record: Record<string, any>,
  ): Promise<void> {
    const columns = Object.keys(record).join(', ');
    const placeholders = Object.keys(record)
      .map((key) => `:${key}`)
      .join(', ');
    const values = Object.values(record);

    const sqlQuery = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
    const connection = await this.pool.getConnection();
    await connection.execute(sqlQuery, record);
    await connection.commit();
    await connection.close();
  }

  async updateRecord(
    tableName: string,
    filters: Record<string, any>,
    record: Record<string, any>,
  ): Promise<void> {
    const updates = Object.keys(record)
      .map((key) => `${key} = :${key}`)
      .join(', ');
    const updateValues = Object.values(record);
    const { clause, values: filterValues } = this.buildWhereClause(filters);

    const sqlQuery = `UPDATE ${tableName} SET ${updates} ${clause}`;
    const connection = await this.pool.getConnection();
    await connection.execute(sqlQuery, {
      ...record,
      ...filterValues.reduce((acc, param) => {
        acc[param.name] = param.value;
        return acc;
      }, {}),
    });
    await connection.commit();
    await connection.close();
  }

  async deleteRecord(
    tableName: string,
    filters: Record<string, any>,
  ): Promise<void> {
    const { clause, values } = this.buildWhereClause(filters);
    const sqlQuery = `DELETE FROM ${tableName} ${clause}`;
    const connection = await this.pool.getConnection();
    await connection.execute(
      sqlQuery,
      values.reduce((acc, param) => {
        acc[param.name] = param.value;
        return acc;
      }, {}),
    );
    await connection.commit();
    await connection.close();
  }

  async callStoredProcedure(
    procedureName: string,
    inputParams: Record<string, any> = {},
    outputParams: string[] = [],
  ): Promise<any> {
    const connection = await this.pool.getConnection();
    const binds = { ...inputParams };
    outputParams.forEach((param) => {
      binds[param] = { dir: oracledb.BIND_OUT, type: oracledb.STRING }; // Assuming output params are of type STRING, adjust as needed
    });

    const result = await connection.execute(
      `BEGIN ${procedureName}(${Object.keys(binds)
        .map((key) => `:${key}`)
        .join(', ')}); END;`,
      binds,
    );

    const output = outputParams.reduce((acc: Record<string, any>, param) => {
      acc[param] = (result.outBinds as Record<string, any>)[param];
      return acc;
    }, {});

    await connection.close();
    return { result: result.rows, output };
  }
}

/*
export PATH=/path/to/instant/client:$PATH
export LD_LIBRARY_PATH=/path/to/instant/client:$LD_LIBRARY_PATH

https://www.oracle.com/database/technologies/instant-client/downloads.html
*/
