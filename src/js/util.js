const formDataToObject = (formData) => {
    return Object.fromEntries([...formData.entries()]);
  };
  
  export {
    formDataToObject
  };