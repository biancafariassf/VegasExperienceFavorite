import React, { useContext, useEffect, useState } from "react";
import { Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons';
import firestore from "@react-native-firebase/firestore";
import { UserContext } from "../contexts/useUser";

// Novo componente FavoriteCard
function FavoriteCard({ nome, descricao, localizacao, onRemove }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{nome}</Text>
      <Text style={styles.cardText}>{descricao}</Text>
      
      <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <Text style={styles.removeButtonText}>REMOVER</Text>
      </TouchableOpacity>
    </View>
  );
}

export function Profile() {
  const { user, userInformations, handleSignOut, toggleFavorite } = useContext(UserContext);
  const [hoteis, setHoteis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    !loading && setLoading(true);
    firestore()
      .collection('hoteis')
      .get()
      .then((querySnapshot) => {
        const hoteis = [];
        querySnapshot.forEach((documentSnapshot) => {
          userInformations.favorites.forEach((favorite) => {
            if (favorite === documentSnapshot.data().nome_hot) {
              hoteis.push(documentSnapshot.data());
            }
          });
        });
        setHoteis(hoteis);
        setLoading(false);
      });
  }, [userInformations.favorites]);

  return (
    
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.image}
          source={{ uri: user.photoURL }}
        />
        <Text style={styles.username}>{user.displayName}</Text>
      </View>
      <TouchableOpacity style={styles.buttonLogout} onPress={handleSignOut}>
        <Feather name="log-out" size={20} color="white" />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
      {!loading && userInformations.favorites.length > 0 && (
        userInformations.favorites.map((favorite, index) => {
          const favoriteData = hoteis.find(hotel => hotel.nome_hot === favorite);

          if (favoriteData) {
            return (
              <FavoriteCard
                key={index}
                nome={favoriteData.nome_hot}
                descricao={favoriteData.descricao_hot}
                localizacao={favoriteData.localizacao_hot}
                onRemove={() => toggleFavorite(favoriteData.nome_hot)}
              />
            );
          }
          return null;
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  username: {
    color: 'black',
    fontSize: 18,
    lineHeight: 18,
    textAlign: 'left',
    marginLeft: 10,
  },
  buttonLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#147DEB',
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  
  // Estilos do FavoriteCard
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
  cardText: {
    fontSize: 16,
    marginBottom: 8,
    color: 'black',
  },
  removeButton: {
    backgroundColor: '#147DEB',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
