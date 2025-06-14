import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "_store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Main from "src/Main";
import { Buffer } from "buffer";

global.Buffer = Buffer;

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Main />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
}
