import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ExperienceForm from "../components/ExperienceForm";
import ExperienceList from "../components/ExperienceList";
import SearchExperience from "../components/SearchExperience"; // Nuevo componente
import {
  fetchExperiences,
  deleteExperience,
} from "../services/experienceService";
import { fetchUsers } from "../services/userService";

export default function ExperiencesScreen() {
  const [experiences, setExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]); // Para mostrar resultados filtrados
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const loadExperiencesAndUsers = async () => {
    try {
      const [experiencesData, usersData] = await Promise.all([
        fetchExperiences(),
        fetchUsers(),
      ]);
      setExperiences(experiencesData);
      setFilteredExperiences(experiencesData); // Inicialmente, mostramos todas las experiencias
      setUsers(usersData);
    } catch (error) {
      console.error("Error al cargar experiencias y usuarios:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadExperiencesAndUsers();
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
      setFilteredExperiences((prevExperiences) =>
        prevExperiences.filter((exp) => exp._id !== experienceId)
      );
    } catch (error) {
      console.error("Error al eliminar experiencia:", error);
    }
  };

  const handleSearch = (searchQuery) => {
    const query = searchQuery.toLowerCase();
    const results = experiences.filter((exp) => {
      const userName = getUserNameById(exp.userId).toLowerCase();
      return userName.includes(query);
    });
    setFilteredExperiences(results);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Experiencias</Text>

      {/* Componente de búsqueda */}
      <SearchExperience onSearch={handleSearch} />

      {/* Lista de experiencias filtradas */}
      <ExperienceList
        experiences={filteredExperiences}
        getUserNameById={getUserNameById}
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
                loadExperiencesAndUsers();
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
