import "./Home.css";

export function Home() {
  return (
    <>
      <title>Home</title>
      <main>
        <section className="hero">
          <div className="container">
            <div className="crumbs mb-5">
              <span>FW—26</span>
              <span className="sep">/</span>
              <span>VOL. 04</span>
              <span className="sep">/</span>
              <span style={{ color: "var(--accent)" }}>● Live</span>
            </div>
            <div className="hero-grid">
              <div>
                <h1>
                  Considered <em>electronics</em>
                  <br />
                  for the <span className="signal">signal</span>
                  <br />
                  over the noise.
                </h1>
                <p className="hero-sub mt-6">
                  A small catalogue of audio, input devices, and ambient
                  hardware — chosen for build quality, repairability, and a long
                  second life.
                </p>
                <div className="hero-actions">
                  <a className="btn btn-primary btn-lg" href="catalog.html">
                    Browse the catalog
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                  <a className="btn btn-secondary btn-lg" href="#new">
                    What's new
                  </a>
                </div>
                <div className="hero-meta">
                  <div className="hero-meta-item">
                    <div className="num">142</div>
                    <div className="lbl">Products in stock</div>
                  </div>
                  <div className="hero-meta-item">
                    <div className="num">9</div>
                    <div className="lbl">Active categories</div>
                  </div>
                  <div className="hero-meta-item">
                    <div className="num">2—5 d</div>
                    <div className="lbl">Avg. shipping window</div>
                  </div>
                  <div className="hero-meta-item">
                    <div className="num">30 d</div>
                    <div className="lbl">No-questions returns</div>
                  </div>
                </div>
              </div>
              <div className="feature-card">
                <div className="head">
                  <span className="mono">FEATURE / 001</span>
                  <span className="mono">SKU—A4-IVO</span>
                </div>
                <div className="glyph-wrap">
                  <div className="ring"></div>
                  <div className="glyph">○</div>
                </div>
                <div className="info">
                  <div
                    className="mono"
                    style={{ color: "rgba(255,255,255,.55)" }}
                  >
                    — New release · Audio
                  </div>
                  <div className="title">Aperture A4 Open-Back Headphones</div>
                  <div
                    className="mono"
                    style={{ color: "rgba(255,255,255,.55)" }}
                  >
                    Ivory · 320 g · 38 Ω
                  </div>
                </div>
                <div className="price-row">
                  <span className="price">$ 489.00 USD</span>
                  <a className="cta" href="product.html">
                    Read more
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="marquee">
          <div className="container">
            <div className="marquee-track">
              <span>
                <span className="dot">●</span> &nbsp; FREE SHIPPING OVER $80
              </span>
              <span>
                <span className="dot">●</span> &nbsp; LIFETIME REPAIR PROGRAM
              </span>
              <span>
                <span className="dot">●</span> &nbsp; CARBON-NEUTRAL FULFILLMENT
              </span>
              <span>
                <span className="dot">●</span> &nbsp; 30-DAY RETURNS, NO
                QUESTIONS
              </span>
              <span>
                <span className="dot">●</span> &nbsp; HANDPICKED FROM 14 STUDIOS
              </span>
            </div>
          </div>
        </div>

        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow">§ 01 — Browse by category</div>
                <h2 className="h-2">
                  Nine families.{" "}
                  <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                    One catalogue.
                  </span>
                </h2>
              </div>
              <a href="catalog.html" className="meta-link">
                See all categories
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
            <div className="cat-grid">
              <a href="catalog.html" className="cat-tile">
                <div className="row between">
                  <span className="num">01</span>
                  <span className="arrow">↗</span>
                </div>
                <div className="mark">⌥</div>
                <div>
                  <div className="label">
                    Audio &amp;
                    <br />
                    Headphones
                  </div>
                  <div className="count mt-2">38 items</div>
                </div>
              </a>
              <a href="catalog.html" className="cat-tile">
                <div className="row between">
                  <span className="num">02</span>
                  <span className="arrow">↗</span>
                </div>
                <div className="mark">⌘</div>
                <div>
                  <div className="label">
                    Keyboards &amp;
                    <br />
                    Input
                  </div>
                  <div className="count mt-2">22 items</div>
                </div>
              </a>
              <a href="catalog.html" className="cat-tile">
                <div className="row between">
                  <span className="num">03</span>
                  <span className="arrow">↗</span>
                </div>
                <div className="mark">◐</div>
                <div>
                  <div className="label">
                    Cameras &amp;
                    <br />
                    Optics
                  </div>
                  <div className="count mt-2">14 items</div>
                </div>
              </a>
              <a href="catalog.html" className="cat-tile">
                <div className="row between">
                  <span className="num">04</span>
                  <span className="arrow">↗</span>
                </div>
                <div className="mark">◉</div>
                <div>
                  <div className="label">
                    Speakers &amp;
                    <br />
                    Ambient
                  </div>
                  <div className="count mt-2">19 items</div>
                </div>
              </a>
              <a href="catalog.html" className="cat-tile">
                <div className="row between">
                  <span className="num">05</span>
                  <span className="arrow">↗</span>
                </div>
                <div className="mark">▢</div>
                <div>
                  <div className="label">Displays</div>
                  <div className="count mt-2">11 items</div>
                </div>
              </a>
              <a href="catalog.html" className="cat-tile">
                <div className="row between">
                  <span className="num">06</span>
                  <span className="arrow">↗</span>
                </div>
                <div className="mark">◇</div>
                <div>
                  <div className="label">Lighting</div>
                  <div className="count mt-2">9 items</div>
                </div>
              </a>
              <a href="catalog.html" className="cat-tile">
                <div className="row between">
                  <span className="num">07</span>
                  <span className="arrow">↗</span>
                </div>
                <div className="mark">∞</div>
                <div>
                  <div className="label">
                    Cables &amp;
                    <br />
                    Power
                  </div>
                  <div className="count mt-2">21 items</div>
                </div>
              </a>
              <a href="catalog.html" className="cat-tile">
                <div className="row between">
                  <span className="num">08</span>
                  <span className="arrow">↗</span>
                </div>
                <div className="mark">+</div>
                <div>
                  <div className="label">Accessories</div>
                  <div className="count mt-2">8 items</div>
                </div>
              </a>
            </div>
          </div>
        </section>

        <section className="section" id="new">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow">§ 02 — New this week</div>
                <h2 className="h-2">Fresh on the shelves.</h2>
              </div>
              <div className="pill-row">
                <button className="pill is-active">All</button>
                <button className="pill">Audio</button>
                <button className="pill">Input</button>
                <button className="pill">Optics</button>
                <button className="pill">Ambient</button>
              </div>
            </div>
            <div className="product-grid">
              <a href="product.html" className="product-card">
                <div className="thumb thumb-paper">
                  <span className="thumb-label">A—001</span>
                  <span className="thumb-label-r">NEW</span>
                  <span className="glyph">⌥</span>
                </div>
                <div>
                  <div className="sub">Audio · Aperture Studio</div>
                  <div className="meta mt-1">
                    <span className="name">Aperture A4 Open-Back</span>
                    <span className="price">$489</span>
                  </div>
                </div>
              </a>

              <a href="product.html" className="product-card">
                <div className="thumb thumb-ink">
                  <span
                    className="thumb-label"
                    style={{ color: "rgba(255,255,255,.6)" }}
                  >
                    K—014
                  </span>
                  <span
                    className="thumb-label-r"
                    style={{ color: "rgba(255,255,255,.6)" }}
                  >
                    ●
                  </span>
                  <span className="glyph" style={{ color: "white" }}>
                    ⌘
                  </span>
                </div>
                <div>
                  <div className="sub">Input · Linework</div>
                  <div className="meta mt-1">
                    <span className="name">Linework 65 Compact</span>
                    <span className="price">$245</span>
                  </div>
                </div>
              </a>

              <a href="product.html" className="product-card">
                <div className="thumb thumb-sand">
                  <span className="thumb-label">L—007</span>
                  <span className="thumb-label-r">LOW</span>
                  <span className="glyph">◇</span>
                </div>
                <div>
                  <div className="sub">Lighting · Demi Studio</div>
                  <div className="meta mt-1">
                    <span className="name">Demi Desk Lamp 02</span>
                    <span className="price">$179</span>
                  </div>
                </div>
              </a>

              <a href="product.html" className="product-card">
                <div className="thumb thumb-mist">
                  <span className="thumb-label">S—021</span>
                  <span className="thumb-label-r">NEW</span>
                  <span className="glyph">◉</span>
                </div>
                <div>
                  <div className="sub">Speakers · Field Lab</div>
                  <div className="meta mt-1">
                    <span className="name">Field Lab Monitor 6"</span>
                    <span className="price">$629</span>
                  </div>
                </div>
              </a>

              <a href="product.html" className="product-card">
                <div className="thumb thumb-accent">
                  <span
                    className="thumb-label"
                    style={{ color: "rgba(255,255,255,.7)" }}
                  >
                    C—002
                  </span>
                  <span
                    className="thumb-label-r"
                    style={{ color: "rgba(255,255,255,.7)" }}
                  >
                    ●
                  </span>
                  <span className="glyph">◐</span>
                </div>
                <div>
                  <div className="sub">Optics · Hand Built</div>
                  <div className="meta mt-1">
                    <span className="name">Hand Built 35mm Rangefinder</span>
                    <span className="price">$1,290</span>
                  </div>
                </div>
              </a>

              <a href="product.html" className="product-card">
                <div className="thumb thumb-paper">
                  <span className="thumb-label">P—099</span>
                  <span className="thumb-label-r">×2</span>
                  <span className="glyph">∞</span>
                </div>
                <div>
                  <div className="sub">Power · Daily Carry</div>
                  <div className="meta mt-1">
                    <span className="name">Daily Carry 65W GaN Pack</span>
                    <span className="price">$58</span>
                  </div>
                </div>
              </a>

              <a href="product.html" className="product-card">
                <div className="thumb thumb-mist">
                  <span className="thumb-label">D—011</span>
                  <span className="thumb-label-r">NEW</span>
                  <span className="glyph">▢</span>
                </div>
                <div>
                  <div className="sub">Displays · Studio One</div>
                  <div className="meta mt-1">
                    <span className="name">Studio One 27" Matte</span>
                    <span className="price">$1,049</span>
                  </div>
                </div>
              </a>

              <a href="product.html" className="product-card">
                <div className="thumb thumb-sand">
                  <span className="thumb-label">X—004</span>
                  <span className="thumb-label-r">●</span>
                  <span className="glyph">+</span>
                </div>
                <div>
                  <div className="sub">Accessory · Mass Object</div>
                  <div className="meta mt-1">
                    <span className="name">Mass Object Cable Tidy</span>
                    <span className="price">$28</span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="editorial">
              <div>
                <div
                  className="eyebrow"
                  style={{
                    color: "rgba(255,255,255,.55)",
                    marginBottom: "var(--s-4)",
                  }}
                >
                  § 03 — The thinking
                </div>
                <h2>
                  Buy <em>less.</em>
                  <br />
                  Use it for <em>longer.</em>
                  <br />
                  Repair when needed.
                </h2>
                <p className="mt-5">
                  Every product on Shopsflow is vetted for repairability,
                  modular components, and a real second-hand market. We publish
                  service manuals, sell spare parts, and run a trade-in program
                  at year three.
                </p>
                <a href="#" className="editorial-cta">
                  Read our standards
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
              <div className="editorial-stats">
                <div className="editorial-stat">
                  <div className="n">14</div>
                  <div className="l">Partner studios</div>
                </div>
                <div className="editorial-stat">
                  <div className="n">96 %</div>
                  <div className="l">Repairability index</div>
                </div>
                <div className="editorial-stat">
                  <div className="n">8 yrs</div>
                  <div className="l">Avg. product lifetime</div>
                </div>
                <div className="editorial-stat">
                  <div className="n">$0</div>
                  <div className="l">Restocking fees</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="duo">
              <div className="duo-card">
                <div>
                  <div className="eyebrow">For makers</div>
                  <h3 className="mt-3">
                    A developer-friendly storefront, fully documented at{" "}
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7em",
                        padding: "4px 8px",
                        background: "var(--bg)",
                        borderRadius: "6px",
                        border: "1px solid var(--line)",
                      }}
                    >
                      /swagger-ui.html
                    </span>
                  </h3>
                </div>
                <a href="#" className="lnk">
                  Browse the API
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
              <div
                className="duo-card"
                style={{
                  background: "var(--ink)",
                  color: "var(--bg)",
                  borderColor: "var(--ink)",
                }}
              >
                <div>
                  <div
                    className="eyebrow"
                    style={{ color: "rgba(255,255,255,.55)" }}
                  >
                    Join the list
                  </div>
                  <h3 className="mt-3">
                    New drops, repair guides, and the occasional studio visit.
                    Weekly, never spam.
                  </h3>
                </div>
                <form
                  className="row gap-2"
                  onSubmit={(event) => event.preventDefault()}
                >
                  <input
                    className="input"
                    placeholder="you@studio.com"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      borderColor: "rgba(255,255,255,0.18)",
                      color: "white",
                    }}
                  />
                  <button className="btn btn-accent" type="submit">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
