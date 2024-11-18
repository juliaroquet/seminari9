import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function UserList({
  users,
  getExperienceDescriptionById,
  onDeleteUser,
}) {
  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.label}>Nombre: {item.getFullName()}</Text>
          <Text style={styles.label}>Email: {item.getEmail()}</Text>
          <Text style={styles.label}>Comentario: {item.comment}</Text>
          <Text style={styles.label}>Experiencias:</Text>

          {/* Listamos las experiencias */}
          {item.experiencies && item.experiencies.length > 0 ? (
            <View style={styles.experienceList}>
              {item.experiencies.map((expId) => (
                <Text key={expId} style={styles.experienceItem}>
                  - {getExperienceDescriptionById(expId)}
                </Text>
              ))}
            </View>
          ) : (
            <Text style={styles.noExperienceText}>Sin experiencias</Text>
          )}

          {/* Botón Eliminar */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDeleteUser(item.id)}
          >
            <Text style={styles.deleteButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      )}
      style={styles.list}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
    width: "100%",
    paddingHorizontal: 20,
  },
  item: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#8B0000",
  },
  label: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
  experienceList: {
    paddingLeft: 10,
    marginTop: 5,
  },
  experienceItem: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 3,
  },
  noExperienceText: {
    fontSize: 14,
    color: "#fff",
    fontStyle: "italic",
  },
  deleteButton: {
    backgroundColor: "#32CD32",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
