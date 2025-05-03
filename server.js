const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');

const app = express();

// Configure CORS properly
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}));

app.use(express.json());

// Your product pairs array
const productPairs = [
    // Samsung Galaxy S24 FE 5G
    {
      amazon: 'https://www.amazon.in/dp/B0DHL7YT5S',
      flipkart: 'https://www.flipkart.com/samsung-galaxy-s24-fe-5g-graphite-128-gb/p/itme960199e26f23?pid=MOBH4ZG33EBNZKS7'
    },
    {
      amazon: 'https://www.amazon.in/dp/B0DHL85K81',
      flipkart: 'https://www.flipkart.com/samsung-galaxy-s24-fe-5g-mint-128-gb/p/itme960199e26f23?pid=MOBH4ZG3TSXHKXH2'
    },
    {
      amazon: 'https://www.amazon.in/dp/B0DHL98QM2',
      flipkart: 'https://www.flipkart.com/samsung-galaxy-s24-fe-5g-blue-128-gb/p/itme960199e26f23?pid=MOBH4ZG3Z5NCBW2H'
    },
  
    // Samsung Galaxy S24 5G
    {
      amazon: 'https://www.amazon.in/dp/B0CS69QQTG',
      flipkart: 'https://www.flipkart.com/samsung-galaxy-s24-5g-onyx-black-256-gb/p/itm0456c01739016?pid=MOBGX2F3ZUBMWBGP'
    },
    {
      amazon: 'https://www.amazon.in/dp/B0CQYGPGPP',
      flipkart: 'https://www.flipkart.com/samsung-galaxy-s24-5g-amber-yellow-256-gb/p/itmebc700bb8d159?pid=MOBGX2F3TYAVSQJC'
    },
  
    // Samsung Galaxy A05
    {
      amazon: 'https://www.amazon.in/dp/B0CJ2DVN1Q',
      flipkart: 'https://www.flipkart.com/samsung-galaxy-a05-light-green-128-gb/p/itmf37d39ccf9aea?pid=MOBGTZ6W2WVQBGSB'
    },
  
    // Samsung Galaxy A26 5G
    {
      amazon: 'https://www.amazon.in/dp/B0DYDNMHN2',
      flipkart: 'https://www.reliancedigital.in/product/samsung-galaxy-a26-5g-256-gb-8-gb-ram-awesome-black-mobile-phone-m8o624-9025203'
    },
  
    // Redmi Note 14 5G
    {
      amazon: 'https://www.amazon.in/dp/B0DV9DCJ45',
      flipkart: 'https://www.flipkart.com/redmi-note-14-5g-ivy-green-128-gb/p/itm11a447d125328?pid=MOBH9FKYHFTF6C6B'
    },
  
    // Samsung Galaxy S23 5G
    {
      amazon: 'https://www.amazon.in/dp/B0BTYVTMT6',
      flipkart: 'https://www.flipkart.com/samsung-galaxy-s23-5g-cream-256-gb/p/itm745d4b532623e?pid=MOBGMFFXURCVYANE'
    },
  
   
    {
      amazon: 'https://www.amazon.in/dp/B0C5XM26J9',
      flipkart: 'https://www.flipkart.com/nokia-106-4g/p/itma78af69d2d7f2?pid=MOBGQFVGQCSST23U'
    },
    {
      amazon: 'https://www.amazon.in/dp/B0C5XNP22C',
      flipkart: 'https://www.flipkart.com/nokia-106-4g-keypad-mobile-long-lasting-battery-microsd-card-slot/p/itm3eb6a3b98461c?pid=MOBGQFVGAHHMHJDF'
    },
  
    // Samsung Galaxy S23 FE
    {
      amazon: 'https://www.amazon.in/dp/B0CJXQX3MB',
      flipkart: 'https://www.flipkart.com/samsung-galaxy-s23-fe-graphite-128-gb/p/itme751066521899?pid=MOBGVTA2836DQWTT'
    },
  
    // Samsung Galaxy S24+ 5G
    {
      amazon: 'https://www.amazon.in/dp/B0CR44MHBD',
      flipkart: 'https://www.flipkart.com/samsung-galaxy-s24-5g-onyx-black-256-gb/p/itm325da4a26d7bb?pid=MOBGX2F3HVJYNHUV'
    },
  
    // Samsung Galaxy A35 5G
    {
      amazon: 'https://www.amazon.in/dp/B0CXMCX9MD',
      flipkart: 'https://www.flipkart.com/samsung-galaxy-a35-5g-awesome-iceblue-128-gb/p/itm9684d2fe9201e?pid=MOBGYT2HEYWFCG8Q'
    },
    {
      amazon: 'https://www.amazon.in/dp/B0CXMD9YX5',
      flipkart: 'https://www.flipkart.com/samsung-galaxy-a35-5g-awesome-navy-128-gb/p/itm12fccc5bfbaac?pid=MOBGYT2HGFKNMSZQ'
    },
  
    // Redmi Note 13 Pro+
    {
      amazon: 'https://www.amazon.in/dp/B0CXXB7LYC',
      flipkart: 'https://www.flipkart.com/redmi-note-13-pro-5g-fusion-purple-256-gb/p/itmb1aa74d7307e2?pid=MOBGWFHFMH3FAA39'
    },
  
    // Realme C65 5G
    {
      amazon: 'https://www.amazon.in/dp/B0D2DNDQZW',
      flipkart: 'https://www.flipkart.com/realme-c65-5g-feather-green-128-gb/p/itma294063ac4410?pid=MOBHYFV8HJJWWFWE'
    },
  
    // Realme P1 5G
    {
      amazon: 'https://www.amazon.in/dp/B0D35V6J6N',
      flipkart: 'https://www.flipkart.com/realme-p1-5g-peacock-green-128-gb/p/itmae4447062b5b5?pid=MOBGZSU4HH7YZW6D'
    },
  
    // Motorola Edge 50 Pro
    {
      amazon: 'https://www.amazon.in/dp/B0D37WRCP1',
      flipkart: 'https://www.flipkart.com/motorola-edge-50-pro-5g-125w-charger-luxe-lavender-256-gb/p/itm3281f9ac32d1a?pid=MOBGXFXY2SBHGSVN'
    },
  
    // Motorola G64 5G
    {
      amazon: 'https://www.amazon.in/dp/B0D3BJ3719',
      flipkart: 'https://www.flipkart.com/motorola-g64-5g-ice-lilac-256-gb/p/itm36e3ccb6c9dee?pid=MOBGY2JUGGJZJQNK'
    },
    {
      amazon: 'https://www.amazon.in/dp/B0D3BKCX5Q',
      flipkart: 'https://www.flipkart.com/motorola-g64-5g-ice-lilac-128-gb/p/itm36e3ccb6c9dee?pid=MOBGY2JUZHAXQ8ZG'
    },
  
    // Motorola Edge 50 Fusion
    {
      amazon: 'https://www.amazon.in/dp/B0D4JLR5ZN',
      flipkart: 'https://www.flipkart.com/motorola-edge-50-fusion-marshmallow-blue-128-gb/p/itmf88eea5799a27?pid=MOBGXTYZEZSZQE7W'
    },
    {
      amazon: 'https://www.amazon.in/dp/B0D4JLSGBB',
      flipkart: 'https://www.flipkart.com/motorola-edge-50-fusion-marshmallow-blue-256-gb/p/itmf88eea5799a27?pid=MOBGXTYZBAS4VM8K'
    },
    {
      amazon: 'https://www.amazon.in/dp/B0D4JM8B2Q',
      flipkart: 'https://www.flipkart.com/motorola-edge-50-fusion-forest-blue-256-gb/p/itm8a5b907bb2896?pid=MOBGXTYZZEW8GZE6'
    },
    {
      amazon: 'https://www.amazon.in/dp/B0D4JNVVHH',
      flipkart: 'https://www.flipkart.com/motorola-edge-50-fusion-hot-pink-256-gb/p/itmfee7de3c2e095?pid=MOBGXTYZZBUPYFEC'
    },
  
    // Redmi 13 5G
    {
      amazon: 'https://www.amazon.in/dp/B0D78W2HF5',
      flipkart: 'https://www.flipkart.com/redmi-13-5g-orchid-pink-128-gb/p/itm4fca11238358d?pid=MOBH2UPGHDHVG2XY'
    },
    {
      amazon: 'https://www.amazon.in/dp/B0D78WCNZZ',
      flipkart: 'https://www.flipkart.com/redmi-13-5g-hawaiian-blue-128-gb/p/itmede93b8d7b1a4?pid=MOBH2SS96VEZUVX4'
    },
    {
      amazon: 'https://www.amazon.in/dp/B0D78X544X',
      flipkart: 'https://www.flipkart.com/redmi-13-5g-hawaiian-blue-128-gb/p/itmbf96c9b15ce5e?pid=MOBH2SUHMUYBZSHY'
    },
    {
      amazon: 'https://www.amazon.in/dp/B0D78Y577J',
      flipkart: 'https://www.flipkart.com/redmi-13-5g-black-diamond-128-gb/p/itmbf96c9b15ce5e?pid=MOBH2SU8G4RW85RG'
    },
  
    // Vivo T3 Lite 5G
    {
      amazon: 'https://www.amazon.in/dp/B0D93GGMYT',
      flipkart: 'https://shop.vivo.com/in/product/10279?skuId=18996'
    },
    {
      amazon: 'https://www.amazon.in/dp/B0D93HRDD3',
      flipkart: 'https://www.flipkart.com/vivo-t3-lite-5g-vibrant-green-128-gb/p/itm977c89a44d373?pid=MOBHFTYBA6V3RVZE'
    },
  
    // Motorola G85 5G
    {
      amazon: 'https://www.amazon.in/dp/B0D9GM15RC',
      flipkart: 'https://www.flipkart.com/motorola-g85-5g-olive-green-128-gb/p/itm1c4b849213a0e?pid=MOBHY9PQMNCMDVCD'
    },
    {
      amazon: 'https://www.amazon.in/dp/B0D9GM982V',
      flipkart: 'https://www.flipkart.com/motorola-g85-5g-olive-green-256-gb/p/itm59b2d8db7fe04?pid=MOBHY9PQ7B5GYJRX'
    },
    {
      amazon: 'https://www.amazon.in/dp/B0D9LS6MVV',
      flipkart: 'https://www.flipkart.com/motorola-g85-5g-cobalt-blue-128-gb/p/itm3c5fb4da1bfe6?pid=MOBHY9PQ7FGZKVDK'
    },
  
    // Motorola Edge 50
    {
      amazon: 'https://www.amazon.in/dp/B0DCHQDRT4',
      flipkart: 'https://www.flipkart.com/motorola-edge-50/p/itm740d86a7c55d1?pid=MOBH2Q5Y5EVAGS6M'
    },
  
    // Motorola G45 5G
    {
      amazon: 'https://www.amazon.in/dp/B0DDY9HMJG',
      flipkart: 'https://www.flipkart.com/motorola-g45-5g-brilliant-blue-128-gb/p/itm1decbdd265f94?pid=MOBH3YKQT2HEAPAM'
    },
    {
      amazon: 'https://www.amazon.in/dp/B0DDY9XDJS',
      flipkart: 'https://www.flipkart.com/motorola-g45-5g-viva-magenta-128-gb/p/itm4fcac185bc02b?pid=MOBH3YKQMPVFBUB5'
    },
    {
      amazon: 'https://www.amazon.in/dp/B0DDYBQWLW',
      flipkart: 'https://www.flipkart.com/motorola-g45-5g-brilliant-green-128-gb/p/itm156df63edff03?pid=MOBH3YKQQN3S9TQQ'
    },
  
    // Motorola Edge 50 Neo
    {
      amazon: 'https://www.amazon.in/dp/B0DH38XSL4',
      flipkart: 'https://www.flipkart.com/motorola-edge-50-neo-pantone-nautical-blue-256-gb/p/itm94d3bb79258e9?pid=MOBHFHDRDDW9MKVG'
    },
  
    // Motorola G85 5G Viva Magenta
    {
      amazon: 'https://www.amazon.in/dp/B0DJ7XL7SW',
      flipkart: 'https://www.flipkart.com/motorola-g85-5g-viva-magenta-128-gb/p/itme67cc98574a7f?pid=MOBH35ZQFGVJFJ3W'
    },
  
    // Motorola Edge 50 Fusion Forest Green
    {
      amazon: 'https://www.amazon.in/dp/B0DJ7XPSSW',
      flipkart: 'https://www.flipkart.com/motorola-edge-50-fusion-forest-green-256-gb/p/itm372843264e10a?pid=MOBHYVFV3RNAGXF6'
    },
  
    // Motorola Edge 50 Pro Caneel Bay
    {
      amazon: 'https://www.amazon.in/dp/B0DJ7Y5T9G',
      flipkart: 'https://www.flipkart.com/motorola-edge-50-pro-5g-125w-charger-caneel-bay-256-gb/p/itm1603f674e2178?pid=MOBH2YWHMKHAFHZF'
    },
  
    // Redmi A3X
    {
      amazon: 'https://www.amazon.in/dp/B0DN1VXP5R',
      flipkart: 'https://www.flipkart.com/redmi-a3x-olive-green-64-gb/p/itmae02f9f3f765a?pid=MOBH9JUHYE9AZCVX'
    },
  
    // Moto G35 5G
    {
      amazon: 'https://www.amazon.in/dp/B0DPW2M4JR',
      flipkart: 'https://www.reliancedigital.in/product/moto-g35-5g-128-gb-4-gb-ram-leaf-green-mobile-phone-m4ifd1-8764251'
    }
  ]; // Your existing product pairs array

