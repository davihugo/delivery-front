import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Modal, FlatList, Text, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import ModalDropdown from 'react-native-modal-dropdown';
import { Button, Card, Text as PaperText } from 'react-native-paper';

const AddDeliveryScreen = ({ navigation }) => {
  const [motoboys, setMotoboys] = useState([]);
  const [nEntrega, setNEntrega] = useState('');
  const [motoboyId, setMotoboyId] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');
  const [valorReceber, setValorReceber] = useState('');
  const [showMotoboyModal, setShowMotoboyModal] = useState(false);
  const [showFormaPagamentoModal, setShowFormaPagamentoModal] = useState(false);
  const [nEntregaOptions, setNEntregaOptions] = useState([]);

  useEffect(() => {
    // Buscar todos os motoboys
    axios.get('http://172.20.2.104:8080/motoboys')
      .then(response => setMotoboys(response.data))
      .catch(error => console.error('Erro ao carregar motoboys:', error));

    // Buscar todos os números de entrega já cadastrados
    axios.get('http://172.20.2.104:8080/entregas')
      .then(response => {
        const allNEntregas = Array.from({ length: 200 }, (_, i) => (i + 1).toString());
        const registeredNEntregas = response.data.map(delivery => delivery.nEntrega.toString());
        const availableNEntregas = allNEntregas.filter(n => !registeredNEntregas.includes(n));
        setNEntregaOptions(availableNEntregas);
      })
      .catch(error => console.error('Erro ao carregar entregas:', error));
  }, []);

  const handleAddDelivery = () => {
    axios.post('http://172.20.2.104:8080/entregas', {
      nEntrega,
      motoboy: { id: motoboyId },
      formaPagamento,
      valorReceber: ['DINHEIRO', 'PIX'].includes(formaPagamento) ? valorReceber : null,
      entregue: false,
    })
      .then(() => {
        setNEntrega('');
        setMotoboyId('');
        setFormaPagamento('');
        setValorReceber('');
        navigation.navigate('Entregas');
      })
      .catch(error => console.error('Erro ao adicionar entrega:', error));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        setMotoboyId(item.id);
        setShowMotoboyModal(false);
      }}
    >
      <Text style={styles.itemText}>{item.nome}</Text>
    </TouchableOpacity>
  );

  const renderFormaPagamentoItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        setFormaPagamento(item);
        setShowFormaPagamentoModal(false);
      }}
    >
      <Text style={styles.itemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Title title="Cadastrar Entrega" titleStyle={styles.cardTitle} />
          <Card.Content>
            <View style={styles.inputContainer}>
              <PaperText style={styles.label}>Número da Entrega</PaperText>
              <ModalDropdown
                options={nEntregaOptions}
                defaultValue="Selecione um número disponível"
                onSelect={(index, value) => setNEntrega(value)}
                textStyle={styles.dropdownText}
                dropdownStyle={styles.dropdown}
                dropdownTextStyle={styles.dropdownItemText}
                style={styles.dropdownContainer}
              />
            </View>
            <Button mode="contained" onPress={() => setShowMotoboyModal(true)} style={styles.button}>
              Selecionar Motoboy
            </Button>
            <TextInput
              style={styles.input}
              placeholder="Motoboy"
              value={motoboys.find(m => m.id === motoboyId)?.nome || ''}
              editable={false}
            />
            <Button mode="contained" onPress={() => setShowFormaPagamentoModal(true)} style={styles.button}>
              Selecionar Forma de Pagamento
            </Button>
            <TextInput
              style={styles.input}
              placeholder="Forma de Pagamento"
              value={formaPagamento}
              editable={false}
            />
            {['DINHEIRO', 'PIX'].includes(formaPagamento) && (
              <TextInput
                style={styles.input}
                placeholder="Valor a Receber"
                keyboardType="numeric"
                value={valorReceber}
                onChangeText={setValorReceber}
              />
            )}
            <Button mode="contained" onPress={handleAddDelivery} style={styles.button}>
              Cadastrar Entrega
            </Button>
          </Card.Content>
        </Card>

        {/* Modal Motoboy */}
        <Modal
          transparent={true}
          visible={showMotoboyModal}
          onRequestClose={() => setShowMotoboyModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Selecione um Motoboy</Text>
              <FlatList
                data={motoboys}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.modalList}
              />
              <Button mode="contained" onPress={() => setShowMotoboyModal(false)} style={styles.modalButton}>
                Fechar
              </Button>
            </View>
          </View>
        </Modal>

        {/* Modal Forma de Pagamento */}
        <Modal
          transparent={true}
          visible={showFormaPagamentoModal}
          onRequestClose={() => setShowFormaPagamentoModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Selecione a Forma de Pagamento</Text>
              <FlatList
                data={['DINHEIRO', 'CARTAO', 'PIX']}
                keyExtractor={(item) => item}
                renderItem={renderFormaPagamentoItem}
                contentContainerStyle={styles.modalList}
              />
              <Button mode="contained" onPress={() => setShowFormaPagamentoModal(false)} style={styles.modalButton}>
                Fechar
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
    backgroundColor: 'white',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 48,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    maxHeight: '60%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalList: {
    width: '100%',
  },
  modalButton: {
    marginTop: 16,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdown: {
    width: '100%',
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdownText: {
    padding: 12,
    fontSize: 16,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  button: {
    marginBottom: 16,
  },
});

export default AddDeliveryScreen;
