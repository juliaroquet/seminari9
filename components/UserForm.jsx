import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { addUser } from "../services/userService";

export default function UserForm({ onUserAdded }) {
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [comment, setComment] = useState("");
  const [mailError, setMailError] = useState(""); // Estado para mostrar el error del correo
  const [nameError, setNameError] = useState(""); // Error para nombre
  const [passwordError, setPasswordError] = useState(""); // Error para contraseña
  const [commentError, setCommentError] = useState(""); // Error para comentario

  // Función para validar el formato del correo
  const validateEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/; // Expresión regular para validar un correo
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    let isValid = true;

    // Validaciones de campos vacíos
    if (name === "") {
      setNameError("El nombre es obligatorio.");
      isValid = false;
    } else {
      setNameError("");
    }

    if (mail === "") {
      setMailError("El correo es obligatorio.");
      isValid = false;
    } else if (!validateEmail(mail)) {
      setMailError("Por favor, ingresa un correo válido.");
      isValid = false;
    } else {
      setMailError("");
    }

    if (password === "") {
      setPasswordError("La contraseña es obligatoria.");
      isValid = false;
    } else if (password.length < 7) {
      setPasswordError("La contraseña debe tener al menos 7 caracteres.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (comment === "") {
      setCommentError("El comentario es obligatorio.");
      isValid = false;
    } else {
      setCommentError("");
    }

    if (!isValid) {
      return; // Si hay errores, no continuar con la solicitud
    }

    try {
      const newUser = { name, mail, password, comment };
      await addUser(newUser); // Llama al servicio para agregar el usuario
      setName("");
      setMail("");
      setPassword("");
      setComment("");
      onUserAdded(); // Cierra el modal y recarga la lista de usuarios
    } catch (error) {
      console.error("Error al agregar usuario:", error);
    }
  };

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Agregar Usuario</Text>
      <TextInput
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      {/* Mensaje de error si el nombre está vacío */}
      {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

      <TextInput
        placeholder="Email"
        value={mail}
        onChangeText={setMail}
        style={styles.input}
        keyboardType="email-address"
      />
      {/* Mensaje de error si el correo es inválido o está vacío */}
      {mailError ? <Text style={styles.errorText}>{mailError}</Text> : null}

      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true} // Para ocultar la contraseña
        style={styles.input}
      />
      {/* Mensaje de error si la contraseña está vacía o tiene menos de 7 caracteres */}
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <TextInput
        placeholder="Comentario"
        value={comment}
        onChangeText={setComment}
        style={styles.input}
      />
      {/* Mensaje de error si el comentario está vacío */}
      {commentError ? <Text style={styles.errorText}>{commentError}</Text> : null}

      <Button title="Enviar" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
