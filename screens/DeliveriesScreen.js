import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal, FlatList, Text, TouchableOpacity, ScrollView, TextInput, Switch, Button } from 'react-native';
import { DataTable } from 'react-native-paper';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DeliveriesScreen = ({ navigation }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [motoboys, setMotoboys] = useState([]);
  const [formaPagamentoOptions] = useState(['DINHEIRO', 'CARTAO', 'PIX']);

  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [motoboyId, setMotoboyId] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');
  const [valorReceber, setValorReceber] = useState('');
  const [nEntrega, setNEntrega] = useState('');
  const [entregue, setEntregue] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchDeliveries();
      fetchMotoboys();
    }
  }, [isFocused]);

  const fetchDeliveries = () => {
    axios.get('http://172.20.2.104:8080/entregas')
      .then(response => {
        const sortedDeliveries = response.data.sort((a, b) => a.nEntrega - b.nEntrega);
        setDeliveries(sortedDeliveries);
      })
      .catch(error => console.error('Erro ao carregar entregas:', error));
  };

  const fetchMotoboys = () => {
    axios.get('http://172.20.2.104:8080/motoboys')
      .then(response => setMotoboys(response.data))
      .catch(error => console.error('Erro ao carregar motoboys:', error));
  };

  const handleUpdateDelivery = () => {
    axios.put(`http://172.20.2.104:8080/entregas/${selectedDelivery.id}`, {
      nEntrega,
      motoboy: { id: motoboyId },
      formaPagamento,
      valorReceber,
      entregue
    })
      .then(() => {
        fetchDeliveries();
        setShowUpdateModal(false);
      })
      .catch(error => console.error('Erro ao atualizar entrega:', error));
  };

  const renderMotoboyItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.item,
        motoboyId === item.id ? styles.selectedItem : null
      ]}
      onPress={() => setMotoboyId(item.id)}
    >
      <Text style={styles.itemText}>{item.nome}</Text>
    </TouchableOpacity>
  );

  const renderFormaPagamentoItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.item,
        formaPagamento === item ? styles.selectedItem : null
      ]}
      onPress={() => setFormaPagamento(item)}
    >
      <Text style={styles.itemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <DataTable style={styles.dataTable}>
          <DataTable.Header>
            <DataTable.Title style={styles.title}>N°</DataTable.Title>
            <DataTable.Title style={styles.title}>Motoboy</DataTable.Title>
            <DataTable.Title style={styles.title}>Forma de Pagamento</DataTable.Title>
            <DataTable.Title style={styles.title}>Ação</DataTable.Title>
          </DataTable.Header>

          {deliveries.map((delivery) => (
            <DataTable.Row key={delivery.id}>
              <DataTable.Cell>{delivery.nEntrega}</DataTable.Cell>
              <DataTable.Cell>{delivery.motoboy?.nome}</DataTable.Cell>
              <DataTable.Cell>
                {delivery.formaPagamento === 'DINHEIRO' ? `${delivery.valorReceber} BRL` : delivery.formaPagamento}
              </DataTable.Cell>
              <DataTable.Cell>
                <Switch
                  value={delivery.entregue}
                  onValueChange={() => { }}
                  trackColor={{ false: '#767577', true: '#bfb1e6' }}
                  thumbColor={delivery.entregue ? '#6750a4' : '#f4f3f4'}
                />
              </DataTable.Cell>
              <DataTable.Cell>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedDelivery(delivery);
                    setMotoboyId(delivery.motoboy?.id || '');
                    setFormaPagamento(delivery.formaPagamento);
                    setValorReceber(delivery.valorReceber);
                    setNEntrega(delivery.nEntrega);
                    setEntregue(delivery.entregue);
                    setShowUpdateModal(true);
                  }}
                >
                  <MaterialCommunityIcons name="pencil" size={24} color="#6750a4" />
                </TouchableOpacity>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>

        {/* Modal de Atualização */}
        <Modal
          visible={showUpdateModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowUpdateModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Atualizar Entrega</Text>
              
              <TextInput
                placeholder="Número da Entrega"
                value={nEntrega}
                onChangeText={setNEntrega}
                style={styles.input}
              />

              <Text>Motoboy:</Text>
              <FlatList
                data={motoboys}
                renderItem={renderMotoboyItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.list}
              />

              <Text>Forma de Pagamento:</Text>
              <FlatList
                data={formaPagamentoOptions}
                renderItem={renderFormaPagamentoItem}
                keyExtractor={(item) => item}
                style={styles.list}
              />

              {formaPagamento === 'DINHEIRO' && (
                <>
                  <Text>Valor a Receber:</Text>
                  <TextInput
                    placeholder="Valor a Receber"
                    value={valorReceber}
                    onChangeText={setValorReceber}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </>
              )}

              <View style={styles.switchContainer}>
                <Text>Entrega Feita:</Text>
                <Switch
                  value={entregue}
                  onValueChange={setEntregue}
                  
                />
              </View>

              <View style={styles.buttonContainer}>
                <Button title="Atualizar Entrega" onPress={handleUpdateDelivery} color="#6750a4" />
                <Button title="Cancelar" onPress={() => setShowUpdateModal(false)} color="#dc3545" />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  dataTable: {
    width: '100%',
    backgroundColor: 'white',
  },
  title: {
    fontWeight: 'bold',
    color: '#6750a4',
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  selectedItem: {
    backgroundColor: '#e9ecef',
  },
  itemText: {
    fontSize: 16,
    color: '#495057',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#6750a4',
  },
  input: {
    height: 40,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 10,
    color: '#495057',
  },
  list: {
    maxHeight: 150,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default DeliveriesScreen;
