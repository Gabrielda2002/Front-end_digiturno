import { usuarioService } from "@/services/usuario.service";
import { Usuario } from "@/types/api.types";
import { useCallback, useEffect, useState } from "react";

export const useFetchUsers = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


        const refreshUsers = useCallback(async () => {
        
                try {
    
                    setLoading(true);
    
                    const  response = await usuarioService.getAllUsuarios();
    
                    if (response && response.length > 0) {
                        setUsuarios(response);
                        setError(null);
                    }
                    
                } catch (error: any) {
                    
                    if (error.response && error.response.status === 404) {
                        setError("No se encontraron usuarios.");
                    } else if (error.response && error.response.status === 500) {
                        setError("Error interno del servidor.");
                    } else {
                        setError("Error al obtener usuarios.");
                    }   
                }finally{
                    setLoading(false);
                }
        }, [])

        useEffect(() => {
            refreshUsers();
        }, [refreshUsers]); 

    return { usuarios, loading, error, refreshUsers };
}