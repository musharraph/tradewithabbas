(() => {
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const year = document.getElementById("year");
  const canvas = document.getElementById("candles");

  if (year) year.textContent = String(new Date().getFullYear());

  const closeMenu = () => {
    navLinks?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  menuToggle?.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("scroll", () => {
    header?.classList.toggle("scrolled", window.scrollY > 8);
  }, { passive: true });

  const reveals = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
  );
  reveals.forEach((el) => io.observe(el));
  const showVisible = () => {
    reveals.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 40) {
        el.classList.add("visible");
      }
    });
  };
  showVisible();
  window.addEventListener("scroll", showVisible, { passive: true });

  const faqButtons = document.querySelectorAll(".faq-item button");
  faqButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const open = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((el) => el.classList.remove("open"));
      if (!open) item.classList.add("open");
    });
  });

  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const COUNT = 42;
  const candles = [];
  let price = 112;

  const seed = () => {
    candles.length = 0;
    price = 112;
    for (let i = 0; i < COUNT; i += 1) {
      candles.push(nextCandle());
    }
  };

  const nextCandle = () => {
    const open = price;
    const close = open + (Math.random() - 0.47) * 14;
    const high = Math.max(open, close) + Math.random() * 5;
    const low = Math.min(open, close) - Math.random() * 5;
    price = close;
    return { open, close, high, low };
  };

  const size = () => {
    const { width, height } = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(width, height);
  };

  const draw = (w, h) => {
    ctx.clearRect(0, 0, w, h);
    const highs = candles.map((c) => c.high);
    const lows = candles.map((c) => c.low);
    const min = Math.min(...lows);
    const max = Math.max(...highs);
    const range = max - min || 1;
    const y = (v) => h - ((v - min) / range) * (h * 0.7) - h * 0.14;
    const slot = w / COUNT;

    candles.forEach((c, i) => {
      const x = i * slot + slot / 2;
      const up = c.close >= c.open;
      ctx.strokeStyle = up ? "rgba(61, 207, 142, 0.38)" : "rgba(226, 91, 91, 0.38)";
      ctx.fillStyle = up ? "rgba(61, 207, 142, 0.22)" : "rgba(226, 91, 91, 0.22)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, y(c.high));
      ctx.lineTo(x, y(c.low));
      ctx.stroke();
      const top = y(Math.max(c.open, c.close));
      const bot = y(Math.min(c.open, c.close));
      ctx.fillRect(x - slot * 0.2, top, slot * 0.4, Math.max(3, bot - top));
    });
  };

  seed();
  size();
  window.addEventListener("resize", size);
  setInterval(() => {
    candles.shift();
    candles.push(nextCandle());
    const { width, height } = canvas.getBoundingClientRect();
    draw(width, height);
  }, 720);
})();

/* =========================================
   GLOBAL COMMUNITY CLICK
   ========================================= */

const COMMUNITY_URL = "https://t.me/+BgJ9E-FwayFlOWY8";

document.addEventListener("click", function (event) {

  // If user clicked an existing link or button,
  // let that element work normally.
  const interactive = event.target.closest(
    "a, button, input, select, textarea, summary, label"
  );

  if (interactive) {
    return;
  }

  // Ignore clicks on the menu/canvas mechanics
  if (
    event.target.closest(".menu-toggle") ||
    event.target.closest(".nav-links")
  ) {
    return;
  }

  // Any other area of the page → VIP Community
  window.location.href = COMMUNITY_URL;

});
