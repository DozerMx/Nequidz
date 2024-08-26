document.addEventListener("DOMContentLoaded", function() {
    const keyContainer = document.getElementById("key-container");
    const inicioContainer = document.getElementById("inicio");
    const idInput = document.getElementById("id-input");
    const keyInput = document.getElementById("key-input");
    const keySubmit = document.getElementById("key-submit");

    keySubmit.addEventListener("click", function() {
        const id = idInput.value;
        const key = keyInput.value;

        // Leer el archivo registros.txt
        fetch('registros.txt')
            .then(response => response.text())
            .then(text => {
                const lines = text.trim().split('\n');
                let valid = false;

                for (const line of lines) {
                    const [fileId, filePassword] = line.split(',');
                    if (fileId === id && filePassword === key) {
                        valid = true;
                        break;
                    }
                }

                if (valid) {
                    keyContainer.style.display = "none";
                    inicioContainer.style.display = "block";
                } else {
                    alert("🤬¡ID o contraseña incorrectos!〽️");
                }
            })
            .catch(error => {
                console.error("Error al leer registros.txt:", error);
                alert("Error al verificar el ID y la contraseña. Inténtalo de nuevo más tarde.");
            });
    });

    // Formato del número de teléfono
    const telefonoInput = document.getElementById("telefono");

    telefonoInput.addEventListener("input", function(e) {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        const formattedValue = value.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
        e.target.value = formattedValue;
    });

    // Manejo del formulario
    const formulario = document.getElementById("formulario");
    formulario.addEventListener("submit", function(event) {
        event.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const telefono = document.getElementById("telefono").value;
        const valor = parseFloat(document.getElementById("valor").value).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        function generarReferencia() {
            const longitud = 7;
            let referencia = 'M';
            for (let i = 0; i < longitud; i++) {
                referencia += Math.floor(Math.random() * 10);
            }
            return referencia;
        }

        const referencia = generarReferencia();

        const content = `
            <div class="top-image">
                <img src="https://i.postimg.cc/7Ls6sfsv/Picsart-24-08-25-02-28-55-342.jpg" alt="Imagen principal" style="width: 100%; max-width: 400px; display: block; margin: 0 auto; margin-bottom: 20px;">
            </div>
            <div class="status"></div>
            <div class="detail">
                <span>Para</span>
                ${nombre}
            </div>
            <div class="detail">
                <span>¿Cuánto?</span>
                $ ${valor}
            </div>
            <div class="detail">
                <span>Número Nequi</span>
                ${telefono}
            </div>
            <div class="detail">
                <span>Fecha</span>
                ${new Date().toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })} a las ${new Date().toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                })}
            </div>
            <div class="reference">
                <span>Referencia</span>
                <span>${referencia}</span>
            </div>
            <div class="detail" style="margin-top: 20px;">
                <span class="plata-label">¿De dónde salió la plata?</span>
            </div>
            <div class="account-balance">
                <img src="https://i.postimg.cc/6qy3vkM2/Picsart-24-08-03-01-26-01-809.png" alt="icon">
                <div>
                    <span class="dispo">Disponible</span>
                    <span class="amount">$${valor.split(',')[0]}<small>,${valor.split(',')[1]}</small></span>
                </div>
            </div>
            <a href="#" class="problem-link">
                <img src="https://i.postimg.cc/qRKyS8yf/pixelcut-export-1.jpg" alt="Problema con el movimiento" style="max-width: 100%; height: auto; display: inline-block;">
            </a>
        `;

        document.getElementById("inicio").style.display = "none";
        document.getElementById("content").style.display = "block";
        document.getElementById("content").innerHTML = content;
    });
});
