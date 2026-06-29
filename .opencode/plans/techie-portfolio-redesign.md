# Techie Portfolio Redesign — Implementation Plan

## Overview
Rebuild the personal homepage with a modern dark-techie theme, fin animations, responsive layout, and data-driven content that's easy to extend.

---

## Files to Create/Modify

### 1. `package.json` — Build tooling
```json
{
  "name": "lalit-saini",
  "private": true,
  "scripts": {
    "build-css": "sass sass/style.scss css/style.css --style compressed",
    "watch-css": "sass --watch sass/style.scss:css/style.css"
  },
  "devDependencies": {
    "sass": "^1.77.0"
  }
}
```

### 2. `js/data.js` — All extensible content
Single `portfolioData` object with arrays:
- `skills[]` — `{ name, icon, level, category }` — 6 skills
- `timeline[]` — `{ type: "education"|"experience", date, title, subtitle, description }` — 9 entries (merge education + experience chronologically)
- `projects[]` — `{ title, tech, description, link, image }` — 4 projects
- `blogs[]` — `{ title, date, category, link, image, summary }` — 3 entries
- `social` — object with github, linkedin, facebook, instagram URLs
- `contact` — `{ email }`

To add a timeline entry, skill, project, or blog → append to the array. No HTML changes needed.

### 3. `js/main.js` — Vanilla JS
No jQuery. Pure vanilla JS on `DOMContentLoaded`:
- **renderSkills(data)** — generates skill cards grid from `portfolioData.skills`
- **renderTimeline(data)** — generates animated timeline from `portfolioData.timeline`
- **renderProjects(data)** — generates project cards with hover overlays
- **renderBlogs(data)** — generates blog cards
- **initTypewriter()** — typing effect on hero tagline
- **initNav()** — hamburger toggle on mobile, active section highlighting via IntersectionObserver
- **initScrollAnimations()** — IntersectionObserver that adds `.revealed` class for CSS fade-in-up/slide animations
- **initSmoothScroll()** — `scrollIntoView({ behavior: 'smooth' })` for anchor links

### 4. `sass/style.scss` — Full SCSS (dark techie theme)
Architecture (in order):

```
1. Imports (Google Fonts: Inter, JetBrains Mono)

2. SCSS Variables
   $bg-primary: #0a0a0a
   $bg-card: #111827
   $bg-elevated: #1f2937
   $text: #e5e7eb
   $text-muted: #9ca3af
   $accent: #00d4ff
   $accent-purple: #7c3aed
   $accent-green: #10b981
   $font-sans: 'Inter', sans-serif
   $font-mono: 'JetBrains Mono', monospace

3. Reset & Base
   - box-sizing, margin/padding reset
   - body: dark bg, light text, smooth font rendering
   - selection: accent bg
   - scrollbar styling (thin, dark)

4. Typography
   h1-h6 styles, link styles with accent underline
   .code, .tagline classes using mono font

5. Layout
   .container (max-width: 1200px, padding: 0 24px, centered)
   .section (padding: 100px 0, border-bottom: 1px solid rgba(255,255,255,0.05))
   .grid-2, .grid-3 (CSS Grid with 1fr columns, responsive)
   .grid-2 { grid-template-columns: repeat(2, 1fr) }
   .grid-3 { grid-template-columns: repeat(3, 1fr) }
   @media (max-width: 768px) → single column

6. Navigation (`.nav`)
   Position: fixed, top: 0, z-index: 1000
   Background: rgba(10,10,10,0.8) with backdrop-filter: blur(12px)
   Flex: logo left, links right
   .nav__toggle — hidden on desktop (display: none)
   .nav__links a — uppercase, small font, accent hover
   Mobile (≤768px):
     - nav height: 60px
     - .nav__toggle: visible (hamburger icon)
     - .nav__links: hidden by default, shown when .nav--open
     - Full-screen overlay style menu

7. Hero Section (`#hero`)
   min-height: 100vh, flex center
   Background: radial gradient + subtle animated grid pattern (CSS)
   Profile photo: 150px, circular, border: 3px solid $accent, glow
   h1: large, bold, white
   .tagline: typing animation (cursor blink via CSS)
   Social links row with hover scale
   CV button with accent border + glow
   Scroll indicator (animated bouncing arrow) at bottom

