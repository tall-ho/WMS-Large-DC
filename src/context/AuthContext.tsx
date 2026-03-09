import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// DEV_CONFIG: For developers to bypass login
const DEV_CONFIG = {
  enabled: true,
  mockUser: {
    username: 'dev_admin',
    name: 'T-DCC Developer',
    role: 'Admin',
    employeeId: 'DEV-001',
    email: 'tallintelligence.dcc@gmail.com',
    position: 'Lead Developer',
    avatar: 'https://drive.google.com/thumbnail?id=1Z_fRbN9S4aA7OkHb3mlim_t60wIT4huY&sz=w400'
  },
  mockApiUrl: 'https://script.google.com/macros/s/AKfycbw_MOCK_URL/exec',
  mockClientName: 'Dev Factory Co., Ltd.',
};

interface User {
  username: string;
  name: string;
  role: string;
  employeeId: string;
  email?: string;
  position?: string;
  avatar?: string;
}

interface AuthContextType {
  isPaired: boolean;
  apiUrl: string | null;
  clientName: string | null;
  isAuthenticated: boolean;
  user: User | null;
  pairDevice: (licenseKey: string, apiUrl: string, clientName: string) => void;
  unpairDevice: () => void;
  login: (userData: User) => void;
  logout: () => void;
  devLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isPaired, setIsPaired] = useState(true);
  const [apiUrl, setApiUrl] = useState<string | null>(DEV_CONFIG.mockApiUrl);
  const [clientName, setClientName] = useState<string | null>(DEV_CONFIG.mockClientName);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState<User | null>(DEV_CONFIG.mockUser);

  useEffect(() => {
    // Load state from localStorage on mount
    const storedApiUrl = localStorage.getItem('apiUrl');
    const storedClientName = localStorage.getItem('clientName');
    const storedUser = localStorage.getItem('user');

    if (storedApiUrl && storedClientName) {
      setIsPaired(true);
      setApiUrl(storedApiUrl);
      setClientName(storedClientName);
    }

    if (storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const pairDevice = (licenseKey: string, url: string, name: string) => {
    localStorage.setItem('licenseKey', licenseKey);
    localStorage.setItem('apiUrl', url);
    localStorage.setItem('clientName', name);
    setIsPaired(true);
    setApiUrl(url);
    setClientName(name);
  };

  const unpairDevice = () => {
    localStorage.removeItem('licenseKey');
    localStorage.removeItem('apiUrl');
    localStorage.removeItem('clientName');
    localStorage.removeItem('user');
    setIsPaired(false);
    setApiUrl(null);
    setClientName(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  const login = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const devLogin = () => {
    if (DEV_CONFIG.enabled) {
      pairDevice('DEV-MODE', DEV_CONFIG.mockApiUrl, DEV_CONFIG.mockClientName);
      login(DEV_CONFIG.mockUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isPaired,
        apiUrl,
        clientName,
        isAuthenticated,
        user,
        pairDevice,
        unpairDevice,
        login,
        logout,
        devLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
