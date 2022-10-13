import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import RNFS from 'react-native-fs';
const {width, height} = Dimensions.get('window');

const App = () => {
  const [pathStorage, setPathStorage] = useState('');
  const [filePath, setFilePath] = useState('');
  const [text, setText] = useState('Text...');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPathStorage(RNFS.DocumentDirectoryPath);
  }, []);

  useEffect(() => {
    if (pathStorage.trim()) {
      const filePathCreate = pathStorage + '/assets';
      RNFS.mkdir(filePathCreate);
      setFilePath(filePathCreate + '/a.txt');
    }
  }, [pathStorage]);

  const readFile = async () => {
    setIsLoading(true);
    RNFS.readFile(filePath, 'utf8')
      .then(value => {
        setText(value ?? '');
        setIsLoading(false);
      })
      .catch(error => {
        setText('');
        setIsLoading(false);
      });
  };

  const writeFile = async () => {
    setIsLoading(true);
    RNFS.writeFile(filePath, text ?? '', 'utf8')
      .then(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      })
      .catch(error => {
        setIsLoading(false);
      });
  };

  const renderLoading = () => {
    return (
      <View style={styles.viewModal}>
        <ActivityIndicator size={30} color={'red'} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.base}>
      {isLoading && renderLoading()}
      <View style={styles.container}>
        <Text style={styles.textLabel}>Android challenge</Text>
        <TextInput
          onChangeText={value => {
            console.log('value', value);
            setText(value);
          }}
          multiline={true}
          style={styles.input}
          value={text}
          textAlignVertical={'top'}
        />
        <View style={styles.viewButton}>
          <TouchableOpacity style={styles.button} onPress={readFile}>
            <Text style={styles.textLabel}>Read</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={writeFile}>
            <Text style={styles.textLabel}>Write</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: '#FFEDAA',
  },
  textLabel: {
    color: 'black',
    fontSize: 18,
  },
  container: {
    padding: 20,
  },
  input: {
    marginTop: height * 0.05,
    height: height * 0.4,
    fontSize: 18,
    borderWidth: 1,
    color: 'black',
    textDecorationLine: 'underline',
  },
  viewButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.05,
  },
  button: {
    borderColor: 'black',
    borderWidth: 1,
    padding: 20,
    width: width * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewModal: {
    width: width,
    height: height,
    position: 'absolute',
    zIndex: 999,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'transparent',
  },
});

export default App;
