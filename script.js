/**
 * Vageesh Dwivedi Portfolio & Technical Lab
 * Interactive Logic: Theme Switching, Filtering, Sandboxes, Modals & Toast
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initResumeTabs();
  initExperimentsFilter();
  initArticlesFilter();
  initModals();
  initCopyButtons();
});

/* ==========================================================================
   1. Theme Management (Dark / Light)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const storedTheme = localStorage.getItem('vagdwd-theme') || 'dark';

  if (storedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    updateThemeIcon('light');
  } else {
    document.documentElement.removeAttribute('data-theme');
    updateThemeIcon('dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const newTheme = isLight ? 'dark' : 'light';
      
      if (newTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }

      localStorage.setItem('vagdwd-theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(`Switched to ${newTheme} mode`, '🌓');
    });
  }
}

function updateThemeIcon(theme) {
  const iconSpan = document.getElementById('theme-toggle-icon');
  if (!iconSpan) return;
  if (theme === 'light') {
    iconSpan.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
    iconSpan.setAttribute('aria-label', 'Switch to dark theme');
  } else {
    iconSpan.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
    iconSpan.setAttribute('aria-label', 'Switch to light theme');
  }
}

/* ==========================================================================
   2. Sticky Navigation & Scroll Spy
   ========================================================================== */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Scroll spy
    let currentId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });

    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }
}

/* ==========================================================================
   3. Resume Tab Switcher
   ========================================================================== */
