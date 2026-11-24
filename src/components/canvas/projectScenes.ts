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
      "2-lane road at 60 km/h -> +2 square Quadkey prefetch ahead -> green/red localization route line tracks vehicle lock per tile.",
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
 * 1. CARIAD REM — 2-Lane Road, 60 km/h, 12 Square Z16 Quadkeys, +1 Advance Prefetch
 * ============================================================================ */
const CARIAD_TILES = [
  { quadkey: "1203221030201122", shortKey: "..1122", xyz: "[37516,23715]", fail: false },
  { quadkey: "1203221030201123", shortKey: "..1123", xyz: "[37517,23715]", fail: false },
  { quadkey: "1203221030201132", shortKey: "..1132", xyz: "[37518,23715]", fail: false },
  { quadkey: "1203221030201133", shortKey: "..1133", xyz: "[37519,23715]", fail: true },
  { quadkey: "1203221030210022", shortKey: "..0022", xyz: "[37520,23715]", fail: false },
  { quadkey: "1203221030210023", shortKey: "..0023", xyz: "[37521,23715]", fail: false },
  { quadkey: "1203221030210032", shortKey: "..0032", xyz: "[37522,23715]", fail: false },
  { quadkey: "1203221030210033", shortKey: "..0033", xyz: "[37523,23715]", fail: false },
  { quadkey: "1203221030210122", shortKey: "..0122", xyz: "[37524,23715]", fail: true },
  { quadkey: "1203221030210123", shortKey: "..0123", xyz: "[37525,23715]", fail: false },
  { quadkey: "1203221030210132", shortKey: "..0132", xyz: "[37526,23715]", fail: false },
  { quadkey: "1203221030210133", shortKey: "..0133", xyz: "[37527,23715]", fail: false },
] as const;

