<!-- .ülkemi geziyorum - Hero Alanı HTML Yapısı -->
<section id="hero-experience" class="hero-container">
  <!-- Katman 1: Göz ve Parallax -->
  <div id="eye-layer" class="eye-wrapper">
    <img id="gorsel1" src="gorsel1.jpg" alt="Göz ve Kültürel Miras" class="eye-image" />
    <div class="vignette-overlay"></div>
    <div class="scroll-cue">
      <div class="mouse-icon"><div class="mouse-wheel"></div></div>
    </div>
  </div>

  <!-- Katman 2: Türkiye Haritası & Pinler -->
  <div id="map-layer" class="map-wrapper">
    <div id="map-stage" class="map-stage">
      <div id="map-inner" class="map-inner">
        <img id="gorsel2" src="gorsel2.jpg" alt="Türkiye Haritası" class="map-image" />
        
        <!-- Örnek İnteraktif Hotspot Pinleri (Yüzdelik Koordinatlar) -->
        <!-- İstanbul Pin -->
        <div class="hotspot-pin" style="left: 14.8%; top: 25.5%;" data-city="İstanbul" data-name="Ayasofya-i Kebir">
          <button class="pin-marker" aria-label="İstanbul"></button>
          <div class="pin-tooltip">Ayasofya-i Kebir, İstanbul</div>
        </div>

        <!-- Kapadokya Pin -->
        <div class="hotspot-pin" style="left: 48.5%; top: 48.2%;" data-city="Kapadokya" data-name="Peri Bacaları">
          <button class="pin-marker" aria-label="Kapadokya"></button>
          <div class="pin-tooltip">Peri Bacaları, Kapadokya</div>
        </div>

        <!-- İzmir Pin -->
        <div class="hotspot-pin" style="left: 5.2%; top: 50.8%;" data-city="İzmir" data-name="Saat Kulesi">
          <button class="pin-marker" aria-label="İzmir"></button>
          <div class="pin-tooltip">Saat Kulesi, İzmir</div>
        </div>
      </div>
    </div>

    <!-- Zoom & Pan Kontrolleri -->
    <div class="map-controls">
      <button id="zoom-out">-</button>
      <span id="zoom-value">1.0x</span>
      <button id="zoom-in">+</button>
      <button id="zoom-reset">↺</button>
    </div>
  </div>
</section>
 
<!-- gsap kısmı -->
// GSAP & ScrollTrigger Entegrasyon Kodu
gsap.registerPlugin(ScrollTrigger);

// 1. Mouse Move Parallax (Göz Katmanı)
const eyeLayer = document.querySelector("#eye-layer");
let mouseX = 0, mouseY = 0, currentX = 0, currentY = 0;

window.addEventListener("mousemove", (e) => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  mouseX = (e.clientX - cx) / cx;
  mouseY = (e.clientY - cy) / cy;
});

function loopParallax() {
  currentX += (mouseX - currentX) * 0.08;
  currentY += (mouseY - currentY) * 0.08;
  if (eyeLayer) {
    eyeLayer.style.transform = `perspective(1000px) translate3d(${currentX * -24}px, ${currentY * -16}px, 0) rotateX(${currentY * -4}deg) rotateY(${currentX * 4}deg)`;
  }
  requestAnimationFrame(loopParallax);
}
requestAnimationFrame(loopParallax);

// 2. ScrollTrigger ile Göz Bebeğine Zoom-In ve Haritaya Crossfade
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: "#hero-experience",
    start: "top top",
    end: "+=2400",
    pin: true,
    scrub: 1, // Scroll hızına bağlı ve geri sarılabilir
  }
});

tl.to("#gorsel1", {
  scale: 14,
  transformOrigin: "50% 50%",
  ease: "power2.inOut",
  duration: 0.75
}, 0)
.to("#gorsel1", {
  filter: "brightness(0.08) contrast(1.5)",
  duration: 0.3
}, 0.45)
.fromTo("#map-layer", {
  opacity: 0,
  scale: 0.9,
  pointerEvents: "none"
}, {
  opacity: 1,
  scale: 1,
  pointerEvents: "auto",
  duration: 0.45
}, 0.55);

// 3. Pin Tıklama Listenerları (X Şehrine Tıklandı)
document.querySelectorAll(".hotspot-pin").forEach(pin => {
  pin.addEventListener("click", () => {
    const city = pin.getAttribute("data-city");
    const name = pin.getAttribute("data-name");
    console.log(`${city} şehrine tıklandı: ${name}`);
    // Yönlendirme kodunuzu buraya ekleyebilirsiniz:
    // window.location.href = `/sehir/${encodeURIComponent(city.toLowerCase())}`;
  });
});