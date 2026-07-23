// ==========================================================================
// PORTFOLIO INTERACTIVE LOGIC
// ==========================================================================

// Shared syntax highlighting
function highlight(text) {
  const escaped = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g, '<br>');
  return escaped
    .replace(/(@\w+(?:\.\w+)?)/g, '<span class="decorator">$1</span>')
    .replace(/'[^']*'/g, '<span class="string">$&</span>')
    .replace(/\bclass\s+(\w+)(?:\(([^)]+)\))?/g, function(m, name, parent) {
      return '<span class="keyword">class</span> <span class="class-name">' + name + '</span>' + (parent ? '(<span class="class-name">' + parent + '</span>)' : '');
    })
    .replace(/\bdef\s+(\w+)/g, '<span class="keyword">def</span> <span class="function-name">$1</span>')
    .replace(/\b(if|elif|else|for|while|in|is|not|and|or|try|except|finally|return|raise|with|as|self|True|False|None)\b/g, '<span class="keyword">$1</span>')
    .replace(/\b\d+(?:\.\d+)?\b/g, '<span class="number">$&</span>');
}
// Shared typing effect — types raw code char by char with syntax highlighting
function startTyping(el, cursorEl, raw) {
  if (!el || !cursorEl) return;
  if (el._typingTimer) { clearTimeout(el._typingTimer); el._typingTimer = null; }
  el.textContent = '';
  cursorEl.textContent = '';
  let idx = 0;
  function typeChar() {
    if (idx < raw.length) {
      el.innerHTML = highlight(raw.substring(0, idx + 1));
      idx++;
      el._typingTimer = setTimeout(typeChar, naturalDelay(raw, idx));
    } else {
      el.innerHTML = highlight(raw);
      cursorEl.textContent = ' \u2588';
      el._typingTimer = null;
    }
  }
  el._typingTimer = setTimeout(typeChar, naturalDelay(raw, 0));
}

function naturalDelay(raw, idx) {
  const c = raw[idx];
  const n = raw[idx + 1] || '';
  if (c === '\n') {
    if (/^\s*(def\b|class\b|for\b|if\b|return\b|@\w)/.test(raw.substring(idx + 1)))
      return 30 + Math.random() * 20;
    return 12 + Math.random() * 10;
  }
  if (c === ' ') {
    if (idx > 0 && (raw[idx - 1] === ' ' || raw[idx - 1] === '\n')) return 0;
    return 6 + Math.random() * 6;
  }
  if (/[:;.,(){}@=><#'"\-\+]/.test(c)) return 8 + Math.random() * 8;
  if (/[a-zA-Z0-9_]/.test(c)) {
    const atEnd = !n || !/[a-zA-Z0-9_]/.test(n);
    return (atEnd ? 4 : 2) + Math.random() * 4;
  }
  return 4 + Math.random() * 5;
}

document.addEventListener('DOMContentLoaded', () => {
  initThemeSystem();
  initMobileMenu();
  initScrollProgress();
  initBackToTop();
  initSkillsFilter();
  initErpSandbox();
  initContactInteractions();
  initTypingEffect();
});

// Theme System Initialization (Dark / Light Mode)
function initThemeSystem() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

// 1. Mobile Navigation Menu Drawer Toggle
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('mobileMenuCloseBtn');
  const overlay = document.getElementById('mobileMenuOverlay');
  const menu = document.getElementById('mobileMenu');
  // Include both section links and the CTA button ("Get in Touch")
  const navLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-btn');

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
    code:
`class MrpProduction(models.Model):
    _inherit = 'mrp.production'

    @api.depends('date_start', 'product_qty')
    def _compute_realistic_deadline(self):
        for production in self:
            production.date_deadline = production.date_start
            production.delay_owner = 'supplier'
            if production.product_qty > 1000:
                production.delay_reason = 'next_sprint'`,
    footerLeft: 'Odoo Manufacturing: Custom BOM Costing',
    footerRight: 'mrp_custom_valuation'
  },
  inventory: {
    title: 'stock_smart_routes.py',
    code:
`class StockMove(models.Model):
    _inherit = 'stock.move'

    @api.depends('product_uom_qty', 'quantity')
    def _compute_quantity_gap(self):
        for move in self:
            move.quantity_gap = move.product_uom_qty - move.quantity
            move.audit_status = 'matches_excel'
            if move.quantity_gap > 0:
                move.audit_status = 'ask_warehouse'`,
    footerLeft: 'Odoo Logistics: Advanced Stock Routes',
    footerRight: 'stock_smart_router'
  },
  billing: {
    title: 'l10n_es_facturae_audit.py',
    code:
`class AccountMove(models.Model):
    _inherit = 'account.move'

    def _process_aeat_response(self, response):
        self.ensure_one()
        self.aeat_status = 'accepted'
        if response.status_code == 418:
            self.aeat_status = 'it_is_complicated'
            self.message_post(body=_('AEAT returned a teapot.'))`,
    footerLeft: 'Spanish Localization: Compliance Integration',
    footerRight: 'l10n_es_facturae'
  },
  integrations: {
    title: 'fastapi_edi_bridge.py',
    code:
`class FastApiConnector(models.AbstractModel):
    _name = 'fastapi.connector'

    @api.model
    def _sync_legacy_order(self, payload):
        try:
            return self._call_vendor_endpoint(payload)
        except TimeoutError:
            _logger.info('Vendor API works on their local machine')
            return {'status': 'retry'}`,
    footerLeft: 'Integrations: REST API / B2BRouter Gateway',
    footerRight: 'fastapi_xmlrpc_bridge'
  }
};

