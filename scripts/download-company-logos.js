const fs = require('fs');
const path = require('path');

// Company logo URLs (using reliable sources)
const companyLogos = {
    'Blenheim Chalcot': 'https://blenheimchalcot.com/wp-content/uploads/2021/03/BC-Logo-White.png',
    'Whitehat Jr': 'https://www.whitehatjr.com/assets/images/logo.png',
    'Flint Chem': 'https://via.placeholder.com/60x60/6366f1/ffffff?text=FC', // Fallback
    'Tech Mahindra': 'https://www.techmahindra.com/content/dam/techmahindra/global/images/logo/tech-mahindra-logo.png',
    'Teleperformance': 'https://www.teleperformance.com/wp-content/themes/teleperformance/assets/images/logo.png',
    'Jet Airways': 'https://via.placeholder.com/60x60/1e40af/ffffff?text=JA' // Fallback
};

// Create logos directory if it doesn't exist
const logosDir = path.join(__dirname, '..', 'assets', 'images', 'logos');
if (!fs.existsSync(logosDir)) {
    fs.mkdirSync(logosDir, { recursive: true });
}

console.log('Company logos configuration created!');
console.log('Available logos:', Object.keys(companyLogos));

// Export for use in HTML
module.exports = companyLogos;
