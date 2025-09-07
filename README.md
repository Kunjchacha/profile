# Kunj Chacha - Professional Portfolio

A modern, elegant, and sleek portfolio website with **automatic LinkedIn synchronization**. 
Showcasing professional experience, achievements, and projects with a premium design.

## ✨ Features

- **🎨 Elegant Design**: Modern dark theme with premium aesthetics
- **📱 Responsive**: Mobile-first approach with perfect scaling
- **🔄 Auto-Sync**: Automatic LinkedIn profile synchronization (fortnightly)
- **⚡ Performance**: Optimized for 90+ Lighthouse score
- **🎯 Professional**: Clean, executive-focused presentation
- **🚀 Auto-Deploy**: GitHub Pages integration with CI/CD

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Grid, Flexbox, and animations
- **Icons**: Font Awesome for scalable vector icons
- **Sync**: LinkedIn MCP integration for automatic updates
- **Scheduler**: Node.js cron jobs for fortnightly sync
- **Deployment**: GitHub Pages with automatic CI/CD

## 📁 Project Structure

```
webume-portfolio/
├── index.html                    # Main portfolio website
├── assets/
│   ├── style.css                # Elegant CSS styling
│   └── images/                  # Profile images
├── scripts/
│   ├── linkedin-auto-sync.js    # LinkedIn sync automation
│   └── fortnightly-scheduler.js # Scheduler for auto-sync
├── data/
│   ├── linkedin-profile.json    # LinkedIn data cache
│   └── backups/                 # Portfolio backups
├── .github/workflows/           # GitHub Actions for deployment
├── package.json                 # Project dependencies
└── README.md                   # Project documentation
```

## 🔄 LinkedIn Auto-Sync

The portfolio automatically syncs with your LinkedIn profile every 2 weeks to keep your information up-to-date.

### Sync Features
- **Profile Information**: Name, headline, about section
- **Experience**: Job titles, companies, dates, descriptions
- **Education**: Degrees, institutions, dates
- **Skills**: Technical and professional skills
- **Contact**: LinkedIn profile and contact information

### Manual Sync Commands
```bash
# Run manual sync
npm run sync

# Start fortnightly scheduler
npm run scheduler

# Deploy changes to GitHub Pages
npm run deploy
```

### Sync Schedule
- **Automatic**: Every 2 weeks on Monday at 9:00 AM IST
- **Manual**: Run `npm run sync` anytime
- **Backup**: Automatic backup before each sync

## 🚀 Getting Started

### Prerequisites
- Modern web browser
- Node.js (for LinkedIn sync features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Kunjchacha/profile.git
cd profile
```

2. Install dependencies:
```bash
npm install
```

3. Start local development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3001`

## 🎨 Customization

### Colors
The main color scheme uses a gradient from `#667eea` to `#764ba2`. You can modify these in `assets/style.css`:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
}
```

### Content
Update the content in `index.html` to reflect your personal information:
- Personal details
- Professional experience
- Project descriptions
- Contact information

### Styling
Modify `assets/style.css` to customize:
- Typography
- Layout spacing
- Color schemes
- Animations

## 📱 Responsive Design

The portfolio is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 Deployment

### GitHub Pages
1. Push your changes to the main branch
2. Enable GitHub Pages in repository settings
3. Select source branch (usually main)
4. Your site will be available at `https://username.github.io/repository-name`

### Manual Deployment
1. Build the project: `npm run build`
2. Upload files to your web hosting service
3. Configure your domain (if applicable)

## 🔧 Development

### Local Development
```bash
npm start          # Start development server
npm run build     # Build for production
npm test          # Run tests (if configured)
```

### File Structure Guidelines
- Keep HTML semantic and accessible
- Use CSS custom properties for consistent theming
- Modularize JavaScript for maintainability
- Optimize images and assets for web

## 📊 Performance

- **Lighthouse Score**: Optimized for 90+ performance score
- **Loading Speed**: Minimal dependencies for fast loading
- **SEO Ready**: Semantic HTML and meta tags
- **Accessibility**: WCAG 2.1 AA compliant

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Kunjchacha**
- LinkedIn: [Your LinkedIn]
- Email: contact@kunjchacha.com
- Portfolio: [Your Portfolio URL]

## 🙏 Acknowledgments

- Font Awesome for icons
- Modern CSS techniques and best practices
- GitHub Pages for hosting

---

**Last Updated**: January 2025
