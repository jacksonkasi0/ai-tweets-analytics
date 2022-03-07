const initialState = {
  user: {
    name: null,
    id: "",
    profilImg: "",
  },
};

const singleReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        user: action.value,
      };
    default:
      return state;
  }
};

export default singleReducer;
