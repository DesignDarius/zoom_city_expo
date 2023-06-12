import React, { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootSiblingParent } from "react-native-root-siblings";
import { ActivityIndicator } from "react-native";

// redux persist
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import { Provider } from "react-redux";

// navigation
import Navigation from "./navigation";

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    Barlow: require("./assets/fonts/barlow/Barlow-Regular.ttf"),
    MoonDance: require("./assets/fonts/moonDance/MoonDance-Regular.ttf"),
  });

  useEffect(() => {
    const prepare = async () => {
      try {
        SplashScreen.preventAutoHideAsync();
        await Font.loadAsync({
          Barlow: require("./assets/fonts/barlow/Barlow-Regular.ttf"),
          MoonDance: require("./assets/fonts/moonDance/MoonDance-Regular.ttf"),
        });
        console.log("Try prepare: fontovi ");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await SplashScreen.hideAsync();
      } catch (error) {
        console.log("catch error useeffect prepare: ", error);
      } finally {
        setAppIsReady(true);
      }
    };

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && fontsLoaded) {
      console.log("appIsReady: ", appIsReady);
      await SplashScreen.hideAsync();
    }
  }, [appIsReady, fontsLoaded]);

  if (!appIsReady || !fontsLoaded) {
    return <ActivityIndicator color="#0000ff" />;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <RootSiblingParent>
            <Navigation onLayout={onLayoutRootView} />
          </RootSiblingParent>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
