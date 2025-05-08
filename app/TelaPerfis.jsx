import React, { useState } from 'react';
import { ScrollView, View, Text, FlatList, Button, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { router } from 'expo-router';

export default function TelaPerfis() {
  const [perfilSelecionado, setPerfilSelecionado] = useState(null); // Guarda o perfil atual selecionado (ou null se nenhum)
  const [modoEdicao, setModoEdicao] = useState(false); // Controla se o modo de edição de perfil está ativo.
  const [modalVisible, setModalVisible] = useState(false); // Controla a visibilidade do modal de edição de dieta.
  const [dietaEditando, setDietaEditando] = useState(null); // Armazena a dieta atualmente sendo editada.
  const [novoNomeDieta, setNovoNomeDieta] = useState(''); // Guarda o nome da nova dieta ou o nome editado.
  const [novosAlimentos, setNovosAlimentos] = useState(''); // Guarda os alimentos da nova dieta ou edição.
  const [novoHorario, setNovoHorario] = useState(''); // Guarda o horário da nova dieta ou edição.

  const [perfis, setPerfis] = useState([ // Lista dos perfis cadastrados (inicializados com 2 exemplos).
    { id: '1', nome: 'João', peso: '75kg', altura: '1.75m', objetivo: 'Ganhar massa' },
    { id: '2', nome: 'Maria', peso: '60kg', altura: '1.65m', objetivo: 'Perder peso' },
  ]);

  const [dietasPorPerfil, setDietasPorPerfil] = useState({ // Dicionário com dietas associadas a cada perfil (pelo ID).
    '1': [
      { id: '1', nome: 'Café da manhã', alimentos: ['Arroz', 'Feijão', 'Frango'], horario: '08:00' },
      { id: '2', nome: 'Almoço', alimentos: ['Salada', 'Peixe', 'Batata'], horario: '12:00' },
    ],
    '2': [
      { id: '3', nome: 'Jantar', alimentos: ['Macarrão', 'Carne', 'Salada'], horario: '19:00' },
    ],
  });

  const handlePerfilClick = (perfil) => { // Seleciona um perfil da lista e sai do modo de edição.
    setPerfilSelecionado(perfil);
    setModoEdicao(false);
  };

  const handleVoltar = () => { // Volta para a lista de perfis e desativa o modo edição.
    setPerfilSelecionado(null);
    setModoEdicao(false);
  };

  const handleRemoverDieta = (perfilId, dietaId) => { // Remove uma dieta do perfil especificado.
    const updatedDietas = dietasPorPerfil[perfilId].filter((dieta) => dieta.id !== dietaId);
    setDietasPorPerfil((prevState) => ({
      ...prevState,  // esses ... servem para não ter que sobrescrever o objeto inteiro.
      [perfilId]: updatedDietas,
    }));
  };

  const handleRemoverPerfil = (perfilId) => { // Remove o perfil da lista e limpa a seleção se for o atual.
    const updatedPerfis = perfis.filter((perfil) => perfil.id !== perfilId);
    setPerfis(updatedPerfis);
    if (perfilSelecionado && perfilSelecionado.id === perfilId) {
      setPerfilSelecionado(null);
    }
  };

  const handleSalvarEdicao = () => { // Salva as alterações feitas nas métricas do perfil.
    const novosPerfis = perfis.map((p) =>
      p.id === perfilSelecionado.id ? perfilSelecionado : p
    );
    setPerfis(novosPerfis);
    setModoEdicao(false);
  };

  const abrirModalEdicaoDieta = (dieta) => { // Abre o modal para editar uma dieta específica.
    setDietaEditando(dieta);
    setNovoNomeDieta(dieta.nome);
    setNovosAlimentos(dieta.alimentos.join(', '));
    setNovoHorario(dieta.horario);
    setModalVisible(true);
  };

  const salvarEdicaoDieta = () => { // Salva a edição feita em uma dieta e fecha o modal.
    const atualizadas = dietasPorPerfil[perfilSelecionado.id].map((dieta) =>
      dieta.id === dietaEditando.id
        ? { ...dieta, nome: novoNomeDieta, alimentos: novosAlimentos.split(',').map((a) => a.trim()), horario: novoHorario }
        : dieta
    );
    setDietasPorPerfil((prev) => ({
      ...prev,
      [perfilSelecionado.id]: atualizadas,
    }));
    setModalVisible(false);
    setDietaEditando(null);
  };

  const handleAdicionarDieta = () => { // Adiciona uma nova dieta ao perfil selecionado.
    const novaDieta = {
      id: String(new Date().getTime()),
      nome: novoNomeDieta,
      alimentos: novosAlimentos.split(',').map((a) => a.trim()),
      horario: novoHorario,
    };

    setDietasPorPerfil((prevState) => ({
      ...prevState,
      [perfilSelecionado.id]: [...(prevState[perfilSelecionado.id] || []), novaDieta],
    }));

    setNovoNomeDieta('');
    setNovosAlimentos('');
    setNovoHorario('');
  };

  return (
    <ScrollView style={styles.container}>
        <View style={{ height: 30 }} /> {/* Gambiarra para deixar o botão de login absoluto mas sem agarrar nos demais componentes ha ha ha*/}

      <TouchableOpacity style={styles.botaoVoltarLogin} onPress={() => router.push('/')}>
        <Text style={styles.botaoVoltarLoginTexto}>Voltar para Login</Text>
      </TouchableOpacity>

      {perfilSelecionado ? ( // Mostra os dados do perfil (e dietas) ou a lista de perfis, conforme o estado atual.
        <View style={styles.perfisContainer}>
          <Text style={styles.title}>Perfil: {perfilSelecionado.nome}</Text>

          {modoEdicao ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Peso"
                value={perfilSelecionado.peso}
                onChangeText={(texto) => setPerfilSelecionado({ ...perfilSelecionado, peso: texto })}
              />
              <TextInput
                style={styles.input}
                placeholder="Altura"
                value={perfilSelecionado.altura}
                onChangeText={(texto) => setPerfilSelecionado({ ...perfilSelecionado, altura: texto })}
              />
              <TextInput
                style={styles.input}
                placeholder="Objetivo"
                value={perfilSelecionado.objetivo}
                onChangeText={(texto) => setPerfilSelecionado({ ...perfilSelecionado, objetivo: texto })}
              />
              <Button title="Salvar" onPress={handleSalvarEdicao} />
            </>
          ) : (
            <>
              <Text>Peso: {perfilSelecionado.peso}</Text>
              <Text>Altura: {perfilSelecionado.altura}</Text>
              <Text>Objetivo: {perfilSelecionado.objetivo}</Text>
              <Button title="Editar Métricas" onPress={() => setModoEdicao(true)} />
            </>
          )}

          <FlatList
            data={dietasPorPerfil[perfilSelecionado.id]}
            renderItem={({ item }) => (
              <View style={styles.dietaItem}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold' }}>{item.nome}</Text>
                  <Text>{item.alimentos.join(', ')}</Text>
                  <Text>Horário: {item.horario}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => abrirModalEdicaoDieta(item)}
                  style={[styles.removerButton, { backgroundColor: '#007BFF', marginRight: 8 }]}
                >
                  <Text style={styles.removerText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleRemoverDieta(perfilSelecionado.id, item.id)}
                  style={styles.removerButton}
                >
                  <Text style={styles.removerText}>X</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />

           {/*criar alimentação nova :*/}
          
          <TextInput
            style={styles.input}
            placeholder="Nome da nova alimentação"
            value={novoNomeDieta}
            onChangeText={setNovoNomeDieta}
          />
          <TextInput
            style={styles.input}
            placeholder="Alimentos (separados por vírgula)"
            value={novosAlimentos}
            onChangeText={setNovosAlimentos}
          />
          <TextInput
            style={styles.input}
            placeholder="Horário"
            value={novoHorario}
            onChangeText={setNovoHorario}
          />
          <Button title="Adicionar Alimentação" onPress={handleAdicionarDieta} />

          {/* Adicionando um espaçamento entre os botões */}
          <View style={{ marginBottom: 20 }} />

          <Button title="Voltar para a lista de perfis" onPress={handleVoltar} />
        </View>
      ) : (
        <View style={styles.perfisContainer}> {/*Após tocar em um perfil :*/} 
          <Text style={styles.title}>Meus Perfis</Text>
          <FlatList
            data={perfis}
            renderItem={({ item }) => ( // define como cada item da lista sera renderizado
              <View style={styles.item}>
                <Text onPress={() => handlePerfilClick(item)}>{item.nome}</Text>
                <TouchableOpacity onPress={() => handleRemoverPerfil(item.id)} style={styles.removerPerfilButton}>
                  <Text style={styles.removerPerfilText}>X</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id} // define a chave única de cada item
          />
          <Button title="Criar Novo Perfil" onPress={() => alert('Função de criar perfil ainda será implementada')} />
        </View>
      )}

      {/* Modal de edição da dieta */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Editar Dieta</Text>
            <TextInput
              value={novoNomeDieta}
              onChangeText={setNovoNomeDieta}
              placeholder="Nome da dieta"
              style={styles.input}
            />
            <TextInput
              value={novosAlimentos}
              onChangeText={setNovosAlimentos}
              placeholder="Alimentos separados por vírgula"
              style={styles.input}
            />
            <TextInput
              value={novoHorario}
              onChangeText={setNovoHorario}
              placeholder="Horário"
              style={styles.input}
            />
            <Button title="Salvar" onPress={salvarEdicaoDieta} />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} color="gray" />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  botaoVoltarLogin: {
    position: 'absolute',
    top: 50,
    left: 1,
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    zIndex: 10,
  },
  
  botaoVoltarLoginTexto: {
    color: '#fff',
    fontSize: 16,
  },
  perfisContainer: {
    marginTop: 70,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  item: {
    padding: 16,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dietaItem: {
    padding: 16,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  removerButton: {
    backgroundColor: 'red',
    borderRadius: 50,
    padding: 5,
  },
  removerText: {
    color: 'white',
    fontSize: 18,
  },
  removerPerfilButton: {
    backgroundColor: 'red',
    borderRadius: 50,
    padding: 5,
  },
  removerPerfilText: {
    color: 'white',
    fontSize: 18,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
});
