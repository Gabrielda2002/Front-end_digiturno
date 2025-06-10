export interface InstallationConfig {
    id: string;
    sedeId: string;
    sedeCodigo: string;
    nombre: string;
    tipo: string;
    ubicacion?: string;
    timezone: string;
    configuration: {
        autoImpresion: boolean;
        tiempoEsperaMaximo: number;
        modulosDisponibles: string[];
        motivosPermitidos: string[];
    };
}

export const getCurrentInstallation = (): InstallationConfig => {
    const config = localStorage.getItem('installationConfig');
    console.log("getCurrentInstallation", config);

    if(config) return JSON.parse(config) as InstallationConfig;

    return {
        id: import.meta.env.VITE_INSTALLATION_ID || 'default',
        sedeId: import.meta.env.VITE_SEDE_ID || 'default',
        sedeCodigo: import.meta.env.VITE_SEDE_CODIGO || 'default',
        nombre: import.meta.env.VITE_SEDE_NOMBRE || 'Sede Principal',
        tipo: 'sede',
        ubicacion: '',
        timezone: 'America/Bogota',
        configuration: {
            autoImpresion: true,
            tiempoEsperaMaximo: 30,
            modulosDisponibles: [],
            motivosPermitidos: []
        }
    }
}