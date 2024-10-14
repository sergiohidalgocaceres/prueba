import { Inject, Injectable } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

import { MYSQL_OPTIONS } from './mysql.symbols';
import { MySQLConfig } from './mysql.type';

@Injectable()
export class MySQLService {
  private readonly pool: mysql.Pool;

  constructor(@Inject(MYSQL_OPTIONS) options: MySQLConfig) {
    this.pool = mysql.createPool(options);
  }

  private buildWhereClause(filters: Record<string, any>): {
    clause: string;
    values: any[];
  } {
    const keys = Object.keys(filters);
    if (keys.length === 0) return { clause: '', values: [] };

    const clause = keys.map((key) => `${key} = ?`).join(' AND ');
    const values = keys.map((key) => filters[key]);

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
    const sql = `SELECT ${selectFields} FROM ${tableName} ${clause} ${orderClause} LIMIT 1`;
    const [rows]: [any[], any] = await this.pool.query(sql, values);
    return rows[0];
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
    const sql = `SELECT ${selectFields} FROM ${tableName} ${clause} ${orderClause}`;
    const [rows] = (await this.pool.query(sql, values)) as [any[], any];
    return rows;
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
    const sql = `SELECT ${selectFields} FROM ${tableName} ${clause} ${orderClause} LIMIT ?,?`;
    const [rows] = (await this.pool.query(sql, [...values, offset, limit])) as [
      any[],
      any,
    ];
    return rows;
  }

  async insertRecord(
    tableName: string,
    record: Record<string, any>,
  ): Promise<void> {
    const columns = Object.keys(record).join(', ');
    const placeholders = Object.keys(record)
      .map(() => '?')
      .join(', ');
    const values = Object.values(record);

    const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
    await this.pool.query(sql, values);
  }

  async updateRecord(
    tableName: string,
    filters: Record<string, any>,
    record: Record<string, any>,
  ): Promise<void> {
    const updates = Object.keys(record)
      .map((key) => `${key} = ?`)
      .join(', ');
    const updateValues = Object.values(record);
    const { clause, values: filterValues } = this.buildWhereClause(filters);

    const sql = `UPDATE ${tableName} SET ${updates} ${clause}`;
    await this.pool.query(sql, [...updateValues, ...filterValues]);
  }

  async deleteRecord(
    tableName: string,
    filters: Record<string, any>,
  ): Promise<void> {
    const { clause, values } = this.buildWhereClause(filters);
    const sql = `DELETE FROM ${tableName} ${clause}`;
    await this.pool.query(sql, values);
  }

  async callStoredProcedure(
    procedureName: string,
    inputParams: Record<string, any> = {},
    outputParams: string[] = [],
  ): Promise<any> {
    const inputPlaceholders = Object.keys(inputParams)
      .map(() => '?')
      .join(', ');
    const inputValues = Object.values(inputParams);
    const outputPlaceholders = outputParams
      .map((param) => `@${param}`)
      .join(', ');
    const sql = `CALL ${procedureName}(${inputPlaceholders}${outputPlaceholders ? `, ${outputPlaceholders}` : ''})`;

    const [rows]: [any[], any] = await this.pool.query(sql, inputValues);

    if (outputParams.length > 0) {
      const selectOutputSql = `SELECT ${outputParams.map((param) => `@${param} AS ${param}`).join(', ')}`;
      const [outputRows] = await this.pool.query(selectOutputSql);
      return { result: rows, output: (outputRows as any[])[0] };
    }

    return { result: rows };
  }
}
