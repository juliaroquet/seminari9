import React, { useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet } from "react-native";

export default function SearchExperience({ experiences, getUserNameById }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredExperiences, setFilteredExperiences] = useState([]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredExperiences([]);
      return;
    }

    // Filtrar experiencias según el nombre del propietario o participantes
    const filtered = experiences.filter((experience) => {
      const ownerName = getUserNameById(experience.owner).toLowerCase();
      const participantNames = experience.participants.map((participantId) =>
        getUserNameById(participantId).toLowerCase()
      );

      return (
        ownerName.includes(query.toLowerCase()) ||
        participantNames.some((name) => name.includes(query.toLowerCase()))
      );
    });

    setFilteredExperiences(filtered);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar por nombre de usuario..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {filteredExperiences.length > 0 ? (
        <FlatList
          data={filteredExperiences}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.label}>
                Propietario: {getUserNameById(item.owner)}
              </Text>
              <Text style={styles.label}>Descripción: {item.description}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noResults}>No se encontraron experiencias.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#8B0000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  item: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#8B0000",
  },
  label: {
    fontSize: 16,
    color: "#fff",
  },
  noResults: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
});
