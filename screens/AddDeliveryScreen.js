import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Modal, FlatList, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';

const AddDeliveryScreen = () => {
  const [motoboys, setMotoboys] = useState([]);
  const [nEntrega, setNEntrega] = useState('');
  const [motoboyId, setMotoboyId] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');
  const [valorReceber, setValorReceber] = useState('');
  const [showMotoboyModal, setShowMotoboyModal] = useState(false);
  const [showFormaPagamentoModal, setShowFormaPagamentoModal] = useState(false);

  useEffect(() => {
    axios.get('http://172.20.2.104:8080/motoboys')
      .then(response => setMotoboys(response.data))
      .catch(error => console.error('Erro ao carregar motoboys:', error));
  }, []);

  const handleAddDelivery = () => {
    axios.post('http://172.20.2.104:8080/entregas', {
      nEntrega,
      motoboy: { id: motoboyId },
      formaPagamento,
      valorReceber: formaPagamento === 'DINHEIRO' ? valorReceber : null,
      entregue: false,
    })
      .then(() => {
        setNEntrega('');
        setMotoboyId('');
        setFormaPagamento('');
        setValorReceber('');
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
      <Text>{item.nome}</Text>
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
      <Text>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Número da Entrega"
        value={nEntrega}
        onChangeText={setNEntrega}
      />
      <Button title="Selecionar Motoboy" onPress={() => setShowMotoboyModal(true)} />
      <TextInput
        style={styles.input}
        placeholder="Motoboy"
        value={motoboys.find(m => m.id === motoboyId)?.nome || ''}
        editable={false}
      />
      <Button title="Selecionar Forma de Pagamento" onPress={() => setShowFormaPagamentoModal(true)} />
      <TextInput
        style={styles.input}
        placeholder="Forma de Pagamento"
        value={formaPagamento}
        editable={false}
      />
      {formaPagamento === 'DINHEIRO' && (
        <TextInput
          style={styles.input}
          placeholder="Valor a Receber"
          keyboardType="numeric"
          value={valorReceber}
          onChangeText={setValorReceber}
        />
      )}
      <Button title="Cadastrar Entrega" onPress={handleAddDelivery} />

      <Modal
        transparent={true}
        visible={showMotoboyModal}
        onRequestClose={() => setShowMotoboyModal(false)}
      >
        <View style={styles.modal}>
          <FlatList
            data={motoboys}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={showFormaPagamentoModal}
        onRequestClose={() => setShowFormaPagamentoModal(false)}
      >
        <View style={styles.modal}>
          <FlatList
            data={['DINHEIRO', 'CARTAO']}
            keyExtractor={(item) => item}
            renderItem={renderFormaPagamentoItem}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    margin: 50,
    borderRadius: 10,
    elevation: 5,
  },
});

export default AddDeliveryScreen;
