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
    title: "REM Quadkey Tile Streaming & HTTP 200/400 Monitoring",
    caption:
      "Vehicle moving along Z16 Quadkey grid -> Dashcam requests tiles -> Server responds HTTP 200 (green) / HTTP 400 (red).",
    scrollBoostLabel: "SWARM",
    baseRate: 10,
    unit: "KB/km",
    staticHud: [
      { label: "PROTOCOL", value: "CANoe 100%", tone: "emerald" },
      { label: "QUADKEY", value: "ZOOM 16", tone: "cyan" },
      { label: "GATE", value: "HTTP 200 / 400", tone: "default" },
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
 * 1. CARIAD REM — Moving Vehicle, Quadkey Z16 Tile Grid, REQ->Server->HTTP 200/400
 * ============================================================================ */
const CARIAD_TILES = [
  { quadkey: "1203221030201122", shortKey: "QK..1122", xyz: "[37516,23715]", fail: false },
  { quadkey: "1203221030201123", shortKey: "QK..1123", xyz: "[37517,23715]", fail: false },
  { quadkey: "1203221030201132", shortKey: "QK..1132", xyz: "[37518,23715]", fail: false },
  { quadkey: "1203221030201133", shortKey: "QK..1133", xyz: "[37519,23715]", fail: true },
  { quadkey: "1203221030201300", shortKey: "QK..1300", xyz: "[37516,23716]", fail: false },
] as const;

function drawCariadRemScene({
  ctx,
  width,
  height,
  phase,
  velocityBoost,
  colors,
}: SceneDrawContext) {
  const compact = width < 680;
  const tileCount = compact ? 4 : CARIAD_TILES.length;
  const gridLeft = compact ? 16 : 36;
  const gridRight = width - (compact ? 16 : 36);
  const gridWidth = gridRight - gridLeft;
  const tileW = gridWidth / tileCount;
  const tileH = compact ? 74 : 84;
  const roadTop = height - tileH - (compact ? 22 : 24);
  const roadCy = roadTop + tileH * 0.56;

  // Cycle progress 0..1 like a smooth looping GIF; static snapshot at 0.68 when phase === 0
  const loopSpeed = 0.055 + velocityBoost * 0.04;
  const cycle = phase === 0 ? 0.68 : (phase * loopSpeed) % 1;
  // Active cursor progresses across tiles 0..tileCount (extra tail pause to inspect final states)
  const activeTileFloat = cycle * (tileCount + 0.6);
  const loadingIdx = Math.min(Math.floor(activeTileFloat), tileCount - 1);
  const tileLocalProg = Math.min(Math.max(activeTileFloat - Math.floor(activeTileFloat), 0), 1);

  // Server pill in upper-right area
  const serverX = compact ? width * 0.72 : width * 0.76;
  const serverY = compact ? 32 : 34;

  // 1) Draw Road Surface & Quadkey Z16 Tile Grid along the street
  for (let i = 0; i < tileCount; i++) {
    const tileMeta = CARIAD_TILES[i];
    if (!tileMeta) continue;
    const tx = gridLeft + i * tileW;
    const ty = roadTop;
    const pad = 2;
    const bx = tx + pad;
    const by = ty + pad;
    const bw = tileW - pad * 2;
    const bh = tileH - pad * 2;

    let tileState: "idle" | "loading" | "ok" | "fail" = "idle";
    if (i < activeTileFloat - 0.85) {
      tileState = tileMeta.fail ? "fail" : "ok";
    } else if (i <= activeTileFloat && i === loadingIdx) {
      // Response arrives at 82% of local cycle -> flips to 200 / 400
      if (tileLocalProg >= 0.82) {
        tileState = tileMeta.fail ? "fail" : "ok";
      } else {
        tileState = "loading";
      }
    }

    // Tile background tint
    if (tileState === "ok") {
      ctx.fillStyle = "rgba(16, 185, 129, 0.12)";
    } else if (tileState === "fail") {
      ctx.fillStyle = "rgba(244, 63, 94, 0.14)";
    } else if (tileState === "loading") {
      ctx.fillStyle = "rgba(245, 158, 11, 0.12)";
    } else {
      ctx.fillStyle = colors.nodeCardFill;
    }
    drawRoundRect(ctx, bx, by, bw, bh, 6);
    ctx.fill();

    // Tile border (Yellow when loading, Green when HTTP 200, Red when HTTP 400)
    ctx.save();
    if (tileState === "idle") {
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = colors.busTrace;
      ctx.lineWidth = 1.1;
    } else if (tileState === "loading") {
      ctx.strokeStyle = colors.packetAmber;
      ctx.lineWidth = 2.2;
    } else if (tileState === "ok") {
      ctx.strokeStyle = colors.packetSuccess;
      ctx.lineWidth = 2;
    } else {
      ctx.strokeStyle = colors.packetCrimson;
      ctx.lineWidth = 2;
    }
    drawRoundRect(ctx, bx, by, bw, bh, 6);
    ctx.stroke();
    ctx.restore();

    // Quadkey text + Zoom 16 metadata inside tile (auto-compact on narrower tiles to avoid text overlap)
    const showFullQuadkey = bw >= 195;
    ctx.textAlign = "left";
    ctx.fillStyle = colors.nodeSubText;
    ctx.font = showFullQuadkey ? "600 9px monospace" : "600 8.5px monospace";
    ctx.fillText(
      showFullQuadkey ? `QK ${tileMeta.quadkey}` : tileMeta.shortKey,
      bx + 6,
      by + 13
    );

    if (showFullQuadkey) {
      ctx.fillStyle = colors.nodeSubText;
      ctx.font = "500 8.5px monospace";
      ctx.fillText(`Z16 ${tileMeta.xyz}`, bx + 6, by + 24);
    }

    // HTTP / Loading Status Badge at top-right of each tile
    ctx.textAlign = "right";
    ctx.font = "700 9px monospace";
    if (tileState === "loading") {
      ctx.fillStyle = colors.packetAmber;
      ctx.fillText("LOADING", bx + bw - 6, by + 13);
    } else if (tileState === "ok") {
      ctx.fillStyle = colors.packetSuccess;
      ctx.fillText("HTTP 200", bx + bw - 6, by + 13);
    } else if (tileState === "fail") {
      ctx.fillStyle = colors.packetCrimson;
      ctx.fillText("HTTP 400", bx + bw - 6, by + 13);
    } else {
      ctx.fillStyle = colors.nodeSubText;
      ctx.fillText("QUEUED", bx + bw - 6, by + 13);
    }

    // Bottom loading progress line inside tile
    const barX = bx + 5;
    const barY = by + bh - 6;
    const barMaxW = bw - 10;
    ctx.fillStyle = colors.busTrace;
    ctx.fillRect(barX, barY, barMaxW, 2.5);

    if (tileState === "loading") {
      const fillRatio = Math.min(tileLocalProg / 0.82, 1);
      ctx.fillStyle = colors.packetAmber;
      ctx.fillRect(barX, barY, barMaxW * fillRatio, 2.5);
    } else if (tileState === "ok") {
      ctx.fillStyle = colors.packetSuccess;
      ctx.fillRect(barX, barY, barMaxW, 2.5);
    } else if (tileState === "fail") {
      ctx.fillStyle = colors.packetCrimson;
      ctx.fillRect(barX, barY, barMaxW, 2.5);
    }
  }

  // Road dashed centerline across the tiles
  ctx.save();
  ctx.setLineDash([10, 10]);
  ctx.strokeStyle = colors.busTrace;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(gridLeft + 4, roadCy);
  ctx.lineTo(gridRight - 4, roadCy);
  ctx.stroke();
  ctx.restore();

  // 2) Moving Car along the Quadkey street
  const carLen = compact ? 64 : 84;
  const carWid = compact ? 28 : 34;
  const minCarX = gridLeft + carLen * 0.6;
  const maxCarX = gridRight - carLen * 0.7;
  const carTravelNorm = Math.min(activeTileFloat / tileCount, 1);
  const carX = minCarX + (maxCarX - minCarX) * carTravelNorm;
  const carY = roadCy + 6;
  const camX = carX + carLen * 0.34;
  const camY = carY - carWid / 2 + 2;

  // Front Dashcam Vision Cone scanning upcoming tile
  const coneLen = compact ? 58 : 88;
  const coneGrad = ctx.createLinearGradient(
    carX + carLen / 2,
    carY,
    carX + carLen / 2 + coneLen,
    carY
  );
  coneGrad.addColorStop(0, colors.visionConeStart);
  coneGrad.addColorStop(1, colors.visionConeEnd);
  ctx.fillStyle = coneGrad;
  ctx.beginPath();
  ctx.moveTo(carX + carLen / 2 - 4, carY);
  ctx.lineTo(carX + carLen / 2 + coneLen, carY - (compact ? 18 : 24));
  ctx.lineTo(carX + carLen / 2 + coneLen, carY + (compact ? 18 : 24));
  ctx.closePath();
  ctx.fill();

  // Top-Down Vehicle Silhouette
  drawRoundRect(ctx, carX - carLen / 2, carY - carWid / 2, carLen, carWid, 8);
  ctx.fillStyle = colors.chassisFill;
  ctx.fill();
  ctx.lineWidth = 1.8;
  ctx.strokeStyle = colors.chassisStroke;
  ctx.stroke();

  // Windshield & Mounted Front Dashcam Dot
  drawRoundRect(
    ctx,
    carX - carLen * 0.16,
    carY - carWid / 2 + 5,
    carLen * 0.4,
    carWid - 10,
    4
  );
  ctx.fillStyle = colors.canopyFill;
  ctx.fill();
  ctx.strokeStyle = colors.chassisAccent;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Dashcam lens node
  ctx.fillStyle = colors.packetAmber;
  ctx.beginPath();
  ctx.arc(camX, camY + carWid * 0.36, 3.2, 0, Math.PI * 2);
  ctx.fill();

  // 3) Request (Dashcam -> Server) & Response (Server -> Car/Camera) Curves
  const reqCtrlX = (camX + serverX) * 0.38;
  const reqCtrlY = Math.min(serverY + 8, roadTop - 32);
  const resCtrlX = (camX + serverX) * 0.62;
  const resCtrlY = roadTop - 14;

  // Request curve (Car Dashcam -> Server)
  ctx.save();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = colors.packetAmber;
  ctx.globalAlpha = 0.45;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(camX, camY);
  ctx.quadraticCurveTo(reqCtrlX, reqCtrlY, serverX - 42, serverY + 12);
  ctx.stroke();

  // Response curve (Server -> Car Dashcam)
  const currentTile = CARIAD_TILES[loadingIdx];
  const respIsFail = Boolean(currentTile?.fail);
  ctx.strokeStyle = respIsFail ? colors.packetCrimson : colors.packetSuccess;
  ctx.beginPath();
  ctx.moveTo(serverX - 28, serverY + 18);
  ctx.quadraticCurveTo(resCtrlX, resCtrlY, camX + 6, camY);
  ctx.stroke();
  ctx.restore();

  // Animated Request Packet (0 .. 0.42 -> Dashcam to Server)
  const evalQuad = (
    t: number,
    p0: number,
    p1: number,
    p2: number
  ): number => (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;

  if (tileLocalProg < 0.44) {
    const rt = tileLocalProg / 0.44;
    const rx = evalQuad(rt, camX, reqCtrlX, serverX - 42);
    const ry = evalQuad(rt, camY, reqCtrlY, serverY + 12);
    ctx.fillStyle = colors.packetAmber;
    ctx.beginPath();
    ctx.arc(rx, ry, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "700 9px monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      `REQ ${currentTile?.shortKey ?? ""}`,
      rx,
      ry - 9
    );
  } else if (tileLocalProg <= 0.86) {
    // Animated Response Packet (0.44 .. 0.86 -> Server back to Car/Camera)
    const st = Math.min((tileLocalProg - 0.44) / 0.4, 1);
    const sx = evalQuad(st, serverX - 28, resCtrlX, camX + 6);
    const sy = evalQuad(st, serverY + 18, resCtrlY, camY);
    const respColor = respIsFail ? colors.packetCrimson : colors.packetSuccess;
    ctx.fillStyle = respColor;
    ctx.beginPath();
    ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "700 9px monospace";
    ctx.textAlign = "center";
    ctx.fillText(respIsFail ? "HTTP 400" : "HTTP 200", sx, sy - 9);
  }

  // Server & Pandas ETL Pill at top
  drawPill(
    ctx,
    serverX,
    serverY,
    compact ? 146 : 186,
    36,
    "REM TILE SERVER",
    "Z16 QUADKEY • PANDAS ETL",
    colors,
    colors.chassisAccent
  );

  // Subtle legend on top-left when space allows
  if (!compact) {
    ctx.textAlign = "left";
    ctx.font = "600 9.5px monospace";
    ctx.fillStyle = colors.packetAmber;
    ctx.fillText("■ LOADING", gridLeft, serverY - 6);
    ctx.fillStyle = colors.packetSuccess;
    ctx.fillText("■ HTTP 200 OK", gridLeft + 84, serverY - 6);
    ctx.fillStyle = colors.packetCrimson;
    ctx.fillText("■ HTTP 400 FAILED", gridLeft + 184, serverY - 6);
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
