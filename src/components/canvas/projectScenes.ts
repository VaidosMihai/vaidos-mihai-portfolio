import type { CanvasThemePalette } from "@/lib/theme";

export type ProjectSceneId =
  | "cariad"
  | "bmw-parking"
  | "harman-mazda"
  | "graitec-advance";

export interface ProjectSceneMeta {
  id: ProjectSceneId;
  tabLabel: string;
  badge: string;
  title: string;
  caption: string;
  scrollBoostLabel: string;
  baseRate: number;
  unit: string;
  staticHud: [
    { label: string; value: string; tone?: "default" | "emerald" | "cyan" },
    { label: string; value: string; tone?: "default" | "emerald" | "cyan" },
    { label: string; value: string; tone?: "default" | "emerald" | "cyan" },
  ];
}

export const PROJECT_SCENES: ProjectSceneMeta[] = [
  {
    id: "cariad",
    tabLabel: "CARIAD REM",
    badge: "01 // CARIAD (VOLKSWAGEN GROUP)",
    title: "REM Download & Mobileye Swarm Telemetry",
    caption:
      "Front dashcam vision scanning road landmarks -> ~10 KB/km Roadbook tiles -> Vector CANoe & Python/Pandas ETL validation.",
    scrollBoostLabel: "SWARM",
    baseRate: 10,
    unit: "KB/km",
    staticHud: [
      { label: "PROTOCOL", value: "CANoe 100%", tone: "emerald" },
      { label: "WORKLOAD", value: "-30% ETL", tone: "cyan" },
      { label: "QUALITY", value: "4-EYES", tone: "default" },
    ],
  },
  {
    id: "bmw-parking",
    tabLabel: "BMW Parking",
    badge: "02 // BMW GROUP",
    title: "Parking Assistant Professional (200m Maneuver)",
    caption:
      "12 ultrasonic sonar arcs + 4 surround camera cones computing collision-free tight-bay reverse & trajectory replay.",
    scrollBoostLabel: "SONAR",
    baseRate: 48,
    unit: "Hz",
    staticHud: [
      { label: "SENSORS", value: "12 USS + 4 CAM", tone: "cyan" },
      { label: "COVERAGE", value: "95% GTEST", tone: "emerald" },
      { label: "BUILD", value: "CMAKE / BAZEL", tone: "default" },
    ],
  },
  {
    id: "harman-mazda",
    tabLabel: "HARMAN eCall",
    badge: "03 // HARMAN / MAZDA",
    title: "Telematics HIL Bench & 2G/3G eCall",
    caption:
      "Arduino UART trigger bridge -> RF antenna attenuation & emergency SOS latch -> Jenkins Pytest & DLT trace capture.",
    scrollBoostLabel: "BAUD",
    baseRate: 115,
    unit: "kbps",
    staticHud: [
      { label: "LINK", value: "UART 8N1", tone: "cyan" },
      { label: "TELEMATICS", value: "2G/3G ECALL", tone: "emerald" },
      { label: "SANITY", value: "100% PYTEST", tone: "default" },
    ],
  },
  {
    id: "graitec-advance",
    tabLabel: "Graitec 3D CAD",
    badge: "04 // GRAITEC & AUTODESK REVIT",
    title: "Advance Design Structural CAD Modules",
    caption:
      "Parametric 3D wall perforations, FEM slab meshing & Eurocode 6 / CR6 calculations across Column, Beam, Footing, Slab, Wall & Masonry.",
    scrollBoostLabel: "MESH",
    baseRate: 60,
    unit: "FPS",
    staticHud: [
      { label: "SUITE", value: "6 MODULES", tone: "cyan" },
      { label: "ARCH", value: "C# WPF MVVM", tone: "emerald" },
      { label: "CODES", value: "EN 1996 / CR6", tone: "default" },
    ],
  },
];

type SceneColors = CanvasThemePalette["engineeringShowcase"];

