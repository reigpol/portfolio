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
    code: `<span class="code-keyword">class</span> <span class="code-method">MrpProduction</span>(models.Model):
    _inherit = <span class="code-string">'mrp.production'</span>

    <span class="code-keyword">def</span> <span class="code-method">action_confirm</span>(<span class="code-keyword">self</span>):
        <span class="code-comment"># Compute automated BOM costing margins on confirmation</span>
        res = <span class="code-keyword">super</span>(MrpProduction, <span class="code-keyword">self</span>).action_confirm()
        <span class="code-keyword">for</span> order <span class="code-keyword">in</span> <span class="code-keyword">self</span>:
            order._calculate_custom_cost_ratios()
        <span class="code-keyword">return</span> res`,
    parentIcon: '⚙️',
    parentLabel: 'mrp.production',
    childIcon: '🧮',
    childLabel: 'BOM Valuation Flow'
  },
  inventory: {
    title: 'stock_smart_routes.py',
    code: `<span class="code-keyword">class</span> <span class="code-method">StockMove</span>(models.Model):
    _inherit = <span class="code-string">'stock.move'</span>

    <span class="code-keyword">def</span> <span class="code-method">_action_assign</span>(<span class="code-keyword">self</span>):
        <span class="code-comment"># Enforce advanced supplier routes based on realtime lead times</span>
        <span class="code-keyword">self</span>._validate_warehouse_capacity()
        <span class="code-keyword">return</span> <span class="code-keyword">super</span>()._action_assign()`,
    parentIcon: '📦',
    parentLabel: 'stock.picking',
    childIcon: '🚛',
    childLabel: 'Supplier Pricelist Matrix'
  },
  billing: {
    title: 'l10n_es_facturae_audit.py',
    code: `<span class="code-keyword">class</span> <span class="code-method">AccountMove</span>(models.Model):
    _inherit = <span class="code-string">'account.move'</span>

    <span class="code-keyword">def</span> <span class="code-method">_post</span>(<span class="code-keyword">self</span>, soft=<span class="code-keyword">True</span>):
        <span class="code-comment"># Electronic Invoice XML sign with Spanish AEAT / SII</span>
        posted = <span class="code-keyword">super</span>()._post(soft)
        <span class="code-keyword">if</span> <span class="code-keyword">self</span>.country_code == <span class="code-string">'ES'</span>:
            <span class="code-keyword">self</span>._submit_sii_electronic_invoicing()
        <span class="code-keyword">return</span> posted`,
    parentIcon: '🧾',
    parentLabel: 'account.move (Facturae)',
    childIcon: '🏛️',
    childLabel: 'AEAT / SII Government Gate'
  },
  integrations: {
    title: 'fastapi_edi_bridge.py',
    code: `<span class="code-keyword">from</span> fastapi <span class="code-keyword">import</span> FastAPI, Depends
<span class="code-keyword">import</span> xmlrpc.client

app = FastAPI(title=<span class="code-string">"B2BRouter EDI Sync"</span>)

<span class="code-keyword">@app.post</span>(<span class="code-string">"/edi/sync"</span>)
<span class="code-keyword">def</span> <span class="code-method">synchronize_invoice</span>(payload: InvoiceSchema):
    <span class="code-comment"># Secure XML-RPC pipe to synchronize external operations</span>
    uid = common.authenticate(HOST, DB, USER, PWD, {})
    models.execute_kw(DB, uid, PWD, <span class="code-string">'account.move'</span>, <span class="code-string">'create'</span>, [payload])
    <span class="code-keyword">return</span> {"sync_status": "success"}`,
    parentIcon: '⚡',
    parentLabel: 'FastAPI Microservice',
    childIcon: '🔗',
    childLabel: 'Odoo XML-RPC Core'
  }
};

function initErpSandbox() {
  const controls = document.querySelectorAll('.erp-btn');
  const codeSnippet = document.getElementById('codeSnippet');
  const screenTitle = document.getElementById('screenTitle');
  const parentNode = document.getElementById('diagNodeParent');
  const childNode = document.getElementById('diagNodeChild');

  if (!controls.length || !codeSnippet) return;

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

  function updateLineNumbers(codeHtml) {
    const lineNumbersContainer = document.getElementById('codeLineNumbers');
    if (!lineNumbersContainer) return;

    // Split HTML lines to calculate numbers
    const lines = codeHtml.split('\n');
    const lineCount = lines.length;

    let html = '';
    for (let i = 1; i <= lineCount; i++) {
      html += `<span>${i}</span>`;
    }
    lineNumbersContainer.innerHTML = html;
  }

  function updateSandbox(key) {
    const data = ERP_MODULE_DATA[key];
    if (!data) return;

    // Smooth transition for code
    codeSnippet.style.opacity = 0;
    setTimeout(() => {
      screenTitle.textContent = data.title;
      codeSnippet.innerHTML = data.code;
      updateLineNumbers(data.code);
      codeSnippet.style.opacity = 1;
    }, 150);

    // Update diagram nodes with custom flash animations
    if (parentNode && childNode) {
      parentNode.classList.remove('active-pulse');
      childNode.classList.remove('active-pulse');

      parentNode.innerHTML = `
        <span class="node-icon">${data.parentIcon}</span>
        <span class="node-label">${data.parentLabel}</span>
      `;
      childNode.innerHTML = `
        <span class="node-icon">${data.childIcon}</span>
        <span class="node-label">${data.childLabel}</span>
      `;

      // Trigger micro-flash
      setTimeout(() => {
        parentNode.classList.add('active-pulse');
        childNode.classList.add('active-pulse');
      }, 50);
    }
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
    ...document.querySelectorAll('.contact-inner')
  ];

  // Set initial hidden styles dynamically (prevents layout flash if JS loads late)
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add a slight delay for staggered appearance
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, 100);
        observer.unobserve(entry.target);
      }
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
