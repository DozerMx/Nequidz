document.addEventListener("DOMContentLoaded", function() {
    const adminOptionsButton = document.getElementById("admin-options-button");
    const adminOptions = document.getElementById("admin-options");
    const userListButton = document.getElementById("user-list-button");
    const userListContainer = document.getElementById("user-list-container");
    const addUserButton = document.getElementById("add-user-button");
    const addUserForm = document.getElementById("add-user-form");
    const newUserForm = document.getElementById("new-user-form");

    // Mostrar/ocultar el panel de opciones de administración
    adminOptionsButton.addEventListener("click", function() {
        adminOptions.style.display = adminOptions.style.display === "block" ? "none" : "block";
    });

    // Cargar la lista de usuarios y dispositivos desde registros.txt
    function cargarListaUsuarios() {
        fetch("registros.txt")
            .then(response => response.text())
            .then(data => {
                const registros = data.split("\n").map(linea => linea.trim()).filter(linea => linea);
                const lista = document.getElementById("user-list");
                lista.innerHTML = ""; // Limpiar lista antes de cargar nuevos datos

                registros.forEach(registro => {
                    const [id, nombre, dispositivos] = registro.split(",");
                    const dispositivosCount = dispositivos ? dispositivos.split("|").length : 0;
                    const li = document.createElement("li");
                    li.textContent = `ID: ${id}, Nombre: ${nombre}, Dispositivos: ${dispositivosCount || "Ninguno"}`;
                    lista.appendChild(li);
                });
            })
            .catch(error => {
                console.error("Error al cargar la lista de usuarios:", error);
            });
    }

    // Mostrar la lista de usuarios cuando se hace clic en el botón correspondiente
    userListButton.addEventListener("click", function() {
        userListContainer.style.display = userListContainer.style.display === "block" ? "none" : "block";
        if (userListContainer.style.display === "block") {
            cargarListaUsuarios();
        }
    });

    // Mostrar/ocultar el formulario para añadir usuario
    addUserButton.addEventListener("click", function() {
        addUserForm.style.display = addUserForm.style.display === "block" ? "none" : "block";
    });

    // Añadir un nuevo usuario
    if (newUserForm) {
        newUserForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const idInput = document.getElementById("new-id");
            const nombreInput = document.getElementById("new-nombre");
            const claveInput = document.getElementById("new-password");

            const id = idInput.value.trim();
            const nombre = nombreInput.value.trim();
            const clave = claveInput.value.trim();

            if (id && nombre && clave) {
                const nuevoUsuario = `${id},${nombre},`;

                // Enviar el nuevo usuario al servidor para guardarlo
                fetch("save_user.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: new URLSearchParams({
                        new_user: nuevoUsuario
                    })
                })
                .then(response => response.text())
                .then(result => {
                    if (result === "success") {
                        alert("Usuario añadido con éxito.");
                        idInput.value = "";
                        nombreInput.value = "";
                        claveInput.value = "";
                        cargarListaUsuarios(); // Recargar lista después de añadir
                        addUserForm.style.display = "none";
                    } else {
                        alert("Hubo un problema al añadir el usuario. Intenta de nuevo.");
                    }
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
