# CollabFlow - Base MiniApp

**Build better, together.** Tinder for creative projects.

CollabFlow is a Base MiniApp that helps individuals discover and connect with collaborators for creative projects through a swipe-based matching experience.

## Features

### 🎯 Core Features
- **Project Profile Creation**: Create detailed profiles for your projects with skills, vision, and collaboration style
- **Swipe-Based Matching**: Tinder-like interface to discover and match with potential collaborators
- **In-App Chat**: Direct communication with matched project owners
- **Basic Task Management**: Simple task tracking for collaborative projects

### 🚀 Tech Stack
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **MiniKit** for Base integration
- **OnchainKit** for blockchain features

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd collabflow
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Main page
│   └── providers.tsx     # App providers
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── DiscoverView.tsx  # Project discovery
│   ├── MatchesView.tsx   # Matches management
│   ├── ChatView.tsx      # Chat interface
│   └── ...
├── lib/                  # Utilities and types
│   ├── types.ts         # TypeScript types
│   ├── utils.ts         # Utility functions
│   └── constants.ts     # App constants
└── public/              # Static assets
```

## Key Components

### SwipeableCard
Interactive card component that handles touch/mouse gestures for swiping projects left (pass) or right (like).

### ProfileCard
Displays project information including title, description, required skills, and project vision.

### ChatView
Real-time chat interface for matched collaborators with typing indicators and message history.

### Navigation
Bottom navigation bar for switching between Discover, Matches, Create, and Profile views.

## Data Models

### User
- `userId`: Unique identifier
- `displayName`: User's display name
- `bio`: User biography
- `linkedProjects`: Array of project IDs

### ProjectProfile
- `projectId`: Unique identifier
- `title`: Project title
- `description`: Detailed description
- `skillsRequired`: Array of required skills
- `vision`: Project vision statement
- `workStyle`: Remote/In-person/Hybrid/Flexible

### Match
- `matchId`: Unique identifier
- `projectProfile1Id`: First project ID
- `projectProfile2Id`: Second project ID
- `createdAt`: Match timestamp

## Customization

### Design System
The app uses a consistent design system defined in `lib/constants.ts`:

- **Colors**: Primary blue, accent orange, neutral grays
- **Typography**: System fonts with consistent sizing
- **Spacing**: 8px base unit system
- **Shadows**: Subtle card shadows

### Adding New Skills
Update the `SKILL_CATEGORIES` array in `lib/constants.ts` to add new skill options.

### Modifying Swipe Behavior
Adjust the `SWIPE_THRESHOLD` constant to change swipe sensitivity.

## Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
npx vercel
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on GitHub or contact the development team.

---

**CollabFlow** - Where great projects meet great collaborators! 🚀
