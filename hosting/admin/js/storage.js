
const setItem = (key, val) => localStorage.setItem(key, val);
const getItem = (key) => localStorage.getItem(key);
const removetItem = (key) => localStorage.removeItem(key);
const setItems = (dict) => Object.keys(dict).forEach(key => setItem(key, dict[key]));
/// keys: array of keys
const removeItems = (keys) => keys.forEach(key => removetItem(key))
const clear = () => localStorage.clear();

export {
    setItem,
    getItem,
    removetItem,
    setItems,
    removeItems,
    clear
}