function initErpSandbox() {
  const controls = document.querySelectorAll('.erp-btn');
  const codeSnippet = document.getElementById('codeSnippet');
  const sandboxCursor = document.getElementById('sandboxCursor');
  const screenTitle = document.getElementById('screenTitle');

  if (!controls.length || !codeSnippet) return;

  // Initialize with manufacturing
  setTimeout(function() {
    const data = ERP_MODULE_DATA['manufacturing'];
    if (data) {
      screenTitle.textContent = data.title;
      const footerLeft = document.getElementById('sandboxFooterLeft');
      const footerRight = document.getElementById('sandboxFooterRight');
      if (footerLeft && data.footerLeft) footerLeft.textContent = data.footerLeft;
      if (footerRight && data.footerRight) footerRight.textContent = data.footerRight;
      startTyping(codeSnippet, sandboxCursor, data.code);
    }
  }, 400);

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
    screenTitle.textContent = data.title;
    const footerLeft = document.getElementById('sandboxFooterLeft');
    const footerRight = document.getElementById('sandboxFooterRight');
    if (footerLeft && data.footerLeft) footerLeft.textContent = data.footerLeft;
    if (footerRight && data.footerRight) footerRight.textContent = data.footerRight;
    startTyping(codeSnippet, sandboxCursor, data.code);
  }
}

// 4. Quick Feedback Copy to Clipboard for Contact Items
function initContactInteractions() {
  const contactLinks = document.querySelectorAll('.contact-item');
  
  contactLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const textToCopy = link.querySelector('.contact-text').textContent;
      
      navigator.clipboard.writeText(textToCopy).then(() => {
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
      }).catch(() => {});
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

// 8. Hero typing effect — code types itself out in color
function initTypingEffect() {
  const el = document.getElementById('typingCode');
  const cursor = document.getElementById('typingCursor');
  if (!el || !cursor) return;

  const raw =
  'class OdooTechLead(Developer):\n' +
  '    @api.depends(\'experience_years\')\n' +
  '    def _compute_expertise(self):\n' +
  '        for eng in self:\n' +
  '            eng.expert_upgrades = True\n' +
  '            eng.compliance_es = True\n' +
  '            eng.oca_contributor = True\n' +
  '            eng.clean_code = True';

  setTimeout(function() { startTyping(el, cursor, raw); }, 100);
}
