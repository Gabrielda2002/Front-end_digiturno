import { getCurrentInstallation, InstallationConfig } from "@/config/installationConfig";
import React, { useContext, useEffect, useState } from "react";

interface InstallationContextType {
    installation: InstallationConfig;
    updateInstallation: (newConfig: Partial<InstallationConfig>) => void;
    isConfigured: boolean;
}

const InstallationContext = React.createContext<InstallationContextType  | undefined>(undefined);

export const InstallationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [installation, setInstallation] = useState<InstallationConfig>(getCurrentInstallation());
    const [isConfigured, setIsConfigured] = useState<boolean>(false);

    useEffect(() => {

        const hasValidConfig = installation.sedeId && installation.sedeCodigo ? true : false;
        setIsConfigured(hasValidConfig);

        if (!hasValidConfig && window.location.pathname !== '/setup') {
            window.location.href = '/setup';
        }

    }, [installation]);

    const updateInstallation = (newConfig: Partial<InstallationConfig>) => {
        const updatedConfig = { ...installation, ...newConfig };
        setInstallation(updatedConfig);
        localStorage.setItem('installationConfig', JSON.stringify(updatedConfig));
    };

    return (
        <InstallationContext.Provider value={{ installation, updateInstallation, isConfigured}}>
            {children}
        </InstallationContext.Provider>
    )
};
export const useInstallation = () => {
    const context = useContext(InstallationContext);
    if (!context) {
        throw new Error("useInstallation must be used within an InstallationProvider");
    }
    return context;
}