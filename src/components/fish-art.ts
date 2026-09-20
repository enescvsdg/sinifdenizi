import type { FishType } from '@/lib/domain';
const colors: Record<FishType, [string, string]> = {
  clown: ['#ffb146', '#e65a32'],
  'blue-tang': ['#4dabff', '#234bca'],
  'yellow-tang': ['#fff07a', '#eda92d'],
  butterfly: ['#fff4ba', '#f69d46'],
  lionfish: ['#f2baa0', '#b54c49'],
  puffer: ['#eed58b', '#b98550'],
  seahorse: ['#ffb2a1', '#da6e81'],
  manta: ['#92cbd9', '#367894'],
  turtle: ['#7bddaa', '#318878'],
  shark: ['#a9d7e6', '#537e9e'],
  octopus: ['#e5a1e4', '#aa60b5'],
  jellyfish: ['#c6baff', '#847bcc'],
};
export function drawFish(
  c: CanvasRenderingContext2D,
  type: FishType,
  x: number,
  y: number,
  size: number,
  direction: number,
  time: number,
  phase: number,
  level = 1,
) {
  c.save();
  c.translate(x, y);
  c.scale(size * (direction < 0 ? -1 : 1), size);
  const [light, dark] = colors[type] || colors.clown;
  const ellipse = (x: number, y: number, rx: number, ry: number, fill: string | CanvasGradient) => {
    c.fillStyle = fill;
    c.beginPath();
    c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    c.fill();
  };
  const fin = (points: number[], fill: string | CanvasGradient) => {
    c.fillStyle = fill;
    c.beginPath();
    c.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) c.lineTo(points[i], points[i + 1]);
    c.closePath();
    c.fill();
  };
  const grad = c.createLinearGradient(0, -26, 0, 25);
  grad.addColorStop(0, light);
  grad.addColorStop(1, dark);
  const sway = Math.sin(time * 4 + phase) * 4;
  if (type === 'jellyfish' || type === 'octopus') {
    for (let i = 0; i < 6; i++) {
      c.strokeStyle = i % 2 ? light : dark;
      c.lineWidth = type === 'jellyfish' ? 2 : 6;
      c.lineCap = 'round';
      c.beginPath();
      c.moveTo(-18 + i * 7, 8);
      c.bezierCurveTo(-24 + i * 8 + sway, 30, -25 + i * 9 - sway, 42, -22 + i * 9 + sway, 49);
      c.stroke();
    }
    ellipse(0, 0, 30, type === 'jellyfish' ? 20 : 27, grad);
    if (type === 'jellyfish') ellipse(-8, -10, 11, 5, '#ffffff55');
  } else if (type === 'manta') {
    fin([-36, 0, -14, -12, -1, -44 + sway, 20, -8, 38, 1, 16, 13, -4, 40 - sway, -15, 12], grad);
    c.strokeStyle = dark;
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(-30, 0);
    c.quadraticCurveTo(-50, 10, -65, sway);
    c.stroke();
    ellipse(0, 0, 24, 11, light);
  } else if (type === 'turtle') {
    fin([-17, -12, -26, -31, -6, -21, 18, -11, 29, -29, 34, -9], light);
    fin([-20, 12, -27, 30, -3, 20, 18, 11, 31, 30, 34, 11], light);
    ellipse(0, 0, 30, 23, dark);
    ellipse(4, -2, 22, 17, '#5aad8a');
    c.strokeStyle = '#b8e8a066';
    c.lineWidth = 2;
    for (let i = -1; i <= 1; i++) {
      c.beginPath();
      c.moveTo(i * 11, -17);
      c.lineTo(i * 11 + 5, 17);
      c.stroke();
    }
    ellipse(35, -1, 13, 11, light);
  } else if (type === 'seahorse') {
    c.strokeStyle = dark;
    c.lineWidth = 12;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(4, -15);
    c.bezierCurveTo(-30, 10, 18, 14, -2, 30);
    c.bezierCurveTo(-16, 42, -24, 18, -10, 22);
    c.stroke();
    ellipse(7, -19, 16, 14, grad);
    fin([17, -24, 34, -19, 32, -12, 15, -12], light);
    fin([-10, -5, -26, 0, -12, 12], light);
  } else {
    const tall = ['yellow-tang', 'butterfly', 'puffer'].includes(type);
    const ry = tall ? 28 : 20;
    fin([-27, 0, -51, -22 + sway, -46, sway, -51, 22 + sway], dark);
    if (type === 'lionfish')
      for (let i = 0; i < 7; i++)
        fin(
          [-25 + i * 7, -10, -35 + i * 11, -43 + (i % 2) * 10, -15 + i * 7, -10],
          i % 2 ? dark : light,
        );
    else fin([-15, -ry + 3, 4, -ry - 15, 18, -ry + 5], dark);
    if (type === 'shark') fin([-12, 15, -1, 39, 13, 16], dark);
    ellipse(0, 0, type === 'shark' ? 44 : 34, ry, grad);
    c.save();
    c.beginPath();
    c.ellipse(0, 0, type === 'shark' ? 44 : 34, ry, 0, 0, Math.PI * 2);
    c.clip();
    if (type === 'clown' || type === 'lionfish' || type === 'butterfly') {
      c.strokeStyle = type === 'butterfly' ? '#3c4859' : '#fff9e9';
      c.lineWidth = type === 'lionfish' ? 4 : 8;
      for (const xx of [-20, 4]) {
        c.beginPath();
        c.moveTo(xx - 4, -35);
        c.quadraticCurveTo(xx + 7, 0, xx - 3, 35);
        c.stroke();
      }
    }
    if (type === 'blue-tang') ellipse(-7, 0, 22, 13, '#183677');
    if (type === 'puffer')
      for (let i = 0; i < 12; i++)
        ellipse((i % 4) * 12 - 24, Math.floor(i / 4) * 12 - 12, 2, 2, '#92693688');
    ellipse(0, ry - 4, 28, 8, '#ffffff24');
    c.restore();
    fin([-7, 3, -17, 15 + sway, 7, 9], light + 'bb');
  }
  const eyeX =
    type === 'turtle'
      ? 39
      : type === 'seahorse'
        ? 12
        : type === 'octopus' || type === 'jellyfish'
          ? 12
          : 22;
  ellipse(eyeX, -5, 5.5, 6, '#fffdf1');
  ellipse(eyeX + 1, -4, 3, 3.7, '#173c51');
  ellipse(eyeX + 2, -6, 1.2, 1.2, 'white');
  if (level >= 4) {
    c.fillStyle = '#fff5a1';
    c.beginPath();
    c.arc(-6, -34, 3, 0, 7);
    c.fill();
  }
  c.restore();
}
