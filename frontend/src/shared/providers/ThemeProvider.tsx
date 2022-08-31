import { createContext, useState } from 'react';
import { defaultTheme } from '../../styles';
import { corporate } from '../../styles/custom';

export type Theme = {
  name: string;
  value: typeof defaultTheme;
  isCurrent: boolean;
};

export type ThemeContextType = {
  currentTheme: Theme;
  requestThemeChange: (theme: Theme) => void;
  getAvailableThemes: () => Theme[];
};

export const ThemeContext = createContext<ThemeContextType>(
  {} as ThemeContextType
);
const initialTheme: Theme = {
  name: 'Default',
  value: defaultTheme,
  isCurrent: false,
};
const corporateTheme: Theme = {
  name: 'Corporate',
  value: corporate,
  isCurrent: false,
};
const localThemes = [initialTheme, corporateTheme];

type ThemeProviderProps = {
  children: React.ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(initialTheme);
  const [availableThemes, setAvailableThemes] = useState(localThemes);

  const changeTheme = (theme: Theme) => {
    const updatedThemes: Theme[] = availableThemes.map((themeItem) => {
      if (themeItem !== theme) {
        return {
          ...themeItem,
          isCurrent: false,
        };
      }

      const newTheme = {
        ...themeItem,
        isCurrent: true,
      };

      setCurrentTheme(newTheme);
      return newTheme;
    });

    setAvailableThemes(updatedThemes);
  };

  const getAvailableThemes = (): Theme[] => {
    return availableThemes;
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        requestThemeChange: changeTheme,
        getAvailableThemes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
