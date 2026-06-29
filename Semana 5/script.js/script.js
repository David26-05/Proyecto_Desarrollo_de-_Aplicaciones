// ================================================================
//  WAFFLECITO - SCRIPT DE GESTIÓN DE PRODUCTOS (Dinámico)
// ================================================================

document.addEventListener('DOMContentLoaded', function() {

    // ---------- ELEMENTOS DEL DOM ----------
    const productForm = document.getElementById('productForm');
    const productName = document.getElementById('productName');
    const productCategory = document.getElementById('productCategory');
    const productDescription = document.getElementById('productDescription');
    const productList = document.getElementById('productList');
    const emptyMessage = document.getElementById('emptyMessage');
    const productCount = document.getElementById('productCount');

    // Contador de productos (arranca en 0)
    let counter = 0;

    // ---------- FUNCIÓN PARA ACTUALIZAR CONTADOR ----------
    function updateCounter() {
        const items = productList.querySelectorAll('.product-item');
        counter = items.length;
        productCount.textContent = counter;

        // Mostrar/ocultar mensaje de "sin productos"
        if (counter === 0) {
            emptyMessage.style.display = 'block';
        } else {
            emptyMessage.style.display = 'none';
        }
    }

    // ---------- FUNCIÓN PARA ELIMINAR PRODUCTO ----------
    function deleteProduct(event) {
        // El botón de eliminar tiene clase 'delete-btn'
        const btn = event.currentTarget;
        const productItem = btn.closest('.product-item');
        if (productItem) {
            // Efecto visual de eliminación
            productItem.style.transition = 'all 0.3s ease';
            productItem.style.opacity = '0';
            productItem.style.transform = 'scale(0.9)';
            setTimeout(() => {
                productItem.remove();
                updateCounter();
                // Mostrar mensaje de éxito (opcional)
                showToast('Producto eliminado correctamente', 'danger');
            }, 300);
        }
    }

    // ---------- FUNCIÓN PARA MOSTRAR TOAST (Bootstrap) ----------
    function showToast(message, type = 'success') {
        // Crear toast dinámicamente
        const toastContainer = document.createElement('div');
        toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '1050';

        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type} border-0`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');

        const toastBody = document.createElement('div');
        toastBody.className = 'd-flex';
        toastBody.innerHTML = `
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        `;
        toast.appendChild(toastBody);
        toastContainer.appendChild(toast);
        document.body.appendChild(toastContainer);

        // Inicializar y mostrar
        const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
        bsToast.show();

        // Eliminar del DOM después de ocultarse
        toast.addEventListener('hidden.bs.toast', function() {
            toastContainer.remove();
        });
    }

    // ---------- EVENTO: AGREGAR PRODUCTO ----------
    productForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita recarga de la página

        // 1. VALIDAR CAMPOS (no vacíos)
        const name = productName.value.trim();
        const category = productCategory.value.trim();
        const description = productDescription.value.trim();

        if (name === '' || category === '' || description === '') {
            // Mostrar mensaje de error con validación
            showToast('❌ Todos los campos son obligatorios. Completa el formulario.', 'danger');
            // Resaltar campos vacíos
            if (name === '') productName.classList.add('is-invalid');
            else productName.classList.remove('is-invalid');
            if (category === '') productCategory.classList.add('is-invalid');
            else productCategory.classList.remove('is-invalid');
            if (description === '') productDescription.classList.add('is-invalid');
            else productDescription.classList.remove('is-invalid');
            return;
        }

        // Remover clases de error si todo está bien
        productName.classList.remove('is-invalid');
        productCategory.classList.remove('is-invalid');
        productDescription.classList.remove('is-invalid');

        // 2. CREAR ELEMENTOS HTML CON createElement() y appendChild()
        //    - Contenedor principal (columna Bootstrap)
        const col = document.createElement('div');
        col.className = 'col-md-6 col-xl-4 product-item';
        col.style.transition = 'all 0.3s ease';

        //    - Card
        const card = document.createElement('div');
        card.className = 'card card-waffle h-100';

        //    - Cuerpo de la card
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body d-flex flex-column';

        //    - Título
        const title = document.createElement('h5');
        title.className = 'card-title';
        title.innerHTML = `<i class="bi bi-tag"></i> ${name}`;

        //    - Categoría (badge)
        const catBadge = document.createElement('span');
        catBadge.className = 'badge bg-warning text-dark mb-2';
        catBadge.textContent = `📂 ${category}`;

        //    - Descripción
        const desc = document.createElement('p');
        desc.className = 'card-text flex-grow-1';
        desc.textContent = description;

        //    - Fecha de creación (automática)
        const date = document.createElement('small');
        date.className = 'text-muted d-block mb-2';
        const now = new Date();
        date.textContent = `🕒 Agregado: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

        //    - Botón eliminar
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-sm mt-2 delete-btn';
        deleteBtn.innerHTML = '<i class="bi bi-trash3"></i> Eliminar';
        // Asignar evento click al botón eliminar
        deleteBtn.addEventListener('click', deleteProduct);

        // 3. ARMAR ESTRUCTURA
        cardBody.appendChild(title);
        cardBody.appendChild(catBadge);
        cardBody.appendChild(desc);
        cardBody.appendChild(date);
        cardBody.appendChild(deleteBtn);
        card.appendChild(cardBody);
        col.appendChild(card);

        // 4. AGREGAR A LA LISTA (appendChild)
        productList.appendChild(col);

        // 5. ACTUALIZAR CONTADOR
        updateCounter();

        // 6. LIMPIAR FORMULARIO
        productForm.reset();

        // 7. MOSTRAR MENSAJE DE ÉXITO
        showToast(`✅ Producto "${name}" agregado correctamente.`, 'success');

        // 8. SCROLL SUAVE AL NUEVO PRODUCTO
        col.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // ---------- VALIDACIÓN EN TIEMPO REAL (opcional) ----------
    // Quitar clase 'is-invalid' cuando el usuario empiece a escribir
    productName.addEventListener('input', function() {
        if (this.value.trim() !== '') this.classList.remove('is-invalid');
    });
    productCategory.addEventListener('input', function() {
        if (this.value.trim() !== '') this.classList.remove('is-invalid');
    });
    productDescription.addEventListener('input', function() {
        if (this.value.trim() !== '') this.classList.remove('is-invalid');
    });

    // ---------- INICIALIZAR CONTADOR ----------
    updateCounter();

}); // Fin DOMContentLoaded