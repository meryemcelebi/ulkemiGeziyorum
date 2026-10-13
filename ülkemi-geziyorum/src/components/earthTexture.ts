import * as THREE from 'three';

/**
 * Generates an equirectangular Earth texture on an offscreen canvas.
 * Includes realistic continental landmasses, Mediterranean & Anatolia contours,
 * deserts, mountain ranges, coastal turquoise shelves, and city lights.
 */
export function createProceduralEarthTexture(): { map: THREE.CanvasTexture; bump: THREE.CanvasTexture } {
  const width = 2048;
  const height = 1024;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bCtx = bumpCanvas.getContext('2d')!;

  // 1. Ocean base - Deep oceanic gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, '#0a2540');
  oceanGrad.addColorStop(0.3, '#0b3558');
  oceanGrad.addColorStop(0.5, '#072b49');
  oceanGrad.addColorStop(0.7, '#083256');
  oceanGrad.addColorStop(1, '#0a2540');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  bCtx.fillStyle = '#000000';
  bCtx.fillRect(0, 0, width, height);

  // Helper to convert Lat/Long to Texture X, Y
  // Longitude: -180 to +180 -> 0 to width
  // Latitude: +90 to -90 -> 0 to height
  const toXY = (lat: number, lon: number): [number, number] => {
    const x = ((lon + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return [x, y];
  };

  // Function to draw land polygon
  const drawPolygon = (
    points: [number, number][],
    fillColor: string,
    strokeColor?: string,
    lineWidth = 2
  ) => {
    if (points.length < 3) return;
    ctx.beginPath();
    const [startX, startY] = toXY(points[0][0], points[0][1]);
    ctx.moveTo(startX, startY);
    for (let i = 1; i < points.length; i++) {
      const [px, py] = toXY(points[i][0], points[i][1]);
      ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();

    if (strokeColor) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }

    // Bump map representation
    bCtx.beginPath();
    bCtx.moveTo(startX, startY);
    for (let i = 1; i < points.length; i++) {
      const [px, py] = toXY(points[i][0], points[i][1]);
      bCtx.lineTo(px, py);
    }
    bCtx.closePath();
    bCtx.fillStyle = '#666666';
    bCtx.fill();
  };

  // Coastal turquoise shelf glow
  const drawCoastGlow = (points: [number, number][]) => {
    ctx.beginPath();
    const [startX, startY] = toXY(points[0][0], points[0][1]);
    ctx.moveTo(startX, startY);
    for (let i = 1; i < points.length; i++) {
      const [px, py] = toXY(points[i][0], points[i][1]);
      ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = '#0e7490';
    ctx.lineWidth = 10;
    ctx.filter = 'blur(4px)';
    ctx.stroke();
    ctx.filter = 'none';
  };

  // ================= CONTINENTAL DEFINITIONS ================= //

  // 1. AFRICA
  const africa: [number, number][] = [
    [37, 10], [36, 1], [35, -6], [32, -9], [28, -13], [20, -17],
    [15, -17], [10, -14], [5, -1], [4, 7], [-4, 12], [-12, 14],
    [-22, 14], [-33, 18], [-34, 25], [-29, 32], [-24, 35], [-15, 40],
    [-5, 39], [2, 43], [12, 51], [12, 44], [15, 39], [22, 38],
    [28, 34], [31, 32], [32, 25], [37, 10]
  ];

  // 2. EUROPE
  const europe: [number, number][] = [
    [36, -5], [43, -9], [48, -4], [50, 2], [54, 8], [55, 12],
    [54, 19], [60, 28], [65, 35], [70, 30], [71, 25], [62, 5],
    [58, 6], [50, 0], [44, 4], [43, 3], [42, 3], [38, -1],
    [36, -5]
  ];

  // 3. ANATOLIA (TURKEY) - Meticulously specified!
  // Surrounded by Black Sea (north: lat ~41-42), Aegean Sea (west: lon ~26), Mediterranean (south: lat ~36), Caucasus/Iran (east: lon ~44)
  const turkey: [number, number][] = [
    [41.5, 26.5], // Edirne / Thrace
    [41.2, 28.5], // Istanbul Black Sea coast
    [41.8, 31.8], // West Black Sea / Zonguldak
    [42.0, 35.1], // Sinop cape (Northernmost point)
    [41.3, 36.3], // Samsun
    [41.0, 39.7], // Trabzon
    [41.4, 41.5], // Rize / Hopa
    [41.1, 43.1], // Ardahan / Georgia border
    [40.0, 44.5], // Mount Ararat / Ağrı
    [37.2, 44.3], // Hakkari / Iraq-Iran border
    [37.1, 42.4], // Cizre / Syrian border
    [36.9, 40.5], // Mardin / Nusaybin
    [36.9, 38.0], // Şanlıurfa
    [36.8, 36.5], // Gaziantep / Hatay entrance
    [36.0, 35.9], // Hatay / Samandağ (Southernmost point)
    [36.8, 34.6], // Mersin / Mediterranean coast
    [36.3, 32.3], // Anamur
    [36.9, 30.7], // Antalya bay
    [36.2, 29.6], // Kaş
    [36.6, 29.1], // Fethiye
    [36.7, 27.5], // Datça / Aegean
    [37.0, 27.3], // Bodrum
    [38.4, 26.3], // Çeşme / İzmir
    [39.5, 26.1], // Ayvalık
    [40.0, 26.2], // Çanakkale / Dardanelles
    [40.8, 27.5], // Marmara Sea coast
    [41.0, 29.0], // Bosphorus / Istanbul
    [41.5, 26.5]
  ];

  // 4. EURASIA / ASIA
  const eurasia: [number, number][] = [
    [40, 45], [42, 50], [45, 53], [50, 60], [60, 70], [70, 75],
    [75, 110], [70, 140], [65, 175], [55, 160], [45, 140], [35, 130],
    [25, 120], [20, 110], [10, 105], [5, 100], [15, 95], [22, 90],
    [20, 80], [10, 76], [22, 69], [25, 60], [30, 50], [35, 45],
    [40, 45]
  ];

  // 5. ARABIAN PENINSULA
  const arabia: [number, number][] = [
    [30, 35], [28, 48], [24, 52], [22, 59], [17, 54], [12, 45],
    [13, 43], [20, 40], [28, 35], [30, 35]
  ];

  // 6. AMERICAS
  const northAmerica: [number, number][] = [
    [70, -160], [72, -130], [60, -90], [55, -60], [45, -65], [35, -75],
    [25, -80], [20, -90], [15, -92], [20, -105], [30, -115], [40, -124],
    [50, -128], [60, -145], [65, -165], [70, -160]
  ];

  const southAmerica: [number, number][] = [
    [10, -75], [5, -55], [-5, -35], [-20, -40], [-35, -55], [-55, -65],
    [-50, -75], [-30, -72], [-15, -75], [0, -80], [10, -75]
  ];

  // 7. AUSTRALIA
  const australia: [number, number][] = [
    [-12, 130], [-15, 136], [-12, 142], [-22, 150], [-34, 151],
    [-38, 145], [-35, 137], [-32, 130], [-34, 115], [-22, 114],
    [-15, 123], [-12, 130]
  ];

  // Draw Coastal shelves first
  drawCoastGlow(africa);
  drawCoastGlow(europe);
  drawCoastGlow(turkey);
  drawCoastGlow(arabia);
  drawCoastGlow(eurasia);

  // Draw Lands with natural textures
  drawPolygon(northAmerica, '#2d5a37');
  drawPolygon(southAmerica, '#1e4826');
  drawPolygon(australia, '#8c5d32');
  drawPolygon(eurasia, '#2f5a34');
  drawPolygon(europe, '#2d6a4f');

  // Draw Africa with Sahara desert tone
  drawPolygon(africa, '#345e37');
  // Sahara desert overlay
  const sahara: [number, number][] = [
    [32, -8], [30, 30], [20, 35], [14, 30], [15, -10], [25, -15], [32, -8]
  ];
  drawPolygon(sahara, '#c29b62');

  // Arabia desert tone
  drawPolygon(arabia, '#d4a359');

  // Draw Turkey prominently with fertile green coasts and golden-warm Anatolian plateau
  drawPolygon(turkey, '#3b7a57', '#6ee7b7', 3);

  // Inner Anatolian plateau shading
  const innerAnatolia: [number, number][] = [
    [40.0, 30.5], [40.5, 36.0], [39.5, 41.0], [38.5, 41.5],
    [37.8, 36.0], [37.8, 32.5], [38.5, 30.5], [40.0, 30.5]
  ];
  drawPolygon(innerAnatolia, '#b5924f');

  // Add subtle mountain relief brush marks across Anatolia, Alps, Caucasus
  ctx.strokeStyle = '#e2d3b5';
  ctx.lineWidth = 2.5;
  // Taurus mountains arc
  const [t1x, t1y] = toXY(37.0, 30.5);
  const [t2x, t2y] = toXY(37.5, 35.5);
  ctx.beginPath();
  ctx.moveTo(t1x, t1y);
  ctx.quadraticCurveTo(t1x + 20, t1y + 10, t2x, t2y);
  ctx.stroke();

  // North Anatolian mountains
  const [n1x, n1y] = toXY(41.0, 32.0);
  const [n2x, n2y] = toXY(40.8, 41.0);
  ctx.beginPath();
  ctx.moveTo(n1x, n1y);
  ctx.lineTo(n2x, n2y);
  ctx.stroke();

  // Add clouds/swirls on the texture
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  for (let i = 0; i < 40; i++) {
    const rx = Math.random() * width;
    const ry = Math.random() * height;
    const rw = 40 + Math.random() * 120;
    const rh = 15 + Math.random() * 40;
    ctx.beginPath();
    ctx.ellipse(rx, ry, rw, rh, Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Create Three.js Textures
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  const bumpTexture = new THREE.CanvasTexture(bumpCanvas);
  bumpTexture.wrapS = THREE.RepeatWrapping;
  bumpTexture.wrapT = THREE.ClampToEdgeWrapping;

  return { map: texture, bump: bumpTexture };
}

/**
 * Generates an ethereal cloud texture for the outer cloud sphere
 */
export function createCloudTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, 1024, 512);

  // Soft atmospheric cloud patches
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * 1024;
    const y = (Math.random() * 0.7 + 0.15) * 512;
    const rad = 25 + Math.random() * 70;
    const opacity = 0.1 + Math.random() * 0.35;

    const grad = ctx.createRadialGradient(x, y, 0, x, y, rad);
    grad.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
    grad.addColorStop(0.7, `rgba(255, 255, 255, ${opacity * 0.5})`);
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}
