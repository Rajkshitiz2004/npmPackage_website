'use strict';

// 30 realistic sample products for e-commerce catalog
const categories = ['Electronics', 'Audio', 'Peripherals', 'Wearables', 'Smart Home'];

const products = Array.from({ length: 30 }, (_, index) => {
  const id = index + 1;
  const titles = [
    'Ultra-Wide Curved Gaming Monitor 34"',
    'Mechanical Tenkeyless RGB Keyboard',
    'Wireless Noise-Cancelling Headphones Pro',
    'Ergonomic Vertical Mouse Dual-Mode',
    'USB-C Quad 4K Docking Station',
    'Studio Dynamic XLR Podcast Microphone',
    'Smart Ambient LED Lightbar RGBIC',
    'High-Precision 4K Webcam 60FPS',
    'Thunderbolt 4 NVMe External SSD 2TB',
    'Active Stylus Drawing Tablet Pen',
    'MagSafe Wireless Charging Stand 3-in-1',
    'Noise-Isolating In-Ear Studio Monitors',
    'Mechanical Numpad with OLED Display',
    'Braided USB-C to DP 2.1 Cable 2m',
    'Desk Mount Dual Heavy-Duty Monitor Arm'
  ];

  const title = `${titles[index % titles.length]}${index >= 15 ? ' (Gen 2)' : ''}`;
  const category = categories[index % categories.length];
  const price = parseFloat((29.99 + (index * 17.5) % 350).toFixed(2));
  const rating = parseFloat((4.0 + ((index * 7) % 10) / 10).toFixed(1));

  return {
    id,
    sku: `PROD-${1000 + id}`,
    title,
    category,
    price,
    currency: 'USD',
    stock: (index * 9 + 12) % 85,
    rating,
    reviewsCount: (index * 23 + 47) % 320,
    inStock: (index * 9 + 12) % 85 > 0,
    tags: [category.toLowerCase(), 'premium', 'tech']
  };
});

module.exports = { products };
