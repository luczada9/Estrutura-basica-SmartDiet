import { Stack } from 'expo-router';  // para navegar entre telas
import React from 'react';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>  // screenOptions controla configurações gerais da pilha, nesse caso esta indicando que o cabeçalho nao sera mostrado
      <Stack.Screen name="index" /> // Define a tela chamada "index" na pilha
      <Stack.Screen name="TelaPerfis" /> // Define a tela chamada "TelaPerfis" na pilha
    </Stack>
  );
}
