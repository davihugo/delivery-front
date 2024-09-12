import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ScrollView } from 'react-native';
import axios from 'axios';
import { Card, Button as PaperButton } from 'react-native-paper';

const AddMotoboyScreen = ({ navigation }) => {
  const [nome, setNome] = useState('');

  const handleAddMotoboy = () => {
    axios.post('http://172.20.2.104:8080/motoboys', { nome })
      .then(() => {
        navigation.goBack();
      })
      .catch(error => console.error(error));
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Title title="Cadastrar Motoboy" titleStyle={styles.cardTitle} />
          <Card.Content>
            <Text style={styles.label}>Nome do Motoboy</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome do motoboy"
              value={nome}
              onChangeText={setNome}
            />
            <PaperButton
              mode="contained"
              onPress={handleAddMotoboy}
              style={styles.button}
            >
              Cadastrar
            </PaperButton>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    elevation: 4,
    backgroundColor: 'white',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 16,
  },
});

export default AddMotoboyScreen;
