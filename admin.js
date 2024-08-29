document.addEventListener("DOMContentLoaded", function() {
    // Tu código actual permanece igual

    // Ejemplo para iniciar sesión
    function iniciarSesion(id, password) {
        fetch("/api/checkLogin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Acceso permitido") {
                alert("Inicio de sesión exitoso");
                // Aquí puedes redirigir o mostrar una sección
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error("Error al iniciar sesión:", error);
        });
    }

    // Código para otros elementos (añadir usuario, cargar lista, etc.) permanece igual.
});