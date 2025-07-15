import * as d3 from "d3-geo";

// Elliptic integral function
function ellipticF(phi, m) {
  const { abs, atan, ln, PI: pi, sin, sqrt } = Math;
  const C1 = 10e-4, C2 = 10e-10, TOL = 10e-6;
  const sp = sin(phi);

  let k = sqrt(1 - m), h = sp * sp;

  // "complete" elliptic integral
  if (h >= 1 || abs(phi) === pi / 2) {  
    if (k <= TOL) return sp < 0 ? -Infinity : Infinity;
    m = 1, h = m, m += k;  
    while(abs(h - k) > C1 * m) {
      k = sqrt(h * k);
      m /= 2, h = m, m += k;
    }
    return sp < 0 ? -pi / m : pi / m;
  }
  // "incomplete" elliptic integral
  else {
    if (k <= TOL) return ln((1 + sp) / (1 - sp)) / 2;
    let g, n, p, r, y;
    m = 1, n = 0, g = m, p = m * k, m += k;
    y = sqrt((1 - h) / h);
    if (abs(y -= p / y) <= 0) y = C2 * sqrt(p);
    while (abs(g - k) > C1 * g) {
      k = 2 * sqrt(p), n += n;
      if (y < 0) n += 1;
      p = m * k, g = m, m += k;
      if (abs(y -= p / y) <= 0) y = C2 * sqrt(p);
    }
    if (y < 0) n += 1;
    r = (atan(m / y) + pi * n) / m;
    return sp < 0 ? -r : r;
  }
}

// Elliptic factory
function ellipticFactory(a, b, sm, sn) {
  let m = Math.asin(Math.sqrt(1 + Math.min(0, Math.cos(a + b))));
  if (sm) m = -m;

  let n = Math.asin(Math.sqrt(Math.abs(1 - Math.max(0, Math.cos(a - b)))));
  if (sn) n = -n;
  
  return [
    ellipticF(m, 0.5),
    ellipticF(n, 0.5)
  ];
}

// Inverse function
function inverse(x, y, lam, phi, proj) {
  const { abs, max, min, PI } = Math;
  const HALFPI = Math.PI / 2;

  let dLamX = 0,
      dLamY = 0,
      dPhiX = 0,
      dPhiY = 0;
  
  let x2, y2, lam2, phi2;
  
  for(let i = 0; i < 15; ++i) {
    const [xAppr, yAppr] = proj(lam, phi);
    const dX = xAppr - x;
    const dY = yAppr - y;
    
    if(abs(dX) < 1e-10 && abs(dY) < 1e-10) {
      return [lam, phi];
    }

    if(abs(dX) > 1e-6 || abs(dY) > 1e-6) {
      // Compute Jacobian matrix
      const dLam = lam > 0 ? -1e-6 : 1e-6;
      lam2 = lam + dLam;
      phi2 = phi;
      [x2, y2] = proj(lam2, phi2);
      const dXLam = (x2 - xAppr) / dLam;
      const dYLam = (y2 - yAppr) / dLam;
      
      const dPhi = phi > 0 ? -1e-6 : 1e-6;
      lam2 = lam;
      phi2 = phi + dPhi;
      [x2, y2] = proj(lam2, phi2);
      const dXPhi = (x2 - xAppr) / dPhi;
      const dYPhi = (y2 - yAppr) / dPhi;

      // Inverse of Jacobian matrix
      const det = dXLam * dYPhi - dXPhi * dYLam;
      if(det != 0) {
        dLamX =  dYPhi / det;
        dLamY = -dXPhi / det;
        dPhiX = -dYLam / det;
        dPhiY =  dXLam / det;
      }
    }
    
    // Limit the amplitude of correction
    if(x != 0) {
      const dLam = max(min(dX * dLamX + dY * dLamY, 0.3), -0.3);
      lam -= dLam;
      if(lam < -PI) lam = -PI;
      else if(lam > PI) lam = PI;
    }

    if(y != 0) {
      const dPhi = max(min(dX * dPhiX + dY * dPhiY, 0.3), -0.3);
      phi -= dPhi;
      if(phi < -HALFPI) phi = -HALFPI;
      else if(phi > HALFPI) phi = HALFPI;
    }
  }
  return [lam, phi];
}

// Spilhaus Square projection
export function spilhausSquare() {
  const { abs, max, min, sin, cos, asin, acos, tan } = Math;
  const pi = Math.PI, halfPi = pi / 2;

  function spilhausSquareRaw(lambda, phi) {
    let a, b, sm, sn;
    const sp = tan(0.5 * phi);
    a = cos(asin(sp)) * sin(0.5 * lambda);
    sm = (sp + a) < 0;
    sn = (sp - a) < 0;
    b = acos(sp);
    a = acos(a);

    return ellipticFactory(a, b, sm, sn);
  }

  spilhausSquareRaw.invert = function(x, y) {
    let phi = max(min(y / 1.8540746957596883, 1), -0.5 * pi);
    let lam = abs(phi) < pi ? max(min(x / 1.854074716833181, 1), -1) * pi : 0;
    return inverse(x, y, lam, phi, spilhausSquareRaw);
  };

  return d3.geoProjection(spilhausSquareRaw)
    .rotate([-66.94970198, 49.56371678, 40.17823482])
    .scale(134.838125);
} 