let scrapingInProgress = false;
let currentProgress = 0;
let totalProducts = productPairs.length;
let csvFilePath = '';
let results = [];

async function scrapePage(browser, url, type) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const data = await page.evaluate((type) => {
      function getText(selectors) {
        for (const sel of selectors) {
          const el = document.querySelector(sel);
          if (el) return el.textContent.trim();
        }
        return null;
      }

      const priceSelectors = type === 'Amazon' 
        ? ['span.a-price-whole', 'span.a-offscreen', '#priceblock_ourprice', '#priceblock_dealprice']
        : ['.Nx9bqj.CxhGGd', '._30jeq3._16Jk6d', '[class*="price"]'];

      const titleSelectors = type === 'Amazon'
        ? ['#productTitle', 'h1#title']
        : ['span.B_NuCI', 'h1.yhB1nd', 'div[class*="title"]'];

      const title = getText(titleSelectors) || document.title;
      const priceText = getText(priceSelectors) || 'Price not found';

      let coupon = '';
      let seller = '';
      
      if (type === 'Amazon') {
        const couponEl = document.querySelector('.couponBadge, .couponLabelText');
        if (couponEl) coupon = couponEl.textContent.trim();
      } 
      else if (type === 'Flipkart') {
        const sellerElement = document.querySelector('#sellerName');
        if (sellerElement) {
          const sellerNameElement = sellerElement.querySelector('span > span');
          if (sellerNameElement) {
            seller = sellerNameElement.textContent.trim();
          } else {
            seller = sellerElement.textContent.trim().split('\n')[0].trim();
          }
        }
      }

      return { title, priceText, coupon, seller };
    }, type);

    await page.close();

    let numericPrice = 'N/A';
    if (data.priceText !== 'Price not found') {
      numericPrice = parseFloat(data.priceText.replace(/[^\d.]/g, ''));
      if (isNaN(numericPrice)) numericPrice = 'N/A';
    }

    return {
      url,
      productTitle: data.title,
      buyBox: type,
      price: numericPrice,
      priceText: data.priceText,
      coupon: data.coupon || '',
      seller: data.seller || ''
    };
  } catch (err) {
    await page.close();
    return {
      url,
      productTitle: 'Error',
      buyBox: type,
      price: 'N/A',
      priceText: `Error: ${err.message}`,
      coupon: '',
      seller: ''
    };
  }
}

