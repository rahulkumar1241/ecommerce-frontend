const useLocalStorage = {
    getItem: (key: string) => {
      const data = localStorage.getItem(key) || "";
      try {
        return JSON.parse(data);
      } catch (e) {
        return data;
      }
    },
    setItem: (key: string, value: any) => {
      return localStorage.setItem(key, JSON.stringify(value));
    },
    removeItem: (key: string) => {
      return localStorage.removeItem(key);
    },
    clear: () => {
      return localStorage.clear();
    },
    key: (index: number) => {
      return localStorage.key(index);
    },
  };
  
  export default useLocalStorage;
  