8. About Section (`#about`)
   Flex layout: 2 columns on desktop, stacked on mobile
   Left: profile info
   Right: bio text
   3 interest cards below — each has colored border-top (accent/purple/green)
   Cards have hover lift effect

9. Skills Section (`#skills`)
   .skill-card grid (3 cols desktop, 2 cols tablet, 1 col mobile)
   Each card: icon image (40px) + name + category + progress bar
   Progress bar: fills on scroll (width animated via CSS transition)
   Staggered animation delay (0.1s per card)

10. Timeline Section (`#timeline`)
    Vertical line centered or 30px from left
    .timeline-entry — alternating left/right on desktop (odd: left, even: right)
    On mobile: all entries on the right
    Each entry:
      - .timeline-dot (colored circle — blue for education, orange for experience)
      - .timeline-card with date badge, title, subtitle, description
      - Slide-in animation from left/right on scroll
    .timeline-entry.begin — empty entry for terminating line

11. Projects Section (`#projects`)
    2×2 grid (2 cols desktop, 1 col mobile)
    .project-card:
      - Background image, 280px height, cover
      - Gradient overlay (dark to transparent)
      - Title + tech tag + description on hover
      - GitHub link icon in top-right
      - Scale transform on hover

12. Blog Section (`#blog`)
    3 cols desktop, 2 cols tablet, 1 col mobile
    .blog-card:
      - Image top (zoom on hover)
      - Date + category tags
      - Title (link)
      - Summary text
      - Subtle border + shadow

13. Contact Section (`#contact`)
    Center-aligned
    Email link with mail icon, large
    Social icon row (icomoon)
    Footer: © year + tagline

14. Animations & Utilities
    .reveal { opacity: 0; transform: translateY(30px); transition: 0.6s ease }
    .revealed { opacity: 1; transform: translateY(0) }
    
    @keyframes fadeInUp — from opacity:0, translateY(40px) to normal
    @keyframes typewriter — width from 0 to 100%
    @keyframes blink — cursor blink
    @keyframes bounce — scroll indicator

    Staggered classes: .delay-1 through .delay-6 (transition-delay: 0.1s * n)

15. Responsive Breakpoints
    @media (max-width: 768px): mobile
    @media (max-width: 1024px): tablet
    @media (min-width: 1025px): desktop
