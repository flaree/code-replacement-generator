# Lensflxre Tools

A comprehensive suite of tools for sports photographers to streamline their workflow with Photo Mechanic code replacements, metadata management, and team information.

## 🎯 Features

### Club Code Generator
- Search for individual clubs worldwide
- Generate Photo Mechanic code replacements for home and away teams
- Automatic delimiter generation based on team names
- Customizable player name formats

### League Code Generator
- Select from major football leagues (Premier League, La Liga, Serie A, etc.)
- Generate team-based code replacements for entire league fixtures
- Support for League of Ireland, Scottish, and UK competitions

### Photo Metadata Manager
- Generate XMP metadata files for batch photo processing
- IPTC-compliant metadata including creator, copyright, and location
- Automatic club and stadium information integration
- Export to XMP or JSON formats

### Additional Features
- Dark/Light theme support with persistent preferences
- Responsive design for mobile and desktop
- Customizable player sorting (by number or position)
- Goalkeeper-specific formatting options
- Support for players without shirt numbers

## 🚀 Getting Started

### Prerequisites
- Node.js 14.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/flaree/lensflxre-sports-photography-tool.git
cd lensflxre-sports-photography-tool

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
```

The optimized build will be created in the `build/` directory.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AdditionalOptions.js
│   ├── ErrorBoundary.js
│   ├── SearchInput.js
│   ├── TeamSelector.js
│   └── ThemeToggle.js
├── constants/          # Configuration and constants
│   └── config.js
├── hooks/              # Custom React hooks
│   ├── useClubSearch.js
│   ├── useCodeOptions.js
│   └── useTheme.js
├── pages/              # Page components
│   ├── About.js
│   ├── ManualClubSearch.js
│   ├── PhotoMetadata.js
│   └── TeamCodeGenerator.js
├── services/           # API and external services
│   └── api.js
├── utils/              # Utility functions
│   └── codeGenerator.js
├── App.js              # Main app component
└── index.js            # Entry point
```

## 🛠️ Technology Stack

- **React 19.2** - UI framework
- **React Router 7** - Client-side routing
- **FontAwesome** - Icons
- **Tailwind CSS** - Styling framework
- **PropTypes** - Runtime type checking

## 🎨 Code Quality & Maintainability

### Recent Improvements

1. **Centralized Configuration**
   - All API URLs, league codes, and default options in `src/constants/config.js`
   - Easy to update and maintain across the application

2. **Custom Hooks**
   - `useClubSearch` - Encapsulates club search logic
   - `useTheme` - Manages theme state and persistence
   - `useCodeOptions` - Handles code generation options

3. **API Service Layer**
   - All API calls abstracted in `src/services/api.js`
   - Consistent error handling
   - Easy to mock for testing

4. **Reusable Components**
   - `TeamSelector` - Standardized team selection UI
   - `SearchInput` - Consistent search input pattern
   - `ErrorBoundary` - Graceful error handling

5. **Type Safety**
   - PropTypes validation on all components
   - Runtime type checking in development

6. **Documentation**
   - JSDoc comments on all utility functions
   - Component-level documentation
   - Inline code comments for complex logic

## 🔧 Configuration

### Environment Variables

No environment variables required. The API endpoint is configured in `src/constants/config.js`.

### Customizing Leagues

Edit `LEAGUE_CODES` in `src/constants/config.js`:

```javascript
export const LEAGUE_CODES = {
  "Your League Name": 'CODE',
  // ...
};
```

### Customizing Player Formats

Edit `PLAYER_NAME_FORMATS` in `src/constants/config.js`:

```javascript
export const PLAYER_NAME_FORMATS = [
  "{playerName} of {team}",
  "{team} #{shirtNumber} {playerName}",
  // Add your custom formats
];
```

## 📝 Development Guidelines

### Adding a New Component

1. Create component file in `src/components/`
2. Add PropTypes validation
3. Include JSDoc comments
4. Export as default

### Adding a New Page

1. Create page file in `src/pages/`
2. Add route in `src/App.js`
3. Update navigation in `NavLinks` component

### Making API Changes

1. Update or add functions in `src/services/api.js`
2. Add JSDoc documentation
3. Handle errors appropriately

## 🐛 Known Issues

- Data sourced from Transfermarkt may occasionally be inaccurate
- No current support for women's competitions (data availability dependent)
- Intermittent issues due to scraping restrictions

## 🤝 Contributing

This is a personal project, but suggestions and bug reports are welcome via GitHub issues.

## 📄 License

© 2026 Jamie McGuinness · All rights reserved

## 💰 Support

This project is free and ad-free. Backend services are self-funded. If you find these tools useful:

[Buy me a coffee](https://www.buymeacoffee.com/cyqi5my0sl)

## 🔗 Links

- **Website**: [lensflxre.com](https://lensflxre.com)
- **GitHub**: [@flaree](https://github.com/flaree)
- **Instagram**: [@lensflxre](https://instagram.com/lensflxre)
- **Twitter**: [@jxmiemcg](https://twitter.com/jxmiemcg)

## 📊 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 🔍 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

Built with ❤️ for sports photographers