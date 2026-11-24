import type { CanvasThemePalette } from "@/lib/theme";

export type GraitecModuleId =
  | "footing"
  | "column"
  | "beam"
  | "slab"
  | "wall"
  | "masonry";

export type GraitecTreeNodeId = GraitecModuleId | "perforation";

export interface GraitecModuleMeta {
  id: GraitecTreeNodeId;
  label: string;
  viewModel: string;
  codeStandard: string;
  specLabel: string;
  specValue: string;
  rebarOrMesh: string;
  summary: string;
}

export const GRAITEC_MODULES: readonly GraitecModuleId[] = [
  "footing",
  "column",
  "beam",
  "slab",
  "wall",
  "masonry",
] as const;

export const GRAITEC_NODE_SPECS: Record<GraitecTreeNodeId, GraitecModuleMeta> = {
  footing: {
    id: "footing",
    label: "Footing",
    viewModel: "FootingModuleVM",
    codeStandard: "EN 1992-1 • Punching Shear",
    specLabel: "Soil Bearing",
    specValue: "240 kPa OK",
    rebarOrMesh: "B500B Pad Grid Ø14@150",
    summary: "4× isolated RC pad footings with bearing pressure & punching perimeter.",
  },
  column: {
    id: "column",
    label: "Column",
    viewModel: "ColumnModuleVM",
    codeStandard: "Biaxial M-N • Confinement",
    specLabel: "Axial Load",
    specValue: "NEd = 1,420 kN",
    rebarOrMesh: "8Ø20 Long. + Ø8/150 Stirrups",
    summary: "4× structural RC piers with corner longitudinal bars & stirrup confinement.",
  },
  beam: {
    id: "beam",
    label: "Beam",
    viewModel: "BeamModuleVM",
    codeStandard: "Flexure & Shear Envelope",
    specLabel: "Frame Span",
    specValue: "L = 6.00 m (30×55cm)",
    rebarOrMesh: "4Ø18 Top/Bot + Anchorage",
    summary: "Perimeter reinforced frame tie beams linking column tops & shear zone.",
  },
  slab: {
    id: "slab",
    label: "Slab",
    viewModel: "SlabModuleVM",
    codeStandard: "2D/3D FEM Strip Method",
    specLabel: "Diaphragm",
    specValue: "h = 220 mm • Δ = 4.2mm",
    rebarOrMesh: "FEM Planar Strip Mesh",
    summary: "Top horizontal diaphragm plate with FEM strip mesh & deflection nodes.",
  },
  wall: {
    id: "wall",
    label: "Wall",
    viewModel: "ShearWallModuleVM",
    codeStandard: "EN 1992 Shear Wall",
    specLabel: "Geometry",
    specValue: "4.80m × 2.80m × 25cm",
    rebarOrMesh: "Ø12@150 + Boundary Cage",
    summary: "Parametric 3D RC shear wall supporting real-time boolean perforations.",
  },
  masonry: {
    id: "masonry",
    label: "Masonry",
    viewModel: "MasonryCR6ModuleVM",
    codeStandard: "Eurocode 6 (EN 1996) / CR6",
    specLabel: "Seismic Shear",
    specValue: "fv0 = 0.28 MPa PASS",
    rebarOrMesh: "Confined Masonry + Diagonal Strut",
    summary: "Courseted masonry wall check under Romanian CR6 & Eurocode 6 seismic rules.",
  },
  perforation: {
    id: "perforation",
    label: "Perforate Wall",
    viewModel: "WallOpeningBooleanVM",
    codeStandard: "CSG 3D Boolean + INotify",
    specLabel: "Cutout",
    specValue: "1.80×1.40m (L/R 1.50 • T 0.65 • B 0.75)",
    rebarOrMesh: "4-Edge Dynamic Annotations",
    summary: "2-click boolean subtraction on wall mesh triggering 4-edge auto re-dimensioning.",
  },
};