```

### 5. `index.html` — Complete rewrite

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lalit Saini — Techie Portfolio</title>
  <meta name="description" content="Lalit Saini — Electrical Engineer, Developer & ML Enthusiast at IIT Bombay">
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  
  <!-- Icomoon Icons -->
  <link rel="stylesheet" href="css/icomoon.css">
  
  <!-- Compiled SCSS -->
  <link rel="stylesheet" href="css/style.css">
  
  <!-- Data + Main JS (deferred) -->
  <script src="js/data.js" defer></script>
  <script src="js/main.js" defer></script>
</head>
<body>

  <!-- === NAVIGATION === -->
  <nav class="nav" id="navbar">
    <div class="container nav__inner">
      <a href="#hero" class="nav__logo">Lalit Saini</a>
      <button class="nav__toggle" id="navToggle" aria-label="Toggle navigation">
        <span></span><span></span><span></span>
      </button>
      <div class="nav__links" id="navLinks">
        <a href="#about">About</a>
        <a href="#skills">Skills</a>
        <a href="#timeline">Timeline</a>
        <a href="#projects">Projects</a>
        <a href="#blog">Blog</a>
        <a href="#contact">Contact</a>
        <a href="180070030New.pdf" target="_blank" class="nav__cv">CV</a>
      </div>
    </div>
  </nav>

  <!-- === HERO === -->
  <section id="hero">
    <div class="hero__bg"></div>
    <div class="container hero__content">
      <div class="hero__photo">
        <img src="images/resi.png" alt="Lalit Saini">
      </div>
      <p class="hero__greeting">Hi, my name is</p>
      <h1>Lalit Saini</h1>
      <p class="hero__tagline" id="tagline"></p>
      <p class="hero__desc">
        Electrical Engineer by study, coder by heart.<br>
        Machine Learning · Deep Learning · Automation
      </p>
      <div class="hero__social">
        <a href="https://github.com/codeLAlit/" target="_blank" aria-label="GitHub"><i class="icon-github"></i></a>
        <a href="https://www.linkedin.com/in/lalit-saini-553b35192/" target="_blank" aria-label="LinkedIn"><i class="icon-linkedin2"></i></a>
        <a href="https://www.facebook.com/profile.php?id=100034740338121" target="_blank" aria-label="Facebook"><i class="icon-facebook2"></i></a>
        <a href="https://www.instagram.com/_lalitsaini" target="_blank" aria-label="Instagram"><i class="icon-instagram"></i></a>
      </div>
      <a href="180070030New.pdf" target="_blank" class="btn btn--primary">Download CV</a>
    </div>
    <div class="scroll-indicator">
      <span></span><span></span><span></span>
    </div>
  </section>

  <!-- === ABOUT === -->
  <section id="about" class="section">
    <div class="container">
      <div class="section__header reveal">
        <span class="section__number">01.</span>
        <h2>About Me</h2>
      </div>
      <div class="about__grid">
        <div class="about__info reveal">
          <p><strong>Hi I'm Lalit Saini.</strong> I am Electrical Engineer by study but a coder by heart. I am mainly interested in Machine Learning, Deep Learning and their applications. I am also interested in automating stuff using python. In Electrical field I would like to work in automation.</p>
          <p>Apart from this I am a good sportsman. I play cricket, table tennis, badminton, pool and e-games. Music is my escape and I am fond of comedy. I think myself as budding standup comedian too. I am a MCU follower and like only batman from DC Universe.</p>
        </div>
        <div class="about__photo reveal">
          <div class="about__photo-frame">
            <img src="images/resi.png" alt="Lalit Saini">
          </div>
          <div class="about__status">
            <span class="status-dot"></span>
            Second Year Undergraduate · Electrical Engineering · IIT Bombay
          </div>
        </div>
      </div>
      <div class="about__interests">
        <div class="interest-card reveal" style="--card-accent: var(--accent)">
          <span class="interest-card__icon"><i class="icon-layers2"></i></span>
          <h3>Deep Learning</h3>
          <p>Building neural networks and exploring AI applications</p>
        </div>
        <div class="interest-card reveal" style="--card-accent: var(--accent-purple)">
          <span class="interest-card__icon"><i class="icon-data"></i></span>
          <h3>Software</h3>
          <p>Crafting clean, efficient solutions with code</p>
        </div>
        <div class="interest-card reveal" style="--card-accent: var(--accent-green)">
          <span class="interest-card__icon"><i class="icon-phone3"></i></span>
          <h3>Application</h3>
          <p>Building apps that solve real-world problems</p>
        </div>
      </div>
    </div>
  </section>

  <!-- === SKILLS === -->
  <section id="skills" class="section">
    <div class="container">
      <div class="section__header reveal">
        <span class="section__number">02.</span>
        <h2>Skills & Technologies</h2>
      </div>
      <div class="grid-3" id="skillsGrid"></div>
    </div>
  </section>

  <!-- === TIMELINE === -->
  <section id="timeline" class="section">
    <div class="container">
      <div class="section__header reveal">
        <span class="section__number">03.</span>
        <h2>Timeline</h2>
        <p>Education & Experience</p>
      </div>
      <div class="timeline" id="timelineContainer"></div>
    </div>
  </section>

  <!-- === PROJECTS === -->
  <section id="projects" class="section">
    <div class="container">
      <div class="section__header reveal">
        <span class="section__number">04.</span>
        <h2>Projects</h2>
        <p>Click on a project title to view the repository</p>
      </div>
      <div class="grid-2" id="projectsGrid"></div>
    </div>
  </section>

  <!-- === BLOG === -->
  <section id="blog" class="section">
    <div class="container">
      <div class="section__header reveal">
        <span class="section__number">05.</span>
        <h2>Blog</h2>
      </div>
      <div class="grid-3" id="blogGrid"></div>
    </div>
  </section>

  <!-- === CONTACT === -->
  <section id="contact" class="section">
    <div class="container">
      <div class="section__header reveal">
        <span class="section__number">06.</span>
        <h2>Get in Touch</h2>
      </div>
      <div class="contact__content reveal">
        <p>Have a project, idea, or just want to say hi?</p>
        <a href="mailto:lalitpsaini@gmail.com" class="contact__email">
          <i class="icon-mail"></i> lalitpsaini@gmail.com
        </a>
        <div class="contact__social">
          <a href="https://github.com/codeLAlit/" target="_blank" aria-label="GitHub"><i class="icon-github"></i></a>
          <a href="https://www.linkedin.com/in/lalit-saini-553b35192/" target="_blank" aria-label="LinkedIn"><i class="icon-linkedin2"></i></a>
          <a href="https://www.facebook.com/profile.php?id=100034740338121" target="_blank" aria-label="Facebook"><i class="icon-facebook2"></i></a>
          <a href="https://www.instagram.com/_lalitsaini" target="_blank" aria-label="Instagram"><i class="icon-instagram"></i></a>
        </div>
      </div>
    </div>
    <footer class="footer">
      <p>&copy; <span id="year"></span> Lalit Saini. Built with <i class="icon-heart"></i></p>
    </footer>
  </section>

</body>
</html>
```

