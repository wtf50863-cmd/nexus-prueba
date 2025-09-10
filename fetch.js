document.addEventListener("DOMContentLoaded", () => {
  const btnCargar = document.getElementById("btn-cargar");
  const laptopLista = document.getElementById("laptop-lista");

  btnCargar.addEventListener("click", async () => {
    try {
      // Llama a tu API en Express/Mongoose
      const res = await fetch("/api/pcs");
      const laptops = await res.json();

      // Limpia el contenedor antes de pintar
      laptopLista.innerHTML = "";

      // Recorre los laptops recibidos
      laptops.forEach(laptop => {
        const card = document.createElement("div");
        card.classList.add("laptop-card");

        card.innerHTML = `
          <img src="${laptop.img}" alt="${laptop.nombre}" class="laptop-img" />
          <h3>${laptop.nombre}</h3>
          <p><strong>Marca:</strong> ${laptop.marca}</p>
          <p><strong>Procesador:</strong> ${laptop.especificaciones?.procesador}</p>
          <p><strong>RAM:</strong> ${laptop.especificaciones?.ram}</p>
          <p><strong>Almacenamiento:</strong> ${laptop.especificaciones?.almacenamiento}</p>
          <p><strong>Pantalla:</strong> ${laptop.especificaciones?.pantalla}</p>
          ${laptop.especificaciones?.grafica ? `<p><strong>Gráfica:</strong> ${laptop.especificaciones?.grafica}</p>` : ""}
          <p class="precio">$${laptop.precio.toLocaleString()} ${laptop.moneda}</p>
        `;

        laptopLista.appendChild(card);
      });
    } catch (error) {
      console.error("Error cargando laptops:", error);
      laptopLista.innerHTML = "<p>Error cargando laptops. Revisa la consola.</p>";
    }
  });
});
