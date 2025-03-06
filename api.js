const API_URL = 'http://localhost:3000';

const api = {
    fetchLinks: async function(tag = '') {
        try {
            const url = tag ? `${API_URL}/links?tag=${tag}` : `${API_URL}/links`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al cargar enlaces');
            return await response.json();
        } catch (error) {
            console.error('Error fetching links:', error);
            throw error;
        }
    },

    fetchLinkById: async function(id) {
        try {
            const response = await fetch(`${API_URL}/links/${id}`);
            if (!response.ok) throw new Error('Error al cargar detalles del enlace');
            return await response.json();
        } catch (error) {
            console.error('Error fetching link details:', error);
            throw error;
        }
    },

    fetchTags: async function() {
        try {
            const response = await fetch(`${API_URL}/tags`);
            if (!response.ok) throw new Error('Error al cargar etiquetas');
            return await response.json();
        } catch (error) {
            console.error('Error fetching tags:', error);
            throw error;
        }
    },

    createLink: async function(linkData) {
        try {
            const response = await fetch(`${API_URL}/links`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(linkData)
            });
            if (!response.ok) throw new Error('Error al crear enlace');
            return await response.json();
        } catch (error) {
            console.error('Error creating link:', error);
            throw error;
        }
    },

    addComment: async function(linkId, commentData) {
        try {
            const response = await fetch(`${API_URL}/links/${linkId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(commentData)
            });
            if (!response.ok) throw new Error('Error al añadir comentario');
            return await response.json();
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    },

    addVote: async function(linkId) {
        try {
            const response = await fetch(`${API_URL}/links/${linkId}/votes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ value: 1 })
            });
            if (!response.ok) throw new Error('Error al registrar voto');
            return await response.json();
        } catch (error) {
            console.error('Error adding vote:', error);
            throw error;
        }
    }
};