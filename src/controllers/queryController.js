import { createPool } from 'mysql2/promise';
import config from '../config.js'



const pool = createPool(config.database);

async function truncatePrdany() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const sqlDelete = `TRUNCATE TABLE ${config.database.name}.${config.tabelaAny}`;
    await connection.execute(sqlDelete);

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.log({message: error.message});
    return (error.message);

  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function inserirProdutosAny(produto) {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();


    const insertData = {
      qtty: produto['QTD'],
      price: produto['CUSTO'],
      sku: produto['CÓDIGO FORNECEDOR / SKU INTERNO']
    };

    const fields = Object.keys(insertData);
    const sql = `INSERT IGNORE INTO ${config.database.name}.${config.tabelaAny} (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`;
    const values = fields.map(field => insertData[field]);
    await connection.execute(sql, values);

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.log({message: error.message});
    return (error.message);

  } finally {
    if (connection) {
      connection.release();
    }
  }
}


async function verificacaoTabelas() {
  console.log('Iniciando verificação de tabelas');

  try {
    const connection = await pool.getConnection();

    try {
      const sqlCriarTabelaAny = `
      CREATE TABLE IF NOT EXISTS ${config.database.name}.${config.tabelaAny} (
        qtty            varchar(100),
        price           varchar(100),
        sku             varchar(100),
        primary key     (sku)
        )
      `

      await connection.query(sqlCriarTabelaAny);
      console.log(`Verificação de tabelas concluidas`);
    } catch (error) {
      console.error('Erro ao executar consulta:', error.message);
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    if (error.code === 'ENOTFOUND') {
      console.error('Erro: O host especificado não pode ser encontrado.');
    } else {
      console.error('Erro desconhecido ao conectar ao banco de dados:', error.message);
    }
    throw error;
  }
}

export { verificacaoTabelas, inserirProdutosAny,truncatePrdany };