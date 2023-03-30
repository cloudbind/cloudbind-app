import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Card = ({ data }) => {
  const { parent, name, code, users, createdAt, updatedAt } = data;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.code}>Code: {code}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.label}>
          <Text style={styles.labelText}>Creator:</Text>
          <Text style={styles.parentText}>{parent.name}</Text>
        </View>
        <View style={styles.label}>
          <Text style={styles.labelText}>Users:</Text>
            <Text color="grey">{users.length}</Text>
        </View>
        <View style={styles.label}>
          <Text style={styles.labelText}>Created On:</Text>
          <Text style={styles.dateText}>{createdAt.replace(/-/g,"/").substring(0,10)}</Text>
        </View>
        {/* <View style={styles.label}>
          <Text style={styles.labelText}>Updated At:</Text>
          <Text style={styles.dateText}>{createdAt.replace(/-/g,"/").substring(0,10)}</Text>
        </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginHorizontal: 5,
    marginVertical: 10,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  code: {
    fontSize: 18,
    color: '#999',
    marginLeft: 30
  },
  content: {},
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  labelText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
    width: 100,
  },
  parentText: {
    fontSize: 16,
    color: '#999',
  },
  usersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  userText: {
    fontSize: 16,
    color: '#999',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#999',
  },
});

export default Card;
