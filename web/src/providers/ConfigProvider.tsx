import { Context, createContext, useContext, useEffect, useState } from 'react';
import { MantineColor } from '@mantine/core';
import { fetchNui } from '../utils/fetchNui';
import { useNuiEvent } from '../hooks/useNuiEvent';

interface Config {
  primaryColor: MantineColor;
  primaryShade: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}

interface ConfigCtxValue {
  config: Config;
  setConfig: (config: Config) => void;
}

const ConfigCtx = createContext<{ config: Config; setConfig: (config: Config) => void } | null>(null);

const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Config>({
    primaryColor: 'blue',
    primaryShade: 6,
  });

  useEffect(() => {
    // Initial fetch
    fetchNui<Config>('getConfig').then((data) => setConfig(data));
  }, []);

  useNuiEvent<Config>('updateColorSettings', (data) => {
    const { primaryColor, primaryShade } = data;
    console.log(primaryColor, primaryShade);
    setConfig((prevConfig) => ({
      ...prevConfig,
      primaryColor,
      primaryShade,
    }));
  });

  return <ConfigCtx.Provider value={{ config, setConfig }}>{children}</ConfigCtx.Provider>;
};

export default ConfigProvider;

export const useConfig = () => useContext<ConfigCtxValue>(ConfigCtx as Context<ConfigCtxValue>);
