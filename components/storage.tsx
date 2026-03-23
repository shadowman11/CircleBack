import * as SecureStore from 'expo-secure-store';

// Returns value for given key from Expo secure store.
async function getValueFor(key: string) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
        return result;
    } 
}

// Saves the given key value pair in Expo secure store.
async function save(key: string, value: string) {
    try {
        await SecureStore.setItemAsync(key, value);
    } catch (e) {
        alert(e);
    }
}

export {save, getValueFor};