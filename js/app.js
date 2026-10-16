/**
 * StampaDito — Lógica de interacción del sitio (js/app.js)
 * ---------------------------------------------------------
 * Funcionalidades:
 * 1. Cintilla promocional configurable con control accesible de pausa/reanudación.
 * 2. Menú móvil accesible con cierre con tecla Escape y sincronización ARIA.
 * 3. Filtrado de catálogo por colecciones desde el mosaico, filtros y pie de página.
 * 4. Selección de variantes en tarjetas de producto con actualización de precio y acabado.
 * 5. Modal de detalle de producto y modal personalizador interactivo (nombre, frase, fuente, carga de imagen).
 * 6. Carrito local persistente en localStorage (alcance prototipo sin simular cobros reales).
 * 7. Animaciones suaves al hacer scroll mediante IntersectionObserver y movimiento sutil en el Hero,
 *    respetando prefers-reduced-motion y garantizando visibilidad total si JS falla.
 */

(function () {
  'use strict';

  const DATA = window.STAMPADITO_DATA;
  if (!DATA) return;

  const STORAGE_KEY = 'stampadito_cart_v1';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Estado de la aplicación
  const state = {
    activeFilter: 'all',
    selectedVariantsByCard: {},
    customizer: {
      productId: DATA.products[0].id,
      variantId: DATA.products[0].variants[0].id,
      customName: DATA.products[0].defaultCustomText || 'CAMILA',
      customPhrase: '',
      fontStyle: 'editorial',
      uploadedImageDataUrl: null,
      uploadedImageName: '',
      notes: ''
    },
    detailProduct: null,
    detailVariantId: null,
    cart: loadCartFromStorage()
  };

  // Inicializar variantes por defecto para cada producto
  DATA.products.forEach((p) => {
    if (p.variants && p.variants.length > 0) {
      state.selectedVariantsByCard[p.id] = p.variants[0].id;
    }
  });

  // =========================================================================
  // Utilidades
  // =========================================================================
  function formatCurrency(amount) {
    const { symbol, suffix } = DATA.meta.currency;
    return `${symbol}${Number(amount).toFixed(0)} ${suffix}`;
  }

  function getProductById(productId) {
    return DATA.products.find((p) => p.id === productId) || DATA.products[0];
  }

  function getVariant(product, variantId) {
    if (!product || !product.variants) return null;
    return product.variants.find((v) => v.id === variantId) || product.variants[0];
  }

  function computePrice(product, variantId) {
    const variant = getVariant(product, variantId);
    const delta = variant ? variant.priceDelta || 0 : 0;
    return product.price + delta;
  }

  function showToast(message) {
    const region = document.getElementById('toastRegion');
    if (!region) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    region.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3400);
  }

  // =========================================================================
  // 1. Cintilla promocional (Pausa / Reanudar accesible + Configuración desde DATA)
  // =========================================================================
  function initPromoBar() {
    const promoBar = document.querySelector('.promo-bar');
    const toggleBtn = document.getElementById('promoToggleBtn');
    const toggleIcon = document.getElementById('promoToggleIcon');
    const toggleText = document.getElementById('promoToggleText');
    const primaryGroup = document.getElementById('promoPrimaryGroup');
    const cloneGroup = document.getElementById('promoCloneGroup');

    if (!promoBar || !toggleBtn) return;

    // Sincronizar mensajes desde DATA.promoBar si están definidos
    if (DATA.promoBar && Array.isArray(DATA.promoBar.items) && DATA.promoBar.items.length > 0 && primaryGroup && cloneGroup) {
      const buildItemsHtml = (isClone) =>
        DATA.promoBar.items
          .map(
            (text) =>
              `<span class="promo-bar__item">${escapeHtml(text)}</span><span class="promo-bar__sep"${
                isClone ? '' : ' aria-hidden="true"'
              }>✦</span>`
          )
          .join('');
      primaryGroup.innerHTML = buildItemsHtml(false);
      cloneGroup.innerHTML = buildItemsHtml(true);
    }

    toggleBtn.addEventListener('click', () => {
      const isPaused = promoBar.classList.toggle('is-paused');
      toggleBtn.setAttribute('aria-pressed', String(isPaused));
      toggleBtn.setAttribute(
        'aria-label',
        isPaused ? 'Reanudar animación de la cintilla promocional' : 'Pausar animación de la cintilla promocional'
      );
      if (toggleIcon) toggleIcon.textContent = isPaused ? '▶' : '❚❚';
      if (toggleText) toggleText.textContent = isPaused ? 'Reanudar' : 'Pausar';
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // =========================================================================
  // 2. Navegación y Menú Móvil Accesible
  // =========================================================================
  function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const menuPanel = document.getElementById('mobileMenuPanel');
    if (!menuBtn || !menuPanel) return;

    function closeMenu() {
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Abrir menú de navegación');
      menuPanel.hidden = true;
    }

    function toggleMenu() {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        closeMenu();
      } else {
        menuBtn.setAttribute('aria-expanded', 'true');
        menuBtn.setAttribute('aria-label', 'Cerrar menú de navegación');
        menuPanel.hidden = false;
      }
    }

    menuBtn.addEventListener('click', toggleMenu);

    menuPanel.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('click', () => {
        closeMenu();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuBtn.focus();
      }
    });
  }

  // =========================================================================
  // 3. Catálogo: Filtrado por Colección y Selección de Variantes
  // =========================================================================
  function initCatalogInteractions() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const productCards = document.querySelectorAll('.product-card[data-product-id]');

    function applyCollectionFilter(collectionId, shouldScroll = false) {
      state.activeFilter = collectionId;

      filterButtons.forEach((btn) => {
        const isMatch = btn.getAttribute('data-filter') === collectionId;
        btn.classList.toggle('is-active', isMatch);
        btn.setAttribute('aria-pressed', String(isMatch));
      });

      productCards.forEach((card) => {
        const cardCollection = card.getAttribute('data-collection');
        const visible = collectionId === 'all' || cardCollection === collectionId;
        card.hidden = !visible;
      });

      if (shouldScroll) {
        const catalogSection = document.getElementById('catalogo');
        if (catalogSection) {
          catalogSection.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
        }
      }
    }

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filterVal = btn.getAttribute('data-filter') || 'all';
        applyCollectionFilter(filterVal, false);
      });
    });

    // Enlaces en tarjetas del mosaico y en el pie de página que filtran colecciones
    document.querySelectorAll('[data-filter-collection]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const colId = link.getAttribute('data-filter-collection');
        if (colId) {
          e.preventDefault();
          applyCollectionFilter(colId, true);
        }
      });
    });

    // Swatches de variantes en cada tarjeta de producto
    productCards.forEach((card) => {
      const productId = card.getAttribute('data-product-id');
      const product = getProductById(productId);
      const priceEl = card.querySelector('[data-price-display]');
      const variantNameEl = card.querySelector('[data-variant-name]');
      const swatches = card.querySelectorAll('.swatch[data-variant-id]');

      swatches.forEach((swatch) => {
        swatch.addEventListener('click', () => {
          const variantId = swatch.getAttribute('data-variant-id');
          state.selectedVariantsByCard[productId] = variantId;

          swatches.forEach((s) => {
            const active = s === swatch;
            s.classList.toggle('is-selected', active);
            s.setAttribute('aria-pressed', String(active));
          });

          const variant = getVariant(product, variantId);
          const totalPrice = computePrice(product, variantId);

          if (variantNameEl && variant) {
            variantNameEl.textContent = variant.label;
          }
          if (priceEl) {
            priceEl.innerHTML = `$${totalPrice} <span class="product-card__currency">${DATA.meta.currency.suffix}</span>`;
          }
        });
      });
    });
  }

  // =========================================================================
  // 4. Modal Personalizador Interactivo
  // =========================================================================
  function initCustomizerModal() {
    const dialog = document.getElementById('customizerDialog');
    const form = document.getElementById('customizerForm');
    const productSelect = document.getElementById('customProductSelect');
    const variantsContainer = document.getElementById('customizerVariantsContainer');
    const nameInput = document.getElementById('customNameInput');
    const fontSelect = document.getElementById('customFontSelect');
    const phraseInput = document.getElementById('customPhraseInput');
    const imageInput = document.getElementById('customImageInput');
    const imageStatus = document.getElementById('customImageStatus');
    const clearImageBtn = document.getElementById('clearCustomImageBtn');
    const notesInput = document.getElementById('customNotesInput');
    const priceDisplay = document.getElementById('customizerPriceDisplay');

    // Elementos de vista previa
    const stage = document.getElementById('customizerStage');
    const previewModelName = document.getElementById('customizerPreviewModelName');
    const baseImage = document.getElementById('customizerBaseImage');
    const userPhotoWrap = document.getElementById('customizerUserPhotoWrap');
    const userPhoto = document.getElementById('customizerUserPhoto');
    const previewName = document.getElementById('previewCustomName');
    const previewPhrase = document.getElementById('previewCustomPhrase');

    if (!dialog || !form || !productSelect) return;

    // Poblar selector de modelos
    productSelect.innerHTML = DATA.products
      .map((p) => `<option value="${escapeHtml(p.id)}">${escapeHtml(p.name)} — Base $${p.price} MXN</option>`)
      .join('');

    function renderVariantPills(product) {
      variantsContainer.innerHTML = '';
      product.variants.forEach((v) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isActive = v.id === state.customizer.variantId;
        btn.className = `variant-pill${isActive ? ' is-active' : ''}`;
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', String(isActive));
        const deltaText = v.priceDelta > 0 ? ` (+$${v.priceDelta})` : v.priceDelta < 0 ? ` (-$${Math.abs(v.priceDelta)})` : '';
        btn.innerHTML = `<span class="variant-pill__dot" style="background-color: ${v.colorHex}"></span><span>${escapeHtml(
          v.label + deltaText
        )}</span>`;
        btn.addEventListener('click', () => {
          state.customizer.variantId = v.id;
          renderVariantPills(product);
          updateCustomizerPreview();
        });
        variantsContainer.appendChild(btn);
      });
    }

    function updateCustomizerPreview() {
      const product = getProductById(state.customizer.productId);
      const price = computePrice(product, state.customizer.variantId);

      if (stage) stage.setAttribute('data-theme', product.accentTheme || 'pink');
      if (previewModelName) previewModelName.textContent = product.name;
      if (baseImage) {
        baseImage.src = product.image;
        baseImage.alt = product.imageAlt;
      }

      const displayText = (nameInput.value || '').trim() || product.defaultCustomText || 'TU IDEA';
      if (previewName) {
        previewName.textContent = displayText;
        previewName.classList.toggle('is-sans', fontSelect.value === 'modern');
      }

      const phraseText = (phraseInput.value || '').trim();
      if (previewPhrase) {
        previewPhrase.textContent = phraseText;
        previewPhrase.hidden = phraseText.length === 0;
      }

      if (state.customizer.uploadedImageDataUrl && userPhoto && userPhotoWrap) {
        userPhoto.src = state.customizer.uploadedImageDataUrl;
        userPhotoWrap.hidden = false;
      } else if (userPhotoWrap) {
        userPhotoWrap.hidden = true;
      }

      if (priceDisplay) {
        priceDisplay.textContent = formatCurrency(price);
      }
    }

    function openCustomizer(productId) {
      const product = getProductById(productId || state.customizer.productId);
      state.customizer.productId = product.id;
      state.customizer.variantId = state.selectedVariantsByCard[product.id] || product.variants[0].id;
      productSelect.value = product.id;

      if (!nameInput.value || nameInput.dataset.autoFilled === 'true') {
        nameInput.value = product.defaultCustomText || 'CAMILA';
        nameInput.dataset.autoFilled = 'true';
      }

      renderVariantPills(product);
      updateCustomizerPreview();

      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
    }

    function closeCustomizer() {
      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
    }

    productSelect.addEventListener('change', () => {
      const product = getProductById(productSelect.value);
      state.customizer.productId = product.id;
      state.customizer.variantId = product.variants[0].id;
      if (nameInput.dataset.autoFilled === 'true') {
        nameInput.value = product.defaultCustomText || '';
      }
      renderVariantPills(product);
      updateCustomizerPreview();
    });

    nameInput.addEventListener('input', () => {
      nameInput.dataset.autoFilled = 'false';
      updateCustomizerPreview();
    });

    fontSelect.addEventListener('change', updateCustomizerPreview);
    phraseInput.addEventListener('input', updateCustomizerPreview);

    // Carga de imagen local con FileReader para vista previa ilustrativa
    imageInput.addEventListener('change', () => {
      const file = imageInput.files && imageInput.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast('Por favor selecciona un archivo de imagen válido (PNG, JPG o WebP).');
        imageInput.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        state.customizer.uploadedImageDataUrl = ev.target.result;
        state.customizer.uploadedImageName = file.name;
        if (imageStatus) imageStatus.textContent = `Archivo cargado: ${file.name}`;
        if (clearImageBtn) clearImageBtn.hidden = false;
        updateCustomizerPreview();
      };
      reader.readAsDataURL(file);
    });

    if (clearImageBtn) {
      clearImageBtn.addEventListener('click', () => {
        imageInput.value = '';
        state.customizer.uploadedImageDataUrl = null;
        state.customizer.uploadedImageName = '';
        if (imageStatus) imageStatus.textContent = 'Ningún archivo seleccionado';
        clearImageBtn.hidden = true;
        updateCustomizerPreview();
      });
    }

    // Guardar taza personalizada en el carrito local
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const product = getProductById(state.customizer.productId);
      const variant = getVariant(product, state.customizer.variantId);
      const unitPrice = computePrice(product, state.customizer.variantId);
      const customName = (nameInput.value || '').trim() || product.defaultCustomText || 'Sin texto';
      const customPhrase = (phraseInput.value || '').trim();
      const customNotes = (notesInput.value || '').trim();

      addItemToCart({
        productId: product.id,
        name: product.name,
        image: product.image,
        variantId: variant.id,
        variantLabel: variant.label,
        unitPrice,
        customization: {
          name: customName,
          phrase: customPhrase,
          fontStyle: fontSelect.value === 'modern' ? 'Geométrica Sans' : 'Editorial Serif',
          uploadedImageName: state.customizer.uploadedImageName || null,
          notes: customNotes || null
        }
      });

      closeCustomizer();
      openCartDrawer();
      showToast(`«${product.name}» personalizada añadida a tu carrito.`);
    });

    // Disparadores globales para abrir el personalizador
    document.querySelectorAll('[data-open-customizer]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openCustomizer(state.customizer.productId);
      });
    });

    document.querySelectorAll('[data-customize-product]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const prodId = btn.getAttribute('data-customize-product');
        nameInput.dataset.autoFilled = 'true';
        openCustomizer(prodId);
      });
    });

    document.querySelectorAll('[data-close-customizer]').forEach((btn) => {
      btn.addEventListener('click', closeCustomizer);
    });

    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) closeCustomizer();
    });

    // Exponer función para abrir desde el modal de detalle
    window.__openStampaCustomizer = openCustomizer;
  }

  // =========================================================================
  // 5. Modal de Detalle de Producto
  // =========================================================================
  function initDetailModal() {
    const dialog = document.getElementById('productDetailDialog');
    const colTag = document.getElementById('detailCollectionTag');
    const titleEl = document.getElementById('detailModalTitle');
    const imgEl = document.getElementById('detailProductImage');
    const priceEl = document.getElementById('detailProductPrice');
    const descEl = document.getElementById('detailProductDescription');
    const variantsList = document.getElementById('detailVariantsList');
    const customizeBtn = document.getElementById('detailCustomizeBtn');
    const quickAddBtn = document.getElementById('detailQuickAddBtn');

    if (!dialog) return;

    function renderDetailVariants(product) {
      variantsList.innerHTML = '';
      product.variants.forEach((v) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isActive = v.id === state.detailVariantId;
        btn.className = `variant-pill${isActive ? ' is-active' : ''}`;
        btn.innerHTML = `<span class="variant-pill__dot" style="background-color: ${v.colorHex}"></span><span>${escapeHtml(
          v.label
        )}</span>`;
        btn.addEventListener('click', () => {
          state.detailVariantId = v.id;
          state.selectedVariantsByCard[product.id] = v.id;
          priceEl.textContent = formatCurrency(computePrice(product, v.id));
          renderDetailVariants(product);
        });
        variantsList.appendChild(btn);
      });
    }

    function openDetail(productId) {
      const product = getProductById(productId);
      state.detailProduct = product;
      state.detailVariantId = state.selectedVariantsByCard[product.id] || product.variants[0].id;

      if (colTag) colTag.textContent = product.collectionLabel;
      if (titleEl) titleEl.textContent = product.name;
      if (imgEl) {
        imgEl.src = product.image;
        imgEl.alt = product.imageAlt;
      }
      if (priceEl) priceEl.textContent = formatCurrency(computePrice(product, state.detailVariantId));
      if (descEl) descEl.textContent = product.fullDescription;

      renderDetailVariants(product);

      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
    }

    function closeDetail() {
      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
    }

    if (customizeBtn) {
      customizeBtn.addEventListener('click', () => {
        if (!state.detailProduct) return;
        const pid = state.detailProduct.id;
        closeDetail();
        if (typeof window.__openStampaCustomizer === 'function') {
          window.__openStampaCustomizer(pid);
        }
      });
    }

    if (quickAddBtn) {
      quickAddBtn.addEventListener('click', () => {
        if (!state.detailProduct) return;
        const product = state.detailProduct;
        const variant = getVariant(product, state.detailVariantId);
        const unitPrice = computePrice(product, variant.id);

        addItemToCart({
          productId: product.id,
          name: product.name,
          image: product.image,
          variantId: variant.id,
          variantLabel: variant.label,
          unitPrice,
          customization: {
            name: product.defaultCustomText || 'Diseño de referencia',
            phrase: '',
            fontStyle: 'Estándar del modelo',
            uploadedImageName: null,
            notes: null
          }
        });

        closeDetail();
        openCartDrawer();
        showToast(`«${product.name}» añadida al carrito.`);
      });
    }

    document.querySelectorAll('[data-view-product]').forEach((btn) => {
      btn.addEventListener('click', () => {
        openDetail(btn.getAttribute('data-view-product'));
      });
    });

    document.querySelectorAll('[data-close-detail]').forEach((btn) => {
      btn.addEventListener('click', closeDetail);
    });

    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) closeDetail();
    });
  }

  // =========================================================================
  // 6. Carrito Local Funcional (Prototipo sin pagos simulados)
  // =========================================================================
  function loadCartFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveCartToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cart));
    } catch {
      // Ignorar si el almacenamiento está restringido
    }
  }

  function addItemToCart(newItem) {
    const signature = JSON.stringify({
      p: newItem.productId,
      v: newItem.variantId,
      c: newItem.customization
    });

    const existing = state.cart.find((item) => item.signature === signature);
    if (existing) {
      existing.quantity += 1;
    } else {
      state.cart.push({
        id: 'item_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
        signature,
        quantity: 1,
        ...newItem
      });
    }

    saveCartToStorage();
    renderCartUI();
  }

  function updateCartItemQty(itemId, delta) {
    const idx = state.cart.findIndex((i) => i.id === itemId);
    if (idx === -1) return;
    state.cart[idx].quantity += delta;
    if (state.cart[idx].quantity <= 0) {
      state.cart.splice(idx, 1);
    }
    saveCartToStorage();
    renderCartUI();
  }

  function removeCartItem(itemId) {
    state.cart = state.cart.filter((i) => i.id !== itemId);
    saveCartToStorage();
    renderCartUI();
  }

  function clearCart() {
    state.cart = [];
    saveCartToStorage();
    renderCartUI();
  }

  function renderCartUI() {
    const badge = document.getElementById('cartCountBadge');
    const emptyState = document.getElementById('cartEmptyState');
    const cartList = document.getElementById('cartList');
    const cartFooter = document.getElementById('cartFooter');
    const subtotalEl = document.getElementById('cartSubtotalValue');
    const feedbackEl = document.getElementById('cartActionFeedback');

    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = state.cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    if (badge) badge.textContent = String(totalItems);
    if (feedbackEl) feedbackEl.hidden = true;

    if (!cartList || !emptyState || !cartFooter) return;

    if (state.cart.length === 0) {
      emptyState.hidden = false;
      cartList.hidden = true;
      cartFooter.hidden = true;
      cartList.innerHTML = '';
      return;
    }

    emptyState.hidden = true;
    cartList.hidden = false;
    cartFooter.hidden = false;
    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);

    cartList.innerHTML = state.cart
      .map((item) => {
        const c = item.customization || {};
        return `
        <li class="cart-item">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" width="72" height="72" class="cart-item__thumb">
          <div>
            <h3 class="cart-item__title">${escapeHtml(item.name)}</h3>
            <div class="cart-item__meta">
              <span><strong>Acabado:</strong> ${escapeHtml(item.variantLabel)}</span>
              <span><strong>Texto/Nombre:</strong> ${escapeHtml(c.name || 'Base')} (${escapeHtml(c.fontStyle || 'Estándar')})</span>
              ${c.phrase ? `<span><strong>Frase:</strong> ${escapeHtml(c.phrase)}</span>` : ''}
              ${c.uploadedImageName ? `<span><strong>Imagen adjunta:</strong> ${escapeHtml(c.uploadedImageName)}</span>` : ''}
              ${c.notes ? `<span><strong>Notas:</strong> ${escapeHtml(c.notes)}</span>` : ''}
              <span><strong>Precio unitario (demo):</strong> ${formatCurrency(item.unitPrice)}</span>
            </div>
            <div class="cart-item__controls">
              <div class="qty-control" role="group" aria-label="Cantidad de ${escapeHtml(item.name)}">
                <button type="button" class="qty-control__btn" data-qty-minus="${escapeHtml(item.id)}" aria-label="Disminuir cantidad">−</button>
                <span class="qty-control__val">${item.quantity}</span>
                <button type="button" class="qty-control__btn" data-qty-plus="${escapeHtml(item.id)}" aria-label="Aumentar cantidad">+</button>
              </div>
              <button type="button" class="cart-item__remove" data-remove-item="${escapeHtml(item.id)}">Eliminar</button>
            </div>
          </div>
        </li>
      `;
      })
      .join('');

    cartList.querySelectorAll('[data-qty-minus]').forEach((btn) => {
      btn.addEventListener('click', () => updateCartItemQty(btn.getAttribute('data-qty-minus'), -1));
    });
    cartList.querySelectorAll('[data-qty-plus]').forEach((btn) => {
      btn.addEventListener('click', () => updateCartItemQty(btn.getAttribute('data-qty-plus'), 1));
    });
    cartList.querySelectorAll('[data-remove-item]').forEach((btn) => {
      btn.addEventListener('click', () => removeCartItem(btn.getAttribute('data-remove-item')));
    });
  }

  function openCartDrawer() {
    const dialog = document.getElementById('cartDialog');
    if (!dialog) return;
    renderCartUI();
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }

  function closeCartDrawer() {
    const dialog = document.getElementById('cartDialog');
    if (!dialog) return;
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
  }

  function initCartDrawer() {
    const openBtn = document.getElementById('cartOpenBtn');
    const dialog = document.getElementById('cartDialog');
    const copyBtn = document.getElementById('copyOrderSummaryBtn');
    const clearBtn = document.getElementById('clearCartBtn');
    const feedbackEl = document.getElementById('cartActionFeedback');

    renderCartUI();

    if (openBtn) {
      openBtn.addEventListener('click', openCartDrawer);
    }

    document.querySelectorAll('[data-close-cart]').forEach((btn) => {
      btn.addEventListener('click', closeCartDrawer);
    });

    if (dialog) {
      dialog.addEventListener('click', (e) => {
        if (e.target === dialog) closeCartDrawer();
      });

      // Si el usuario pulsa "Personalizar una taza" dentro del carrito vacío, cerramos el carrito primero
      dialog.querySelectorAll('[data-open-customizer]').forEach((btn) => {
        btn.addEventListener('click', () => {
          closeCartDrawer();
        });
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        clearCart();
        showToast('Carrito vaciado.');
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const subtotal = state.cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
        const lines = [
          'RESUMEN DE SOLICITUD — STAMPADITO (PROTOTIPO DEMO)',
          '--------------------------------------------------',
          ...state.cart.map((item, index) => {
            const c = item.customization || {};
            return `${index + 1}. ${item.name} (x${item.quantity}) - ${item.variantLabel} | Texto: "${c.name || ''}" ${
              c.phrase ? `| Frase: "${c.phrase}"` : ''
            } ${c.uploadedImageName ? `| Archivo: ${c.uploadedImageName}` : ''} | Subtotal: ${formatCurrency(
              item.unitPrice * item.quantity
            )}`;
          }),
          '--------------------------------------------------',
          `Total estimado (demo): ${formatCurrency(subtotal)}`,
          'Nota: Solicitud generada desde el prototipo StampaDito (pendiente de pasarela de pago y envío).'
        ];

        const summaryText = lines.join('\n');
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(summaryText).then(() => {
            if (feedbackEl) {
              feedbackEl.textContent =
                'Resumen copiado al portapapeles. Listo para compartir cuando se active el canal de pedidos.';
              feedbackEl.hidden = false;
            }
          });
        } else if (feedbackEl) {
          feedbackEl.textContent = 'Resumen preparado en el carrito local.';
          feedbackEl.hidden = false;
        }
      });
    }
  }

  // =========================================================================
  // 7. Animaciones de aparición en Scroll (IntersectionObserver) y Hero sutil
  // =========================================================================
  function initScrollAndHeroMotion() {
    if (prefersReducedMotion.matches) return;

    const revealElements = document.querySelectorAll('.reveal-item, .product-card');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              obs.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '0px 0px -8% 0px',
          threshold: 0.1
        }
      );

      revealElements.forEach((el, idx) => {
        const rect = el.getBoundingClientRect();
        // Dejar inmediatamente visibles los elementos en el primer pantallazo
        if (rect.top < window.innerHeight * 0.92) {
          el.classList.add('is-visible');
        } else {
          el.classList.add('will-animate');
          const staggerMs = (idx % 4) * 65;
          el.style.setProperty('--stagger-delay', `${staggerMs}ms`);
          observer.observe(el);
        }
      });
    }

    // Movimiento de profundidad muy leve en el Hero solo en escritorio con puntero fino
    const heroStage = document.getElementById('heroStage');
    const parallaxLayers = document.querySelectorAll('[data-parallax-depth]');
    if (heroStage && parallaxLayers.length > 0 && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      let rafId = null;
      heroStage.addEventListener('mousemove', (e) => {
        if (prefersReducedMotion.matches) return;
        const rect = heroStage.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          parallaxLayers.forEach((layer) => {
            const depth = parseFloat(layer.getAttribute('data-parallax-depth')) || 0.02;
            const moveX = (relX * 180 * depth).toFixed(2);
            const moveY = (relY * 180 * depth).toFixed(2);
            layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
          });
        });
      });

      heroStage.addEventListener('mouseleave', () => {
        parallaxLayers.forEach((layer) => {
          layer.style.transform = 'translate3d(0, 0, 0)';
        });
      });
    }
  }

  // =========================================================================
  // Inicialización general
  // =========================================================================
  function boot() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    initPromoBar();
    initMobileMenu();
    initCatalogInteractions();
    initCustomizerModal();
    initDetailModal();
    initCartDrawer();
    initScrollAndHeroMotion();

    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(() => {});
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
