document.addEventListener("DOMContentLoaded", function() {
    const adminOptionsButton = document.getElementById("admin-options-button");
    const adminOptions = document.getElementById("admin-options");
    const userListContainer = document.getElementById("user-list-container");
    const addUserForm = document.getElementById("add-user-form");

    // Mostrar/ocultar el panel de opciones de administración
    adminOptionsButton.addEventListener("click", function() {
        adminOptions.style.display = adminOptions.style.display === "block" ? "none" : "block";
    });

    // Cargar la lista de usuarios desde un archivo
    function cargarListaUsuarios() {
        fetch("usuarios.txt")
            .then(response => response.text())
            .then(data => {
                const usuarios = data.split("\n").map(linea => linea.trim()).filter(linea => linea);
                const lista = document.getElementById("user-list");
                lista.innerHTML = ""; // Limpiar lista antes de cargar nuevos datos

                usuarios.forEach(usuario => {
                    const li = document.createElement("li");
                    li.textContent = usuario;
                    lista.appendChild(li);
                });
            })
            .catch(error => {
                console.error("Error al cargar la lista de usuarios:", error);
            });
    }

    // Mostrar la lista de usuarios
    if (userListContainer) {
        cargarListaUsuarios();
    }

    // Añadir un nuevo usuario
    if (addUserForm) {
        addUserForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const idInput = document.getElementById("id-input");
            const nombreInput = document.getElementById("nombre-input");
            const claveInput = document.getElementById("clave-input");

            const id = idInput.value.trim();
            const nombre = nombreInput.value.trim();
            const clave = claveInput.value.trim();

            if (id && nombre && clave) {
                const nuevoUsuario = `${id},${nombre},${clave}`;
                
                // Enviar el nuevo usuario a un servidor o archivo
                fetch("guardar_usuario.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: new URLSearchParams({
                        usuario: nuevoUsuario
                    })
                })
                .then(response => response.text())
                .then(result => {
                    alert("Usuario añadido con éxito.");
                    idInput.value = "";
                    nombreInput.value = "";
                    claveInput.value = "";
                    cargarListaUsuarios(); // Recargar lista después de añadir
                })
                .catch(error => {
                    console.error("Error al añadir el usuario:", error);
                    alert("Error al añadir el usuario. Inténtalo de nuevo más tarde.");
                });
            } else {
                alert("Por favor, completa todos los campos.");
            }
        });
    }
});