export interface GraitecCadRenderState {
  mode: "auto" | "manual";
  activeSelection: GraitecTreeNodeId;
  moduleProgress: Record<GraitecModuleId, number>;
  perforationProgress: number;
  notifyPulse: number;
}

type SceneColors = CanvasThemePalette["engineeringShowcase"];

interface Vec2 {
  x: number;
  y: number;
}

interface IsoProjector {
  (x: number, y: number, z: number): Vec2;
}

function clamp01(val: number): number {
  return Math.max(0, Math.min(1, val));
}

export function drawRoundRect(
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

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - clamp01(t), 3);
}

function drawPolygon(
  ctx: CanvasRenderingContext2D,
  pts: Vec2[],
  fillStyle?: string,
  strokeStyle?: string,
  lineWidth = 1.4,
  dashed?: number[]
) {
  if (pts.length === 0) return;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(pts[0]!.x, pts[0]!.y);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i]!.x, pts[i]!.y);
  }
  ctx.closePath();
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  if (strokeStyle) {
    if (dashed) ctx.setLineDash(dashed);
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
  ctx.restore();
}

function drawIsoBox(
  ctx: CanvasRenderingContext2D,
  iso: IsoProjector,
  x0: number,
  y0: number,
  z0: number,
  x1: number,
  y1: number,
  z1: number,
  colors: SceneColors,
  prog: number,
  highlighted: boolean
) {
  if (prog <= 0.01) return;
  const p = clamp01(prog);
  const currentZ1 = z0 + (z1 - z0) * easeOutCubic(Math.min(p / 0.72, 1));
  const strokeCol = highlighted
    ? colors.packetAmber
    : colors.cadBeamStroke.replace("ALPHA", p < 0.35 ? "0.7" : "0.9");
  const isWireframeOnly = p < 0.32;
  const lineW = highlighted ? 2 : 1.3;

  // Visible 3 faces for front-left-above camera (+x right-down, +y left-down, +z up):
  // Front-Left face (y = y1), Front-Right face (x = x1), Top cap (z = currentZ1)
  const topPts = [
    iso(x0, y0, currentZ1),
    iso(x1, y0, currentZ1),
    iso(x1, y1, currentZ1),
    iso(x0, y1, currentZ1),
  ];
  const frontLeftPts = [
    iso(x0, y1, z0),
    iso(x1, y1, z0),
    iso(x1, y1, currentZ1),
    iso(x0, y1, currentZ1),
  ];
  const frontRightPts = [
    iso(x1, y0, z0),
    iso(x1, y1, z0),
    iso(x1, y1, currentZ1),
    iso(x1, y0, currentZ1),
  ];

  if (isWireframeOnly) {
    drawPolygon(ctx, frontLeftPts, undefined, strokeCol, 1.2, [4, 3]);
    drawPolygon(ctx, frontRightPts, undefined, strokeCol, 1.2, [4, 3]);
    drawPolygon(ctx, topPts, undefined, strokeCol, 1.2, [4, 3]);

    // Corner CAD anchor nodes during Phase 1 wireframe construction
    ctx.fillStyle = colors.cadNodeFill;
    for (const pt of [topPts[0]!, topPts[2]!, frontLeftPts[0]!]) {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }

  const faceAlpha = clamp01((p - 0.32) / 0.35);
  ctx.save();
  ctx.globalAlpha = 0.25 + faceAlpha * 0.75;
  drawPolygon(ctx, frontRightPts, colors.cadFaceSide, strokeCol, lineW);
  drawPolygon(ctx, frontLeftPts, colors.cadFaceFront, strokeCol, lineW);
  drawPolygon(ctx, topPts, colors.cadFaceTop, strokeCol, lineW);
  ctx.restore();
}

export function computeAutoShowcaseState(
  phase: number,
  velocityBoost: number
): GraitecCadRenderState {
  // Smooth continuous sequence across all 6 structural modules + Wall Perforation (~16s full cycle)
  const loopSpeed = 0.045 + velocityBoost * 0.025;
  const cycle = phase === 0 ? 0.86 : (phase * loopSpeed) % 1;

  const ramp = (start: number, span: number) =>
    clamp01((cycle - start) / span);

  const footing = ramp(0.02, 0.13);
  const column = ramp(0.14, 0.14);
  const beam = ramp(0.26, 0.14);
  const slab = ramp(0.38, 0.14);
  const wall = ramp(0.5, 0.14);
  const masonry = cycle >= 0.78 && cycle < 0.9 ? clamp01((cycle - 0.78) / 0.08) : 0;
  const perforationProgress = ramp(0.64, 0.2);

  let activeSelection: GraitecTreeNodeId = "footing";
  if (cycle >= 0.78 && cycle < 0.9) activeSelection = "masonry";
  else if (cycle >= 0.64) activeSelection = "perforation";
  else if (cycle >= 0.5) activeSelection = "wall";
  else if (cycle >= 0.38) activeSelection = "slab";
  else if (cycle >= 0.26) activeSelection = "beam";
  else if (cycle >= 0.14) activeSelection = "column";

  return {
    mode: "auto",
    activeSelection,
    moduleProgress: {
      footing,
      column,
      beam,
      slab,
      wall,
      masonry,
    },
    perforationProgress,
    notifyPulse: cycle >= 0.74 && cycle <= 0.86 ? 1 - Math.abs(cycle - 0.8) / 0.06 : 0,
  };
}

export function drawGraitecCadScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colors: SceneColors,
  state: GraitecCadRenderState
) {
  const compact = width < 520;
  const scale = compact
    ? Math.min(width * 0.36, 108)
    : Math.min(height * 0.47, width * 0.32, 134);
  const originX = width * 0.5;
  const originY = height * (compact ? 0.73 : 0.74);

  // Structural bay world coordinates
  const W = 1.0;
  const D = 0.72;
  const wallT = 0.08;
  const colS = 0.08;
  const footS = 0.18;
  const footH = 0.1;
  const H = 0.74;
  const beamH = 0.09;
  const slabT = 0.06;

  const iso: IsoProjector = (x, y, z) => ({
    x: originX + (x - W * 0.5 - (y - D * 0.5)) * scale * 0.88,
    y: originY + (x - W * 0.5 + (y - D * 0.5)) * scale * 0.44 - z * scale * 0.92,
  });

  // 1) Blueprint Foundation Datum Grid (z = 0)
  ctx.save();
  ctx.strokeStyle = colors.cadSlabGrid.replace("ALPHA", "0.28");
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const t = i / 4;
    const pA = iso(-0.1 + t * (W + 0.2), -0.1, 0);
    const pB = iso(-0.1 + t * (W + 0.2), D + 0.1, 0);
    ctx.beginPath();
    ctx.moveTo(pA.x, pA.y);
    ctx.lineTo(pB.x, pB.y);
    ctx.stroke();
  }
  for (let j = 0; j <= 3; j++) {
    const t = j / 3;
    const pA = iso(-0.1, -0.1 + t * (D + 0.2), 0);
    const pB = iso(W + 0.1, -0.1 + t * (D + 0.2), 0);
    ctx.beginPath();
    ctx.moveTo(pA.x, pA.y);
    ctx.lineTo(pB.x, pB.y);
    ctx.stroke();
  }
  ctx.restore();

  const mProg = state.moduleProgress;
  const sel = state.activeSelection;

  // Helper: draw footing pad + column at a bay corner (cx, cy)
  const drawFootingAt = (cx: number, cy: number) => {
    if (mProg.footing <= 0.01) return;
    drawIsoBox(
      ctx,
      iso,
      cx - footS * 0.5,
      cy - footS * 0.5,
      -footH,
      cx + footS * 0.5,
      cy + footS * 0.5,
      0.01,
      colors,
      mProg.footing,
      sel === "footing"
    );

    // Phase 3 Soil Bearing Stress Arrows under Footing
    if (mProg.footing >= 0.72) {
      ctx.save();
      ctx.strokeStyle = colors.packetSuccess;
      ctx.lineWidth = 1.2;
      for (const ox of [-0.04, 0.04]) {
        const bot = iso(cx + ox, cy + footS * 0.5, -footH - 0.09);
        const top = iso(cx + ox, cy + footS * 0.5, -footH - 0.01);
        ctx.beginPath();
        ctx.moveTo(bot.x, bot.y);
        ctx.lineTo(top.x, top.y);
        ctx.lineTo(top.x - 2.5, top.y + 3);
        ctx.moveTo(top.x, top.y);
        ctx.lineTo(top.x + 2.5, top.y + 3);
        ctx.stroke();
      }
      ctx.restore();
    }
  };

  const drawColumnAt = (cx: number, cy: number) => {
    if (mProg.column <= 0.01) return;
    drawIsoBox(
      ctx,
      iso,
      cx - colS * 0.5,
      cy - colS * 0.5,
      0.01,
      cx + colS * 0.5,
      cy + colS * 0.5,
      H,
      colors,
      mProg.column,
      sel === "column"
    );

    // Phase 3 Horizontal Stirrup Confinement Bands & Axial Load Vector
    if (mProg.column >= 0.75) {
      ctx.save();
      ctx.strokeStyle = colors.cadRebarStroke;
      ctx.lineWidth = 1;
      for (const sz of [0.16, 0.34, 0.52, 0.66]) {
        const s0 = iso(cx - colS * 0.5, cy + colS * 0.5, sz);
        const s1 = iso(cx + colS * 0.5, cy + colS * 0.5, sz);
        const s2 = iso(cx + colS * 0.5, cy - colS * 0.5, sz);
        ctx.beginPath();
        ctx.moveTo(s0.x, s0.y);
        ctx.lineTo(s1.x, s1.y);
        ctx.lineTo(s2.x, s2.y);
        ctx.stroke();
      }
      ctx.restore();
    }
  };

  // Painter's Algorithm Depth Order: Back Corner (0,0) -> Sides (W,0) & (0,D) -> Rear Beams -> Slab -> Wall -> Front Corner (W,D)
  drawFootingAt(0.05, 0.05);
  drawColumnAt(0.05, 0.05);

  drawFootingAt(W - 0.05, 0.05);
  drawColumnAt(W - 0.05, 0.05);

  drawFootingAt(0.05, D - 0.05);
  drawColumnAt(0.05, D - 0.05);

  // Rear Beams (back-left & back-right)
  if (mProg.beam > 0.01) {
    drawIsoBox(
      ctx,
      iso,
      0.05,
      0.02,
      H - beamH,
      W - 0.05,
      0.08,
      H,
      colors,
      mProg.beam,
      sel === "beam"
    );
    drawIsoBox(
      ctx,
      iso,
      0.02,
      0.05,
      H - beamH,
      0.08,
      D - 0.05,
      H,
      colors,
      mProg.beam,
      sel === "beam"
    );
  }

  // Top Structural Diaphragm Slab + 2D FEM Strip Mesh
  if (mProg.slab > 0.01) {
    drawIsoBox(
      ctx,
      iso,
      0.0,
      0.0,
      H,
      W,
      D,
      H + slabT,
      colors,
      mProg.slab,
      sel === "slab"
    );

    if (mProg.slab >= 0.7) {
      const zTop = H + slabT * easeOutCubic(Math.min(mProg.slab / 0.72, 1));
      ctx.save();
      ctx.strokeStyle =
        sel === "slab" ? colors.packetAmber : colors.cadSlabGrid.replace("ALPHA", "0.65");
      ctx.lineWidth = 1;
      for (let i = 1; i < 5; i++) {
        const tx = (i / 5) * W;
        const a = iso(tx, 0, zTop);
        const b = iso(tx, D, zTop);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      for (let j = 1; j < 4; j++) {
        const ty = (j / 4) * D;
        const a = iso(0, ty, zTop);
        const b = iso(W, ty, zTop);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  // Front Beams (Front-Right opening beam & Front-Left top beam over wall)
  if (mProg.beam > 0.01) {
    drawIsoBox(
      ctx,
      iso,
      W - 0.08,
      0.05,
      H - beamH,
      W - 0.02,
      D - 0.05,
      H,
      colors,
      mProg.beam,
      sel === "beam"
    );
    drawIsoBox(
      ctx,
      iso,
      0.05,
      D - 0.08,
      H - beamH,
      W - 0.05,
      D - 0.02,
      H,
      colors,
      mProg.beam,
      sel === "beam"
    );

    // Phase 3 Longitudinal Beam Rebar Trace on Front-Right Tie Beam
    if (mProg.beam >= 0.75) {
      ctx.save();
      ctx.strokeStyle = colors.cadRebarStroke;
      ctx.lineWidth = 1.4;
      const rA = iso(W - 0.02, 0.08, H - beamH * 0.35);
      const rB = iso(W - 0.02, D - 0.08, H - beamH * 0.35);
      ctx.beginPath();
      ctx.moveTo(rA.x, rA.y);
      ctx.lineTo(rB.x, rB.y);
      ctx.stroke();
      ctx.restore();
    }
  }

  // Front-Left Parametric Hero Wall OR Eurocode 6 / CR6 Masonry Wall + Boolean 3D Perforation
  const hasMasonry = mProg.masonry > 0.02;
  const activeWallProg = Math.max(mProg.wall, mProg.masonry);

  if (activeWallProg > 0.01) {
    const wx0 = 0.09;
    const wx1 = W - 0.09;
    const wy = D - 0.015;
    const wz0 = 0.02;
    const wzMax = H - beamH - 0.01;
    const wz1 = wz0 + (wzMax - wz0) * easeOutCubic(Math.min(activeWallProg / 0.72, 1));

    // Hole opening coordinates inside front-left wall (centered cutout)
    const hx0 = 0.33;
    const hx1 = 0.67;
    const hz0 = 0.16;
    const hz1 = 0.52;
    const perfP = state.perforationProgress;
    const showCutout = perfP >= 0.36 && activeWallProg >= 0.72;

    const wallStroke =
      sel === "wall" || sel === "masonry"
        ? colors.packetAmber
        : hasMasonry
          ? colors.packetCrimson
          : colors.chassisAccent;

    // Draw front-left wall elevation using evenodd path so hole reveals genuine see-through interior
    ctx.save();
    ctx.beginPath();
    const wFL0 = iso(wx0, wy, wz0);
    const wFL1 = iso(wx1, wy, wz0);
    const wFL2 = iso(wx1, wy, wz1);
    const wFL3 = iso(wx0, wy, wz1);
    ctx.moveTo(wFL0.x, wFL0.y);
    ctx.lineTo(wFL1.x, wFL1.y);
    ctx.lineTo(wFL2.x, wFL2.y);
    ctx.lineTo(wFL3.x, wFL3.y);
    ctx.closePath();

    if (showCutout) {
      const cutScale = clamp01((perfP - 0.36) / 0.25);
      const cxH = (hx0 + hx1) * 0.5;
      const czH = (hz0 + hz1) * 0.5;
      const chx0 = cxH - (hx1 - hx0) * 0.5 * cutScale;
      const chx1 = cxH + (hx1 - hx0) * 0.5 * cutScale;
      const chz0 = czH - (hz1 - hz0) * 0.5 * cutScale;
      const chz1 = czH + (hz1 - hz0) * 0.5 * cutScale;

      const h0 = iso(chx0, wy, chz0);
      const h1 = iso(chx0, wy, chz1);
      const h2 = iso(chx1, wy, chz1);
      const h3 = iso(chx1, wy, chz0);
      ctx.moveTo(h0.x, h0.y);
      ctx.lineTo(h1.x, h1.y);
      ctx.lineTo(h2.x, h2.y);
      ctx.lineTo(h3.x, h3.y);
      ctx.closePath();
    }

    if (activeWallProg < 0.32) {
      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = wallStroke;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    } else {
      ctx.fillStyle = hasMasonry ? "rgba(244, 63, 94, 0.18)" : colors.cadFaceFront;
      ctx.fill("evenodd");
      ctx.strokeStyle = wallStroke;
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Clipped Engineering Detail (Masonry Courses + Seismic Strut OR Concrete Boundary Rebar)
      if (activeWallProg >= 0.72) {
        ctx.clip("evenodd");
        if (hasMasonry) {
          // Staggered Masonry Block Courses (EN 1996 / CR6)
          ctx.strokeStyle = colors.packetCrimson;
          ctx.globalAlpha = 0.45;
          ctx.lineWidth = 0.9;
          for (let r = 1; r <= 6; r++) {
            const bz = wz0 + ((wz1 - wz0) * r) / 7;
            const cA = iso(wx0, wy, bz);
            const cB = iso(wx1, wy, bz);
            ctx.beginPath();
            ctx.moveTo(cA.x, cA.y);
            ctx.lineTo(cB.x, cB.y);
            ctx.stroke();
          }
          // Diagonal In-Plane Seismic Shear Strut
          ctx.setLineDash([5, 4]);
          ctx.strokeStyle = colors.packetAmber;
          ctx.globalAlpha = 0.85;
          ctx.lineWidth = 1.6;
          const dA = iso(wx0 + 0.04, wy, wz0 + 0.03);
          const dB = iso(wx1 - 0.04, wy, wz1 - 0.03);
          ctx.beginPath();
          ctx.moveTo(dA.x, dA.y);
          ctx.lineTo(dB.x, dB.y);
          ctx.stroke();
        } else {
          // Vertical Boundary & Mesh Rebar Grid
          ctx.strokeStyle = colors.cadRebarStroke;
          ctx.globalAlpha = 0.5;
          ctx.lineWidth = 0.9;
          for (let rx = wx0 + 0.08; rx < wx1 - 0.04; rx += 0.14) {
            const rb0 = iso(rx, wy, wz0);
            const rb1 = iso(rx, wy, wz1);
            ctx.beginPath();
            ctx.moveTo(rb0.x, rb0.y);
            ctx.lineTo(rb1.x, rb1.y);
            ctx.stroke();
          }
        }
      }
    }
    ctx.restore();

    // 3D Inner Wall Cutout Thickness Planes (Left Inner Jamb + Bottom Inner Sill)
    if (showCutout && perfP >= 0.5) {
      const sillPts = [
        iso(hx0, wy, hz0),
        iso(hx1, wy, hz0),
        iso(hx1, wy - wallT, hz0),
        iso(hx0, wy - wallT, hz0),
      ];
      const jambPts = [
        iso(hx0, wy, hz0),
        iso(hx0, wy, hz1),
        iso(hx0, wy - wallT, hz1),
        iso(hx0, wy - wallT, hz0),
      ];
      drawPolygon(ctx, sillPts, colors.cadFaceTop, colors.packetAmber, 1.3);
      drawPolygon(ctx, jambPts, colors.cadFaceSide, colors.packetAmber, 1.3);

      // Opening perimeter highlight
      const holeRing = [
        iso(hx0, wy, hz0),
        iso(hx1, wy, hz0),
        iso(hx1, wy, hz1),
        iso(hx0, wy, hz1),
      ];
      drawPolygon(ctx, holeRing, undefined, colors.packetAmber, 1.8);
    }

    // 2-Click CAD Cursor Targeting Animation during Perforate Phase (0.01 .. 0.42)
    if (perfP > 0.01 && perfP < 0.48) {
      const p1 = iso(hx0, wy, hz1);
      const p2 = iso(hx1, wy, hz0);
      const cursorT = clamp01(perfP / 0.36);
      const curX = p1.x + (p2.x - p1.x) * cursorT;
      const curY = p1.y + (p2.y - p1.y) * cursorT;

      // Bounding box preview between Click 1 & Click 2
      const bx0 = hx0;
      const bz1 = hz1;
      const bx1 = hx0 + (hx1 - hx0) * cursorT;
      const bz0 = hz1 + (hz0 - hz1) * cursorT;
      const previewPts = [
        iso(bx0, wy, bz0),
        iso(bx1, wy, bz0),
        iso(bx1, wy, bz1),
        iso(bx0, wy, bz1),
      ];
      drawPolygon(ctx, previewPts, "rgba(245, 158, 11, 0.16)", colors.packetAmber, 1.5, [4, 3]);

      // P1 Click Ring & Moving P2 Crosshair
      ctx.strokeStyle = colors.packetAmber;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, 4, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(curX - 6, curY);
      ctx.lineTo(curX + 6, curY);
      ctx.moveTo(curX, curY - 6);
      ctx.lineTo(curX, curY + 6);
      ctx.stroke();
    }

    // INotifyPropertyChanged 4-Edge Offset Dimension Lines around Perforation
    if (perfP >= 0.72) {
      const midX = (hx0 + hx1) * 0.5;
      const midZ = (hz0 + hz1) * 0.5;
      ctx.save();
      ctx.strokeStyle = colors.trajectoryStroke;
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1.4;

      const pairs: [Vec2, Vec2][] = [
        [iso(wx0, wy, midZ), iso(hx0, wy, midZ)], // Left offset
        [iso(hx1, wy, midZ), iso(wx1, wy, midZ)], // Right offset
        [iso(midX, wy, wzMax), iso(midX, wy, hz1)], // Top offset
        [iso(midX, wy, hz0), iso(midX, wy, wz0)], // Bottom offset
      ];
      for (const [a, b] of pairs) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.restore();

      // Dimension pill callouts with clean backdrop so numbers never clash with wireframe strokes
      const drawDimBadge = (label: string, bx: number, by: number) => {
        ctx.font = "700 8px monospace";
        const w = ctx.measureText(label).width + 8;
        drawRoundRect(ctx, bx - w / 2, by - 7, w, 13, 3);
        ctx.fillStyle = colors.nodeCardFill;
        ctx.fill();
        ctx.strokeStyle = colors.trajectoryStroke;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.fillStyle = colors.packetSuccess;
        ctx.textAlign = "center";
        ctx.fillText(label, bx, by + 2.5);
      };

      const holeCenter = iso(midX, wy, midZ);
      drawDimBadge("1.80×1.40m", holeCenter.x, holeCenter.y);
      if (!compact) {
        const topMid = iso(midX, wy, (wzMax + hz1) * 0.5);
        const leftMid = iso((wx0 + hx0) * 0.5, wy, midZ);
        drawDimBadge("0.65m", topMid.x + 22, topMid.y);
        drawDimBadge("1.50m", leftMid.x - 4, leftMid.y - 6);
      }
    }
  }

  // Front-Most Corner Footing & Column (W - 0.05, D - 0.05) drawn LAST for exact occlusion
  drawFootingAt(W - 0.05, D - 0.05);
  drawColumnAt(W - 0.05, D - 0.05);

  // Top Left HUD Callout inside 3D Viewport
  const activeMeta = GRAITEC_NODE_SPECS[state.activeSelection];
  ctx.textAlign = "left";
  ctx.font = "700 9px monospace";
  ctx.fillStyle =
    state.notifyPulse > 0.2 ? colors.packetAmber : colors.packetPrimary;
  ctx.fillText(
    `${state.mode === "auto" ? "AUTO BUILD" : "INTERACTIVE"} • ${activeMeta.label.toUpperCase()} (${activeMeta.codeStandard})`,
    14,
    22
  );

  if (state.perforationProgress >= 0.72) {
    ctx.textAlign = "right";
    ctx.fillStyle = colors.packetSuccess;
    ctx.font = "700 8.5px monospace";
    ctx.fillText("INotifyPropertyChanged • 4-EDGE DIMS SYNC", width - 14, 22);
  }
}
