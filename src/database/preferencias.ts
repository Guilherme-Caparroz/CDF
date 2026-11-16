import AsyncStorage from '@react-native-async-storage/async-storage';

import type { FiltroTipo } from './database';

// AsyncStorage guarda SÓ preferências simples do usuário (filtro padrão e lembrete).
// Os lançamentos (dados importantes) ficam apenas no SQLite — ver database.ts.

const CHAVE_FILTRO = '@cdf_filtro_padrao';
const CHAVE_LEMBRETE = '@cdf_lembrete';

const FILTROS_VALIDOS: FiltroTipo[] = ['todos', 'receita', 'despesa'];

// ---------- Filtro padrão da lista ----------

// Lê o filtro que o usuário escolheu como padrão (se der erro, volta para "todos")
export async function obterFiltroPadrao(): Promise<FiltroTipo> {
  try {
    const salvo = await AsyncStorage.getItem(CHAVE_FILTRO);
    if (salvo && (FILTROS_VALIDOS as string[]).includes(salvo)) {
      return salvo as FiltroTipo;
    }
  } catch {
    // preferência não é crítica: se falhar, usa o padrão
  }
  return 'todos';
}

export async function definirFiltroPadrao(filtro: FiltroTipo) {
  await AsyncStorage.setItem(CHAVE_FILTRO, filtro);
}

// ---------- Lembrete diário ----------

export type PreferenciaLembrete = {
  ativo: boolean;
  hora: number;   // 0 a 23
  minuto: number; // 0 a 59
};

export const LEMBRETE_PADRAO: PreferenciaLembrete = { ativo: false, hora: 20, minuto: 0 };

export async function obterLembrete(): Promise<PreferenciaLembrete> {
  try {
    const texto = await AsyncStorage.getItem(CHAVE_LEMBRETE);
    if (texto) {
      const p = JSON.parse(texto);
      const horaOk = Number.isInteger(p.hora) && p.hora >= 0 && p.hora <= 23;
      const minutoOk = Number.isInteger(p.minuto) && p.minuto >= 0 && p.minuto <= 59;
      if (typeof p.ativo === 'boolean' && horaOk && minutoOk) {
        return { ativo: p.ativo, hora: p.hora, minuto: p.minuto };
      }
    }
  } catch {
    // JSON inválido ou erro de leitura: usa o padrão
  }
  return LEMBRETE_PADRAO;
}

export async function salvarLembrete(p: PreferenciaLembrete) {
  await AsyncStorage.setItem(CHAVE_LEMBRETE, JSON.stringify(p));
}
