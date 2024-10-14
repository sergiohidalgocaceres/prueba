import { Injectable } from '@nestjs/common';
import * as sql from 'mssql';

import { envs } from '../../../config/environment-vars';

export type SQLServerConfig = {
  user: string;
  password: string;
  server: string;
  database: string;
  options: {
    encrypt: boolean;
    enableArithAbort: boolean;
  };
};

@Injectable()
export class SQLServerLibrary {
  private readonly config: SQLServerConfig;
  private readonly pool: sql.ConnectionPool;

  constructor() {
    this.config = {
      user: envs.sqlServerUser,
      password: envs.sqlServerPassword,
      server: envs.sqlServerHost,
      database: envs.sqlServerDatabase,
      options: {
        encrypt: true,
        enableArithAbort: true,
      },
    };
    this.pool = new sql.ConnectionPool(this.config);
    this.pool.connect();
  }

  private buildWhereClause(filters: Record<string, any>): {
    clause: string;
    values: any[];
  } {
    const keys = Object.keys(filters);
    if (keys.length === 0) return { clause: '', values: [] };

    const clause = keys.map((key) => `${key} = @${key}`).join(' AND ');
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
    const sqlQuery = `SELECT ${selectFields} FROM ${tableName} ${clause} ${orderClause} OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY`;
    const request = this.pool.request();
    values.forEach((param) => request.input(param.name, param.value));
    const result = await request.query(sqlQuery);
    return result.recordset[0];
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
    const request = this.pool.request();
    values.forEach((param) => request.input(param.name, param.value));
    const result = await request.query(sqlQuery);
    return result.recordset;
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
    const sqlQuery = `SELECT ${selectFields} FROM ${tableName} ${clause} ${orderClause} OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;
    const request = this.pool.request();
    values.forEach((param) => request.input(param.name, param.value));
    request.input('limit', sql.Int, limit);
    request.input('offset', sql.Int, offset);
    const result = await request.query(sqlQuery);
    return result.recordset;
  }

  async insertRecord(
    tableName: string,
    record: Record<string, any>,
  ): Promise<void> {
    const columns = Object.keys(record).join(', ');
    const placeholders = Object.keys(record)
      .map((key) => `@${key}`)
      .join(', ');
    const values = Object.values(record);

    const sqlQuery = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
    const request = this.pool.request();
    Object.keys(record).forEach((key, index) =>
      request.input(key, values[index]),
    );
    await request.query(sqlQuery);
  }

  async updateRecord(
    tableName: string,
    filters: Record<string, any>,
    record: Record<string, any>,
  ): Promise<void> {
    const updates = Object.keys(record)
      .map((key) => `${key} = @${key}`)
      .join(', ');
    const updateValues = Object.values(record);
    const { clause, values: filterValues } = this.buildWhereClause(filters);

    const sqlQuery = `UPDATE ${tableName} SET ${updates} ${clause}`;
    const request = this.pool.request();
    Object.keys(record).forEach((key, index) =>
      request.input(key, updateValues[index]),
    );
    filterValues.forEach((param) => request.input(param.name, param.value));
    await request.query(sqlQuery);
  }

  async deleteRecord(
    tableName: string,
    filters: Record<string, any>,
  ): Promise<void> {
    const { clause, values } = this.buildWhereClause(filters);
    const sqlQuery = `DELETE FROM ${tableName} ${clause}`;
    const request = this.pool.request();
    values.forEach((param) => request.input(param.name, param.value));
    await request.query(sqlQuery);
  }

  async callStoredProcedure(
    procedureName: string,
    inputParams: Record<string, any> = {},
    outputParams: string[] = [],
  ): Promise<any> {
    const request = this.pool.request();
    Object.keys(inputParams).forEach((key) =>
      request.input(key, inputParams[key]),
    );
    outputParams.forEach((param) => request.output(param, sql.VarChar)); // Assuming output params are of type VarChar, adjust as needed

    const result = await request.execute(procedureName);
    const output = outputParams.reduce(
      (acc: Record<string, any>, param) => {
        acc[param] = result.output[param];
        return acc;
      },
      {} as Record<string, any>,
    );

    return { result: result.recordset, output };
  }
}
