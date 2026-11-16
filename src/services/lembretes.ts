import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Recurso do dispositivo: NOTIFICAÇÃO LOCAL (expo-notifications).
// O app lembra o usuário, todo dia no horário escolhido, de registrar os gastos.
// É "local" porque o próprio celular dispara o aviso: não precisa de internet nem de servidor.

const CANAL_ID = 'lembretes';

// No navegador (web) não existe agendamento de notificação, só no celular
export const NOTIFICACOES_SUPORTADAS = Platform.OS !== 'web';

// Chamada uma vez quando o app abre: define como a notificação aparece com o app aberto
export function configurarNotificacoes() {
  if (!NOTIFICACOES_SUPORTADAS) return;
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  } catch {
    // se falhar, o app continua funcionando normalmente, só sem o aviso em primeiro plano
  }
}

// No Android é obrigatório ter um "canal" de notificação
async function garantirCanalAndroid() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CANAL_ID, {
    name: 'Lembretes diários',
    importance: Notifications.AndroidImportance.HIGH,
  });
}

// Pede permissão ao usuário (se ainda não tiver). Retorna true se foi concedida.
export async function pedirPermissao(): Promise<boolean> {
  if (!NOTIFICACOES_SUPORTADAS) return false;
  await garantirCanalAndroid(); // no Android 13+ o pedido só aparece depois de criar o canal
  const atual = await Notifications.getPermissionsAsync();
  if (atual.granted) return true;
  const novo = await Notifications.requestPermissionsAsync();
  return novo.granted;
}

// Agenda a notificação que se repete todos os dias na hora escolhida.
// O app só usa esse lembrete, então cancelamos os agendamentos antigos antes de criar o novo.
export async function agendarLembreteDiario(hora: number, minuto: number) {
  await garantirCanalAndroid();
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Hora de registrar seus gastos 💰',
      body: 'Anote o que você gastou ou recebeu hoje e mantenha o controle em dia.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: hora,
      minute: minuto,
      channelId: CANAL_ID,
    },
  });
}

export async function cancelarLembrete() {
  if (!NOTIFICACOES_SUPORTADAS) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// Dispara uma notificação em 5 segundos (útil para testar e para a apresentação)
export async function enviarNotificacaoDeTeste() {
  await garantirCanalAndroid();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Teste do lembrete 🔔',
      body: 'Se você está vendo isto, as notificações do CDF estão funcionando.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
      channelId: CANAL_ID,
    },
  });
}
