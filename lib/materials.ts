export const MATERIALS = {
  'Plywood': { width_ft: 4, height_ft: 8, area_ft2: 32 },
  'OSB': { width_ft: 4, height_ft: 8, area_ft2: 32 },
  'Shingle Bundle': { coverage_ft2: 33.3 },
  'Roofing felt': { coverage_ft2: 200 },
  'Gravel': { density_lb_ft3: 100, typical_depth_in: 2 },
  'Mulch': { density_lb_ft3: 25, typical_depth_in: 3 },
}

export function areaFromBoxFraction(imageWidthFt: number, imageHeightFt: number, box: { left: number; top: number; width: number; height: number }) {
  return imageWidthFt * imageHeightFt * box.width * box.height
}

export function cubicYardsFromAreaAndDepth(areaFt2: number, depthInches: number) {
  const depthFt = depthInches / 12
  const cubicFt = areaFt2 * depthFt
  return cubicFt / 27
}
