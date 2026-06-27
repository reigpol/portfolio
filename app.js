// ==========================================================================
// PORTFOLIO INTERACTIVE LOGIC
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initThemeSystem();
  initMobileMenu();
  initScrollProgress();
  initBackToTop();
  initSkillsFilter();
  initErpSandbox();
  initScrollAnimations();
  initContactInteractions();
});

// Theme System Initialization (Dark / Light Mode)
function initThemeSystem() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (!toggleBtn) return;

  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Apply default or stored choice
  if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }

  // Handle active clicks
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
  });
}

// 1. Mobile Navigation Menu Drawer Toggle
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('mobileMenuCloseBtn');
  const overlay = document.getElementById('mobileMenuOverlay');
  const menu = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !menu) return;

  function openMenu() {
    toggleBtn.classList.add('active');
    menu.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggleBtn.classList.remove('active');
    menu.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function toggle() {
    if (menu.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  toggleBtn.addEventListener('click', toggle);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// 2. Interactive ERP Sandbox Engine
const ERP_MODULE_DATA = {
  manufacturing: {
    title: 'custom_mrp_costing.py',
    code: `<span class="keyword">class</span> <span class="class-name">MrpProduction</span>(models.Model):
    _inherit = <span class="string">'mrp.production'</span>

    <span class="decorator">@api.depends</span>(<span class="string">'client_promises'</span>, <span class="string">'manager_deadline'</span>)
    <span class="keyword">def</span> <span class="function-name">_compute_delivery_physics</span>(<span class="keyword">self</span>):
        <span class="keyword">for</span> order <span class="keyword">in</span> <span class="keyword">self</span>:
            order.margin_ratio = <span class="number">42.0</span>
            order.ignore_gravity = order.is_urgent
            order.developer_burnout_index = <span class="number">999</span>`,
    parentIcon: '⚙️',
    parentLabel: 'mrp.production',
    childIcon: '🧮',
    childLabel: 'BOM Valuation Flow',
    footerLeft: 'ERP Versions: v16 - v19',
    footerRight: 'mrp_custom_valuation'
  },
  inventory: {
    title: 'stock_smart_routes.py',
    code: `<span class="keyword">class</span> <span class="class-name">StockMove</span>(models.Model):
    _inherit = <span class="string">'stock.move'</span>

    <span class="keyword">def</span> <span class="function-name">_resolve_warehouse_quantum_state</span>(<span class="keyword">self</span>):
        <span class="keyword">for</span> move <span class="keyword">in</span> <span class="keyword">self</span>:
            move.force_teleportation = move.is_lost_in_transit
            move.blame_logistics_partner = <span class="keyword">not</span> move.has_tracking
            move.auto_reply_template = <span class="string">'delays_due_to_solar_flares'</span>`,
    parentIcon: '📦',
    parentLabel: 'stock.picking',
    childIcon: '🚛',
    childLabel: 'Supplier Pricelist Matrix',
    footerLeft: 'Odoo Logistics: Advanced Routing',
    footerRight: 'stock_quantum_router'
  },
  billing: {
    title: 'l10n_es_facturae_audit.py',
    code: `<span class="keyword">class</span> <span class="class-name">AccountMove</span>(models.Model):
    _inherit = <span class="string">'account.move'</span>

    <span class="keyword">def</span> <span class="function-name">_handle_tax_inspection</span>(<span class="keyword">self</span>):
        <span class="keyword">for</span> inv <span class="keyword">in</span> <span class="keyword">self</span>:
            inv.ticketbai_bypass_key = <span class="string">'super_secret_cheat_code'</span>
            inv.aeat_distraction_basket = inv.amount_total &gt; <span class="number">500000</span>
            inv.sii_status = <span class="string">'schrodinger_sent'</span>`,
    parentIcon: '🧾',
    parentLabel: 'account.move (Facturae)',
    childIcon: '🏛️',
    childLabel: 'AEAT / SII Government Gate',
    footerLeft: 'ES Localization compliance',
    footerRight: 'l10n_es_facturae'
  },
  integrations: {
    title: 'fastapi_edi_bridge.py',
    code: `<span class="keyword">class</span> <span class="class-name">FastApiConnector</span>(models.AbstractModel):
    _name = <span class="string">'fastapi.connector'</span>

    <span class="decorator">@api.model</span>
    <span class="keyword">def</span> <span class="function-name">disaster_recovery</span>(<span class="keyword">self</span>):
        <span class="keyword">for</span> worker <span class="keyword">in</span> <span class="keyword">self</span>.workers:
            worker.kill_zombie_threads = <span class="keyword">True</span>
            worker.ignore_user_complaints = <span class="keyword">True</span>
            worker.breathing_room = <span class="keyword">True</span>`,
    parentIcon: '⚡',
    parentLabel: 'FastAPI Microservice',
    childIcon: '🔗',
    childLabel: 'Odoo XML-RPC Core',
    footerLeft: 'External EDI Integrations',
    footerRight: 'fastapi_xmlrpc_bridge'
  }
};

function initErpSandbox() {
  const controls = document.querySelectorAll('.erp-btn');
  const codeSnippet = document.getElementById('codeSnippet');
  const screenTitle = document.getElementById('screenTitle');
  const screenDots = document.querySelectorAll('.erp-screen .card-dot');

  if (!controls.length || !codeSnippet) return;

  // Visual easter egg when clicking screen dots, similar to hero visual dots
  if (screenDots.length > 0) {
    screenDots.forEach(dot => {
      dot.addEventListener('click', () => {
        codeSnippet.style.transition = 'color 0.1s ease';
        codeSnippet.style.color = '#FBBF24';
        setTimeout(() => {
          codeSnippet.style.color = '';
        }, 400);
      });
    });
  }

  // Initialize with manufacturing
  updateSandbox('manufacturing');

  controls.forEach(btn => {
    btn.addEventListener('click', (e) => {
      controls.forEach(b => b.classList.remove('active'));
      const currentBtn = e.currentTarget;
      currentBtn.classList.add('active');
      
      const moduleKey = currentBtn.getAttribute('data-module');
      updateSandbox(moduleKey);
    });
  });

  function updateSandbox(key) {
    const data = ERP_MODULE_DATA[key];
    if (!data) return;

    // Smooth transition for code: fade out and slide slightly down
    codeSnippet.style.opacity = 0;
    codeSnippet.style.transform = 'translateY(8px)';
    
    setTimeout(() => {
      screenTitle.textContent = data.title;
      codeSnippet.innerHTML = data.code;
      
      // Update footer metadata tags to match the tab
      const footerLeft = document.getElementById('sandboxFooterLeft');
      const footerRight = document.getElementById('sandboxFooterRight');
      if (footerLeft && data.footerLeft) footerLeft.textContent = data.footerLeft;
      if (footerRight && data.footerRight) footerRight.textContent = data.footerRight;
      
      // Fade in and slide back up
      codeSnippet.style.opacity = 1;
      codeSnippet.style.transform = 'translateY(0)';
    }, 150);
  }
}

// 3. Staggered reveal animations on scroll
function initScrollAnimations() {
  const animatedElements = [
    ...document.querySelectorAll('.metric-card'),
    ...document.querySelectorAll('.timeline-item'),
    ...document.querySelectorAll('.contribution-card'),
    ...document.querySelectorAll('.skill-category-card'),
    ...document.querySelectorAll('.edu-card'),
    ...document.querySelectorAll('.cert-item'),
    ...document.querySelectorAll('.contact-inner'),
    document.querySelector('.interactive-section .section-header'),
    ...document.querySelectorAll('.erp-btn'),
    document.querySelector('.erp-screen')
  ].filter(Boolean);

  // Set initial hidden styles dynamically (prevents layout flash if JS loads late)
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
  });

  const observer = new IntersectionObserver((entries) => {
    const activeEntries = entries.filter(e => e.isIntersecting);
    activeEntries.forEach((entry) => {
      const element = entry.target;
      const index = animatedElements.indexOf(element);
      
      let delay = 0;
      if (index !== -1) {
        if (element.classList.contains('erp-screen')) {
          // Fire right after the last erp-btn (4 buttons * 85ms = ~340ms)
          delay = 340;
        } else if (element.classList.contains('erp-btn')) {
          // Stagger the 4 buttons sequentially
          const btnIndex = Array.from(document.querySelectorAll('.erp-btn')).indexOf(element);
          delay = btnIndex * 85;
        } else {
          delay = (index % 4) * 85;
        }
      }
      
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, delay);
      
      observer.unobserve(element);
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
}

// 4. Quick Feedback Copy to Clipboard for Contact Items
function initContactInteractions() {
  const contactLinks = document.querySelectorAll('.contact-item');
  
  contactLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Prevent immediate default navigation if user wants to double-click/copy
      const textToCopy = link.querySelector('.contact-text').textContent;
      
      // Attempt copy
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = link.querySelector('.contact-text').textContent;
        const iconWrap = link.querySelector('.contact-icon-wrapper');
        
        // Show success mini tooltip
        const feedback = document.createElement('span');
        feedback.textContent = ' (Copied!)';
        feedback.style.fontSize = '0.75rem';
        feedback.style.color = 'var(--accent-copper)';
        feedback.style.fontWeight = 'bold';
        feedback.style.opacity = '0';
        feedback.style.transition = 'opacity 0.3s ease';
        
        link.appendChild(feedback);
        
        setTimeout(() => {
          feedback.style.opacity = '1';
        }, 50);

        setTimeout(() => {
          feedback.style.opacity = '0';
          setTimeout(() => {
            feedback.remove();
          }, 300);
        }, 2000);
      }).catch(err => {
        // Fallback silently to normal link behavior
      });
    });
  });
}

// 5. Scroll Progress Bar Indicator
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (windowScroll / height) * 100 : 0;
    progressBar.style.width = scrolled + '%';
  });
}

// 6. Floating Back-to-Top Action
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// 7. Interactive Skills Monospace Filter
function initSkillsFilter() {
  const searchInput = document.getElementById('skillsSearchInput');
  const skillItems = document.querySelectorAll('.skill-list li');

  if (!searchInput || !skillItems.length) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    skillItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      
      if (query === '') {
        item.classList.remove('dimmed', 'highlighted');
      } else if (text.includes(query)) {
        item.classList.remove('dimmed');
        item.classList.add('highlighted');
      } else {
        item.classList.add('dimmed');
        item.classList.remove('highlighted');
      }
    });
  });
}
