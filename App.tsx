import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import StackNavigators from "./src/navigation/StackNavigator";

export default function App() {
  return (
      <Provider store={store}>
        <NavigationContainer>
          <StackNavigators />
        </NavigationContainer>
      </Provider>
  );
}
