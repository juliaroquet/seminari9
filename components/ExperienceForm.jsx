import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import CustomCheckBox from "./CustomCheckBox";
import { fetchUsers } from "../services/userService";
import { addExperience } from "../services/experienceService";

export default function ExperienceForm({ onExperienceAdded }) {
  const [users, setUsers] = useState([]);
  const [owner, setOwner] = useState("");
  const [participants, setParticipants] = useState([]);
  const [description, setDescription] = useState("");

  // Cargar los usuarios desde la API
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    };

    loadUsers();
  }, []);

  const handleSelectParticipant = (userId) => {
    setParticipants((prevParticipants) => {
      if (prevParticipants.includes(userId)) {
        // Si ya está seleccionado, lo eliminamos
        return prevParticipants.filter((id) => id !== userId);
      } else {
        // Si no está seleccionado, lo agregamos
        return [...prevParticipants, userId];
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const newExperience = { owner, participants, description };
      await addExperience(newExperience);
      onExperienceAdded(); // Llama a la función que se pasa como prop para recargar la lista de experiencias
      setOwner("");
      setParticipants([]);
      setDescription("");
    } catch (error) {
      console.error("Error al agregar experiencia:", error);
    }
  };

  return (
    <View style={styles.form}>
      <Text style={styles.label}>Propietario:</Text>
      <Picker
        selectedValue={owner}
        onValueChange={(itemValue) => setOwner(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Seleccionar propietario" value="" />
        {users.map((user) => (
          <Picker.Item key={user._id} label={user.name} value={user._id} />
        ))}
      </Picker>

      <Text style={styles.label}>Participantes:</Text>
      <ScrollView style={styles.scrollView}>
        {users.map((user) => (
          <View key={user._id} style={styles.checkboxContainer}>
            <CustomCheckBox
              label={user.name} 
              value={participants.includes(user._id)}
              onValueChange={() => handleSelectParticipant(user._id)}
            />
          </View>
        ))}
      </ScrollView>

      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={styles.textArea}
        multiline={true}
        maxLength={300}
        placeholder="Máximo 300 caracteres"
      />

      <Button title="Enviar" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    width: "100%",
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  scrollView: {
    height: 150,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    height: 100,
  },
});
