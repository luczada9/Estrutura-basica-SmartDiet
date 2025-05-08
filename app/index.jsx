import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() { // Tela inicial do Aplicativo de DIetas
  const router = useRouter();


  // função iniciada com handle, por questões de convenção, é um manipulador de evento.
  const handleEnterWithoutLogin = () => { // Função que navega para a tela de perfis ao clicar no botão
    router.push('/TelaPerfis'); // ao apertar no botão, ele me joga nessa outra tela : TelaPerfis.jsx
  };

  return ( // parte visual que a função Index me retorna :
    <View style={styles.container}>
      <Text style={styles.title}>Smart Diet</Text>

      <TextInput style={styles.input} placeholder="Usuário" />
      <TextInput style={styles.input} placeholder="Senha" secureTextEntry />

      <Button title="Login" onPress={() => {}} />

      <View style={styles.secondaryButton}>
        <Button title="Entrar sem login" onPress={handleEnterWithoutLogin} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ // estilos para minha tela index.
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    backgroundColor: '#fff',
  },
  secondaryButton: {
    marginTop: 10,
    width: '80%',
  },
});
