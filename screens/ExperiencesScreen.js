import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native"; 
import ExperienceForm from "../components/ExperienceForm";
import ExperienceList from "../components/ExperienceList";
import {
  fetchExperiences,
  deleteExperience,
} from "../services/experienceService";
import { fetchUsers } from "../services/userService"; 

export default function ExperiencesScreen() {
  const [experiences, setExperiences] = useState([]);
  const [users, setUsers] = useState([]); 
  const [modalVisible, setModalVisible] = useState(false);

  // Función para cargar las experiencias y los usuarios
  const loadExperiencesAndUsers = async () => {
    try {
      const [experiencesData, usersData] = await Promise.all([
        fetchExperiences(),
        fetchUsers(),
      ]);
      setExperiences(experiencesData);
      setUsers(usersData);
    } catch (error) {
      console.error("Error al cargar experiencias y usuarios:", error);
    }
  };

  // Usamos useFocusEffect para recargar las experiencias y usuarios cada vez que la pantalla se enfoca
  useFocusEffect(
    React.useCallback(() => {
      loadExperiencesAndUsers(); // Cargamos las experiencias y usuarios al enfocar la pantalla
    }, [])
  );

  const getUserNameById = (userId) => {
    const user = users.find((u) => u._id === userId);
    return user ? user.name : "Desconocido";
  };

  const handleDeleteExperience = async (experienceId) => {
    try {
      await deleteExperience(experienceId);
      setExperiences((prevExperiences) =>
        prevExperiences.filter((exp) => exp._id !== experienceId)
      );
    } catch (error) {
      console.error("Error al eliminar experiencia:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Experiencias</Text>

      <ExperienceList
        experiences={experiences}
        getUserNameById={getUserNameById} // Pasamos la función para obtener los nombres
        onDeleteExperience={handleDeleteExperience}
      />

      <TouchableOpacity
        style={styles.openButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Crear Nueva Experiencia</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.modalContainer}>
            <ExperienceForm
              onExperienceAdded={() => {
                setModalVisible(false);
                loadExperiencesAndUsers(); // Actualizar la lista de experiencias
              }}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#8B0000",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
    color: "#fff",
  },
  openButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
