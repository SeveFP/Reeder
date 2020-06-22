export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) {
      console.log("serializedState is NULL");
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    let login = { ...state.login };
    login.client = undefined;
    let localState = { ...state, login };
    const serializedState = JSON.stringify(localState);
    localStorage.setItem("state", serializedState);
  } catch (error) {
    console.log(error);
  }
};