### 6. `css/style.css` — Generated by SASS compile

Compile command: `npx sass sass/style.scss css/style.css --style compressed`

---

## Files to Delete

Run these commands after creating all new files:

```bash
# JS files to delete
rm js/jquery.min.js js/jquery.easing.1.3.js js/bootstrap.min.js
rm js/jquery.waypoints.min.js js/jquery.flexslider-min.js
rm js/owl.carousel.min.js js/jquery.countTo.js
rm js/respond.min.js js/google_map.js js/modernizr-2.6.2.min.js

# CSS files to delete (keep icomoon.css)
rm css/animate.css css/bootstrap.css css/bootstrap.css.map css/flexslider.css
rm css/owl.carousel.min.css css/owl.theme.default.min.css
rm css/style.css.map 2>/dev/null

# SASS Bootstrap files to delete
rm -rf sass/bootstrap/
rm sass/bootstrap.scss sass/_bootstrap-compass.scss sass/_bootstrap-mincer.scss sass/_bootstrap-sprockets.scss

# Prepros config
rm prepros-6.config

# Blog CSS (replaced by inline)
rm blogs/blogs.css

# Remove sass-cache
rm -rf .sass-cache/ .jekyll-cache/
```

---

## Content Preservation Checklist

All content from the original site preserved:
- ✅ Full about bio (EE IITB, coder by heart, ML/DL, Python automation, sports, comedy, MCU)
- ✅ 6 skills with images (C++, Python, HTML/CSS, TensorFlow, OpenCV, Android Studio)
- ✅ 4 education entries (B.Tech EE IITB, CV cert, ML cert, High School)
- ✅ 5 experience entries (IDfy, TA IITB, Mood Indigo, EESA, WnCC)
- ✅ 4 projects + descriptions + GitHub links (MIA, Super-Resolution, FAS, ML Gym)
- ✅ 2 blog posts + placeholder (CTF Tools, CSEC Writeups, Coming Soon)
- ✅ Social links (Facebook, GitHub, Instagram, LinkedIn)
- ✅ CV download link
- ✅ Contact email
- ✅ Profile photo

---

## How to Add Content Later

| Content | Where to Edit |
|---|---|
| New skill | Add object to `portfolioData.skills` in `js/data.js` |
| New job/education | Add object to `portfolioData.timeline` in `js/data.js` |
| New project | Add object to `portfolioData.projects` in `js/data.js` |
| New blog post | Add object to `portfolioData.blogs` in `js/data.js` |
| Changed social links | Update `portfolioData.social` in `js/data.js` |
| Changed email | Update `portfolioData.contact.email` in `js/data.js` |

No HTML changes required for timeline, skills, projects, or blog additions.

---

## Execution Order

1. Write `package.json`
2. Write `js/data.js`
3. Write `js/main.js`
4. Write `sass/style.scss`
5. Write `index.html`
6. Delete unused files (step 6 in the delete list)
7. Run `npm install && npm run build-css`
8. Test by opening `index.html` in a browser
