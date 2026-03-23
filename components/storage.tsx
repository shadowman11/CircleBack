import * as SecureStore from 'expo-secure-store';

async function getValueFor(key: string) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
        return result;
    } 
}

async function save(key: string, value: string) {
    try {
        await SecureStore.setItemAsync(key, value);
    } catch (e) {
        alert(e);
    }
}

export {save, getValueFor};