function initResumeTabs() {
  const tabButtons = document.querySelectorAll('.resume-tab-btn');
  const tabPanes = document.querySelectorAll('.resume-tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(`tab-${targetTab}`);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   4. Technical Experiments Filter & Search
   ========================================================================== */
function initExperimentsFilter() {
  const filterPills = document.querySelectorAll('.exp-filter-pill');
  const searchInput = document.getElementById('exp-search-input');
  const expCards = document.querySelectorAll('.exp-card');
  const emptyState = document.getElementById('exp-empty-state');

  let activeCategory = 'all';
  let searchTerm = '';

  function applyFilters() {
    let visibleCount = 0;

    expCards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const title = card.querySelector('.exp-title')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.exp-desc')?.textContent.toLowerCase() || '';
      const techs = card.querySelector('.exp-techs')?.textContent.toLowerCase() || '';

      const matchesCategory = (activeCategory === 'all') || (category.includes(activeCategory));
      const matchesSearch = !searchTerm || 
        title.includes(searchTerm) || 
        desc.includes(searchTerm) || 
        techs.includes(searchTerm);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }
}

/* ==========================================================================
   5. Articles & Blogs Filter & Data (Hosted LinkedIn Articles + Native Ads)
   ========================================================================== */
const ARTICLE_DATA = {
  'article-taking-over-team': {
    title: 'Taking Over a New Engineering Team or Organization',
    category: 'Engineering Leadership',
    date: 'July 18, 2018',
    readTime: '8 min read',
    permalink: './articles/taking-over-engineering-team.html',
    content: `
      <p>Leaders today have an average of 18.2 years of professional work experience. Within these years, you are typically promoted 4.1 times, move between business functions 1.8 times, and join a new company 3–5 times. <strong>Conclusion: Taking over a team will happen for sure!</strong></p>

      <h3>Two Scenarios: Internal Promotion vs. Joining from Outside</h3>
      <p><strong>1. When promoted internally:</strong> You understand the organizational landscape, but must balance depth and breadth. Delegate more deeply; casual conversations no longer scale, so communicate more formally via regular all-hands.</p>
      
      <p><strong>2. When joining an unfamiliar company:</strong> <em>Think of yourself as an organ being donated into another body: if you do not adapt, you will be attacked by its immune system!</em> Build context, align expectations, and understand the existing culture before imposing changes.</p>

      <h3>The Trust Equation</h3>
      <pre><code>Trustworthiness (T) = (Credibility + Reliability + Intimacy) / Self-Orientation</code></pre>
      <p>Show that you care about your team members' needs and their career growth. When people realize you are genuinely invested in their success, trust flourishes naturally.</p>

      <h3>The 30 / 60 / 90 Day Blueprint</h3>
      <ul>
        <li><strong>First 30 Days:</strong> Focus entirely on relationship building and active listening.</li>
        <li><strong>First 60 Days:</strong> Map out the deep technical and operational context.</li>
        <li><strong>First 90 Days:</strong> Ship high-impact wins to establish momentum.</li>
      </ul>

      <div style="margin-top: 24px;">
        <a href="./articles/taking-over-engineering-team.html" class="btn btn-sm btn-secondary">Read Full Standalone Article ↗</a>
      </div>
    `
  },
  'article-fragmented-scrum': {
    title: '"Fragmented-Dependent" Scrum Execution Model',
    category: 'Agile & Engineering Process',
    date: 'July 2, 2022',
    readTime: '5 min read',
    permalink: './articles/fragmented-dependent-scrum.html',
    content: `
      <p>Though we began optimizing our scrum teams into this model in July 2020, by early 2021 we realized we had evolved an execution framework closely aligned with LeSS (Large-Scale Scrum) principles, adapted specifically for high-velocity enterprise platforms with cross-geo dependencies.</p>

      <h3>Pod Structure & Cadence</h3>
      <ul>
        <li><strong>Focused Pods:</strong> 3–5 engineers dedicated to coherent epics, led by a high-potential Tech Lead.</li>
        <li><strong>Pre-Grooming:</strong> Weekly sync between PO, Engineering Owner, and Pod Leads to align on user value and tech debt.</li>
        <li><strong>Slotted Planning:</strong> Each pod joins sprint planning in designated 15–20 minute slots, accelerating planning velocity by 300%.</li>
        <li><strong>The Rotating Support Baton:</strong> A rotating monthly pod absorbs all production defects, patch releases, and SRE coordination so other pods maintain 100% feature flow.</li>
      </ul>

      <div style="margin-top: 24px;">
        <a href="./articles/fragmented-dependent-scrum.html" class="btn btn-sm btn-secondary">Read Full Standalone Article ↗</a>
      </div>
    `
  },
  'article-runpod-vllm': {
    title: 'Benchmarking GPU Inference Latencies: Why We Migrated Our vLLM Clusters to RunPod Serverless',
    category: 'Infrastructure & GPU',
    date: 'September 2026',
    readTime: '5 min read',
    content: `
      <p>Deploying self-hosted open-weights models (such as Llama 3 70B and Mistral Large) requires careful trade-offs between fixed instance costs, cold start latencies, and token generation speed.</p>
      
      <h3>The Benchmark Setup</h3>
      <p>We conducted empirical benchmarks across dedicated cloud VM instances versus serverless GPU clusters using <strong>vLLM v0.6+</strong> with continuous batching and PagedAttention.</p>

      <div class="in-article-sponsor-box">
        <div class="in-article-sponsor-header">
          <span>⚡ RECOMMENDED CLOUD PARTNER</span>
          <span>SPONSORED SPOTLIGHT</span>
        </div>
        <h4>Deploying LLMs at Scale? Run on High-Performance GPUs</h4>
        <p style="margin-bottom: 12px; font-size: 0.95rem; color: var(--text-secondary);">
          Cut your GPU inference costs by up to 70% with secure cloud compute on NVIDIA H100s, A100s, and L40S. Instant serverless endpoints with per-second billing.
        </p>
        <a href="https://runpod.io?ref=vagdwd" target="_blank" rel="noopener sponsored" class="btn btn-sm btn-primary">
          Claim $25 Free GPU Credit ↗
        </a>
      </div>

      <p>Serverless GPU execution delivered a 65% cost reduction during off-peak hours while maintaining sub-120ms TTFT during production spikes.</p>
    `
  },
  'article-abc-players': {
    title: 'How Do You Know If an Employee Is an A, B, or C Player?',
    category: 'Talent Management',
    date: 'September 13, 2023',
    readTime: '4 min read',
    permalink: './articles/abc-player-framework.html',
    content: `
      <p>Every engineering leader wants as many "A Players" as possible on their team. But what does an A Player actually look like in day-to-day execution?</p>

      <p>I evaluate <strong>4 core behavioral criteria:</strong></p>
      <ol>
        <li>What happens when you delegate to them?</li>
        <li>What happens when you recruit?</li>
        <li>What happens when they need to do something new?</li>
        <li>What happens when they are blocked?</li>
      </ol>

      <p><strong>A Players:</strong> You are confident it will get done with zero defect; they teach themselves; when blocked, they ask for help early with clear options.</p>
      <p><strong>B Players:</strong> They get it mostly done but need constant check-ins; when blocked, they waste time struggling rather than admitting they need assistance.</p>
      <p><strong>C Players:</strong> You worry it won't get done well; they rarely ask for help and allow deadlines to silently slip.</p>

      <div style="margin-top: 24px;">
        <a href="./articles/abc-player-framework.html" class="btn btn-sm btn-secondary">Read Full Standalone Article ↗</a>
      </div>
    `
  },
  'article-neon-postgres': {
    title: 'The Modern Data Stack for LLM Memory: Why Serverless Postgres Beats Dedicated Vector Databases',
    category: 'Data Architecture',
    date: 'August 2026',
    readTime: '6 min read',
    content: `
      <p>When engineering RAG pipelines, teams often instinctively reach for standalone, specialized vector databases. However, managing separate databases for relational metadata and vector embeddings quickly introduces data sync latency and schema fragmentation.</p>

      <div class="in-article-sponsor-box">
        <div class="in-article-sponsor-header">
          <span>🐘 DEVELOPER INFRASTRUCTURE SPOTLIGHT</span>
          <span>FEATURED TOOL</span>
        </div>
        <h4>Instant Serverless Postgres with Autoscaling & Branching</h4>
        <p style="margin-bottom: 12px; font-size: 0.95rem; color: var(--text-secondary);">
          Scale to zero when idle, fork database branches for every git pull request, and run pgvector queries at lightning speed with zero DevOps overhead.
        </p>
        <a href="https://neon.tech?ref=vagdwd" target="_blank" rel="noopener sponsored" class="btn btn-sm btn-primary">
          Try Serverless Postgres Free ↗
        </a>
      </div>

      <p>By keeping relational user data and vector embeddings in the same Postgres engine, you eliminate eventual consistency lag and slash architectural complexity.</p>
    `
  },
  'article-building-distributed': {
    title: 'Building Distributed Engineering Teams Across Geographies',
    category: 'Engineering Culture',
    date: 'June 8, 2018',
    readTime: '6 min read',
    permalink: './articles/building-distributed-teams.html',
    content: `
      <p>Key takeaways from the Engineering Leadership Meetup hosted at Instacart's San Francisco office with leaders from GitHub and fast-growing remote-first startups:</p>

      <ul>
        <li><strong>Start Early:</strong> Remote culture is easy to build from day one, but agonizing to retrofit into an entrenched office culture.</li>
        <li><strong>The In-Person Budget:</strong> Managers should meet direct reports in person at least 4 times a year. Allocate real budget for off-sites.</li>
        <li><strong>Emotion Over Video:</strong> Jason Warner (ex-GitHub VP Eng): actively express more emotion and facial animation on video calls so intense focus isn't misread as anger.</li>
        <li><strong>Radical Transparency:</strong> Over-communicate business goals until you cannot say them one more time. Otherwise, people invent their own narrative.</li>
      </ul>

      <div style="margin-top: 24px;">
        <a href="./articles/building-distributed-teams.html" class="btn btn-sm btn-secondary">Read Full Standalone Article ↗</a>
      </div>
    `
  },
  'article-langfuse-mlops': {
    title: 'Production LLM Observability: Debugging Hallucinations and Token Leaks with Langfuse',
    category: 'MLOps Tools',
    date: 'June 2026',
    readTime: '5 min read',
    content: `
      <p>Once LLM features exit staging, tracking user interactions becomes an observability challenge: token counts vary, prompt versions drift, and non-deterministic model responses can silently degrade customer satisfaction.</p>

      <div class="in-article-sponsor-box">
        <div class="in-article-sponsor-header">
          <span>🔍 MLOPS & OBSERVABILITY</span>
          <span>CURATED RESOURCE</span>
        </div>
        <h4>Open Source LLM Engineering Platform</h4>
        <p style="margin-bottom: 12px; font-size: 0.95rem; color: var(--text-secondary);">
          Trace, evaluate, monitor, and debug prompt workflows. Track latency, costs, and output quality across multiple model providers with one SDK.
        </p>
        <a href="https://langfuse.com?ref=vagdwd" target="_blank" rel="noopener sponsored" class="btn btn-sm btn-primary">
          Explore Open Source Observability ↗
        </a>
      </div>

      <p>Integrating telemetry at the proxy layer ensures engineering teams have full visibility into token spend, latency anomalies, and automated test regressions.</p>
    `
  },
  'article-building-trust': {
    title: 'Building Trust Within Your Engineering Team',
    category: 'Leadership & Team Dynamics',
    date: 'March 20, 2018',
    readTime: '5 min read',
    permalink: './articles/building-trust-team.html',
    content: `
      <p>Key insights from David Silverman (former Navy SEAL Officer, author of <em>Team of Teams</em>) and James Birchler (VP of Engineering at SmugMug):</p>

      <ul>
        <li><strong>Benevolence-Based Trust:</strong> Rooted in emotional safety, empathy, and knowing that colleagues care about your well-being.</li>
        <li><strong>Competence-Based Trust:</strong> Built on technical dependability, performance, and keeping commitments.</li>
        <li><strong>Repairing Trust:</strong> Admit mistakes quickly, apologize without excuses, and ask questions instead of making statements.</li>
        <li><strong>Relinquish Surveillance:</strong> Trust allows leaders to let go of micromanagement. Checking active statuses is the anti-pattern of modern leadership.</li>
      </ul>

      <div style="margin-top: 24px;">
        <a href="./articles/building-trust-team.html" class="btn btn-sm btn-secondary">Read Full Standalone Article ↗</a>
      </div>
    `
  },
  'article-one-on-one': {
    title: 'One-on-One 101: Bringing Problems with a Point of View',
    category: 'Career Mentorship',
    date: 'April 5, 2024',
    readTime: '3 min read',
    permalink: './articles/one-on-one-101.html',
    content: `
      <p>When struggling with a challenge at work, bringing it to your 1-on-1 with your manager is healthy. But how you present it defines your credibility:</p>
      <ul>
        <li>If you only bring problems, you risk coming across as a complainer who expects others to solve their bottlenecks.</li>
        <li>If you cannot answer basic questions, you appear overwhelmed and unfocused.</li>
        <li>If you articulate your thought process and recommendation, you position yourself as a strategic partner.</li>
      </ul>
      <p>Before every 1-on-1, take 5 minutes to define: 1) What is the core problem? 2) Why is it happening? 3) What are 2 possible options and which one do you recommend?</p>

      <div style="margin-top: 24px;">
        <a href="./articles/one-on-one-101.html" class="btn btn-sm btn-secondary">Read Full Standalone Article ↗</a>
      </div>
    `
  },
  'article-competency-matrix': {
    title: 'Engineering Competency Matrix: L1 to L4 Growth Framework',
    category: 'Career Framework',
    date: 'April 4, 2022',
    readTime: '6 min read',
    permalink: './articles/competency-matrix.html',
    content: `
      <p>A transparent rubric evaluating engineering maturity from Junior (L1) to Staff/Principal (L4) across 4 dimensions:</p>
      <ul>
        <li><strong>Continuous Learning:</strong> From gaining language fundamentals to providing org-wide strategic architectural direction.</li>
        <li><strong>Execution Discipline:</strong> From zero-defect task delivery to sustaining quality in dynamic, high-risk multi-team environments.</li>
        <li><strong>Influence & Communication:</strong> From clear pull request notes to boundaryless leadership and executive alignment.</li>
        <li><strong>Initiative:</strong> From acting quickly on blockers to leading major technical change initiatives.</li>
      </ul>

      <div style="margin-top: 24px;">
        <a href="./articles/competency-matrix.html" class="btn btn-sm btn-secondary">Read Full Standalone Article ↗</a>
      </div>
    `
  },
  'article-autogen': {
    title: 'Architecting Enterprise Agentic Concierge: Multi-Agent Collaboration with Microsoft AutoGen',
    category: 'AI Architecture',
    date: 'September 2026',
    readTime: '8 min read',
    content: `
      <p>In enterprise customer engagement, traditional deterministic rule-based dialogue systems frequently fail when tasks require dynamic context switching, multi-step validation, and coordinated human-in-the-loop escalation.</p>
      
      <h3>The Multi-Agent Orchestration Architecture</h3>
      <p>We designed and implemented a production-grade multi-agent pipeline using Microsoft's AutoGen framework. Rather than forcing a single monolithic LLM prompt to handle intent categorization, CRM data extraction, policy validation, and reply generation, we decomposed the architecture into specialized conversational agents.</p>

      <p>Deploying this agentic flow reduced Average Handling Time (AHT) by 10% across tier-1 inquiries, lowered customer friction, and established a scalable framework for enterprise generative AI automation.</p>
    `
  },
  'article-recognition-incentives': {
    title: 'Recognition vs. Incentives in High-Performing Engineering Teams',
    category: 'Culture & Org Design',
    date: 'June 8, 2021',
    readTime: '4 min read',
    permalink: './articles/recognition-vs-incentives.html',
    content: `
      <p>Leaders often conflate employee recognition with performance incentives. While both have their place in compensation and organizational health, they serve completely different psychological functions.</p>

      <h3>The Fundamental Differences</h3>
      <ul>
        <li><strong>Recognition:</strong> Spontaneous, unexpected, frequent, values-based, psychic emotional belonging, celebrated inclusively across the entire org.</li>
        <li><strong>Incentives:</strong> Known in advance, cyclic (quarterly/annual), numbers-driven, tangible monetary value, focused primarily on elite performers.</li>
      </ul>

      <p>A culture starved of spontaneous recognition quickly becomes transactional. When engineers know their daily craftsmanship and unglamorous firefighting are recognized, motivation becomes intrinsic rather than purely mercenary.</p>

      <div style="margin-top: 24px;">
        <a href="./articles/recognition-vs-incentives.html" class="btn btn-sm btn-secondary">Read Full Standalone Article ↗</a>
      </div>
    `
  },
  'article-getting-started': {
    title: 'Getting Started as a Full Stack Engineer: Foundations, Algorithms & Beyond',
    category: 'Engineering Foundations',
    date: 'April 16, 2021',
    readTime: '5 min read',
    permalink: './articles/getting-started-full-stack.html',
    content: `
      <p>Becoming an effective full stack engineer requires looking beyond fleeting framework trends to master core computer science and software design principles.</p>

      <h3>1. Software Development Fundamentals</h3>
      <ul>
        <li><strong>Writing Clean Code:</strong> Emphasize readability, modularity, and maintainability. Study Robert Martin’s <em>Clean Code</em> and Steve McConnell's <em>Code Complete</em>.</li>
        <li><strong>Algorithms & Computational Complexity:</strong> Deep-dive into data structures, memory allocation, and algorithmic analysis. Explore Donald Knuth's legendary <em>Computer Musings</em> lectures.</li>
      </ul>

      <h3>2. JavaScript & Browser Internals</h3>
      <p>Before jumping into React or Vue, master the Event Loop, microtasks vs. macrotasks, prototypal inheritance, DOM critical rendering paths, and memory profiling in Chrome DevTools.</p>

      <div style="margin-top: 24px;">
        <a href="./articles/getting-started-full-stack.html" class="btn btn-sm btn-secondary">Read Full Standalone Article ↗</a>
      </div>
    `
  },
  'article-insinuation-anxiety': {
    title: 'Insinuation Anxiety: Why the Fear of Signaling Distrust Drives Destructive Compliance',
    category: 'Behavioral Psychology & Leadership',
    date: 'September 25, 2026',
    readTime: '6 min read',
    permalink: './articles/insinuation-anxiety-compliance.html',
    content: `
      <p>Have you ever nodded along with an advisor, coworker, or manager when your intuition warned you something was off? Voicing reservations felt awkward—not because of the data, but because of what pushing back seemed to imply about the other person.</p>

      <p>This dilemma is driven by <strong>Insinuation Anxiety</strong>: <em>a distinct psychological friction that arises when people worry that their non-compliance with another person's wishes or advice will be interpreted as a direct signal of distrust—insinuating that the person is incompetent, biased, or dishonest.</em></p>

      <h3>The Financial Advisor Paradox</h3>
      <p>In behavioral experiments with financial advisors who disclose a commission conflict of interest, <strong>disclosure often increases client compliance!</strong> Rejecting advice immediately after an advisor shares a conflict feels like an overt moral judgment (<em>"I think you are exploiting me"</em>). To avoid signaling distrust, clients suppress their doubts and sign anyway—an acute form of <strong>preference falsification</strong>.</p>

      <h3>The Gender Dimension</h3>
      <p>Research demonstrates insinuation anxiety is <strong>measurably higher in women</strong> and underrepresented team members due to societal conditioning that disproportionately penalizes women for being perceived as disagreeable or combative.</p>

      <h3>The Engineering Antidote: Universal Verification</h3>
      <ul>
        <li><strong>Process over Personality:</strong> Mandatory review checklists and automated linters remove personal discretion so verification is never viewed as an insult.</li>
        <li><strong>The Deming Rule:</strong> <em>"In God we trust; all others bring data."</em> Normalize data-seeking as craft respect.</li>
        <li><strong>Designated Red Teams:</strong> Assign explicit roles whose formal duty is to poke holes, decoupling skepticism from interpersonal rapport.</li>
      </ul>

      <div style="margin-top: 24px;">
        <a href="./articles/insinuation-anxiety-compliance.html" class="btn btn-sm btn-secondary">Read Full Standalone Article ↗</a>
      </div>
    `
  },
  'article-compliance-defiance': {
    title: 'Compliance, Defiance, and the Illusion of Agency: Where Is the Line Drawn?',
    category: 'Organizational Ethics & Leadership',
    date: 'September 25, 2026',
    readTime: '8 min read',
    permalink: './articles/compliance-defiance-authority-bias.html',
    content: `
      <p>Under the perceived weight of legitimate authority, individual human moral agency does not simply bend—it fractures. When corporate hierarchies and authoritative pressure collide, ordinary, well-meaning professionals routinely surrender autonomy to become instruments of harm.</p>

      <h3>The Mount Washington McDonald's Case Study</h3>
      <p>In 2004, a hoax caller posing as "Detective Scott" called a McDonald's restaurant in Kentucky. Without a badge, warrant, or physical presence, a disembodied voice convinced the manager and her fiancé to detain, strip-search, and severely abuse an innocent 18-year-old employee over 3.5 hours. The perpetrators were not violent criminals; they were law-abiding citizens under the psychological spell of perceived authority.</p>

      <h3>Milgram’s "Agentic State"</h3>
      <p>Stanley Milgram revealed that when placed in an authority structure, humans experience an <strong>Agentic Shift</strong>: they cease viewing themselves as responsible moral actors and view themselves merely as an instrument executing another's will. Their moral concern shifts from <em>"Is this right?"</em> to <em>"Am I executing instructions competently?"</em></p>

      <h3>The Enterprise Software Parallels</h3>
      <ul>
        <li><strong>The Weaponized "C-Suite Proxy":</strong> Pushing decisions because <em>"XYZ in C*O position has said something"</em> or <em>"I talked to the CTO."</em> Heavy titles are used as epistemic silencers to bypass data and kill technical scrutiny.</li>
        <li><strong>Vulnerability of Junior Engineers:</strong> Junior developers innocently assume executive requests have been ethically and legally vetted. They are often handed tasks (disabling auth, stripping privacy consent, bypassing encryption) without even knowing what catastrophic liability they are agreeing to implement.</li>
        <li><strong>The "Just a Jira Ticket" Syndrome:</strong> Subordinating personal agency and engineering ethics to sprint milestones (e.g., Volkswagen Dieselgate, Boeing 737 MAX MCAS).</li>
        <li><strong>Diffusion of Responsibility:</strong> When decisions pass through five corporate layers, no single person feels the moral weight.</li>
      </ul>

      <h3>The Remedy: Intelligent Defiance</h3>
      <p>Adopted from guide dog training and aviation Crew Resource Management (CRM), <strong>Intelligent Disobedience</strong> requires engineers and leaders to refuse dangerous commands when fundamental safety, human dignity, or data integrity is violated. Always close the loop with executives in writing: title-dropping dissolves quickly under direct public sunshine. Stop hiding behind org charts and tickets—<strong>grow the spine</strong> to stand up for ethical engineering.</p>

      <div style="margin-top: 24px;">
        <a href="./articles/compliance-defiance-authority-bias.html" class="btn btn-sm btn-secondary">Read Full Standalone Article ↗</a>
      </div>
    `
  }
};

function initArticlesFilter() {
  const filterPills = document.querySelectorAll('.article-filter-pill');
  const articleCards = document.querySelectorAll('.article-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter') || 'all';

      articleCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        const isSponsored = card.classList.contains('native-sponsored');

        if (filter === 'all') {
          card.style.display = 'flex';
        } else if (filter === 'sponsored' && isSponsored) {
          card.style.display = 'flex';
        } else if (category.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Clicking an article card opens reader modal
  articleCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a') && e.target.closest('a').getAttribute('target') === '_blank') {
        return;
      }
      const articleId = card.getAttribute('data-article-id');
      if (articleId && ARTICLE_DATA[articleId]) {
        openArticleModal(ARTICLE_DATA[articleId]);
      }
    });
  });
}

