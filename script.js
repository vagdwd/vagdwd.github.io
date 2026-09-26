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
  },
  'article-monk-golden-bowl': {
    title: "The Monk and the Golden Bowl",
    category: "Philosophy",
    date: "December 7, 2025",
    readTime: "4 min read",
    permalink: './articles/monk-golden-bowl.html',
    content: `
<p>In the fast-paced world of software engineering, we often confuse "value" with "complexity." We chase the newest frameworks, the highest titles, and the biggest compensation packages.</p>

<p>But sometimes, the things we chase end up owning us.</p>

<p>I recently came across an ancient story about a monk that illustrates a few correlations to modern crisis in tech.</p>

<h3>The Story of the Monk and the Thief</h3>

<p>A detached monk, known for sharing wisdom in exchange for food, was once invited to a palace. The Queen, deeply moved by his teachings, insisted on trading his simple eating bowl for a solid gold one. The monk accepted it without attachment.</p>

<p>Word spread that a mendicant monk was carrying a fortune. A notorious thief began tracking him, waiting for the monk to fall asleep in his hut so he could steal the bowl.</p>

<p>The monk, sensing the thief outside and realizing the anxiety the bowl was causing, finished his meal and simply threw the golden bowl out of the window, right to the thief's feet.</p>

<p>The thief was shocked. He asked the monk why he would throw away such treasure.</p>

<p>The monk replied: "If you kept thinking about the bowl, you wouldn't sleep. And if you didn't sleep, I wouldn't sleep.". He realized that if a possession steals your peace, it is better to abandon it.</p>

<h3>Applying the "Gold Bowl" to Software Engineering</h3>

<p>This isn't just a parable about minimalism; it’s a framework for surviving a career in tech. Here is how the monk's wisdom applies to our world:</p>

<h3>1. The "Golden Handcuffs"</h3>

<p>The gold bowl is the perfect metaphor for the high salaries and RSUs at high-pressure tech companies. The compensation is heavy and valuable gold. But often, the cost of holding that gold is high stress, toxic on-call rotations, or working on products you don't believe in.</p>

<p>Like the monk, we have to ask: Is the gold worth your "sleep"? Sometimes, winning means taking a pay cut for autonomy, sanity, and peace of mind.</p>

<h3>2. Hoarding Code vs. Deleting Code</h3>

<p>The thief in the story believed winning meant <em>accumulating</em> the bowl. The monk knew winning meant <em>letting it go</em>.</p>

<ul>
<li><strong>Junior Engineers often think like the thief:</strong> They value accumulation. They measure success by lines of code written, features shipped, and complex new tools learned (often "Resume Driven Development", RDD as I used to refer to my colleagues in 2016 or so).</li>
<li><strong>Senior Engineers think like the monk:</strong> They value detachment. They know that every line of code is a future liability—something to debug, test, and maintain. The most satisfying days for a seasoned engineer are often the days they <em>delete</em> thousands of lines of code, making the system simpler and more stable. (Detailed article on <a href="https://www.linkedin.com/pulse/developers-mindset-vs-engineers-vageesh-dwivedi-bbgcc/?trk=article-ssr-frontend-pulse_little-text-block" rel="noopener" target="_blank">Economics of Code</a>)</li>
</ul>

<h3>3. "Sleep" vs. Pager Duty: The Cost of Force-Fitting "Gold"</h3>

<p>The monk threw the bowl away for one simple reason: the anxiety of possessing it cost him his sleep. He realized that a simple clay bowl held dinner just as well as a golden one, without the burden.</p>

<p>In software, we often let our ego or curiosity drive architectural decisions. We aspire to build "Gold Bowl" systems, force-fitting shiny new technologies where they don't belong—like implementing a complex GraphQL federation when a standard RESTful API would have perfectly sufficed.</p>

<p>This compulsion to do more than necessary doesn't just inflate the codebase; it is exactly what triggers the pager at 3 AM. True value isn't found in the complexity of your stack; it’s found in the reliability of <strong>KISS</strong>, the efficiency of <strong>DRY</strong>, and the stability of <strong>SOLID</strong>. Sometimes, 'boring' adherence to these fundamentals is superior to flashy tech because it is the only thing that lets the team sleep at night.</p>

<h3>The Takeaway</h3>

<p>The thief in the story realized he had spent his life losing by trying to gather things, while the monk was winning by letting things go.</p>

<p>In your tech career, are you acting like the thief or the monk? What "gold bowl" are you holding onto right now that is costing you your peace?</p>

      <div style="margin-top: 24px; display: flex; gap: 12px; flex-wrap: wrap;">
        <a href="./articles/monk-golden-bowl.html" class="btn btn-sm btn-secondary">Read Full Standalone Article ↗</a>
        <a href="https://www.linkedin.com/pulse/monk-golden-bowl-vageesh-dwivedi-ek5oc/" target="_blank" rel="noopener" class="btn btn-sm btn-outline">Original on LinkedIn Pulse ↗</a>
      </div>
    `
  },
  'article-developers-vs-engineers': {
    title: "The Developer's Mindset vs. The Engineer's Mindset",
    category: "Mindset & Costs",
    date: "September 23, 2025",
    readTime: "3 min read",
    permalink: './articles/developers-mindset-vs-engineers.html',
    content: `
<p>While the terms "developer" and "engineer" are often used interchangeably, there is a subtle but critical difference in their core approach.</p>

<ul>
<li>A <strong>developer</strong> often focuses on <strong>functionality</strong> and <strong>speed</strong>. Their primary goal is to write code that works and solves a specific problem as quickly as possible. This is a creative and pragmatic role, akin to a skilled craftsperson building a piece of a larger machine.</li>
<li>An <strong>engineer</strong>, by definition, applies scientific and <strong>mathematical principles</strong> to design, build, and maintain systems. This role is concerned not just with functionality, but with <strong>efficiency, reliability, scalability, and cost</strong>. They think about the system's entire lifecycle and its long-term financial and operational impact. An engineer sees the big picture.</li>
</ul>

<h3>The Economics of Code</h3>

<p>This distinction is where your economics background becomes invaluable. You understand that resources are scarce and have a cost. This isn't just about money; it's about opportunity cost. Every dollar spent on an inefficient cloud function is a dollar that can't be invested in a new feature, a new hire, or a marketing campaign.</p>

<p>Therefore, the "not my money" mentality is a developer's mindset, not an engineer's. An engineer knows that the company's credits are the company's capital. Wasting them is like an investor carelessly draining a savings account. By applying principles of <strong>custodianship</strong> and <strong>full-cycle responsibility</strong>, developers can elevate their role to that of an engineer.</p>

<h3>Practical Custodianship in Action</h3>

<p>To move from a developer to an engineer mindset, consider these actions:</p>

<ul>
<li><strong>Audit everything.</strong> Use cloud monitoring tools to track costs per service, per API call, and per project.</li>
<li><strong>Optimize for efficiency.</strong> Is that large-scale virtual machine truly necessary, or would a serverless function with a leaner architecture suffice?</li>
<li><strong>Plan for the long term.</strong> Architect systems that can scale both up and down, and factor cost into your design documents as a non-functional requirement alongside security and performance.</li>
</ul>

<p>By embracing this <strong>frugal and responsible</strong> approach, you're not just writing code—you're building a sustainable and profitable business. You are a <strong>contributor</strong> to the company's financial success, not just a consumer of its resources.</p>

<h3>A very informative talk from Kyle Simpson highly related to this topic</h3>

      <div style="margin-top: 24px; display: flex; gap: 12px; flex-wrap: wrap;">
        <a href="./articles/developers-mindset-vs-engineers.html" class="btn btn-sm btn-secondary">Read Full Standalone Article ↗</a>
        <a href="https://www.linkedin.com/pulse/developers-mindset-vs-engineers-vageesh-dwivedi-bbgcc/" target="_blank" rel="noopener" class="btn btn-sm btn-outline">Original on LinkedIn Pulse ↗</a>
      </div>
    `
  },
  'article-cobra-copilot-effect': {
    title: "The Cobra (or Copilot) Effect",
    category: "AI & Incentives",
    date: "March 12, 2025",
    readTime: "6 min read",
    permalink: './articles/cobra-copilot-effect.html',
    content: `
<h3>A Classic Case of Perverse Incentives (coined by economist Horst Siebert) [1]</h3>

<p>The infamous "Cobra Effect" anecdote from colonial Delhi provides a powerful, enduring illustration of a perverse incentive: a seemingly logical incentive that, in practice, produces the opposite effect of what was intended. The British, seeking to reduce the cobra population, offered a bounty for every dead cobra brought in. The unintended consequence? Resourceful individuals began <em>breeding</em> cobras specifically to collect the bounty. When the government, realizing the folly of their policy, rescinded the reward, these cobra breeders, now faced with a worthless "asset", simply released the snakes, resulting in a significantly <em>larger</em> cobra population than before.</p>

<p>We saw a strikingly similar dynamic unfold during the Afghanistan War. To curb opium production, British forces implemented a program to pay farmers for destroying their poppy fields (as extensively documented by the Washington Post) [2]. The result was a perverse incentive of epic proportions: farmers were incentivized to <em>maximize</em> poppy cultivation, not reduce it, to claim the compensation for destroying their expanded crops. This counterproductive outcome mirrored the Cobra Effect almost perfectly.</p>

<p>These examples, spanning centuries and vastly different contexts, underscore the vital importance of deeply understanding human behavior and anticipating the full spectrum of potential unintended consequences when designing policies or capabilities, economic or even technological.</p>

<p>Are we seeing a similar phenomenon with the widespread adoption of AI tools? AI, like ChatGPT, Copilot, and code generation models, was initially heralded as a productivity booster to empower developers and other professionals. And indeed, 2023 and 2024 saw the entire industry doing song and dance showcasing and encouraging their use [3].</p>

<p>But now, the pendulum seems to be swinging. We're seeing interview processes where candidates are asked to share their screens and use "Ctrl+Tab" (or "Cmd+Tab") to prove they're not relying on AI for answers. Companies like <a href="http://LightScreen.ai?trk=article-ssr-frontend-pulse_little-text-block" rel="noopener" target="_blank">LightScreen.ai</a> recently incubated at YCombinator [4], explicitly marketing themselves as a way to filter out candidates who might be "over-relying" on AI. There's a growing sense of unease as depicted in LinkedIn posts, encapsulated in pathetic memes about developers who "can't code on their own" anymore or blindly saying "Dumb get dumber" [5]. There is a clear divide in the industry at this time.</p>

<p>This raises crucial questions:</p>

<ul>
<li>Are we inadvertently creating a perverse incentive where genuine skill development is discouraged in favor of superficial AI-assisted performance?</li>
<li>Are hiring practices that focus on <em>detecting</em> AI use (which is easily circumvented, e.g., using a separate device – think newsroom teleprompters!) measuring competence? Or just measuring compliance to some rule?</li>
<li>Shouldn't we focus on evaluating the <em>value and impact</em> a candidate can bring, regardless of the tools they use?</li>
<li>Are we repeating past errors like the ones above and creating a different set of problems?</li>
</ul>

<p>Consider other industries. Airline autopilots have been used for decades to enhance safety and efficiency, not to replace the pilot's expertise. Tesla's Full Self-Driving (FSD) system, while advanced, <em>penalizes</em> drivers for <em>not</em> paying attention – it's designed to <em>augment</em>, not replace, human oversight. The focus is on the <em>outcome</em> (safe and efficient flight/driving), not on rigidly policing the <em>method</em>. Shouldn't we apply the same principle to the use of AI in other fields, including software development? Our intentions should be to <strong>embrace and reward the value or impact created</strong>, not to punish the use of tools that can enhance productivity and innovation.</p>

<p>A new term is also doing rounds on social media called <strong>"Vibe Coding"</strong>. A term coined by Andrej Karpathy just a few weeks ago (on <strong>February 6th, 2024</strong>) and has since been featured in the New York Times, Ars Technica, the Guardian, and countless online discussions including a Y Combinator webcast Lightcone [7]. The industry is reflecting on Karpathy's post on X which also defines in his own interpretation [8]. There are various interpretations of the true meaning or intention of the word "vibe" and I feel it's about the human thoughts and feelings that the developer experiences while using the generated code. Coding can include faster iterations, fail faster, and experimentation as described as "exponentials" by Karpathy. Cursor Editor and VSCode with copilot were state of art till last year, but the complete realization comes in <a href="https://v0.dev/?trk=article-ssr-frontend-pulse_little-text-block" rel="noopener" target="_blank">V0 tool</a> by Vercel. Though V0 launched in 2024, their X handle already claims it to be a "<strong>Full Stack Vibe Coding Platform</strong>".</p>

<p>We must consistently ask ourselves:</p>

<ul>
<li>What are the actual, real-world incentives we're creating, not just the intended ones?</li>
<li>How might individuals and businesses, acting in their own perceived self-interest, exploit or circumvent the system?</li>
<li>Are we genuinely addressing the root cause of the problem, or are we merely treating a symptom, potentially creating new problems in the process?</li>
<li>Who ultimately benefits from this enablement, and who bears the burden of its costs, both direct and indirect?</li>
<li>What are the second, third, and even fourth-order effects that might ripple through the system?</li>
</ul>

<p>Perverse incentives are a powerful and often insidious force in shaping human behavior and economic outcomes. Ignoring them, or failing to adequately account for them, can lead to disastrous and deeply counterproductive results, whether in the realm of pest control, drug policy, technology, or any other area of human endeavor. The Cobra Effect serves as a timeless reminder of the need for careful, nuanced, and system-wide thinking.</p>

<p>[1] - <a href="https://en.wikipedia.org/wiki/Perverse_incentive?trk=article-ssr-frontend-pulse_little-text-block" rel="noopener" target="_blank">Perverse Incentive on wikipedia</a></p>

<p>[2] - <a href="https://www.washingtonpost.com/graphics/2019/investigations/afghanistan-papers/afghanistan-war-opium-poppy-production?trk=article-ssr-frontend-pulse_little-text-block" rel="noopener" target="_blank">Afghanistan papers on Washington post</a></p>

<p>[3] - <a href="https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier?trk=article-ssr-frontend-pulse_little-text-block" rel="noopener" target="_blank">Potential of Generative AI on productivity - Mckinsey</a></p>

<p>[4] - <a href="https://www.ycombinator.com/companies/lightscreen-ai?trk=article-ssr-frontend-pulse_little-text-block" rel="noopener" target="_blank">Lightscreen.ai at YCombinator</a></p>

<p>[5] - <a href="https://www.linkedin.com/posts/jiten-karnani-0b572717_dumb-getting-dumber-since-its-launch-activity-7305415942346334208-fBfz?utm_source=share&amp;utm_medium=member_desktop&amp;rcm=ACoAAAIDZ7cBQXWrzkCfUjgT8Vxedx56hwZuESc&amp;trk=article-ssr-frontend-pulse_little-text-block" rel="noopener" target="_blank">Linkedin post saying "Dumb get dumber" on usage of AI tools.</a></p>

<p>[6] - <a href="https://www.linkedin.com/posts/stanpeev_we-hired-the-laziest-engineer-i-have-ever-activity-7303445074275680257-FDIB?trk=article-ssr-frontend-pulse_little-text-block" rel="noopener" target="_blank">LinkedIn Post showcasing AI Assistive Tools in negative light</a></p>

<p>[7] - <a href="https://www.youtube.com/watch?v=IACHfKmZMr8&amp;trk=article-ssr-frontend-pulse_little-text-block" rel="noopener" target="_blank">Vibe Coding Is The Future on Youtube</a></p>

<p>[8] - <a href="https://x.com/karpathy/status/1886192184808149383?trk=article-ssr-frontend-pulse_little-text-block" rel="noopener" target="_blank">Karpathy's post on X.com</a></p>

<p>What are your thoughts on the potential for perverse incentives in the age of AI? Share your perspectives in the comments!</p>

      <div style="margin-top: 24px; display: flex; gap: 12px; flex-wrap: wrap;">
        <a href="./articles/cobra-copilot-effect.html" class="btn btn-sm btn-secondary">Read Full Standalone Article ↗</a>
        <a href="https://www.linkedin.com/pulse/cobra-copilot-effect-vageesh-dwivedi-kqmoc/" target="_blank" rel="noopener" class="btn btn-sm btn-outline">Original on LinkedIn Pulse ↗</a>
      </div>
    `
  },
  'article-managers-dilemma-empathy': {
    title: "The Manager's Dilemma: Balancing Honesty, Kindness, and Empathy",
    category: "Leadership & 1:1",
    date: "February 24, 2025",
    readTime: "6 min read",
    permalink: './articles/managers-dilemma-honesty-kindness-empathy.html',
    content: `
<p>For years, I wrestled with a fundamental question: <em>Should a manager prioritize honesty or kindness in conversations?</em> I believed that being brutally honest could build trust, but sometimes, it led to discomfort. On the other hand, kindness made conversations easier, but at times, it felt like I wasn’t being fully transparent.</p>

<p>It wasn’t until recently that I realized the answer lay in neither <strong>honesty</strong> nor <strong>kindness</strong> alone. The missing piece was <strong>empathy</strong>—the ability to be both honest and kind, in a way that meets the emotional and psychological needs of the other person.</p>

<h3>The Moment of Realization</h3>

<p>Curious about how my team perceived me, I reached out to a few employees and asked: <em>"What feeling comes to mind when you think of me?"</em> One employee's response stood out:</p>

<blockquote class="w-auto"><em>"The first thing that comes to mind is your honesty in conversations. You’ve always been direct about the current state of things, without sugarcoating, which has helped me stay grounded and aware of reality."</em></blockquote>

<p>Was I truly honest? Or had I just been direct? Honesty without empathy can feel harsh. Empathy ensures that honesty is received as <strong>helpful, not hurtful</strong>. I recall one instance where aiming for directness, I bluntly pointed out flaws in an employee's proposal during a team meeting. While my intention was to be helpful and honest, the employee felt publicly criticized and demotivated. It was a clear example of honesty backfiring due to a lack of empathy.</p>

<h3>The Science of Conversations</h3>

<p>Harvard professor <strong>Alison Wood Brooks</strong> studies the psychology of conversations and developed the <strong>T.A.L.K. framework</strong>:</p>

<ul>
<li><strong>Topics</strong>: Choosing the right things to talk about.</li>
<li><strong>Asking</strong>: Engaging through meaningful questions.</li>
<li><strong>Levity</strong>: Using warmth and humor to ease tension.</li>
<li><strong>Kindness</strong>: Showing genuine care in interactions.</li>
</ul>

<p>She emphasizes the <strong>microdecision-making</strong> that happens in every conversation—small choices about <strong>when to speak, how much to share, and how to respond to emotions</strong>. These decisions determine whether a conversation builds trust or erodes it.</p>

<p>A common pitfall is <strong>"boomerasking"</strong>—where conversations become self-centered.</p>

<h3>Example of Boomerasking</h3>

<p>Imagine a manager in a one-on-one meeting with an employee:</p>

<p><strong>Employee</strong>: "I’ve been feeling overwhelmed with the new project deadlines. It’s been hard to keep up."</p>

<p><strong>Manager</strong>: "Yeah, I totally get it! Back when I was handling projects like this, I had to work late nights and weekends to stay on track. It was tough, but I managed. You’ll get through it too!"</p>

<p>Instead of acknowledging the employee’s concerns, the manager redirects the conversation to their own experience—missing an opportunity to offer real support. A more empathetic response would be:</p>

<p><strong>Manager</strong>: "That sounds really challenging. What aspects of the project are causing the most stress for you? Let’s see if we can adjust priorities or find additional resources to help."</p>

<p>Another challenge, highlighted by <strong>Rachel Greenwald</strong>, is the <strong>"zero-questioner"</strong>—someone who talks but never asks questions. This "zero-questioner" approach often stems from a lack of <strong>cognitive empathy</strong> – the failure to consider the other person's perspective and engage with their thoughts. Research also suggests that <strong>24% of the time, our minds wander during conversations</strong>, which can make people feel unheard.</p>

<p>This explained why some of my interactions felt transactional rather than meaningful. I was communicating, but was I truly connecting?</p>

<h3>The Role of Empathy in Conversations</h3>

<p>To build stronger connections, I needed to move beyond <strong>honesty</strong> and <strong>kindness</strong> and embrace <strong>empathy</strong>—a concept that involves more than just understanding feelings.</p>

<p>The <strong>Three Types of Empathy</strong>, as illustrated in the image below, highlight how real empathy works:</p>

<ol>
<li><strong>Cognitive Empathy</strong> (<em>I put myself in your shoes</em>): Understanding another person’s perspective.</li>
<li><strong>Emotional Empathy</strong> (<em>I feel WITH you</em>): Feeling the emotions they are experiencing.</li>
<li><strong>Compassionate Empathy</strong> (<em>I will stand with you, without fixing</em>): Offering support without trying to control or solve everything.</li>
</ol>

<p>To integrate this into leadership, I began responding with empathy in a four-part-approach:</p>

<ol>
<li><strong>Acknowledging emotions</strong> – "I can see that this situation has been frustrating for you."</li>
<li><strong>Demonstrating understanding</strong> – "Given what you've shared, I understand why this feels unfair."</li>
<li><strong>Validating experiences</strong> – "It makes sense that you’d feel this way given the challenges you've faced."</li>
<li><strong>Offering support</strong> – "Let’s work together to find a solution that helps you move forward."</li>
</ol>

<h3>Measuring Empathy</h3>

<p>Empathy measurement is a science in itself, and the data points involved are both important and complex. Understanding the nuances of empathy measurement is crucial for leaders because it allows for self-awareness and the refinement of empathetic approaches. There are two closely related but distinct concepts of empathy:</p>

<ol>
<li><strong>The Affective State of Empathy</strong> – This refers to an individual's personal experience of empathy. If you ask someone, <em>“Did you feel like you knew how this person felt?”</em>, you are measuring their affective state of empathy.</li>
<li><strong>The Ability to Empathize</strong> – This measures how accurately a person understands another's emotions and situation. If you assess whether <strong>Person A</strong> fully understood <strong>Person B</strong>, you are measuring their ability to empathize.</li>
</ol>

<p>While these are closely related, they are still <strong>mutually exclusive concepts</strong>. Someone can feel empathy towards another person and still be <strong>completely wrong</strong> about what the person is feeling or why. However, we would still say that they are experiencing a state of empathy.</p>

<p>This realization was a turning point for me. I might have been empathizing with someone, but was I truly understanding their experience? Until their state of mind and feelings are fully understood and acknowledged, my empathy might have been directed at something completely unrelated to their experience. My four-part approach, while well-intentioned, could fall flat if I wasn't hitting the right emotional note.</p>

<h3>Bridging the Gap: Ensuring Accurate Empathy</h3>

<p>So, how do we bridge this gap between feeling empathy and accurately understanding another person's experience? Here are some practical strategies:</p>

<ul>
<li><strong>Active Listening</strong>: Truly listen to what the other person is saying, both verbally and nonverbally. Pay attention to their tone of voice, body language, and facial expressions.</li>
<li><strong>Clarifying Questions</strong>: Don't be afraid to ask questions to ensure you're understanding correctly. So, if I understand correctly, you're feeling X because of Y?</li>
<li><strong>Reflecting</strong>: Summarize what you've heard to confirm your understanding. "It sounds like you're saying..."</li>
<li><strong>Seeking Feedback</strong>: Ask the other person if you've understood them correctly. Have I captured what you're feeling?</li>
<li><strong>Mindfulness of Bias</strong>: Be aware of your own biases and assumptions, and how they might be coloring your perception of the other person's experience.</li>
</ul>

<h3>The Leadership Shift: From Honesty vs. Kindness to Empathy</h3>

<p>Managers often struggle between being <strong>honest</strong> and being <strong>kind</strong>, but this is a false choice. Empathy allows us to be both. By understanding how conversations work, recognizing microdecisions, and practicing the <strong>Three Types of Empathy</strong>, we can create workplaces where honesty feels <strong>supportive</strong>, not <strong>harsh</strong>—and kindness feels <strong>genuine</strong>, not <strong>sugarcoated</strong>. And do measure the quality and accuracy as well as a self-reflection.</p>

<p>The next time you find yourself in a difficult conversation, ask yourself: <em>Am I just being honest, or am I being empathetically honest?</em> That small shift can transform relationships and leadership effectiveness.</p>

<p>Would love to hear your thoughts—have you experienced a moment when honesty without empathy backfired? Or when kindness without honesty led to confusion? Let’s discuss below!</p>

      <div style="margin-top: 24px; display: flex; gap: 12px; flex-wrap: wrap;">
        <a href="./articles/managers-dilemma-honesty-kindness-empathy.html" class="btn btn-sm btn-secondary">Read Full Standalone Article ↗</a>
        <a href="https://www.linkedin.com/pulse/managers-dilemma-balancing-honesty-kindness-empathy-vageesh-dwivedi-bzysc/" target="_blank" rel="noopener" class="btn btn-sm btn-outline">Original on LinkedIn Pulse ↗</a>
      </div>
    `
  },
  'article-performance-tracking-innovation': {
    title: "How We Transformed Performance Tracking with a Simple Innovation",
    category: "Agile Operations",
    date: "February 20, 2025",
    readTime: "5 min read",
    permalink: './articles/performance-tracking-innovation.html',
    content: `
<p>Everyone knows about the <a href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fcommunity%2Emis%2Etemple%2Eedu%2Fmis0855002fall2015%2Ffiles%2F2015%2F10%2FS%2EM%2EA%2ER%2ET-Way-Management-Review%2Epdf&amp;urlhash=uKTV&amp;trk=article-ssr-frontend-pulse_little-text-block" rel="noopener" target="_blank">S.M.A.R.T. goals framework</a> introduced in 1981 in paper by George T. Doran. In most organizations, goal management is tightly linked to performance management. Ideally, goals are set, cascaded top-down, and reviewed periodically. However, the reality often diverges from this simple and structured approach. Employees and managers tend to update performance evaluation systems only at the end of the appraisal cycle, leading to problems such as:</p>

<ul>
<li>Employees forget key accomplishments</li>
<li>Managerial bias towards recent events (recency effect)</li>
<li>Challenges in tracking contributions across multiple projects</li>
<li>Lack of continuous feedback, especially in remote work settings</li>
<li>Employee updates becoming overly generic, often stating “All goals on track” or as brief as “All good,” limiting the usefulness of the data collected. ()</li>
</ul>

<p>During the pandemic, these issues became more pronounced. HR teams attempted various interventions, from email reminders to leadership messaging, but engagement remained low.</p>

<h3>The Turning Point: Leveraging Microsoft Teams “Updates”</h3>

<p>While exploring Microsoft Teams, I discovered the “Updates” tool (for usage see <a href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Flearn%2Emicrosoft%2Ecom%2Fen-us%2Fmicrosoftteams%2Fmanage-updates-app&amp;urlhash=osr_&amp;trk=article-ssr-frontend-pulse_little-text-block" rel="noopener" target="_blank">Microsoft Learn</a>). Recognizing its potential, I initiated an experiment where employees filled out a simple form every month, answering six key questions:</p>

<ol>
<li><strong>Which objectives in OKRs or Epics did you work on this month?</strong> (Provide links.)</li>
<li><strong>Beyond OKRs or Epics, what else did you contribute to?</strong> (Describe results and individual contributions.)</li>
<li><strong>What was your best work highlight this month?</strong> (Explain why it stood out.)</li>
<li><strong>What was a lowlight?</strong> (Reflect on what could have been done better.)</li>
<li><strong>What unplanned work did you take on?</strong> (E.g., technical debt repayments.)</li>
<li><strong>Who had the most impact on your work this month?</strong> (Express gratitude. )</li>
</ol>

<p>There was an explicit option to write <strong>NONE</strong> for responses, which was a subtle attempt toward self-realization for employees.</p>

<p>This data was collected through a structured process:</p>

<ul>
<li>Employees submitted responses in the MS Teams “Updates” app.</li>
<li>Managers reviewed and discussed responses in a dedicated thread.</li>
<li>An Excel macro converted this data into text files for easy HR system updates. (This could be automated by powerautomate feature in office 365, if your plan allows that)</li>
<li>HR business partners were informed of this modification.</li>
</ul>

<h3>The Results: A Game-Changer for Performance Tracking</h3>

<p>This simple yet structured approach yielded phenomenal results:</p>

<ul>
<li><strong>85% adoption rate</strong>, compared to less than 30% for the HR system.</li>
<li><strong>Four key insights captured:</strong> Accomplishments, Alignment, Interruptions, and Gratitude Exchange.</li>
<li><strong>Real-time tracking:</strong> Managers could see timeseries and aggregate trends.</li>
<li><strong>Improved decision-making:</strong> Managers had better visibility into team performance, blockers, and enablers.</li>
</ul>

<p>Upon the success of this experiment, the process was shared with other teams for review and potential adoption, highlighting the benefits and observed results.</p>

<h3>Important Caveat</h3>

<p>The claim here is not that this process is the best performance measurement tool. There are much more sophisticated tools like <a href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fjellyfish%2Eco%2F&amp;urlhash=mIKN&amp;trk=article-ssr-frontend-pulse_little-text-block" rel="noopener" target="_blank">Jellyfish</a>, <a href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Flinearb%2Eio%2F&amp;urlhash=IBEL&amp;trk=article-ssr-frontend-pulse_little-text-block" rel="noopener" target="_blank">Linear8</a>, <a href="https://www.linkedin.com/redir/redirect?url=http%3A%2F%2FFaros%2Eai&amp;urlhash=VtBt&amp;trk=article-ssr-frontend-pulse_little-text-block" rel="noopener" target="_blank">Faros.ai</a>, <a href="https://www.linkedin.com/redir/redirect?url=http%3A%2F%2Fsleuth%2Eio&amp;urlhash=xQuv&amp;trk=article-ssr-frontend-pulse_little-text-block" rel="noopener" target="_blank">sleuth.io</a>, <a href="https://www.linkedin.com/redir/redirect?url=http%3A%2F%2Fgetdx%2Ecom&amp;urlhash=eEZf&amp;trk=article-ssr-frontend-pulse_little-text-block" rel="noopener" target="_blank">DX</a> and frameworks like DORA and SPACE (Detailed article at <a href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fnewsletter%2Epragmaticengineer%2Ecom%2Fp%2Fdeveloper-productivity-with-dr-nicole&amp;urlhash=202D&amp;trk=article-ssr-frontend-pulse_little-text-block" rel="noopener" target="_blank">pragmatic engineer</a> blog). However, for teams looking for a lightweight, easy-to-implement solution, this approach proved to be highly effective.</p>

<h3>Key Takeaways</h3>

<p>✅ <strong>Continuous feedback beats last-minute evaluations</strong> – Frequent updates prevent recency bias and forgotten achievements.</p>

<p>✅ <strong>Simplicity drives adoption</strong> – A user-friendly process encourages participation.</p>

<p>✅ <strong>Technology can solve process inefficiencies</strong> – Leveraging existing tools reduces manual workload.</p>

<p>✅ <strong>Recognition matters</strong> – Highlighting individual and team contributions fosters a positive culture.</p>

<p>✅ <strong>Data-driven insights improve management</strong> – Regular tracking helps align goals and address challenges proactively.</p>

<p>By leveraging an existing tool in a new way, we enhanced performance tracking with minimal disruption. Sometimes, innovation isn’t about reinventing the wheel—it’s about using what you already have, but more effectively.</p>

      <div style="margin-top: 24px; display: flex; gap: 12px; flex-wrap: wrap;">
        <a href="./articles/performance-tracking-innovation.html" class="btn btn-sm btn-secondary">Read Full Standalone Article ↗</a>
        <a href="https://www.linkedin.com/pulse/how-we-transformed-performance-tracking-simple-vageesh-dwivedi-lmvsc/" target="_blank" rel="noopener" class="btn btn-sm btn-outline">Original on LinkedIn Pulse ↗</a>
      </div>
    `
  },
  'article-standardized-competency-journey': {
    title: "Establishing a Standardized Competency Matrix: A First-Time Manager\u2019s Journey",
    category: "Career Standards",
    date: "February 19, 2025",
    readTime: "4 min read",
    permalink: './articles/establishing-standardized-competency-matrix.html',
    content: `
<p>When I stepped into my role as a first-time manager, I quickly noticed a significant challenge—our competency matrix was tailored to specific business functions and teams. This inconsistency led to issues in hiring quality, unclear expectations for employees, and challenges in performance evaluations.</p>

<p>After participating in two appraisal cycles and the associated calibration meetings, I became convinced that our organization needed to invest in normalizing and aligning the competency matrix. Around the same time, HR had launched a project to standardize engineering levels across the organization, presenting the perfect opportunity to drive this initiative.</p>

<p>Working closely with my leadership and peers, who showed trust in me by not only listening to my concerns but also acting on them. Rather than creating the entire framework myself or by one person, we collaborated among leaders. We paired up, each team taking ownership of one or two engineering levels to draft proposals. These drafts were refined, versioned, and eventually handed over to HR for integration into official processes.</p>

<h3>The impact was significant:</h3>

<ul>
<li><strong>Easier Team Mobility</strong>: Employees found it easier to move between teams as hiring, operational, and performance measurements were normalized.</li>
<li><strong>Consistent Hiring</strong>: Ensured uniform hiring standards regardless of changes in managers or talent acquisition personnel.</li>
<li><strong>Clear Expectations</strong>: Employees gained better clarity about their roles and expected competencies at each level.</li>
<li><strong>Objective Performance Evaluations</strong>: Calibration meetings became more structured and data-driven.</li>
</ul>

<h3>Key Takeaways:</h3>

<p>✅ Collaboration is key—engaging stakeholders leads to better buy-in and implementation.</p>

<p>✅ Listening to signals from employees fosters trust and drives meaningful change.</p>

<p>✅ Identifying pain points early helps in designing effective long-term solutions.</p>

<p>✅ Standardization improves hiring, performance evaluation, and employee growth.</p>

<p>✅ Leveraging existing organizational initiatives can enhance the success of new projects.</p>

<p>This experience reinforced the value of cross-functional collaboration and proactive leadership in driving organizational improvements. Have you worked on similar initiatives to bring alignment to your organization? I’d love to hear your thoughts!</p>

<p><strong>General note:</strong> I have been a huge follower of <a href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fhandbook%2Egitlab%2Ecom%2F&amp;urlhash=tcrJ&amp;trk=article-ssr-frontend-pulse_little-text-block" rel="noopener" target="_blank">GitLab's handbook</a>, a public document outlining how the entire organization operates vertically and horizontally. Very few companies follow such a level of transparency—<a href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fbasecamp%2Ecom%2Fhandbook&amp;urlhash=2EI-&amp;trk=article-ssr-frontend-pulse_little-text-block" rel="noopener" target="_blank">37signals</a> and <a href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fposthog%2Ecom%2Fhandbook&amp;urlhash=IhgC&amp;trk=article-ssr-frontend-pulse_little-text-block" rel="noopener" target="_blank">PostHog</a> are a few other notable examples.</p>

      <div style="margin-top: 24px; display: flex; gap: 12px; flex-wrap: wrap;">
        <a href="./articles/establishing-standardized-competency-matrix.html" class="btn btn-sm btn-secondary">Read Full Standalone Article ↗</a>
        <a href="https://www.linkedin.com/pulse/establishing-standardized-competency-matrix-managers-journey-dwivedi-gdf1c" target="_blank" rel="noopener" class="btn btn-sm btn-outline">Original on LinkedIn Pulse ↗</a>
      </div>
    `
  },
  'article-sales-call-career-opportunity': {
    title: "Sales Call turned into a Career Opportunity",
    category: "Career Strategy",
    date: "February 19, 2025",
    readTime: "3 min read",
    permalink: './articles/sales-call-career-opportunity.html',
    content: `
<p>Today, I had an unexpected yet insightful experience that reinforced the importance of adaptability and leveraging every interaction as an opportunity.</p>

<p>I received a call from a sales executive at LambdaTest. They had reached out, assuming I could influence my prior employer to consider their product. However, they weren’t aware that I was no longer with that company. Instead of ending the conversation abruptly, I decided to engage with the sales exec and share my past experience working with LambdaTest.</p>

<p>Back in 2022, I conducted a POC with them, collaborating with three of their team members on highly complex and specific use cases. I recalled their dedication to problem-solving and commitment to customer success. As the conversation progressed, I built a rapport with the sales executive.</p>

<p>I casually shared that I am currently exploring new opportunities and would love to help LambdaTest in any way possible. I proposed a few ideas:</p>

<ul>
<li>Acting as a third-party expert during their sales pitches to articulate the complexity of the use cases we worked on and highlight their problem-solving capabilities—essentially an enterprise sales affiliate approach.</li>
<li>Exploring full-time engineering roles in the U.S. if they had any openings.</li>
</ul>

<p>The response was overwhelmingly positive. The sales executive shared that this was one of the most engaging conversations they had that day, or perhaps even that week. They assured me that they would introduce me to their talent acquisition lead.</p>

<p>The entire conversation lasted just 10 minutes, but in that short span, I had unknowingly transformed a routine sales call into a self-recruitment opportunity. This experience left me amazed at the power of proactive engagement and strategic positioning.</p>

<h3>Key Takeaways:</h3>

<p>✅ Every conversation is an opportunity—stay open and adaptable.</p>

<p>✅ Build connections before making your ask.</p>

<p>✅ Leverage past experiences to create value in unexpected ways.</p>

<p>✅ Be direct about your career aspirations—you never know where it may lead!</p>

<p>Have you ever turned an unexpected conversation into an opportunity? I’d love to hear your experiences!</p>

      <div style="margin-top: 24px; display: flex; gap: 12px; flex-wrap: wrap;">
        <a href="./articles/sales-call-career-opportunity.html" class="btn btn-sm btn-secondary">Read Full Standalone Article ↗</a>
        <a href="https://www.linkedin.com/pulse/sales-call-turned-career-opportunity-vageesh-dwivedi-ntvdc/" target="_blank" rel="noopener" class="btn btn-sm btn-outline">Original on LinkedIn Pulse ↗</a>
      </div>
    `
  },
  'article-fickleness-requirements-design': {
    title: "Fickleness of Requirements and Travesty of Software Design",
    category: "System Design",
    date: "February 18, 2025",
    readTime: "4 min read",
    permalink: './articles/fickleness-requirements-travesty-design.html',
    content: `
<p>Software design is a battlefield of changing requirements, stakeholder expectations, and the constant pressure to deliver on time. Engineers and architects often find themselves caught in an endless cycle of iteration, refactoring, and, at times, complete redesigns. But is this an unavoidable reality of the industry, or a failure in how we approach software design?</p>

<h3>Fickleness of Requirements</h3>

<p>In an ideal world, requirements would be well-defined, stable, and perfectly aligned with business needs. The reality, however, is not always a rosy journey. Requirements shift due to evolving market conditions, changing business priorities, and, quite often, the inability of stakeholders to articulate their needs upfront. Agile methodologies attempt to accommodate this by promoting iterative development, but even Agile cannot fully shield teams from the chaos of changing objectives.</p>

<p>Frequent changes in requirements often lead to technical debt, rushed implementations, and a loss of design integrity. What starts as a well-structured system can quickly devolve into a fragile, tangled mess as developers scramble to retrofit new functionalities into an architecture that was never designed to support them.</p>

<h3>Travesty of Software Design</h3>

<p>When faced with rapidly changing requirements, some teams abandon structured design principles altogether, leading to what can only be described as a travesty of software design. Instead of a well-thought-out, scalable system, they end up with a patchwork of ad-hoc fixes and workarounds. The result? Codebases that are difficult to maintain, expensive to modify, and prone to failure.</p>

<p>This travesty is not merely a technical issue—it has business implications as well. Poorly designed software slows down development velocity, increases operational costs, and ultimately hampers a company’s ability to innovate.</p>

<h3>Role of Confirmation Bias</h3>

<p>Another critical factor exacerbating poor software design is confirmation bias. Teams often become overly attached to initial design decisions, dismissing evidence that suggests a need for change. Developers and stakeholders alike may resist reevaluating architectural choices, favoring solutions that confirm their pre-existing beliefs rather than objectively analyzing the best approach. This cognitive bias leads to rigidity, preventing systems from adapting efficiently to evolving requirements and business needs.</p>

<h3>A Definitive Takeaway: Design for Change, Not Perfection</h3>

<p>If changing requirements are an unavoidable reality, then software design must adapt. Instead of resisting change, teams must embrace it by designing systems with flexibility in mind. Here are key principles to mitigate the impact of evolving requirements:</p>

<ol>
<li><strong>Modular Architecture</strong> – Design components to be loosely coupled and highly cohesive. This allows for isolated changes without breaking the entire system.</li>
<li><strong>Domain-Driven Design</strong> – Align software structure with business domains to create a system that can evolve with business needs rather than against them.</li>
<li><strong>Continuous Refactoring</strong> – Encourage a culture of refactoring as an ongoing process rather than an afterthought.</li>
<li><strong>Automated Testing</strong> – Ensure that changes do not introduce regressions by investing in robust testing strategies.</li>
<li><strong>Explicit Trade-offs</strong> – Recognize that no design is perfect. Make conscious trade-offs based on expected future changes rather than theoretical ideals.</li>
<li><strong>Awareness of Confirmation Bias</strong> – Cultivate a mindset of adaptability by challenging assumptions and being open to alternative solutions when requirements shift.</li>
</ol>

<p>The fickleness of requirements does not have to lead to the travesty of software design. By acknowledging change as a fundamental characteristic of software development and designing for it, we can create systems that remain resilient, maintainable, and adaptable in the face of uncertainty.</p>

<p>My inspiration to write this article came from a related YouTube playlist. Thanks, Markus in assimilating a playlist.</p>

      <div style="margin-top: 24px; display: flex; gap: 12px; flex-wrap: wrap;">
        <a href="./articles/fickleness-requirements-travesty-design.html" class="btn btn-sm btn-secondary">Read Full Standalone Article ↗</a>
        <a href="https://www.linkedin.com/pulse/fickleness-requirements-travesty-software-design-vageesh-dwivedi-l8xxc" target="_blank" rel="noopener" class="btn btn-sm btn-outline">Original on LinkedIn Pulse ↗</a>
      </div>
    `
  },
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
