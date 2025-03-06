function app() {
    return {
        currentPage: 'home',
        currentLinkId: null,
        currentLink: null,
        links: [],
        tags: [],
        selectedTag: '',
        loading: true,
        error: null,
        
        // Estado para el formulario de nuevo enlace
        newLink: {
            title: '',
            url: '',
            description: '',
            tagsInput: ''
        },
        
        // Estado para el formulario de nuevo comentario
        newComment: {
            userName: '',
            text: ''
        },
        
        // Propiedad computada para el total de votos
        get totalVotes() {
            if (!this.currentLink || !this.currentLink.votes) return 0;
            return this.currentLink.votes.reduce((sum, vote) => sum + vote.value, 0);
        },
        
        // Métodos
        async init() {
            this.loadData();
        },
        
        async loadData() {
            try {
                this.loading = true;
                this.error = null;
                await this.loadLinks();
                await this.loadTags();
            } catch (err) {
                this.error = 'Error al cargar datos. Por favor intenta de nuevo.';
                console.error(err);
            } finally {
                this.loading = false;
            }
        },
        
        async loadLinks() {
            try {
                this.links = await api.fetchLinks(this.selectedTag);
            } catch (err) {
                this.error = 'Error al cargar enlaces.';
                console.error(err);
            }
        },
        
        async loadTags() {
            try {
                this.tags = await api.fetchTags();
            } catch (err) {
                this.error = 'Error al cargar etiquetas.';
                console.error(err);
            }
        },
        
        async showLinkDetails(id) {
            this.currentLinkId = id;
            this.currentPage = 'detail';
            this.loading = true;
            this.error = null;
            
            try {
                this.currentLink = await api.fetchLinkById(id);
            } catch (err) {
                this.error = 'Error al cargar los detalles del enlace.';
                console.error(err);
            } finally {
                this.loading = false;
            }
        },
        
        async createLink() {
            if (!this.newLink.title.trim() || !this.newLink.url.trim()) {
                this.error = 'Por favor completa los campos obligatorios';
                return;
            }
            
            const tags = this.newLink.tagsInput
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag !== '');
            
            try {
                await api.createLink({
                    title: this.newLink.title,
                    url: this.newLink.url,
                    description: this.newLink.description,
                    tags
                });
                
                // Limpiar formulario
                this.newLink = {
                    title: '',
                    url: '',
                    description: '',
                    tagsInput: ''
                };
                
                alert('Enlace añadido correctamente');
                this.currentPage = 'home';
                this.loadLinks();
            } catch (err) {
                this.error = 'Error al crear el enlace. Por favor intenta de nuevo.';
                console.error(err);
            }
        },
        
        async addComment() {
            if (!this.newComment.userName.trim() || !this.newComment.text.trim()) {
                alert('Por favor completa todos los campos');
                return;
            }
            
            try {
                await api.addComment(this.currentLinkId, {
                    userName: this.newComment.userName,
                    text: this.newComment.text
                });
                
                // Recargar los detalles del enlace para mostrar el nuevo comentario
                this.currentLink = await api.fetchLinkById(this.currentLinkId);
                
                // Limpiar formulario
                this.newComment = {
                    userName: '',
                    text: ''
                };
                
                alert('Comentario añadido correctamente');
            } catch (err) {
                alert('Error al añadir el comentario');
                console.error(err);
            }
        },
        
        async addVote() {
            try {
                await api.addVote(this.currentLinkId);
                // Recargar los detalles del enlace para mostrar el nuevo voto
                this.currentLink = await api.fetchLinkById(this.currentLinkId);
                alert('Voto registrado correctamente');
            } catch (err) {
                alert('Error al registrar el voto');
                console.error(err);
            }
        }
    };
}