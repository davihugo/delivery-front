import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { DataTable } from 'react-native-paper';
import axios from 'axios';

const DeliveriesScreen = ({ navigation }) => {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    axios.get('http://172.20.2.104:8080/entregas')
      .then(response => setDeliveries(response.data))
      .catch(error => console.error('Erro ao carregar entregas:', error));
  }, []);

  return (
    <View style={styles.container}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Número da Entrega</DataTable.Title>
          <DataTable.Title>Motoboy</DataTable.Title>
          <DataTable.Title>Forma de Pagamento</DataTable.Title>
        </DataTable.Header>

        {deliveries.map((delivery) => (
          <DataTable.Row key={delivery.id}>
            <DataTable.Cell>{delivery.nEntrega}</DataTable.Cell>
            <DataTable.Cell>{delivery.motoboy.nome}</DataTable.Cell>
            <DataTable.Cell>
              {delivery.formaPagamento === 'DINHEIRO' ? `${delivery.valorReceber} BRL` : delivery.formaPagamento}
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default DeliveriesScreen;