export interface SceneDrawContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  phase: number;
  scrollNorm: number;
  velocityBoost: number;
  colors: SceneColors;
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawBlueprintGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colors: SceneColors
) {
  ctx.lineWidth = 1;
  ctx.strokeStyle = colors.gridMinor;
  ctx.beginPath();
  for (let gx = 0; gx < width; gx += 24) {
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, height);
  }
  for (let gy = 0; gy < height; gy += 24) {
    ctx.moveTo(0, gy);
    ctx.lineTo(width, gy);
  }
  ctx.stroke();

  ctx.strokeStyle = colors.gridMajor;
  ctx.beginPath();
  for (let gx = 0; gx < width; gx += 96) {
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, height);
  }
  for (let gy = 0; gy < height; gy += 96) {
    ctx.moveTo(0, gy);
    ctx.lineTo(width, gy);
  }
  ctx.stroke();
}

function drawPill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  sub: string | null,
  colors: SceneColors,
  accentStroke?: string
) {
  drawRoundRect(ctx, x - w / 2, y - h / 2, w, h, 8);
  ctx.fillStyle = colors.nodeCardFill;
  ctx.fill();
  ctx.lineWidth = 1.3;
  ctx.strokeStyle = accentStroke ?? colors.nodeCardStroke;
  ctx.stroke();

  ctx.fillStyle = colors.nodeLabelText;
  ctx.font = "700 10px monospace";
  ctx.textAlign = "center";
  ctx.fillText(title, x, sub ? y - 2 : y + 3.5);

  if (sub) {
    ctx.fillStyle = colors.nodeSubText;
    ctx.font = "600 9px monospace";
    ctx.fillText(sub, x, y + 10);
  }
}

/* ============================================================================
 * 1. CARIAD REM — Road Lane, Dashcam Vision, Roadbook Tile Upload & Pandas ETL
 * ============================================================================ */
