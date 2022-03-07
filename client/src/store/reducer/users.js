const initialState = {
    users:[]
  };
  
  const multiReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_USERS":
        return {
          users: action.value,
        };
      default:
        return state;
    }
  };
  
  export default multiReducer;
  