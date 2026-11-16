import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList style={{ display: 'none' }}>
        <TabTrigger name="home" href="/" />
        <TabTrigger name="ajustes" href="/ajustes" />
      </TabList>
    </Tabs>
  );
}