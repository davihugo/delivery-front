import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

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
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome do Motoboy"
        value={nome}
        onChangeText={setNome}
      />
      <Button title="Cadastrar" onPress={handleAddMotoboy} />
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
});

export default AddMotoboyScreen;