async function scrapeAllProducts() {
  scrapingInProgress = true;
  currentProgress = 0;
  results = [];
  
  const browser = await puppeteer.launch({ 
    headless: true,
  args: [
    '--no-sandbox', 
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--single-process',
    '--disable-gpu'
  ], 
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath() 
  });

  for (const pair of productPairs) {
    try {
      const [amazonData, flipkartData] = await Promise.all([
        scrapePage(browser, pair.amazon, 'Amazon'),
        scrapePage(browser, pair.flipkart, 'Flipkart')
      ]);

      const combined = {
        amazonUrl: amazonData.url,
        amazonTitle: amazonData.productTitle,
        amazonPrice: amazonData.price,
        amazonPriceOriginal: amazonData.priceText,
        amazonCoupon: amazonData.coupon || 'No coupon',
        flipkartUrl: flipkartData.url,
        flipkartTitle: flipkartData.productTitle,
        flipkartPrice: flipkartData.price,
        flipkartSeller: flipkartData.seller || 'Seller not found',
        flipkartPriceOriginal: flipkartData.priceText,
        priceDifference: 'N/A'
      };

      if (typeof amazonData.price === 'number' && typeof flipkartData.price === 'number') {
        const diff = amazonData.price - flipkartData.price;
        combined.priceDifference = diff > 0
          ? `${Math.abs(diff).toFixed(2)} cheaper on Flipkart`
          : `${Math.abs(diff).toFixed(2)} cheaper on Amazon`;
        combined.numericDifference = diff.toFixed(2);
      }

      results.push(combined);
      currentProgress++;
      
    } catch (error) {
      console.error(`Error processing pair: ${error}`);
    }
  }

  await browser.close();

  // Generate CSV
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-');
  csvFilePath = path.join(__dirname, 'downloads', `product_comparison_${timestamp}.csv`);
  
  // Ensure downloads directory exists
  if (!fs.existsSync(path.join(__dirname, 'downloads'))) {
    fs.mkdirSync(path.join(__dirname, 'downloads'));
  }

  const fields = [
    'amazonUrl', 'amazonTitle', 'amazonPrice', 'amazonCoupon',
    'flipkartPrice', 'flipkartSeller', 'flipkartUrl', 'flipkartTitle', 
    'priceDifference', 'numericDifference'
  ];
  
  const parser = new Parser({ fields });
  const csv = parser.parse(results);
  fs.writeFileSync(csvFilePath, csv);
  
  scrapingInProgress = false;
  return csvFilePath;
}

// API Endpoints
app.get('/api/status', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      inProgress: scrapingInProgress,
      progress: currentProgress,
      total: totalProducts,
      completed: !scrapingInProgress && currentProgress === totalProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/start-scraping', async (req, res) => {
  if (scrapingInProgress) {
    return res.status(400).json({ 
      success: false,
      error: 'Scraping already in progress' 
    });
  }
  
  try {
    scrapeAllProducts().then(() => {
      console.log('Scraping completed');
    }).catch(err => {
      console.error('Scraping error:', err);
    });
    
    res.status(200).json({ 
      success: true,
      message: 'Scraping started successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

app.get('/api/download', (req, res) => {
  if (!csvFilePath || !fs.existsSync(csvFilePath)) {
    return res.status(404).json({ 
      success: false,
      error: 'File not found' 
    });
  }
  
  res.download(csvFilePath, 'product_comparison.csv', (err) => {
    if (err) {
      console.error('Download error:', err);
    }
  });
});

// Serve frontend
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});