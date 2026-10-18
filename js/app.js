/**
 * StampaDito — Lógica de interacción del sitio
 * --------------------------------------------
 */

(function () {
  'use strict';

  const DATA = window.STAMPADITO_DATA;
  if (!DATA) return;

  const STORAGE_KEY = 'stampadito_cart_v3';
  const PAGE_SIZE = 6;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const baseModels = DATA.baseModels || DATA.products || [];
  const catalogDesigns = DATA.catalogDesigns || [];
  const cupColors = DATA.cupColors || [];

  // Estado de la aplicación
  const state = {
    activeFilter: 'all',
    currentPage: 1,
    customizer: {
      baseModelId: baseModels[0] ? baseModels[0].id : 'taza-blanca-clasica',
      colorId: 'blanco',
      originDesignId: null,
      copies: 1,
      uploadedImageName: '',
      notes: ''
    },
    detail: {
      designId: null,
      colorId: null,
      quantity: 1
    },
    cart: loadCartFromStorage()
  };

  // =========================================================================
  // Utilidades
  // =========================================================================
  function formatCurrency(amount) {
    const { symbol, suffix } = DATA.meta.currency;
    return `${symbol}${Number(amount).toFixed(0)} ${suffix}`;
  }

  function getBaseModelById(modelId) {
    return baseModels.find((m) => m.id === modelId) || baseModels[0];
  }

  function getDesignById(designId) {
    if (!designId) return null;
    return catalogDesigns.find((d) => d.id === designId) || null;
  }

  function getColorById(colorId) {
    return cupColors.find((c) => c.id === colorId) || cupColors[0];
  }

  function getBicolorOptions() {
    return cupColors.filter((c) => c.id !== 'blanco');
  }

  function computeUnitPrice(baseModel) {
    return baseModel ? baseModel.price : 150;
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
    const phone = DATA.meta.whatsappPhone || '528132765166';
    const hasUploadedFiles = items.some((i) => i.customization && i.customization.uploadedImageName);

    let text = `¡Hola StampaDito! 👋 Quiero cotizar el siguiente pedido de tazas:\n\n`;

    items.forEach((item, idx) => {
      text += `☕ *${idx + 1}. ${item.designName || item.productName}*\n`;
      if (item.orderAs) {
        text += `   • Pídela como: «${item.orderAs}» (ID: ${item.designId})\n`;
      } else {
        text += `   • Modalidad: Personalización con mi idea\n`;
      }
      text += `   • Modelo físico: ${item.modelName || item.productName}\n`;
      if (item.colorLabel) {
        text += `   • Color de interior y asa: ${item.colorLabel}\n`;
      }
      if (item.presentation) {
        text += `   • Presentación: ${item.presentation}\n`;
      }
      text += `   • Cantidad: ${item.quantity} ${item.quantity === 1 ? 'taza' : 'tazas'}\n`;
      if (item.customization && item.customization.uploadedImageName) {
        text += `   • Archivo seleccionado: ${item.customization.uploadedImageName} (lo adjunto en este chat)\n`;
      }
      if (item.customization && item.customization.notes) {
        text += `   • Detalles / Idea: "${item.customization.notes}"\n`;
      }
      text += `   • Subtotal estimado: ${formatCurrency(item.unitPrice * item.quantity)}\n\n`;
    });

    text += `💰 *Subtotal estimado de tazas:* ${formatCurrency(totalEstimated)}\n`;
    text += `📍 *Envío:* Les comparto mi código postal para cotizar el envío y confirmar disponibilidad y total.\n`;
    if (hasUploadedFiles) {
      text += `📎 *Nota:* Enseguida adjunto mi imagen en este chat para que puedan revisarla.`;
    }

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
  // 3. Catálogo Unificado, Filtros, Contadores y Paginación
  // =========================================================================
  function getFilteredDesigns(filterId) {
    if (!filterId || filterId === 'all') {
      return catalogDesigns;
    }
    return catalogDesigns.filter((d) => Array.isArray(d.categories) && d.categories.includes(filterId));
  }

  function updateCategoryCounts() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach((btn) => {
      const filterId = btn.getAttribute('data-filter') || 'all';
      const count = getFilteredDesigns(filterId).length;
      const badge = btn.querySelector('.filter-chip__count');
      if (badge) {
        badge.textContent = String(count);
      }
    });
  }

  function renderCatalogGrid() {
    const grid = document.getElementById('productGrid');
    const emptyState = document.getElementById('catalogEmptyState');
    const pagination = document.getElementById('catalogPagination');
    if (!grid) return;

    const filtered = getFilteredDesigns(state.activeFilter);
    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

    if (state.currentPage > totalPages) {
      state.currentPage = totalPages;
    }
    if (state.currentPage < 1) {
      state.currentPage = 1;
    }

    if (totalItems === 0) {
      grid.innerHTML = '';
      grid.hidden = true;
      if (emptyState) emptyState.hidden = false;
      if (pagination) {
        pagination.innerHTML = '';
        pagination.hidden = true;
      }
      return;
    }

    if (emptyState) emptyState.hidden = true;
    grid.hidden = false;

    const startIdx = (state.currentPage - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(startIdx, startIdx + PAGE_SIZE);

    grid.innerHTML = pageItems
      .map((design) => {
        const baseModel = getBaseModelById(design.baseModelId);
        const defaultColor = getColorById(design.defaultColorId);
        const modelInfoText = baseModel.isColorCustomizable
          ? `${baseModel.shortLabel} · Interior ${defaultColor.label}`
          : baseModel.shortLabel;

        return `
        <article class="product-card product-card--${escapeHtml(design.accentTheme || 'sky')}" data-design-id="${escapeHtml(design.id)}">
          <div class="product-card__stage${design.isPhotoCrop ? ' product-card__stage--photo' : ''}">
            <div class="product-card__bg" aria-hidden="true"></div>
            <span class="product-card__category">${escapeHtml(design.categoryLabel)}</span>
            <div class="product-card__img-wrap">
              <img src="${escapeHtml(design.image)}"
                alt="${escapeHtml(design.imageAlt)}" width="720" height="720" loading="lazy"
                decoding="async" class="product-card__img${design.isPhotoCrop ? ' product-card__img--photo' : ''}">
            </div>
          </div>
          <div class="product-card__body">
            <div class="product-card__header">
              <h3 class="product-card__title">
                <button type="button" class="product-card__title-btn" data-view-design="${escapeHtml(design.id)}">
                  ${escapeHtml(design.name)}
                </button>
              </h3>
              <p class="product-card__price">
                $${design.price} <span class="product-card__currency">MXN</span>
                <small class="product-card__price-note">+ envío</small>
              </p>
            </div>
            <p class="product-card__order-as">Pídela como «<strong>${escapeHtml(design.orderAs)}</strong>»</p>
            <p class="product-card__desc">${escapeHtml(design.shortDescription)}</p>
            <div class="product-card__variants">
              <span class="product-card__variant-label">Modelo base: <strong>${escapeHtml(modelInfoText)}</strong></span>
            </div>
            <div class="product-card__actions">
              <button type="button" class="btn btn--primary btn--sm" data-customize-design="${escapeHtml(design.id)}">
                Personalizar y cotizar
              </button>
              <button type="button" class="btn btn--outline btn--sm" data-view-design="${escapeHtml(design.id)}">
                Ver detalles
              </button>
            </div>
          </div>
        </article>
      `;
      })
      .join('');

    // Enlazar eventos de las tarjetas recién creadas
    grid.querySelectorAll('[data-customize-design]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const designId = btn.getAttribute('data-customize-design');
        if (typeof window.__openStampaCustomizerWithDesign === 'function') {
          window.__openStampaCustomizerWithDesign(designId);
        }
      });
    });

    grid.querySelectorAll('[data-view-design]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const designId = btn.getAttribute('data-view-design');
        if (typeof window.__openStampaDetail === 'function') {
          window.__openStampaDetail(designId);
        }
      });
    });

    renderPaginationControls(totalItems, totalPages);
  }

  function renderPaginationControls(totalItems, totalPages) {
    const pagination = document.getElementById('catalogPagination');
    if (!pagination) return;

    if (totalPages <= 1) {
      pagination.innerHTML = '';
      pagination.hidden = true;
      return;
    }

    pagination.hidden = false;
    const startItem = (state.currentPage - 1) * PAGE_SIZE + 1;
    const endItem = Math.min(totalItems, state.currentPage * PAGE_SIZE);

    let pagesHtml = '';
    for (let p = 1; p <= totalPages; p++) {
      const isCurrent = p === state.currentPage;
      pagesHtml += `
        <button type="button" class="pagination-btn${isCurrent ? ' is-active' : ''}" data-page="${p}" ${
          isCurrent ? 'aria-current="page"' : ''
        } aria-label="Ir a la página ${p}">
          ${p}
        </button>
      `;
    }

    pagination.innerHTML = `
      <div class="catalog-pagination__status" aria-live="polite">
        Mostrando <strong>${startItem}–${endItem}</strong> de <strong>${totalItems}</strong> diseños
      </div>
      <div class="catalog-pagination__controls">
        <button type="button" class="pagination-btn pagination-btn--nav" data-page-prev ${
          state.currentPage <= 1 ? 'disabled' : ''
        } aria-label="Página anterior">
          ← Anterior
        </button>
        <div class="catalog-pagination__pages">
          ${pagesHtml}
        </div>
        <button type="button" class="pagination-btn pagination-btn--nav" data-page-next ${
          state.currentPage >= totalPages ? 'disabled' : ''
        } aria-label="Página siguiente">
          Siguiente →
        </button>
      </div>
    `;

    const scrollCatalogIntoView = () => {
      const catalogSection = document.getElementById('catalogo');
      if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
      }
    };

    const prevBtn = pagination.querySelector('[data-page-prev]');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (state.currentPage > 1) {
          state.currentPage -= 1;
          renderCatalogGrid();
          scrollCatalogIntoView();
        }
      });
    }

    const nextBtn = pagination.querySelector('[data-page-next]');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (state.currentPage < totalPages) {
          state.currentPage += 1;
          renderCatalogGrid();
          scrollCatalogIntoView();
        }
      });
    }

    pagination.querySelectorAll('[data-page]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetPage = parseInt(btn.getAttribute('data-page'), 10);
        if (targetPage && targetPage !== state.currentPage) {
          state.currentPage = targetPage;
          renderCatalogGrid();
          scrollCatalogIntoView();
        }
      });
    });
  }

  function initCatalogInteractions() {
    const filterButtons = document.querySelectorAll('[data-filter]');

    updateCategoryCounts();

    function applyCollectionFilter(collectionId, shouldScroll = false) {
      state.activeFilter = collectionId || 'all';
      state.currentPage = 1; // Al cambiar de categoría, vuelve a la primera página

      filterButtons.forEach((btn) => {
        const isMatch = btn.getAttribute('data-filter') === state.activeFilter;
        btn.classList.toggle('is-active', isMatch);
        btn.setAttribute('aria-pressed', String(isMatch));
      });

      renderCatalogGrid();

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

    renderCatalogGrid();
  }

  // =========================================================================
  // 4. Modal Personalizador y Solicitud de Cotización
  // =========================================================================
  function initCustomizerModal() {
    const dialog = document.getElementById('customizerDialog');
    const form = document.getElementById('customizerForm');
    const productSelect = document.getElementById('customProductSelect');
    const colorGroup = document.getElementById('customColorGroup');
    const variantsContainer = document.getElementById('customizerVariantsContainer');
    const variantHelp = document.getElementById('customVariantHelp');
    const copiesInput = document.getElementById('customCopiesInput');
    const imageInput = document.getElementById('customImageInput');
    const imageStatus = document.getElementById('customImageStatus');
    const clearImageBtn = document.getElementById('clearCustomImageBtn');
    const notesInput = document.getElementById('customNotesInput');
    const priceDisplay = document.getElementById('customizerPriceDisplay');
    const directWhatsAppBtn = document.getElementById('customizerDirectWhatsAppBtn');

    // Elementos de referencia física y diseño de origen
    const stage = document.getElementById('customizerStage');
    const previewModelName = document.getElementById('customizerPreviewModelName');
    const baseImage = document.getElementById('customizerBaseImage');
    const originBox = document.getElementById('customizerOriginBox');
    const originThumb = document.getElementById('customizerOriginThumb');
    const originTitle = document.getElementById('customizerOriginTitle');
    const originOrderAs = document.getElementById('customizerOriginOrderAs');
    const clearOriginBtn = document.getElementById('clearOriginDesignBtn');

    if (!dialog || !form || !productSelect) return;

    // Poblar selector de tipos de taza
    productSelect.innerHTML = baseModels
      .map((m) => `<option value="${escapeHtml(m.id)}">${escapeHtml(m.name)} — $${m.price} MXN</option>`)
      .join('');

    function renderOriginBanner() {
      const originDesign = getDesignById(state.customizer.originDesignId);
      if (!originBox) return;

      if (!originDesign) {
        originBox.hidden = true;
        return;
      }

      originBox.hidden = false;
      if (originThumb) {
        originThumb.src = originDesign.image;
        originThumb.alt = originDesign.name;
      }
      if (originTitle) {
        originTitle.textContent = originDesign.name;
      }
      if (originOrderAs) {
        originOrderAs.textContent = `Pídela como «${originDesign.orderAs}»`;
      }
    }

    function renderColorPills() {
      const baseModel = getBaseModelById(state.customizer.baseModelId);
      const isBicolor = baseModel.isColorCustomizable;

      variantsContainer.innerHTML = '';

      if (!isBicolor) {
        if (colorGroup) colorGroup.hidden = true;
        return;
      }

      if (colorGroup) colorGroup.hidden = false;
      if (variantHelp) {
        variantHelp.textContent = 'Elige el color para el interior y el asa de tu taza bicolor:';
      }

      cupColors.forEach((c) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isActive = c.id === state.customizer.colorId;
        btn.className = `variant-pill${isActive ? ' is-active' : ''}`;
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', String(isActive));

        btn.innerHTML = `<span class="variant-pill__dot" style="background-color: ${c.colorHex}"></span><span>${escapeHtml(
          c.label
        )}</span>`;

        btn.addEventListener('click', () => {
          state.customizer.colorId = c.id;
          renderColorPills();
          updateCustomizerReference();
        });

        variantsContainer.appendChild(btn);
      });
    }

    function updateCustomizerReference() {
      const baseModel = getBaseModelById(state.customizer.baseModelId);
      const color = getColorById(state.customizer.colorId);
      const isBicolor = baseModel.isColorCustomizable;
      const copies = Math.max(1, parseInt(copiesInput.value, 10) || 1);
      const unitPrice = computeUnitPrice(baseModel);
      const subtotal = unitPrice * copies;

      if (previewModelName) {
        previewModelName.textContent = isBicolor ? `${baseModel.shortLabel} · ${color.label}` : baseModel.name;
      }

      if (baseImage) {
        if (!isBicolor) {
          baseImage.src = baseModel.image;
          baseImage.alt = baseModel.imageAlt;
          if (stage) stage.style.backgroundColor = '#F5F4EE';
        } else {
          baseImage.src = color.image;
          baseImage.alt = `Referencia de taza bicolor con interior y asa color ${color.label}`;
          if (stage) stage.style.backgroundColor = color.bgStage;
        }
      }

      if (priceDisplay) {
        priceDisplay.textContent = `${formatCurrency(subtotal)} (${copies} ${copies === 1 ? 'taza' : 'tazas'})`;
      }
    }

    function openCustomizer({ designId = null, baseModelId = null, colorId = null } = {}) {
      const design = getDesignById(designId);

      if (design) {
        state.customizer.originDesignId = design.id;
        state.customizer.baseModelId = baseModelId || design.baseModelId;
        const model = getBaseModelById(state.customizer.baseModelId);
        state.customizer.colorId = model.isColorCustomizable
          ? colorId || design.defaultColorId || 'rosa'
          : 'blanco';
      } else {
        state.customizer.originDesignId = null;
        if (baseModelId && baseModels.some((m) => m.id === baseModelId)) {
          state.customizer.baseModelId = baseModelId;
        }
        const model = getBaseModelById(state.customizer.baseModelId);
        if (!model.isColorCustomizable) {
          state.customizer.colorId = 'blanco';
        } else if (!state.customizer.colorId || state.customizer.colorId === 'blanco') {
          state.customizer.colorId = 'rosa';
        }
      }

      productSelect.value = state.customizer.baseModelId;
      renderOriginBanner();
      renderColorPills();
      updateCustomizerReference();

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

    if (clearOriginBtn) {
      clearOriginBtn.addEventListener('click', () => {
        state.customizer.originDesignId = null;
        renderOriginBanner();
      });
    }

    productSelect.addEventListener('change', () => {
      const model = getBaseModelById(productSelect.value);
      state.customizer.baseModelId = model.id;
      if (!model.isColorCustomizable) {
        state.customizer.colorId = 'blanco';
      } else if (state.customizer.colorId === 'blanco') {
        const originDesign = getDesignById(state.customizer.originDesignId);
        state.customizer.colorId =
          originDesign && originDesign.defaultColorId !== 'blanco' ? originDesign.defaultColorId : 'rosa';
      }
      renderColorPills();
      updateCustomizerReference();
    });

    copiesInput.addEventListener('input', updateCustomizerReference);
    copiesInput.addEventListener('change', () => {
      if (parseInt(copiesInput.value, 10) < 1 || isNaN(parseInt(copiesInput.value, 10))) {
        copiesInput.value = 1;
      }
      updateCustomizerReference();
    });

    // Selección de archivo local
    imageInput.addEventListener('change', () => {
      const file = imageInput.files && imageInput.files[0];
      if (!file) return;

      const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        showToast('Selecciona una imagen en formato JPG, PNG o WebP.');
        imageInput.value = '';
        return;
      }

      state.customizer.uploadedImageName = file.name;
      if (imageStatus) imageStatus.textContent = `Archivo seleccionado: ${file.name}`;
      if (clearImageBtn) clearImageBtn.hidden = false;
      showToast(`Archivo «${file.name}» registrado. Recuerda adjuntarlo al abrir WhatsApp.`);
    });

    if (clearImageBtn) {
      clearImageBtn.addEventListener('click', () => {
        imageInput.value = '';
        state.customizer.uploadedImageName = '';
        if (imageStatus) imageStatus.textContent = 'Ningún archivo seleccionado';
        clearImageBtn.hidden = true;
      });
    }

    function buildCurrentCustomItem() {
      const baseModel = getBaseModelById(state.customizer.baseModelId);
      const isBicolor = baseModel.isColorCustomizable;
      const color = isBicolor ? getColorById(state.customizer.colorId) : getColorById('blanco');
      const originDesign = getDesignById(state.customizer.originDesignId);
      const copies = Math.max(1, parseInt(copiesInput.value, 10) || 1);
      const unitPrice = computeUnitPrice(baseModel);
      const notes = (notesInput.value || '').trim();

      return {
        designId: originDesign ? originDesign.id : 'personalizada',
        designName: originDesign ? originDesign.name : 'Taza personalizada con tu idea',
        orderAs: originDesign ? originDesign.orderAs : null,
        productId: baseModel.id,
        productName: originDesign ? `${originDesign.name} (${baseModel.shortLabel})` : baseModel.name,
        modelName: baseModel.name,
        presentation: originDesign ? originDesign.presentation : 'Taza individual (11 oz)',
        image: originDesign ? originDesign.image : isBicolor ? color.image : baseModel.image,
        colorId: isBicolor ? color.id : 'blanco',
        colorLabel: isBicolor ? color.label : 'Blanca completa',
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
      showToast(`Agregado al carrito: ${item.designName} (${item.quantity} ${item.quantity === 1 ? 'taza' : 'tazas'}).`);
    });

    // Botón B: Cotizar directamente por WhatsApp
    if (directWhatsAppBtn) {
      directWhatsAppBtn.addEventListener('click', () => {
        const item = buildCurrentCustomItem();
        const total = item.unitPrice * item.quantity;
        const waUrl = buildWhatsAppQuoteUrl([item], total);
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        showToast('Abriendo WhatsApp con los datos de tu solicitud...');
      });
    }

    // Disparadores globales para abrir personalizador sin diseño específico
    document.querySelectorAll('[data-open-customizer]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openCustomizer({ designId: null });
      });
    });

    // Disparadores desde el Hero u otras secciones con diseño específico
    document.querySelectorAll('[data-customize-design]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const designId = btn.getAttribute('data-customize-design');
        openCustomizer({ designId });
      });
    });

    document.querySelectorAll('[data-close-customizer]').forEach((btn) => {
      btn.addEventListener('click', closeCustomizer);
    });

    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) closeCustomizer();
    });

    window.__openStampaCustomizer = () => openCustomizer({ designId: null });
    window.__openStampaCustomizerWithDesign = (designId, opts = {}) =>
      openCustomizer({ designId, ...opts });
  }

  // =========================================================================
  // 5. Modal de Detalles y Pedido del Diseño
  // =========================================================================
  function initDetailModal() {
    const dialog = document.getElementById('productDetailDialog');
    const colTag = document.getElementById('detailCollectionTag');
    const titleEl = document.getElementById('detailModalTitle');
    const orderAsEl = document.getElementById('detailOrderAs');
    const imgEl = document.getElementById('detailProductImage');
    const visualStage = document.getElementById('detailVisualStage');
    const priceEl = document.getElementById('detailProductPrice');
    const descEl = document.getElementById('detailProductDescription');
    const specModel = document.getElementById('detailSpecModel');
    const specCapacity = document.getElementById('detailSpecCapacity');
    const specPresentation = document.getElementById('detailSpecPresentation');
    const colorGroup = document.getElementById('detailColorGroup');
    const variantsContainer = document.getElementById('detailVariantsContainer');
    const variantError = document.getElementById('detailVariantError');
    const qtyInput = document.getElementById('detailQtyInput');
    const subtotalHint = document.getElementById('detailSubtotalHint');
    const customizeBtn = document.getElementById('detailCustomizeBtn');
    const quickAddBtn = document.getElementById('detailQuickAddBtn');

    if (!dialog) return;

    function renderDetailVariants(design, baseModel) {
      if (!colorGroup || !variantsContainer) return;

      variantsContainer.innerHTML = '';
      if (variantError) variantError.hidden = true;

      // Para una taza blanca, no ofrezcas cambiar el interior como si fuera una opción del mismo modelo
      if (!baseModel.isColorCustomizable) {
        colorGroup.hidden = true;
        state.detail.colorId = 'blanco';
        return;
      }

      colorGroup.hidden = false;
      const bicolorOptions = getBicolorOptions();

      bicolorOptions.forEach((c) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isActive = c.id === state.detail.colorId;
        btn.className = `variant-pill${isActive ? ' is-active' : ''}`;
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', String(isActive));

        btn.innerHTML = `<span class="variant-pill__dot" style="background-color: ${c.colorHex}"></span><span>${escapeHtml(
          c.label
        )}</span>`;

        btn.addEventListener('click', () => {
          state.detail.colorId = c.id;
          if (variantError) variantError.hidden = true;
          renderDetailVariants(design, baseModel);
        });

        variantsContainer.appendChild(btn);
      });
    }

    function updateDetailSubtotal() {
      const design = getDesignById(state.detail.designId);
      if (!design) return;
      const qty = Math.max(1, parseInt(qtyInput ? qtyInput.value : 1, 10) || 1);
      state.detail.quantity = qty;
      if (subtotalHint) {
        subtotalHint.textContent = `Subtotal estimado: ${formatCurrency(design.price * qty)}`;
      }
    }

    function openDetail(designId) {
      const design = getDesignById(designId) || catalogDesigns[0];
      if (!design) return;

      const baseModel = getBaseModelById(design.baseModelId);
      state.detail.designId = design.id;
      state.detail.colorId = baseModel.isColorCustomizable ? design.defaultColorId || 'rosa' : 'blanco';
      state.detail.quantity = 1;
      if (qtyInput) qtyInput.value = '1';

      if (colTag) colTag.textContent = design.categoryLabel;
      if (titleEl) titleEl.textContent = design.name;
      if (orderAsEl) orderAsEl.textContent = `Pídela como «${design.orderAs}»`;
      if (imgEl) {
        imgEl.src = design.image;
        imgEl.alt = design.imageAlt;
        imgEl.classList.toggle('detail-modal__img--photo', Boolean(design.isPhotoCrop));
      }
      if (visualStage) {
        visualStage.classList.toggle('detail-modal__visual--photo', Boolean(design.isPhotoCrop));
      }
      if (priceEl) {
        priceEl.innerHTML = `$${design.price} MXN <small style="font-size: 0.55em; font-weight: 600;">+ envío</small>`;
      }
      if (descEl) descEl.textContent = design.fullDescription;
      if (specModel) specModel.textContent = baseModel.name;
      if (specCapacity) specCapacity.textContent = baseModel.capacity;
      if (specPresentation) specPresentation.textContent = design.presentation || 'Taza individual (11 oz)';

      renderDetailVariants(design, baseModel);
      updateDetailSubtotal();

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

    if (qtyInput) {
      qtyInput.addEventListener('input', updateDetailSubtotal);
      qtyInput.addEventListener('change', () => {
        if (parseInt(qtyInput.value, 10) < 1 || isNaN(parseInt(qtyInput.value, 10))) {
          qtyInput.value = '1';
        }
        updateDetailSubtotal();
      });
    }

    if (customizeBtn) {
      customizeBtn.addEventListener('click', () => {
        const design = getDesignById(state.detail.designId);
        if (!design) return;
        const selectedColor = state.detail.colorId;
        closeDetail();
        if (typeof window.__openStampaCustomizerWithDesign === 'function') {
          window.__openStampaCustomizerWithDesign(design.id, {
            baseModelId: design.baseModelId,
            colorId: selectedColor
          });
        }
      });
    }

    if (quickAddBtn) {
      quickAddBtn.addEventListener('click', () => {
        const design = getDesignById(state.detail.designId);
        if (!design) return;
        const baseModel = getBaseModelById(design.baseModelId);

        if (baseModel.isColorCustomizable && !state.detail.colorId) {
          if (variantError) variantError.hidden = false;
          return;
        }

        const color = baseModel.isColorCustomizable
          ? getColorById(state.detail.colorId)
          : getColorById('blanco');
        const qty = Math.max(1, parseInt(qtyInput ? qtyInput.value : 1, 10) || 1);

        addItemToCart({
          designId: design.id,
          designName: design.name,
          orderAs: design.orderAs,
          productId: baseModel.id,
          productName: `${design.name} (${baseModel.shortLabel})`,
          modelName: baseModel.name,
          presentation: design.presentation || 'Taza individual (11 oz)',
          image: design.image,
          colorId: baseModel.isColorCustomizable ? color.id : 'blanco',
          colorLabel: baseModel.isColorCustomizable ? color.label : 'Blanca completa',
          unitPrice: design.price,
          quantity: qty,
          customization: {
            uploadedImageName: null,
            notes: null
          }
        });

        closeDetail();
        openCartDrawer();
        showToast(`«${design.name}» añadida al carrito.`);
      });
    }

    document.querySelectorAll('[data-close-detail]').forEach((btn) => {
      btn.addEventListener('click', closeDetail);
    });

    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) closeDetail();
    });

    window.__openStampaDetail = openDetail;
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
      d: newItem.designId || 'personalizada',
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

    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = state.cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    if (badge) badge.textContent = String(totalItems);

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
        const displayTitle = item.designName || item.productName;
        return `
        <li class="cart-item">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(displayTitle)}" width="72" height="72" class="cart-item__thumb">
          <div>
            <h3 class="cart-item__title">${escapeHtml(displayTitle)}</h3>
            <div class="cart-item__meta">
              ${item.orderAs ? `<span><strong>Pídela como:</strong> «${escapeHtml(item.orderAs)}»</span>` : ''}
              <span><strong>Modelo:</strong> ${escapeHtml(item.modelName || item.productName)}</span>
              <span><strong>Interior y asa:</strong> ${escapeHtml(item.colorLabel || 'Blanca completa')}</span>
              ${c.uploadedImageName ? `<span><strong>Imagen a adjuntar en WhatsApp:</strong> ${escapeHtml(c.uploadedImageName)}</span>` : ''}
              ${c.notes ? `<span><strong>Idea / Notas:</strong> ${escapeHtml(c.notes)}</span>` : ''}
              <span><strong>Precio unitario:</strong> ${formatCurrency(item.unitPrice)}</span>
              <span><strong>Subtotal estimado:</strong> ${formatCurrency(item.unitPrice * item.quantity)}</span>
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
        showToast('Abriendo WhatsApp con tu solicitud...');
      });
    }
  }

  // =========================================================================
  // 7. Animaciones de scroll y Hero
  // =========================================================================
  function initScrollAndHeroMotion() {
    if (prefersReducedMotion.matches) return;

    const revealElements = document.querySelectorAll('.reveal-item');
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
