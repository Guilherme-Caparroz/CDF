import * as SQLite from 'expo-sqlite';

export type Lancamento = {
  id: number;
  nome: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  categoria: string;
  data: string;
  descricao: string;
};

export type FiltroTipo = 'todos' | 'receita' | 'despesa';

let db: SQLite.SQLiteDatabase;

export async function initDB() {
  db = await SQLite.openDatabaseAsync('cdf.db');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS lancamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      valor REAL NOT NULL,
      tipo TEXT NOT NULL,
      categoria TEXT NOT NULL,
      data TEXT NOT NULL,
      descricao TEXT
    );

    CREATE TABLE IF NOT EXISTS config (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      saldo_inicial REAL NOT NULL DEFAULT 0
    );

    INSERT OR IGNORE INTO config (id, saldo_inicial) VALUES (1, 0);
  `);
}
// CREATE
export async function inserirLancamento(l: Omit<Lancamento, 'id'>) {
  await db.runAsync(
    'INSERT INTO lancamentos (nome, valor, tipo, categoria, data, descricao) VALUES (?, ?, ?, ?, ?, ?)',
    [l.nome, l.valor, l.tipo, l.categoria, l.data, l.descricao]
  );
}

// filtro por tipo + busca por nome
export async function listarLancamentos(filtro: FiltroTipo = 'todos', busca = '') {
  let sql = 'SELECT * FROM lancamentos WHERE 1=1';
  const params: string[] = [];
  if (filtro !== 'todos') { sql += ' AND tipo = ?'; params.push(filtro); }
  if (busca) { sql += ' AND nome LIKE ?'; params.push(`%${busca}%`); }
  sql += ' ORDER BY id DESC';
  return await db.getAllAsync<Lancamento>(sql, params);
}

export async function buscarLancamento(id: number) {
  return await db.getFirstAsync<Lancamento>('SELECT * FROM lancamentos WHERE id = ?', [id]);
}

// UPDATE
export async function atualizarLancamento(l: Lancamento) {
  await db.runAsync(
    'UPDATE lancamentos SET nome=?, valor=?, tipo=?, categoria=?, data=?, descricao=? WHERE id=?',
    [l.nome, l.valor, l.tipo, l.categoria, l.data, l.descricao, l.id]
  );
}

// DELETE
export async function excluirLancamento(id: number) {
  await db.runAsync('DELETE FROM lancamentos WHERE id = ?', [id]);
}


// Lê o saldo inicial (começa em 0)
export async function obterSaldoInicial() {
  const r = await db.getFirstAsync<{ saldo_inicial: number }>(
    'SELECT saldo_inicial FROM config WHERE id = 1'
  );
  return r?.saldo_inicial ?? 0;
}

// Salva o valor que o usuário informou
export async function definirSaldoInicial(valor: number) {
  await db.runAsync('UPDATE config SET saldo_inicial = ? WHERE id = 1', [valor]);
}

// Saldo total = saldo inicial + entradas - saídas
export async function calcularSaldo() {
  const r = await db.getFirstAsync<{ saldo: number }>(
    `SELECT
       (SELECT saldo_inicial FROM config WHERE id = 1)
       + COALESCE((SELECT SUM(CASE WHEN tipo='receita' THEN valor ELSE -valor END) FROM lancamentos), 0)
       AS saldo`
  );
  return r?.saldo ?? 0;
}