/* ==========================================================================
   6. Modals Management (Resume Viewer, Live Sandbox, Article Reader)
   ========================================================================== */
function initModals() {
  const openResumeBtn = document.getElementById('open-resume-modal-btn');
  const openResumeHeroBtn = document.getElementById('open-resume-hero-btn');
  const resumeModal = document.getElementById('resume-modal');

  [openResumeBtn, openResumeHeroBtn].forEach(btn => {
    btn?.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(resumeModal);
    });
  });

  const sandboxModal = document.getElementById('sandbox-modal');
  const sandboxIframe = document.getElementById('sandbox-iframe');
  const sandboxTitle = document.getElementById('sandbox-title');
  const sandboxExternalLink = document.getElementById('sandbox-external-link');
  const previewBtns = document.querySelectorAll('.preview-exp-btn');

  previewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const url = btn.getAttribute('data-url') || '';
      const title = btn.getAttribute('data-title') || 'Interactive Experiment';

      if (sandboxIframe && sandboxTitle && sandboxExternalLink) {
        sandboxIframe.src = url;
        sandboxTitle.textContent = title;
        sandboxExternalLink.href = url;
      }
      openModal(sandboxModal);
    });
  });

  const deviceBtns = document.querySelectorAll('.device-btn');
  const sandboxHolder = document.getElementById('sandbox-frame-holder');

  deviceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      deviceBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const device = btn.getAttribute('data-device');

      if (sandboxHolder) {
        if (device === 'mobile') {
          sandboxHolder.style.width = '390px';
        } else if (device === 'tablet') {
          sandboxHolder.style.width = '768px';
        } else {
          sandboxHolder.style.width = '100%';
        }
      }
    });
  });

  document.querySelectorAll('.modal-close-btn, .modal-backdrop').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el) {
        closeAllModals();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
}

function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAllModals() {
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.classList.remove('open');
  });
  document.body.style.overflow = '';
  
  const sandboxIframe = document.getElementById('sandbox-iframe');
  if (sandboxIframe) {
    sandboxIframe.src = 'about:blank';
  }
}

function openArticleModal(article) {
  const articleModal = document.getElementById('article-modal');
  const readerTitle = document.getElementById('article-reader-title');
  const readerMeta = document.getElementById('article-reader-meta');
  const readerBody = document.getElementById('article-reader-body');

  if (readerTitle && readerMeta && readerBody) {
    readerTitle.textContent = article.title;
    readerMeta.textContent = `${article.category} • ${article.date} • ${article.readTime}`;
    readerBody.innerHTML = article.content;
  }

  openModal(articleModal);
}

/* ==========================================================================
   7. Copy to Clipboard & Toast System
   ========================================================================== */
function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`, '📋');
        }).catch(() => {
          showToast(`Copied: ${textToCopy}`, '📋');
        });
      }
    });
  });
}

function showToast(message, icon = '✓') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="font-size: 1.1rem;">${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
