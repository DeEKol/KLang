import React, { useEffect, useState } from "react";
import { SplashScreen } from "screens/SplashScreen";
import { Text } from "shared/ui/paper-kit";

export const InitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ? State
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [progress, setProgress] = useState(0);

  // ? Lifecycle
  useEffect(() => {
    const loadApp = async () => {
      // * Imitation of app loading
      let randomStep = 1;

      for (let i = 0; i < 110; i += randomStep) {
        await new Promise((resolve) => setTimeout(resolve, 200));

        if (i < 100) {
          setProgress(i / 100);
          randomStep = Math.ceil(Math.random() * 10);
        } else {
          setProgress(1);
        }
      }

      // Онбординг (в реальном приложении - из AsyncStorage)
      // const hasSeenOnboarding = false;
      // setShowOnboarding(!hasSeenOnboarding);

      setIsLoading(false);
    };

    loadApp();
  }, []);

  // ? Handlers
  const handleSplashComplete = () => {};

  // ? Render
  return (
    <>
      {isLoading ? (
        <SplashScreen
          onAnimationComplete={handleSplashComplete}
          isLoading={true}
          progress={progress}
        />
      ) : showOnboarding ? (
        <Text>{"Onboarding"}</Text>
      ) : (
        <>{children}</>
      )}
    </>
  );
};