function drawCariadRemScene({
  ctx,
  width,
  height,
  phase,
  scrollNorm,
  velocityBoost,
  colors,
}: SceneDrawContext) {
  const compact = width < 640;
  const roadCy = height * 0.54;
  const roadHalfH = compact ? 38 : 48;

  // Highway Corridor Edges
  ctx.strokeStyle = colors.chassisStroke;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(20, roadCy - roadHalfH);
  ctx.lineTo(width - 20, roadCy - roadHalfH);
  ctx.moveTo(20, roadCy + roadHalfH);
  ctx.lineTo(width - 20, roadCy + roadHalfH);
  ctx.stroke();

  // Moving dashed highway centerline
  ctx.save();
  ctx.setLineDash([14, 14]);
  ctx.lineDashOffset = -phase * 28;
  ctx.strokeStyle = colors.trajectoryStroke;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(20, roadCy);
  ctx.lineTo(width - 20, roadCy);
  ctx.stroke();
  ctx.restore();

  // Vehicle traveling along lower lane
  const carX = compact ? width * 0.22 : width * 0.22;
  const carY = roadCy + (compact ? 18 : 22) + Math.sin(phase * 0.4 + scrollNorm * 4) * 2;
  const carLen = compact ? 84 : 112;
  const carWid = compact ? 34 : 42;

  // Front Mobileye Vision Cone
  const coneLen = compact ? 105 : 175;
  const coneGrad = ctx.createLinearGradient(carX + carLen / 2, carY, carX + carLen / 2 + coneLen, carY);
  coneGrad.addColorStop(0, colors.visionConeStart);
  coneGrad.addColorStop(1, colors.visionConeEnd);
  ctx.fillStyle = coneGrad;
  ctx.beginPath();
  ctx.moveTo(carX + carLen / 2 - 4, carY);
  ctx.lineTo(carX + carLen / 2 + coneLen, carY - (compact ? 28 : 40));
  ctx.lineTo(carX + carLen / 2 + coneLen, carY + (compact ? 28 : 40));
  ctx.closePath();
  ctx.fill();

  // Car silhouette
  drawRoundRect(ctx, carX - carLen / 2, carY - carWid / 2, carLen, carWid, 10);
  ctx.fillStyle = colors.chassisFill;
  ctx.fill();
  ctx.lineWidth = 1.8;
  ctx.strokeStyle = colors.chassisStroke;
  ctx.stroke();

  drawRoundRect(ctx, carX - carLen * 0.2, carY - carWid / 2 + 6, carLen * 0.42, carWid - 12, 5);
  ctx.fillStyle = colors.canopyFill;
  ctx.fill();
  ctx.strokeStyle = colors.chassisAccent;
  ctx.lineWidth = 1.1;
  ctx.stroke();

  // Detected road landmarks (scrolling toward car)
  for (let i = 0; i < 3; i++) {
    const markerProg = (1 - ((phase * 0.14 + i * 0.33) % 1));
    const mx = carX + carLen * 0.6 + markerProg * (width * 0.32);
    const my = roadCy - roadHalfH - 12;
    ctx.fillStyle = colors.packetAmber;
    ctx.beginPath();
    ctx.arc(mx, my, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = colors.packetAmber;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(mx, my + 4);
    ctx.lineTo(mx, roadCy - roadHalfH);
    ctx.stroke();
  }

  // Telemetry Tile Stream Path -> CANoe -> Pandas ETL -> Cloud Tile Verified
  const etlX = compact ? width * 0.72 : width * 0.62;
  const etlY = height * 0.28;
  const cloudX = compact ? width * 0.85 : width * 0.86;

  ctx.strokeStyle = colors.busTrace;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(carX, carY - carWid / 2);
  ctx.quadraticCurveTo(carX + 35, etlY, etlX - 58, etlY);
  if (!compact) {
    ctx.moveTo(etlX + 58, etlY);
    ctx.lineTo(cloudX - 54, etlY);
  }
  ctx.stroke();

  // Moving 10KB/km Tile Packets along path
  for (let p = 0; p < 3; p++) {
    const t = ((phase * (0.24 + velocityBoost * 0.18) + p * 0.33) % 1);
    const px = (1 - t) * carX + t * (compact ? etlX : cloudX);
    const py =
      (1 - t) * (1 - t) * (carY - carWid / 2) +
      2 * (1 - t) * t * etlY +
      t * t * etlY;
    ctx.fillStyle = p % 2 === 0 ? colors.packetPrimary : colors.packetSuccess;
    drawRoundRect(ctx, px - 6, py - 4, 12, 8, 2);
    ctx.fill();
  }

  drawPill(
    ctx,
    etlX,
    etlY,
    compact ? 104 : 116,
    36,
    "PANDAS ETL",
    "CANoe 0x1B4 OK",
    colors,
    colors.chassisAccent
  );

  if (!compact) {
    drawPill(
      ctx,
      cloudX,
      etlY,
      108,
      36,
      "ROADBOOK",
      "~10 KB/km PASS",
      colors,
      colors.trajectoryStroke
    );
  }
}

/* ============================================================================
 * 2. BMW PARKING ASSISTANT — Parallel Bay, Neighbor Cars, 200m Trajectory & 12 USS
 * ============================================================================ */
function drawBmwParkingScene({
  ctx,
  width,
  height,
  phase,
  scrollNorm,
  colors,
}: SceneDrawContext) {
  const compact = width < 640;
  const bayTop = height * 0.2;
  const bayHeight = compact ? 52 : 62;
  const bayStart = width * 0.12;
  const bayEnd = width * 0.88;

  // Parking Curb & Bay Slots
  ctx.strokeStyle = colors.chassisStroke;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(bayStart, bayTop);
  ctx.lineTo(bayEnd, bayTop);
  ctx.stroke();

  ctx.save();
  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = colors.busTrace;
  ctx.lineWidth = 1.4;
  const slot1End = bayStart + (bayEnd - bayStart) * 0.3;
  const slot2End = bayStart + (bayEnd - bayStart) * 0.68;
  ctx.strokeRect(bayStart, bayTop, slot1End - bayStart, bayHeight);
  ctx.strokeRect(slot1End, bayTop, slot2End - slot1End, bayHeight);
  ctx.strokeRect(slot2End, bayTop, bayEnd - slot2End, bayHeight);
  ctx.restore();

  // Parked Obstacle Vehicles (Slots 1 and 3)
  const obstacleW = compact ? 58 : 88;
  const obstacleH = compact ? 28 : 34;
  const obs1X = (bayStart + slot1End) / 2;
  const obs3X = (slot2End + bayEnd) / 2;
  const obsY = bayTop + bayHeight / 2;

  for (const ox of [obs1X, obs3X]) {
    drawRoundRect(ctx, ox - obstacleW / 2, obsY - obstacleH / 2, obstacleW, obstacleH, 7);
    ctx.fillStyle = colors.nodeCardFill;
    ctx.fill();
    ctx.strokeStyle = colors.nodeCardStroke;
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }

  // Target Parking Slot Label
  const targetCx = (slot1End + slot2End) / 2;
  ctx.fillStyle = colors.trajectoryStroke;
  ctx.font = "700 9px monospace";
  ctx.textAlign = "center";
  ctx.fillText("TARGET BAY (200m REPLAY)", targetCx, bayTop + 14);

  // Ego BMW Vehicle Executing Smooth Reverse S-Curve into Center Bay
  const parkProgress = 0.5 + Math.sin(phase * 0.45 + scrollNorm * Math.PI * 2) * 0.45;
  const startX = compact ? width * 0.72 : width * 0.7;
  const startY = height * 0.72;
  const endX = targetCx;
  const endY = obsY + 4;

  // Reverse S-curve Trajectory Preview
  ctx.save();
  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = colors.trajectoryStroke;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.bezierCurveTo(startX - 70, startY, endX + 45, endY + 34, endX, endY);
  ctx.stroke();
  ctx.restore();

  const egoX = startX + (endX - startX) * parkProgress;
  const egoY = startY + (endY - startY) * (parkProgress * parkProgress);
  const egoAngle = -0.28 * Math.sin(parkProgress * Math.PI);
  const egoLen = compact ? 78 : 104;
  const egoWid = compact ? 34 : 42;

  ctx.save();
  ctx.translate(egoX, egoY);
  ctx.rotate(egoAngle);

  // 12 Ultrasonic Sonar Rings (Front, Rear, Sides)
  for (let ring = 0; ring < 3; ring++) {
    const rPhase = (phase * 0.65 + ring * 0.33) % 1;
    const alpha = (1 - rPhase) * 0.6;
    const rad = 14 + rPhase * 28;
    ctx.strokeStyle = colors.sonarArc.replace("ALPHA", alpha.toFixed(3));
    ctx.lineWidth = 1.3;

    ctx.beginPath();
    ctx.arc(egoLen / 2, 0, rad, -0.55, 0.55);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(-egoLen / 2, 0, rad, Math.PI - 0.55, Math.PI + 0.55);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -egoWid / 2, rad * 0.7, -Math.PI * 0.8, -Math.PI * 0.2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, egoWid / 2, rad * 0.7, Math.PI * 0.2, Math.PI * 0.8);
    ctx.stroke();
  }

  // Surround Camera FOV Wedges (Side Mirrors)
  ctx.fillStyle = colors.visionConeStart;
  ctx.beginPath();
  ctx.moveTo(6, -egoWid / 2);
  ctx.lineTo(-14, -egoWid / 2 - 22);
  ctx.lineTo(26, -egoWid / 2 - 22);
  ctx.closePath();
  ctx.fill();

  // Ego Car Body
  drawRoundRect(ctx, -egoLen / 2, -egoWid / 2, egoLen, egoWid, 9);
  ctx.fillStyle = colors.chassisFill;
  ctx.fill();
  ctx.strokeStyle = colors.chassisAccent;
  ctx.lineWidth = 2;
  ctx.stroke();

  drawRoundRect(ctx, -egoLen * 0.18, -egoWid / 2 + 6, egoLen * 0.4, egoWid - 12, 4);
  ctx.fillStyle = colors.canopyFill;
  ctx.fill();
  ctx.restore();

  if (!compact) {
    drawPill(
      ctx,
      width * 0.2,
      height * 0.76,
      138,
      36,
      "GTEST / GMOCK",
      "95% UNIT COVERAGE",
      colors,
      colors.trajectoryStroke
    );
  }
}

