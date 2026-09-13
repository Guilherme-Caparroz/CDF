import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="detalhes" options={{ title: 'Detalhes' }} />
      <Tabs.Screen name="adicionar" options={{ title: 'Adicionar' }} />
    </Tabs>
  );
}