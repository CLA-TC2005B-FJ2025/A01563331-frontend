import React, { useState, useEffect } from 'react';
import { deletePersonaje, getAllPersonajes } from '../api';

function EliminarPersonaje() {
    const [idEliminar, setIdEliminar] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState(null);
    const [personajes, setPersonajes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Cargar la lista de personajes al montar el componente
    useEffect(() => {
        const fetchPersonajes = async () => {
            try {
                const data = await getAllPersonajes();
                setPersonajes(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchPersonajes();
    }, []);

    const handleChange = (e) => {
        setIdEliminar(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await deletePersonaje(idEliminar);
            setMensaje(response.message);
            setError(null);
            setIdEliminar('');
            
            // Actualizar la lista después de eliminar
            const updatedPersonajes = await getAllPersonajes();
            setPersonajes(updatedPersonajes);
        } catch (error) {
            setError(error.message);
            setMensaje('');
        }
    };

    if (loading) {
        return <p>Cargando personajes...</p>;
    }

    return (
        <div>
            <h2>Eliminar Personaje</h2>
            
            {/* Mostrar lista de personajes */}
            <div style={{ marginBottom: '20px' }}>
                <h3>Personajes Registrados</h3>
                {error ? (
                    <p style={{ color: 'red' }}>Error al cargar personajes: {error}</p>
                ) : personajes.length > 0 ? (
                    <ul>
                        {personajes.map(personaje => (
                            <li key={personaje.id}>
                                ID: {personaje.id}, Nombre: {personaje.name}, Email: {personaje.email}, Whatsapp: {personaje.whatsapp}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay personajes registrados.</p>
                )}
            </div>

            {/* Formulario para eliminar */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>ID del Personaje a Eliminar:</label>
                    <input 
                        type="number" 
                        value={idEliminar} 
                        onChange={handleChange} 
                        required 
                        min="1"
                    />
                </div>
                <button type="submit">Eliminar Personaje</button>
            </form>
            
            {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        </div>
    );
}

export default EliminarPersonaje;