/* ============================================================================
 * 3. HARMAN / MAZDA — Arduino UART HIL Bench -> RF Modem eCall -> Pytest/DLT
 * ============================================================================ */
function drawHarmanEcallScene({
  ctx,
  width,
  height,
  phase,
  velocityBoost,
  colors,
}: SceneDrawContext) {
  const compact = width < 640;
  const cy = height * 0.52;
  const leftX = compact ? width * 0.2 : width * 0.18;
  const midX = compact ? width * 0.52 : width * 0.5;
  const rightX = compact ? width * 0.82 : width * 0.82;

  // Bus traces between Arduino HIL -> Modem RF -> Jenkins / DLT
  ctx.strokeStyle = colors.busTrace;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(leftX + (compact ? 45 : 64), cy);
  ctx.lineTo(midX - (compact ? 45 : 64), cy);
  ctx.moveTo(midX + (compact ? 45 : 64), cy);
  ctx.lineTo(rightX - (compact ? 45 : 64), cy);
  ctx.stroke();

  // Animated UART Square-Wave Pulse along Left->Mid Trace
  const waveStart = leftX + (compact ? 48 : 68);
  const waveEnd = midX - (compact ? 48 : 68);
  if (waveEnd > waveStart + 12) {
    ctx.strokeStyle = colors.packetPrimary;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    const steps = 16;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const wx = waveStart + t * (waveEnd - waveStart);
      const high = Math.sin(t * 14 - phase * (2 + velocityBoost)) > 0 ? -7 : 7;
      if (i === 0) ctx.moveTo(wx, cy - 16 + high);
      else ctx.lineTo(wx, cy - 16 + high);
    }
    ctx.stroke();
  }

  // Animated SOS eCall RF Concentric Rings above Center Telematics Modem
  for (let r = 0; r < 3; r++) {
    const pulse = (phase * 0.55 + r * 0.33) % 1;
    const rad = 16 + pulse * 36;
    const alpha = (1 - pulse) * 0.65;
    ctx.strokeStyle = colors.sonarArc.replace("ALPHA", alpha.toFixed(3));
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(midX, cy - 12, rad, -Math.PI * 0.85, -Math.PI * 0.15);
    ctx.stroke();
  }

  // Animated DLT Packets along Mid->Right Trace
  const dltStart = midX + (compact ? 48 : 68);
  const dltEnd = rightX - (compact ? 48 : 68);
  if (dltEnd > dltStart + 10) {
    for (let p = 0; p < 2; p++) {
      const t = (phase * (0.28 + velocityBoost * 0.2) + p * 0.5) % 1;
      const px = dltStart + t * (dltEnd - dltStart);
      ctx.fillStyle = p === 0 ? colors.packetAmber : colors.packetSuccess;
      ctx.beginPath();
      ctx.arc(px, cy, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Node 1: Arduino / UART Hardware Fault Injection
  drawPill(
    ctx,
    leftX,
    cy,
    compact ? 92 : 128,
    46,
    "ARDUINO HIL",
    "UART 115200 8N1",
    colors,
    colors.packetAmber
  );

  // Node 2: Embedded Telematics Modem (2G/3G eCall)
  drawPill(
    ctx,
    midX,
    cy,
    compact ? 92 : 132,
    46,
    "ECALL MODEM",
    "2G/3G SOS LATCH",
    colors,
    colors.chassisAccent
  );

  // Node 3: Jenkins + Pytest + DLT Tracer
  drawPill(
    ctx,
    rightX,
    cy,
    compact ? 92 : 128,
    46,
    "PYTEST + DLT",
    "SANITY PASSED",
    colors,
    colors.trajectoryStroke
  );
}

/* ============================================================================
 * 4. GRAITEC ADVANCE DESIGN — Structural 3D CAD Wall Perforation, FEM & Columns
 * ============================================================================ */
function drawGraitecCadScene({
  ctx,
  width,
  height,
  phase,
  scrollNorm,
  colors,
}: SceneDrawContext) {
  const compact = width < 640;
  const cx = compact ? width * 0.45 : width * 0.38;
  const cy = height * 0.56;

  const w = compact ? 132 : 196;
  const h = compact ? 86 : 114;
  const dx = compact ? 36 : 54;
  const dy = (compact ? -22 : -30) + Math.sin(phase * 0.4 + scrollNorm * 4) * 4;

  const xL = cx - w / 2;
  const xR = cx + w / 2;
  const yT = cy - h / 2;
  const yB = cy + h / 2;

  // Slab Top Plane FEM Strip Grid
  ctx.strokeStyle = colors.cadSlabGrid.replace("ALPHA", "0.4");
  ctx.lineWidth = 1;
  for (let r = 0; r <= 4; r++) {
    const t = r / 4;
    ctx.beginPath();
    ctx.moveTo(xL + dx * t, yT + dy * t);
    ctx.lineTo(xR + dx * t, yT + dy * t);
    ctx.stroke();
  }
  for (let c = 0; c <= 5; c++) {
    const t = c / 5;
    ctx.beginPath();
    ctx.moveTo(xL + w * t, yT);
    ctx.lineTo(xL + w * t + dx, yT + dy);
    ctx.stroke();
  }

  // Front Structural Shear Wall Elevation + Isometric Frame
  ctx.fillStyle = colors.canopyFill;
  ctx.fillRect(xL, yT, w, h);

  ctx.strokeStyle = colors.cadBeamStroke.replace("ALPHA", "0.85");
  ctx.lineWidth = 2;
  ctx.strokeRect(xL, yT, w, h);
  ctx.strokeRect(xL + dx, yT + dy, w, h);

  const corners = [
    [xL, yT],
    [xR, yT],
    [xL, yB],
    [xR, yB],
  ] as const;
  ctx.beginPath();
  for (const [px, py] of corners) {
    ctx.moveTo(px, py);
    ctx.lineTo(px + dx, py + dy);
  }
  ctx.stroke();

  // Parametric 3D Wall Opening Perforation Cutout (Graitec Showcase Task!)
  const holeW = compact ? 44 : 62;
  const holeH = compact ? 36 : 48;
  const holeX = cx - holeW / 2;
  const holeY = cy - holeH / 2 + 4;

  ctx.fillStyle = colors.nodeCardFill;
  ctx.fillRect(holeX, holeY, holeW, holeH);
  ctx.strokeStyle = colors.packetAmber;
  ctx.lineWidth = 1.8;
  ctx.strokeRect(holeX, holeY, holeW, holeH);

  // Automatic 4-Edge Offset Dimension Lines around Perforation
  ctx.save();
  ctx.setLineDash([3, 3]);
  ctx.strokeStyle = colors.trajectoryStroke;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  // Left & Right offset dimensions
  ctx.moveTo(xL, holeY + holeH / 2);
  ctx.lineTo(holeX, holeY + holeH / 2);
  ctx.moveTo(holeX + holeW, holeY + holeH / 2);
  ctx.lineTo(xR, holeY + holeH / 2);
  // Top & Bottom offset dimensions
  ctx.moveTo(holeX + holeW / 2, yT);
  ctx.lineTo(holeX + holeW / 2, holeY);
  ctx.moveTo(holeX + holeW / 2, holeY + holeH);
  ctx.lineTo(holeX + holeW / 2, yB);
  ctx.stroke();
  ctx.restore();

  // Structural Corner Anchor Nodes
  ctx.fillStyle = colors.cadNodeFill;
  for (const [px, py] of corners) {
    ctx.beginPath();
    ctx.arc(px, py, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Right Side Suite Matrix Callout (Column, Beam, Footing, Slab, Wall, Masonry)
  if (!compact) {
    drawPill(
      ctx,
      width * 0.79,
      height * 0.34,
      166,
      36,
      "ADVANCE DESIGN SUITE",
      "COLUMN • BEAM • FOOTING",
      colors,
      colors.chassisAccent
    );
    drawPill(
      ctx,
      width * 0.79,
      height * 0.64,
      166,
      36,
      "REVIT ADD-IN ENGINE",
      "SLAB • WALL • MASONRY",
      colors,
      colors.packetAmber
    );
  }
}

export function renderProjectScene(
  sceneId: ProjectSceneId,
  ctxData: SceneDrawContext
) {
  const { ctx, width, height, colors } = ctxData;
  ctx.clearRect(0, 0, width, height);
  drawBlueprintGrid(ctx, width, height, colors);

  switch (sceneId) {
    case "cariad":
      drawCariadRemScene(ctxData);
      break;
    case "bmw-parking":
      drawBmwParkingScene(ctxData);
      break;
    case "harman-mazda":
      drawHarmanEcallScene(ctxData);
      break;
    case "graitec-advance":
      drawGraitecCadScene(ctxData);
      break;
  }
}
