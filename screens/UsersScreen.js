import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Modal } from "react-native";
import { useFocusEffect } from "@react-navigation/native"; 
import UserForm from "../components/UserForm";
import UserList from "../components/UserList";
import { fetchUsers, deleteUser } from "../services/userService";
import { fetchExperiences } from "../services/experienceService";
import User from "../models/usermodel";

export default function UsersScreen() {
  const [users, setUsers] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const loadUsersAndExperiences = async () => {
    try {
      const [usersData, experiencesData] = await Promise.all([
        fetchUsers(),
        fetchExperiences(),
      ]);

      const userInstances = usersData.map(
        (user) =>
          new User(
            user._id,
            user.name,
            user.mail,
            user.password,
            user.comment,
            user.experiencies
          )
      );

      setUsers(userInstances);
      setExperiences(experiencesData); // Guardamos las experiencias
    } catch (error) {
      console.error("Error al cargar usuarios y experiencias:", error);
    }
  };

  // Usamos useFocusEffect para recargar usuarios y experiencias cada vez que la pantalla se enfoca
  useFocusEffect(
    React.useCallback(() => {
      loadUsersAndExperiences(); // Cargamos usuarios y experiencias al enfocar la pantalla
    }, [])
  );

  const getExperienceDescriptionById = (experienceId) => {
    const experience = experiences.find((exp) => exp._id === experienceId);
    return experience ? experience.description : "Descripción no encontrada";
  };

  const handleDeleteUser = async (userId) => {
    try {
      // Llamamos a la función deleteUser para eliminar al usuario de las experiencias y la base de datos
      await deleteUser(userId);

      // Actualizamos la lista de usuarios después de eliminar
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));

      // Actualizamos también las experiencias por si hay cambios en los participantes
      loadUsersAndExperiences();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Usuarios</Text>
      <UserList
        users={users}
        experiences={experiences}
        getExperienceDescriptionById={getExperienceDescriptionById}
        onDeleteUser={handleDeleteUser}
      />
      <TouchableOpacity
        style={styles.openButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Agregar Usuario</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.modalContainer}>
            <UserForm
              onUserAdded={() => {
                setModalVisible(false);
                loadUsersAndExperiences();
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
