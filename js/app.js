/**
 * StampaDito — Lógica de interacción del sitio (js/app.js)
 * ---------------------------------------------------------
 */

(function () {
  'use strict';

  const DATA = window.STAMPADITO_DATA;
  if (!DATA) return;

  const STORAGE_KEY = 'stampadito_cart_v2';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Estado de la aplicación
  const state = {
    activeFilter: 'all',
    selectedVariantsByCard: {},
    customizer: {
      productId: DATA.products[0].id,
      colorId: DATA.cupColors[0].id,
      copies: 1,
      uploadedImageDataUrl: null,
      uploadedImageName: '',
      notes: ''
    },
    detailProduct: null,
    cart: loadCartFromStorage()
  };

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

  function getColorById(colorId) {
    return DATA.cupColors.find((c) => c.id === colorId) || DATA.cupColors[0];
  }

  function computeUnitPrice(product) {
    return product ? product.price : 150;
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
    }, 3600);
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Generador de URL de WhatsApp con mensaje estructurado
  function buildWhatsAppQuoteUrl(items, totalEstimated) {
    const phone = DATA.meta.whatsappPhone || '5215500000000';
    let text = `¡Hola StampaDito! 👋 Quisiera solicitar la cotización para mi pedido de tazas personalizadas:\n\n`;

    items.forEach((item, idx) => {
      text += `☕ *Item ${idx + 1}:* ${item.productName}\n`;
      text += `   • Cantidad: *${item.quantity} ${item.quantity === 1 ? 'taza' : 'tazas'}*\n`;
      if (item.colorLabel) {
        text += `   • Color interior y asa: *${item.colorLabel}*\n`;
      }
      if (item.customization && item.customization.uploadedImageName) {
        text += `   • Imagen adjunta: *${item.customization.uploadedImageName}* (te la comparto por aquí)\n`;
      }
      if (item.customization && item.customization.notes) {
        text += `   • Idea / Notas: "${item.customization.notes}"\n`;
      }
      text += `   • Subtotal estimado: ${formatCurrency(item.unitPrice * item.quantity)}\n\n`;
    });

    text += `💰 *Total estimado de tazas:* ${formatCurrency(totalEstimated)} MXN\n`;
    text += `📍 *Envío:* Por favor indíquenme el costo de envío a mi código postal o ciudad.\n\n`;
    text += `¡Quedo atento(a) para enviarles la imagen y confirmar mi pedido!`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }

  // =========================================================================
  // 1. Cintilla promocional
  // =========================================================================
  function initPromoBar() {
    const promoBar = document.querySelector('.promo-bar');
    const toggleBtn = document.getElementById('promoToggleBtn');
    const toggleIcon = document.getElementById('promoToggleIcon');
    const toggleText = document.getElementById('promoToggleText');
    const primaryGroup = document.getElementById('promoPrimaryGroup');
    const cloneGroup = document.getElementById('promoCloneGroup');

    if (!promoBar || !toggleBtn) return;

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

  // =========================================================================
  // 2. Menú Móvil
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
  // 3. Catálogo e Interacciones
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

    document.querySelectorAll('[data-filter-collection]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const colId = link.getAttribute('data-filter-collection');
        if (colId) {
          e.preventDefault();
          applyCollectionFilter(colId, true);
        }
      });
    });
  }

  // =========================================================================
  // 4. Modal Personalizador Interactivo (Ajustado a requerimientos)
  // =========================================================================
  function initCustomizerModal() {
    const dialog = document.getElementById('customizerDialog');
    const form = document.getElementById('customizerForm');
    const productSelect = document.getElementById('customProductSelect');
    const variantsContainer = document.getElementById('customizerVariantsContainer');
    const variantHelp = document.getElementById('customVariantHelp');
    const copiesInput = document.getElementById('customCopiesInput');
    const imageInput = document.getElementById('customImageInput');
    const imageStatus = document.getElementById('customImageStatus');
    const clearImageBtn = document.getElementById('clearCustomImageBtn');
    const notesInput = document.getElementById('customNotesInput');
    const priceDisplay = document.getElementById('customizerPriceDisplay');
    const submitBtn = document.getElementById('customizerSubmitBtn');
    const directWhatsAppBtn = document.getElementById('customizerDirectWhatsAppBtn');

    // Elementos de vista previa
    const stage = document.getElementById('customizerStage');
    const previewModelName = document.getElementById('customizerPreviewModelName');
    const baseImage = document.getElementById('customizerBaseImage');

    if (!dialog || !form || !productSelect) return;

    // Poblar selector de tipos de taza
    productSelect.innerHTML = DATA.products
      .map((p) => `<option value="${escapeHtml(p.id)}">${escapeHtml(p.name)} — $${p.price} MXN</option>`)
      .join('');

    function renderColorPills() {
      const product = getProductById(state.customizer.productId);
      const isBicolor = product.isColorCustomizable;

      variantsContainer.innerHTML = '';

      if (!isBicolor) {
        if (variantHelp) {
          variantHelp.textContent = 'Este modelo es 100% blanco por dentro y por fuera. Opción de color bloqueada.';
          variantHelp.style.color = '#B25E00';
        }
      } else {
        if (variantHelp) {
          variantHelp.textContent = 'Selecciona el color para el fondo interior y el asa (10 colores disponibles):';
          variantHelp.style.color = '';
        }
      }

      DATA.cupColors.forEach((c) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isActive = isBicolor ? c.id === state.customizer.colorId : c.id === 'blanco';
        btn.className = `variant-pill${isActive ? ' is-active' : ''}${!isBicolor ? ' is-disabled' : ''}`;
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', String(isActive));
        if (!isBicolor) {
          btn.setAttribute('aria-disabled', 'true');
          btn.tabIndex = -1;
        }

        btn.innerHTML = `<span class="variant-pill__dot" style="background-color: ${c.colorHex}"></span><span>${escapeHtml(
          c.label
        )}</span>`;

        if (isBicolor) {
          btn.addEventListener('click', () => {
            state.customizer.colorId = c.id;
            renderColorPills();
            updateCustomizerPreview();
          });
        }

        variantsContainer.appendChild(btn);
      });
    }

    function updateCustomizerPreview() {
      const product = getProductById(state.customizer.productId);
      const color = getColorById(state.customizer.colorId);
      const isBicolor = product.isColorCustomizable;
      const copies = Math.max(1, parseInt(copiesInput.value, 10) || 1);
      const unitPrice = computeUnitPrice(product);
      const subtotal = unitPrice * copies;

      if (previewModelName) {
        previewModelName.textContent = isBicolor ? `${product.name} (${color.label})` : product.name;
      }

      // Actualizar imagen y fondo con contraste suave adaptativo
      if (baseImage) {
        if (!isBicolor) {
          baseImage.src = product.image;
          baseImage.alt = product.imageAlt;
          if (stage) stage.style.backgroundColor = '#F5F4EE';
        } else {
          baseImage.src = color.image;
          baseImage.alt = `Taza bicolor con asa e interior color ${color.label}`;
          if (stage) stage.style.backgroundColor = color.bgStage;
        }
      }

      if (priceDisplay) {
        priceDisplay.textContent = `${formatCurrency(subtotal)} (${copies} ${copies === 1 ? 'taza' : 'tazas'})`;
      }
    }

    function openCustomizer(productId) {
      const targetId = productId && DATA.products.some((p) => p.id === productId) ? productId : DATA.products[0].id;
      state.customizer.productId = targetId;
      productSelect.value = targetId;

      const product = getProductById(targetId);
      state.customizer.colorId = product.isColorCustomizable ? (state.customizer.colorId || 'rosa') : 'blanco';

      renderColorPills();
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
      if (!product.isColorCustomizable) {
        state.customizer.colorId = 'blanco';
      } else if (state.customizer.colorId === 'blanco') {
        state.customizer.colorId = 'rosa';
      }
      renderColorPills();
      updateCustomizerPreview();
    });

    copiesInput.addEventListener('input', updateCustomizerPreview);
    copiesInput.addEventListener('change', () => {
      if (parseInt(copiesInput.value, 10) < 1 || isNaN(parseInt(copiesInput.value, 10))) {
        copiesInput.value = 1;
      }
      updateCustomizerPreview();
    });

    // Carga de archivo de imagen
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
        if (imageStatus) imageStatus.textContent = `Archivo adjunto: ${file.name}`;
        if (clearImageBtn) clearImageBtn.hidden = false;
        showToast(`Imagen «${file.name}» cargada para enviar en tu cotización.`);
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
      });
    }

    function buildCurrentCustomItem() {
      const product = getProductById(state.customizer.productId);
      const isBicolor = product.isColorCustomizable;
      const color = isBicolor ? getColorById(state.customizer.colorId) : null;
      const copies = Math.max(1, parseInt(copiesInput.value, 10) || 1);
      const unitPrice = computeUnitPrice(product);
      const notes = (notesInput.value || '').trim();

      return {
        productId: product.id,
        productName: product.name,
        image: isBicolor && color ? color.image : product.image,
        colorId: isBicolor && color ? color.id : 'blanco',
        colorLabel: isBicolor && color ? color.label : 'Blanca completa',
        unitPrice,
        quantity: copies,
        customization: {
          uploadedImageName: state.customizer.uploadedImageName || null,
          notes: notes || null
        }
      };
    }

    // Botón A: Añadir al carrito
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const item = buildCurrentCustomItem();
      addItemToCart(item);
      closeCustomizer();
      openCartDrawer();
      showToast(`¡Agregado al carrito! (${item.quantity} ${item.quantity === 1 ? 'taza' : 'tazas'}).`);
    });

    // Botón B: Preordenar / Enviar directamente por WhatsApp
    if (directWhatsAppBtn) {
      directWhatsAppBtn.addEventListener('click', () => {
        const item = buildCurrentCustomItem();
        const total = item.unitPrice * item.quantity;
        const waUrl = buildWhatsAppQuoteUrl([item], total);
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        showToast('Abriendo WhatsApp con tu cotización...');
      });
    }

    // Disparadores globales
    document.querySelectorAll('[data-open-customizer]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openCustomizer(state.customizer.productId);
      });
    });

    document.querySelectorAll('[data-customize-product]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const prodId = btn.getAttribute('data-customize-product');
        openCustomizer(prodId);
      });
    });

    document.querySelectorAll('[data-close-customizer]').forEach((btn) => {
      btn.addEventListener('click', closeCustomizer);
    });

    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) closeCustomizer();
    });

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
    const customizeBtn = document.getElementById('detailCustomizeBtn');
    const quickAddBtn = document.getElementById('detailQuickAddBtn');

    if (!dialog) return;

    function openDetail(productId) {
      const product = getProductById(productId);
      state.detailProduct = product;

      if (colTag) colTag.textContent = product.collectionLabel;
      if (titleEl) titleEl.textContent = product.name;
      if (imgEl) {
        imgEl.src = product.image;
        imgEl.alt = product.imageAlt;
      }
      if (priceEl) priceEl.textContent = `${formatCurrency(product.price)} + envío`;
      if (descEl) descEl.textContent = product.fullDescription;

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
        addItemToCart({
          productId: product.id,
          productName: product.name,
          image: product.image,
          colorId: product.isColorCustomizable ? 'rosa' : 'blanco',
          colorLabel: product.isColorCustomizable ? 'Rosa Pastel (base)' : 'Blanca completa',
          unitPrice: product.price,
          quantity: 1,
          customization: {
            uploadedImageName: null,
            notes: 'Versión base'
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
  // 6. Carrito Local y Cotización por WhatsApp
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
      c: newItem.colorId,
      img: newItem.customization ? newItem.customization.uploadedImageName : null,
      n: newItem.customization ? newItem.customization.notes : null
    });

    const existing = state.cart.find((item) => item.signature === signature);
    if (existing) {
      existing.quantity += newItem.quantity;
    } else {
      state.cart.push({
        id: 'item_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
        signature,
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
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.productName)}" width="72" height="72" class="cart-item__thumb">
          <div>
            <h3 class="cart-item__title">${escapeHtml(item.productName)}</h3>
            <div class="cart-item__meta">
              <span><strong>Acabado/Color:</strong> ${escapeHtml(item.colorLabel || 'Blanco')}</span>
              ${c.uploadedImageName ? `<span><strong>Archivo:</strong> ${escapeHtml(c.uploadedImageName)}</span>` : ''}
              ${c.notes ? `<span><strong>Notas:</strong> ${escapeHtml(c.notes)}</span>` : ''}
              <span><strong>Precio unitario:</strong> ${formatCurrency(item.unitPrice)}</span>
              <span><strong>Subtotal:</strong> ${formatCurrency(item.unitPrice * item.quantity)}</span>
            </div>
            <div class="cart-item__controls">
              <div class="qty-control" role="group" aria-label="Cantidad">
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
    const sendWhatsAppBtn = document.getElementById('sendWhatsAppCartBtn');
    const addAnotherOrderBtn = document.getElementById('addAnotherOrderBtn');
    const clearBtn = document.getElementById('clearCartBtn');

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

      dialog.querySelectorAll('[data-open-customizer]').forEach((btn) => {
        btn.addEventListener('click', () => {
          closeCartDrawer();
        });
      });
    }

    if (addAnotherOrderBtn) {
      addAnotherOrderBtn.addEventListener('click', () => {
        closeCartDrawer();
        if (typeof window.__openStampaCustomizer === 'function') {
          window.__openStampaCustomizer();
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        clearCart();
        showToast('Carrito vaciado.');
      });
    }

    if (sendWhatsAppBtn) {
      sendWhatsAppBtn.addEventListener('click', () => {
        if (state.cart.length === 0) {
          showToast('Tu carrito está vacío.');
          return;
        }
        const subtotal = state.cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
        const waUrl = buildWhatsAppQuoteUrl(state.cart, subtotal);
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        showToast('Abriendo WhatsApp con tu pedido...');
      });
    }
  }

  // =========================================================================
  // 7. Animaciones de scroll y Hero
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

    // Desactivar ServiceWorker en localhost durante desarrollo para que los cambios se vean al instante sin caché
    if ('serviceWorker' in navigator) {
      if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const reg of registrations) {
            reg.unregister();
          }
        });
      } else if (location.protocol === 'https:') {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('./sw.js').catch(() => {});
        });
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