function drawCariadRemScene({
  ctx,
  width,
  height,
  phase,
  velocityBoost,
  colors,
}: SceneDrawContext) {
  const compact = width < 660;
  const tileCount = width < 460 ? 5 : width < 660 ? 8 : CARIAD_TILES.length;
  const gap = compact ? 2 : 3;
  const approachW = width < 460 ? 50 : width < 840 ? 72 : 94;
  const maxCorridorW = width - (compact ? 18 : 36);

  // Enforce strict 1:1 square tiles (width === height), scaled to fit all 12 squares cleanly
  const tileSize = Math.max(
    50,
    Math.min(
      compact ? 70 : 82,
      Math.floor((maxCorridorW - approachW - gap * (tileCount - 1)) / tileCount)
    )
  );
  const tilesTotalW = tileCount * tileSize + (tileCount - 1) * gap;
  const corridorW = approachW + tilesTotalW;
  const corridorLeft = Math.max(9, (width - corridorW) / 2);
  const tilesStartX = corridorLeft + approachW;
  const roadTop = height - tileSize - (compact ? 16 : 20);
  const tileStep = tileSize + gap;

  // Detailed 2-lane street geometry inside the lower/middle band of each square tile
  const laneTop = roadTop + (compact ? 13 : 16);
  const laneBottom = roadTop + tileSize - (compact ? 8 : 10);
  const roadCenterY = (laneTop + laneBottom) * 0.5;
  const bottomLaneCenterY = (roadCenterY + laneBottom) * 0.5;
  const topLaneCenterY = (laneTop + roadCenterY) * 0.5;

  // Continuous smooth GIF loop (~14s per full pass); static frame at 0.52 when phase === 0
  const loopSpeed = 0.048 + velocityBoost * 0.025;
  const cycle = phase === 0 ? 0.52 : (phase * loopSpeed) % 1;

  // Vehicle kinematics: starts at 0 km/h before Tile 0 while Tiles 0 & 1 prefetch,
  // accelerates to 60 km/h along the right lane of the 2-lane road, then slows cleanly
  const startFrontX = tilesStartX - approachW * 0.34;
  const launchEntryX = tilesStartX - tileSize * 0.04;
  const endFrontX = tilesStartX + (tileCount - 1) * tileStep + tileSize * 0.72;
  const cruiseSpan = endFrontX - launchEntryX;

  let carFrontX: number;
  let speedKmh: number;
  if (cycle < 0.14) {
    // Launch ramp: 0 -> 50 km/h while Tiles 0 & 1 prefetch ahead
    const t = cycle / 0.14;
    const easeIn = t * t;
    carFrontX = startFrontX + (launchEntryX - startFrontX) * easeIn;
    speedKmh = Math.round(t * 50);
  } else if (cycle < 0.89) {
    // Cruise at 60 km/h across the 2-lane street
    const t = (cycle - 0.14) / 0.75;
    carFrontX = launchEntryX + cruiseSpan * t;
    speedKmh =
      cycle < 0.18
        ? Math.round(50 + ((cycle - 0.14) / 0.04) * 10)
        : 60;
  } else {
    // Smooth end deceleration 60 -> 0 km/h before loop restart
    const t = (cycle - 0.89) / 0.11;
    const easeOut = 1 - Math.pow(1 - t, 2);
    carFrontX = endFrontX + tileSize * 0.14 * easeOut;
    speedKmh = Math.max(0, Math.round(60 * (1 - t)));
  }

  // Server pill positioned cleanly in upper-right stage
  const serverX = compact ? width * 0.72 : width * 0.77;
  const serverY = compact ? 32 : 36;

  // A) Two-Lane Asphalt Road Surface, Curbs, Edge Lines & Directional Lane Arrows
  ctx.fillStyle = "rgba(100, 116, 139, 0.16)";
  ctx.fillRect(0, laneTop - 3, width, 3);
  ctx.fillRect(0, laneBottom, width, 3);

  ctx.fillStyle = "rgba(15, 23, 42, 0.28)";
  ctx.fillRect(0, laneTop, width, laneBottom - laneTop);
  ctx.fillStyle = "rgba(148, 163, 184, 0.05)";
  ctx.fillRect(0, roadCenterY + 1, width, laneBottom - roadCenterY - 1);

  ctx.strokeStyle = colors.chassisStroke;
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(0, laneTop + 1);
  ctx.lineTo(width, laneTop + 1);
  ctx.moveTo(0, laneBottom - 1);
  ctx.lineTo(width, laneBottom - 1);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Entry stop-bar markings right before Tile 0
  ctx.fillStyle = colors.chassisStroke;
  ctx.globalAlpha = 0.28;
  for (let stripeY = laneTop + 4; stripeY < laneBottom - 4; stripeY += 7) {
    ctx.fillRect(tilesStartX - 10, stripeY, 6, 3.5);
  }
  ctx.globalAlpha = 1;

  // Directional painted arrows on asphalt (Upper lane: <- oncoming, Lower lane: -> ego direction)
  const drawLaneArrow = (ax: number, ay: number, dir: 1 | -1) => {
    ctx.save();
    ctx.strokeStyle = colors.chassisStroke;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(ax - 9 * dir, ay);
    ctx.lineTo(ax + 7 * dir, ay);
    ctx.lineTo(ax + 2 * dir, ay - 3.5);
    ctx.moveTo(ax + 7 * dir, ay);
    ctx.lineTo(ax + 2 * dir, ay + 3.5);
    ctx.stroke();
    ctx.restore();
  };

  for (let ax = 48; ax < width - 36; ax += 148) {
    drawLaneArrow(ax, topLaneCenterY, -1);
    drawLaneArrow(ax + 40, bottomLaneCenterY, 1);
  }

  let activeReqTileIdx = 0;
  let activeReqProg = 0;
  let hasActiveRequest = false;

  // B) Draw Square Quadkey Z16 Tiles — each tile loads 1 full square EARLIER (+1 buffer ahead)
  for (let i = 0; i < tileCount; i++) {
    const tileMeta = CARIAD_TILES[i];
    if (!tileMeta) continue;

    const tx = tilesStartX + i * tileStep;
    const ty = roadTop;

    let tileState: "idle" | "loading" | "ok" | "fail" = "idle";
    let localProg = 0;

    if (i === 0) {
      if (cycle >= 0.07) {
        tileState = tileMeta.fail ? "fail" : "ok";
        localProg = 1;
      } else if (cycle >= 0.008) {
        tileState = "loading";
        localProg = (cycle - 0.008) / 0.062;
      }
    } else if (i === 1) {
      if (cycle >= 0.135) {
        tileState = tileMeta.fail ? "fail" : "ok";
        localProg = 1;
      } else if (cycle >= 0.07) {
        tileState = "loading";
        localProg = (cycle - 0.07) / 0.065;
      }
    } else {
      // +1 square earlier lookahead: car in tile k has k and k+1 loaded while k+2 loads
      const distAhead = tx - carFrontX;
      const startPrefetchDist = tileStep * 1.96;
      const donePrefetchDist = tileStep * 1.12;

      if (distAhead <= donePrefetchDist) {
        tileState = tileMeta.fail ? "fail" : "ok";
        localProg = 1;
      } else if (distAhead < startPrefetchDist) {
        tileState = "loading";
        localProg =
          (startPrefetchDist - distAhead) /
          (startPrefetchDist - donePrefetchDist);
      }
    }

    if (tileState === "loading") {
      activeReqTileIdx = i;
      activeReqProg = Math.min(Math.max(localProg, 0), 1);
      hasActiveRequest = true;
    }

    // Tile background tint
    if (tileState === "ok") {
      ctx.fillStyle = "rgba(16, 185, 129, 0.13)";
    } else if (tileState === "fail") {
      ctx.fillStyle = "rgba(244, 63, 94, 0.15)";
    } else if (tileState === "loading") {
      ctx.fillStyle = "rgba(245, 158, 11, 0.13)";
    } else {
      ctx.fillStyle = "rgba(148, 163, 184, 0.05)";
    }
    drawRoundRect(ctx, tx, ty, tileSize, tileSize, 5);
    ctx.fill();

    // Square border (Yellow while loading, Green HTTP 200, Red HTTP 400)
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
      ctx.lineWidth = 1.9;
    } else {
      ctx.strokeStyle = colors.packetCrimson;
      ctx.lineWidth = 1.9;
    }
    drawRoundRect(ctx, tx, ty, tileSize, tileSize, 5);
    ctx.stroke();
    ctx.restore();

    // Top metadata band inside square (cleanly above the upper road curb)
    const roomySquare = tileSize >= 74;
    ctx.textAlign = "left";
    ctx.fillStyle = colors.nodeSubText;
    ctx.font = "600 7.5px monospace";
    ctx.fillText(
      roomySquare ? tileMeta.shortKey : tileMeta.shortKey.slice(-4),
      tx + 4,
      ty + 11
    );

    ctx.textAlign = "right";
    ctx.font = "700 7.5px monospace";
    if (tileState === "loading") {
      ctx.fillStyle = colors.packetAmber;
      ctx.fillText(roomySquare ? "LOADING" : "LOAD", tx + tileSize - 4, ty + 11);
    } else if (tileState === "ok") {
      ctx.fillStyle = colors.packetSuccess;
      ctx.fillText(roomySquare ? "HTTP 200" : "200", tx + tileSize - 4, ty + 11);
    } else if (tileState === "fail") {
      ctx.fillStyle = colors.packetCrimson;
      ctx.fillText(roomySquare ? "HTTP 400" : "400", tx + tileSize - 4, ty + 11);
    } else {
      ctx.fillStyle = colors.nodeSubText;
      ctx.fillText("WAIT", tx + tileSize - 4, ty + 11);
    }

    // Bottom loading progress line inside the square (below the lower road curb)
    const barX = tx + 4;
    const barY = ty + tileSize - 6;
    const barMaxW = tileSize - 8;
    ctx.fillStyle = colors.busTrace;
    ctx.fillRect(barX, barY, barMaxW, 2.5);

    if (tileState === "loading") {
      ctx.fillStyle = colors.packetAmber;
      ctx.fillRect(barX, barY, barMaxW * activeReqProg, 2.5);
    } else if (tileState === "ok") {
      ctx.fillStyle = colors.packetSuccess;
      ctx.fillRect(barX, barY, barMaxW, 2.5);
    } else if (tileState === "fail") {
      ctx.fillStyle = colors.packetCrimson;
      ctx.fillRect(barX, barY, barMaxW, 2.5);
    }
  }

  // Crisp Dashed Centerline dividing the 2 lanes across the full road width
  ctx.save();
  ctx.setLineDash([12, 9]);
  ctx.strokeStyle = colors.chassisStroke;
  ctx.globalAlpha = 0.72;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(0, roadCenterY);
  ctx.lineTo(width, roadCenterY);
  ctx.stroke();
  ctx.restore();

  // C) Moving Ego Vehicle & Per-Tile Localization Route Line along Lane 2
  const carLen = compact ? 36 : 44;
  const carWid = compact ? 15 : 18;
  const carX = carFrontX - carLen / 2;
  const carY = bottomLaneCenterY;
  const camX = carFrontX - 4;
  const camY = carY - carWid / 2 + 2;

  // Determine which tile currently holds the vehicle center for localization status
  const currentTileIdx = Math.floor((carX - tilesStartX) / tileStep);
  const currentLocTile =
    currentTileIdx >= 0 && currentTileIdx < tileCount
      ? CARIAD_TILES[currentTileIdx]
      : undefined;

  // Route Localization Trace Line along the car's driven path in Lane 2:
  // green across HTTP 200 tiles (localized), turns red across HTTP 400 tiles (unlocalized)
  for (let i = 0; i < tileCount; i++) {
    const tileMeta = CARIAD_TILES[i];
    if (!tileMeta) continue;
    const tx = tilesStartX + i * tileStep;
    if (carX <= tx) break;

    const segStart = tx;
    const segEnd =
      i === tileCount - 1
        ? Math.min(carX, tx + tileSize)
        : Math.min(carX, tx + tileStep);
    if (segEnd <= segStart) continue;

    const locColor = tileMeta.fail
      ? colors.packetCrimson
      : colors.packetSuccess;

    ctx.save();
    ctx.lineCap = "round";
    ctx.strokeStyle = locColor;
    ctx.globalAlpha = 0.28;
    ctx.lineWidth = 6.5;
    ctx.beginPath();
    ctx.moveTo(segStart, bottomLaneCenterY);
    ctx.lineTo(segEnd, bottomLaneCenterY);
    ctx.stroke();

    ctx.globalAlpha = 0.96;
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(segStart, bottomLaneCenterY);
    ctx.lineTo(segEnd, bottomLaneCenterY);
    ctx.stroke();
    ctx.restore();
  }

  // Front Dashcam Long-Range Lookahead Cone reaching +2 squares ahead
  const coneLen = Math.min(tileStep * 1.9, compact ? 95 : 152);
  const coneGrad = ctx.createLinearGradient(
    carFrontX,
    carY,
    carFrontX + coneLen,
    carY
  );
  coneGrad.addColorStop(0, colors.visionConeStart);
  coneGrad.addColorStop(1, colors.visionConeEnd);
  ctx.fillStyle = coneGrad;
  ctx.beginPath();
  ctx.moveTo(carFrontX - 2, carY);
  ctx.lineTo(carFrontX + coneLen, carY - (compact ? 11 : 14));
  ctx.lineTo(carFrontX + coneLen, carY + (compact ? 11 : 14));
  ctx.closePath();
  ctx.fill();

  // Tires on car chassis
  ctx.fillStyle = colors.chassisStroke;
  const wheelOffsetX = carLen * 0.28;
  for (const wx of [carX - wheelOffsetX, carX + wheelOffsetX]) {
    ctx.fillRect(wx - 4, carY - carWid / 2 - 1.5, 8, 2.5);
    ctx.fillRect(wx - 4, carY + carWid / 2 - 1, 8, 2.5);
  }

  // Top-Down Vehicle Silhouette
  drawRoundRect(ctx, carX - carLen / 2, carY - carWid / 2, carLen, carWid, 5);
  ctx.fillStyle = colors.chassisFill;
  ctx.fill();
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = currentLocTile
    ? currentLocTile.fail
      ? colors.packetCrimson
      : colors.packetSuccess
    : colors.chassisStroke;
  ctx.stroke();

  // Windshield & Cabin
  drawRoundRect(
    ctx,
    carX - carLen * 0.16,
    carY - carWid / 2 + 3,
    carLen * 0.42,
    carWid - 6,
    2.5
  );
  ctx.fillStyle = colors.canopyFill;
  ctx.fill();
  ctx.strokeStyle = colors.chassisAccent;
  ctx.lineWidth = 0.9;
  ctx.stroke();

  // Headlights & Taillights
  ctx.fillStyle = colors.packetPrimary;
  ctx.fillRect(carFrontX - 2, carY - carWid / 2 + 3, 2, 3);
  ctx.fillRect(carFrontX - 2, carY + carWid / 2 - 6, 2, 3);
  ctx.fillStyle = colors.packetCrimson;
  ctx.fillRect(carX - carLen / 2, carY - carWid / 2 + 3, 2, 3);
  ctx.fillRect(carX - carLen / 2, carY + carWid / 2 - 6, 2, 3);

  // Dashcam sensor dot & Roof GPS Localization Status Beacon
  ctx.fillStyle = colors.packetAmber;
  ctx.beginPath();
  ctx.arc(camX, camY + carWid * 0.34, 2.5, 0, Math.PI * 2);
  ctx.fill();

  if (currentLocTile) {
    ctx.fillStyle = currentLocTile.fail
      ? colors.packetCrimson
      : colors.packetSuccess;
    ctx.beginPath();
    ctx.arc(carX - carLen * 0.08, carY, 2.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Live speed & localization readout along the road shoulder
  ctx.textAlign = "left";
  ctx.font = "700 9.5px monospace";
  ctx.fillStyle = speedKmh === 0 ? colors.packetAmber : colors.packetPrimary;
  ctx.fillText(`SPD ${speedKmh} km/h`, corridorLeft + 2, roadTop - 10);

  ctx.font = "700 9px monospace";
  if (!currentLocTile) {
    ctx.fillStyle = colors.packetAmber;
    ctx.fillText("• LOC: STANDBY", corridorLeft + 88, roadTop - 10);
  } else if (currentLocTile.fail) {
    ctx.fillStyle = colors.packetCrimson;
    ctx.fillText("• LOC: LOST (HTTP 400)", corridorLeft + 88, roadTop - 10);
  } else {
    ctx.fillStyle = colors.packetSuccess;
    ctx.fillText("• LOC: LOCKED (HTTP 200)", corridorLeft + 88, roadTop - 10);
  }

  if (!compact) {
    ctx.fillStyle = colors.nodeSubText;
    ctx.font = "600 8.5px monospace";
    ctx.fillText("2-LANE ROAD • +2 TILE PREFETCH", corridorLeft + 250, roadTop - 10);
  }

  // D) Request (Dashcam -> Server) & Response (Server -> Car/Camera) Curves
  // Elevated control points keep packet badges above the square tile header row
  const reqCtrlX = (camX + serverX) * 0.36;
  const reqCtrlY = Math.min(serverY + 2, roadTop - 64);
  const resCtrlX = (camX + serverX) * 0.64;
  const resCtrlY = roadTop - 36;

  const activeTile = CARIAD_TILES[activeReqTileIdx];
  const respIsFail = Boolean(activeTile?.fail);

  ctx.save();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = colors.packetAmber;
  ctx.globalAlpha = hasActiveRequest ? 0.55 : 0.2;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(camX, camY);
  ctx.quadraticCurveTo(reqCtrlX, reqCtrlY, serverX - 44, serverY + 12);
  ctx.stroke();

  ctx.strokeStyle = respIsFail ? colors.packetCrimson : colors.packetSuccess;
  ctx.beginPath();
  ctx.moveTo(serverX - 26, serverY + 18);
  ctx.quadraticCurveTo(resCtrlX, resCtrlY, camX + 4, camY);
  ctx.stroke();
  ctx.restore();

  const evalQuad = (
    t: number,
    p0: number,
    p1: number,
    p2: number
  ): number => (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;

  if (hasActiveRequest) {
    if (activeReqProg < 0.48) {
      const rt = activeReqProg / 0.48;
      const rx = evalQuad(rt, camX, reqCtrlX, serverX - 44);
      const ry = evalQuad(rt, camY, reqCtrlY, serverY + 12);
      ctx.fillStyle = colors.packetAmber;
      ctx.beginPath();
      ctx.arc(rx, ry, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "700 9px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`REQ QK${activeTile?.shortKey ?? ""}`, rx, ry - 9);
    } else {
      const st = Math.min((activeReqProg - 0.48) / 0.52, 1);
      const sx = evalQuad(st, serverX - 26, resCtrlX, camX + 4);
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
  }

  // Server & Pandas ETL Pill at top
  drawPill(
    ctx,
    serverX,
    serverY,
    compact ? 150 : 196,
    36,
    "REM TILE SERVER",
    hasActiveRequest
      ? `PREFETCH QK${activeTile?.shortKey ?? ""}`
      : "Z16 QK 1203221030... • ETL",
    colors,
    hasActiveRequest
      ? respIsFail
        ? colors.packetCrimson
        : colors.packetAmber
      : colors.chassisAccent
  );

  // Legend on top-left when space allows
  if (!compact) {
    ctx.textAlign = "left";
    ctx.font = "600 9.5px monospace";
    ctx.fillStyle = colors.packetAmber;
    ctx.fillText("■ LOADING", corridorLeft, serverY - 8);
    ctx.fillStyle = colors.packetSuccess;
    ctx.fillText("■ HTTP 200 OK", corridorLeft + 84, serverY - 8);
    ctx.fillStyle = colors.packetCrimson;
    ctx.fillText("■ HTTP 400 FAILED", corridorLeft + 184, serverY - 8);

    ctx.font = "600 8.5px monospace";
    ctx.fillStyle = colors.packetSuccess;
    ctx.fillText("━ ROUTE: LOCALIZED", corridorLeft, serverY + 7);
    ctx.fillStyle = colors.packetCrimson;
    ctx.fillText("━ ROUTE: NOT LOCALIZED", corridorLeft + 132, serverY + 7);
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
