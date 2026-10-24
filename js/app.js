/* ===================================================================
   DUKAANSPATIAL - 3D WEBGL & INTERACTIVE ENGINE
   India's First 1-Click Interactive 3D & AR Product Showcase Platform
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  init3DViewport();
  initColorSwatches();
  initProductTabs();
  initRoiCalculator();
  initEmbedCopy();
});

// Mobile Navigation
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mainNav = document.getElementById('main-nav');
  if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', () => {
      const isVisible = mainNav.style.display === 'flex';
      mainNav.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        mainNav.style.flexDirection = 'column';
        mainNav.style.position = 'absolute';
        mainNav.style.top = '74px';
        mainNav.style.left = '0';
        mainNav.style.width = '100%';
        mainNav.style.background = '#0b0f1d';
        mainNav.style.padding = '1.5rem';
        mainNav.style.borderBottom = '1px solid rgba(139, 92, 246, 0.2)';
      }
    });
  }
}

// ===================================================================
// 3D PRODUCT VIEWPORT ENGINE (Three.js / WebGL with Native Fallback)
// ===================================================================

let currentProduct = 'sneaker';
let currentColor = '#22d3ee';
let scene, camera, renderer, currentMeshGroup;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let autoRotate = true;

function init3DViewport() {
  const container = document.getElementById('canvas-box-3d');
  const canvas = document.getElementById('webgl-canvas');
  if (!container || !canvas) return;

  const width = container.clientWidth || 500;
  const height = container.clientHeight || 320;

  // Initialize Three.js if available, otherwise native 3D projection canvas
  if (typeof THREE !== 'undefined') {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.5;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x22d3ee, 1.2);
    dirLight1.position.set(5, 5, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x8b5cf6, 1.0);
    dirLight2.position.set(-5, -3, -2);
    scene.add(dirLight2);

    loadProductModel(currentProduct, currentColor);
    setupInteractionListeners(container);
    animateThree();
  } else {
    // Native High-Performance 3D Wireframe/Solid Renderer
    initFallback3DEngine(canvas);
  }
}

function loadProductModel(productType, colorHex) {
  if (!scene) return;
  if (currentMeshGroup) scene.remove(currentMeshGroup);

  currentMeshGroup = new THREE.Group();
  const hexNum = parseInt(colorHex.replace('#', '0x'), 16);

  if (productType === 'sneaker') {
    // 3D Athletic Sneaker Geometry
    // Sole
    const soleGeo = new THREE.BoxGeometry(2.4, 0.35, 1.0);
    const soleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const sole = new THREE.Mesh(soleGeo, soleMat);
    sole.position.y = -0.5;
    currentMeshGroup.add(sole);

    // Body
    const bodyGeo = new THREE.CylinderGeometry(0.5, 0.7, 1.8, 16);
    const bodyMat = new THREE.MeshStandardMaterial({ color: hexNum, roughness: 0.3, metalness: 0.2 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.rotation.z = Math.PI / 2.3;
    body.position.set(0.1, 0.05, 0);
    currentMeshGroup.add(body);

    // Heel Collar
    const collarGeo = new THREE.TorusGeometry(0.4, 0.15, 12, 24);
    const collarMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.position.set(-0.6, 0.5, 0);
    collar.rotation.y = Math.PI / 2;
    currentMeshGroup.add(collar);

    // Accent Stripe
    const stripeGeo = new THREE.BoxGeometry(1.2, 0.08, 1.05);
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.set(0.1, -0.05, 0);
    currentMeshGroup.add(stripe);

  } else if (productType === 'watch') {
    // 3D Luxury Chronograph Smartwatch
    // Case
    const caseGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.25, 32);
    const caseMat = new THREE.MeshStandardMaterial({ color: hexNum, metalness: 0.85, roughness: 0.2 });
    const watchCase = new THREE.Mesh(caseGeo, caseMat);
    watchCase.rotation.x = Math.PI / 4;
    currentMeshGroup.add(watchCase);

    // Screen Dial
    const dialGeo = new THREE.CircleGeometry(0.95, 32);
    const dialMat = new THREE.MeshStandardMaterial({ color: 0x070a13, roughness: 0.1 });
    const dial = new THREE.Mesh(dialGeo, dialMat);
    dial.position.set(0, 0.14, 0.14);
    dial.rotation.x = -Math.PI / 4;
    currentMeshGroup.add(dial);

    // Straps
    const strapGeo = new THREE.BoxGeometry(0.9, 1.6, 0.12);
    const strapMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
    const strapTop = new THREE.Mesh(strapGeo, strapMat);
    strapTop.position.set(0, 1.2, -0.4);
    strapTop.rotation.x = Math.PI / 4;
    currentMeshGroup.add(strapTop);

    const strapBottom = new THREE.Mesh(strapGeo, strapMat);
    strapBottom.position.set(0, -1.2, 0.4);
    strapBottom.rotation.x = Math.PI / 4;
    currentMeshGroup.add(strapBottom);

  } else if (productType === 'headphones') {
    // 3D Wireless Audio Headphones
    // Headband
    const bandGeo = new THREE.TorusGeometry(1.4, 0.12, 16, 32, Math.PI);
    const bandMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
    const band = new THREE.Mesh(bandGeo, bandMat);
    band.position.y = 0.4;
    currentMeshGroup.add(band);

    // Left & Right Ear Cups
    const cupGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.35, 24);
    const cupMat = new THREE.MeshStandardMaterial({ color: hexNum, metalness: 0.7, roughness: 0.3 });
    
    const leftCup = new THREE.Mesh(cupGeo, cupMat);
    leftCup.position.set(-1.4, 0.1, 0);
    leftCup.rotation.z = Math.PI / 2;
    currentMeshGroup.add(leftCup);

    const rightCup = new THREE.Mesh(cupGeo, cupMat);
    rightCup.position.set(1.4, 0.1, 0);
    rightCup.rotation.z = Math.PI / 2;
    currentMeshGroup.add(rightCup);
  }

  scene.add(currentMeshGroup);
}

function setupInteractionListeners(container) {
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    autoRotate = false;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDragging || !currentMeshGroup) return;

    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    currentMeshGroup.rotation.y += deltaX * 0.01;
    currentMeshGroup.rotation.x += deltaY * 0.01;

    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  // Touch Support for Mobile
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      autoRotate = false;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  });

  container.addEventListener('touchmove', (e) => {
    if (!isDragging || !currentMeshGroup || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMousePosition.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.y;

    currentMeshGroup.rotation.y += deltaX * 0.012;
    currentMeshGroup.rotation.x += deltaY * 0.012;

    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}

function animateThree() {
  requestAnimationFrame(animateThree);
  if (currentMeshGroup && autoRotate) {
    currentMeshGroup.rotation.y += 0.008;
  }
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

// Fallback Canvas 3D Rotation Renderer
function initFallback3DEngine(canvas) {
  const ctx = canvas.getContext('2d');
  let angle = 0;

  function renderFallback() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Draw 3D wireframe isometric cube/model
    ctx.save();
    ctx.translate(cx, cy);

    const size = 65;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();

    // Projected 3D vertices
    for (let i = 0; i < 8; i++) {
      const x = ((i & 1) ? size : -size) * cos - ((i & 2) ? size : -size) * sin * 0.5;
      const y = ((i & 4) ? size : -size) * 0.7 + ((i & 2) ? size : -size) * cos * 0.5;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
    angle += 0.015;
    requestAnimationFrame(renderFallback);
  }

  renderFallback();
}

// ===================================================================
// COLOR SWATCHES & PRODUCT SELECTOR
// ===================================================================

function initColorSwatches() {
  const swatches = document.querySelectorAll('.color-dot');
  swatches.forEach(dot => {
    dot.addEventListener('click', () => {
      swatches.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      currentColor = dot.getAttribute('data-color');
      loadProductModel(currentProduct, currentColor);
      updateEmbedSnippet();
    });
  });
}

function initProductTabs() {
  const tabs = document.querySelectorAll('.prod-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentProduct = tab.getAttribute('data-prod');
      loadProductModel(currentProduct, currentColor);
      updateEmbedSnippet();
    });
  });
}

function updateEmbedSnippet() {
  const snippet = document.getElementById('embed-snippet-text');
  if (snippet) {
    const code = `<iframe src="https://dukaanspatial.in/view/${currentProduct}?color=${currentColor.replace('#', '')}" width="100%" height="450" frameborder="0"></iframe>`;
    snippet.textContent = code;
  }
}

function initEmbedCopy() {
  const copyBtn = document.getElementById('copy-embed-btn');
  const snippet = document.getElementById('embed-snippet-text');
  if (copyBtn && snippet) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(snippet.textContent).then(() => {
        const origText = copyBtn.textContent;
        copyBtn.textContent = 'Copied Code!';
        setTimeout(() => {
          copyBtn.textContent = origText;
        }, 1800);
      });
    });
  }
}

// ===================================================================
// INTERACTIVE ROI & CONVERSION ESTIMATOR
// ===================================================================

function initRoiCalculator() {
  const trafficSlider = document.getElementById('calc-traffic');
  const aovSlider = document.getElementById('calc-aov');
  const trafficVal = document.getElementById('calc-traffic-val');
  const aovVal = document.getElementById('calc-aov-val');
  const revenueOutput = document.getElementById('calc-revenue-output');
  const returnsOutput = document.getElementById('calc-returns-output');

  function calculate() {
    if (!trafficSlider || !aovSlider) return;
    const traffic = parseInt(trafficSlider.value, 10);
    const aov = parseInt(aovSlider.value, 10);

    trafficVal.textContent = traffic.toLocaleString('en-IN') + ' visits';
    aovVal.textContent = 'INR ' + aov.toLocaleString('en-IN');

    // Industry Benchmark: 3D interactive viewer lifts conversion by ~38% (e.g. from 1.8% to 2.5%)
    const baselineOrders = traffic * 0.018;
    const liftedOrders = traffic * 0.025;
    const extraOrders = liftedOrders - baselineOrders;
    const additionalMonthlyRevenue = Math.round(extraOrders * aov);
    const returnReductionSaved = Math.round((liftedOrders * aov) * 0.12);

    revenueOutput.textContent = '+ INR ' + additionalMonthlyRevenue.toLocaleString('en-IN');
    returnsOutput.textContent = 'INR ' + returnReductionSaved.toLocaleString('en-IN') + ' Saved';
  }

  if (trafficSlider && aovSlider) {
    trafficSlider.addEventListener('input', calculate);
    aovSlider.addEventListener('input', calculate);
    calculate();
  }
}
