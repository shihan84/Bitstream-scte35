# AWS Elemental MediaLive - Live Stream Encoder

A professional livestream encoder application built with Next.js 15, featuring AWS Elemental MediaLive theming and comprehensive support for HLS, SCTE-35, SSAI, SRT, and MPEG-TS protocols. This application provides a complete web interface for configuring and managing live stream encoding with AWS-inspired design and functionality.

## Features

### Core Functionality
- **Live Stream Management**: Start, stop, and monitor live streams
- **Multi-Protocol Support**: SRT, RTMP, RTSP, UDP, and file input sources
- **Adaptive Bitrate Streaming**: Multi-bitrate encoding profiles
- **Real-time Monitoring**: Stream health, performance metrics, and alerts

### Input Sources
- **SRT (Secure Reliable Transport)**: Secure, reliable transport with encryption
- **RTMP**: Real-time messaging protocol for live streaming
- **RTSP**: Real-time streaming protocol
- **UDP**: User Datagram Protocol for low-latency streaming
- **File Input**: Support for file-based streaming

### Output Formats
- **HLS (HTTP Live Streaming)**: Adaptive bitrate streaming with segment configuration
- **MPEG-TS**: MPEG transport stream with UDP/TCP/SRT transport
- **SRT Output**: Secure reliable transport output
- **RTMP Output**: Real-time messaging protocol output

### Advanced Features
- **SCTE-35 Marker Support**: 
  - Embedded marker detection and passthrough
  - Manual marker insertion
  - Timecode-based insertion
  - API-triggered insertion
  - UPID type configuration

- **Server-Side Ad Insertion (SSAI)**:
  - VAST, VMAP, DAI, and custom ad decision servers
  - Ad break insertion
  - Tracking beacons and analytics
  - Fallback strategies
  - Dynamic ad insertion

### Encoding Profiles
- **Video Encoding**: H.264, H.265/HEVC, AV1 support
- **Audio Encoding**: AAC, MP3, Opus support
- **Advanced Settings**: Keyframe intervals, B-frames, profiles, presets
- **Multi-bitrate**: Adaptive bitrate streaming configuration

### Monitoring & Analytics
- **Input Health**: Connection status, bitrate, packet loss, latency
- **Encoder Performance**: CPU usage, memory, FPS, queue size
- **Output Health**: Active outputs, viewer count, uptime, errors
- **Quality Metrics**: Video/audio quality, buffer health
- **Alert System**: Real-time notifications and alerts

## Design & Theming

### AWS Elemental MediaLive Theme
- **AWS Orange Color Scheme**: Professional orange and amber color palette
- **AWS-Inspired UI**: Clean, modern interface following AWS design principles
- **Responsive Design**: Mobile-first layout with AWS cloud aesthetics
- **Professional Components**: shadcn/ui components with AWS theming
- **Status Indicators**: AWS-style badges and progress indicators
- **Alert System**: AWS-themed notifications and alerts

## Technology Stack

- **Frontend**: Next.js 15 with TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **State Management**: React hooks with Zustand
- **API**: RESTful API endpoints
- **Real-time**: Socket.io for real-time updates
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with responsive design

## API Endpoints

### Encoder Management
- `POST /api/encoder/start` - Start encoder with configuration
- `POST /api/encoder/stop` - Stop encoder
- `GET /api/encoder/status` - Get encoder status
- `POST /api/encoder/status` - Update encoder status

### Configuration
- `GET /api/encoder/config` - Get encoder configuration
- `POST /api/encoder/config` - Save encoder configuration
- `PUT /api/encoder/config` - Update encoder configuration
- `DELETE /api/encoder/config` - Delete encoder configuration

### SCTE-35 Markers
- `POST /api/encoder/scte35` - Manage SCTE-35 markers
  - Actions: `insert`, `remove`, `list`, `configure`

### SSAI (Server-Side Ad Insertion)
- `POST /api/encoder/ssai` - Manage SSAI functionality
  - Actions: `configure`, `insert_ad`, `get_status`, `update_tracking`

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000 in your browser

### Development
- **Development Server**: `npm run dev`
- **Build**: `npm run build`
- **Start Production**: `npm run start`
- **Lint**: `npm run lint`

## Configuration

### Basic Setup
1. Navigate to the **Input** tab to configure your input source
2. Set up encoding profiles in the **Encoding** tab
3. Configure output destinations in the **Output** tab
4. Enable SCTE-35 markers in the **SCTE-35** tab (optional)
5. Configure SSAI in the **SSAI** tab (optional)
6. Monitor your stream in the **Monitor** tab

### SCTE-35 Configuration
- Enable SCTE-35 processing
- Choose marker source (embedded, timecode, manual, API)
- Configure UPID type and duration settings
- Set preroll and postroll times
- Use manual insertion or API-based triggers

### SSAI Configuration
- Enable server-side ad insertion
- Configure ad decision server (VAST, VMAP, DAI)
- Set up tracking beacons and analytics
- Configure fallback strategies
- Enable dynamic ad insertion

## Usage Examples

### Starting a Live Stream
1. Configure input source (e.g., SRT input)
2. Set encoding profiles (video/audio settings)
3. Configure output destinations (e.g., HLS output)
4. Click "Start Stream" to begin encoding
5. Monitor stream health in the Monitor tab

### Inserting SCTE-35 Markers
1. Enable SCTE-35 in the SCTE-35 tab
2. Configure marker settings
3. Click "Insert SCTE-35 Marker" during live stream
4. Monitor marker insertion in the stream

### Server-Side Ad Insertion
1. Enable SSAI in the SSAI tab
2. Configure ad server URL and settings
3. Click "Insert Ad Break" during live stream
4. Track ad performance through monitoring

## Architecture

### Frontend Architecture
- **Components**: Modular React components with shadcn/ui
- **State Management**: React hooks with local state management
- **API Integration**: Fetch API for backend communication
- **Real-time Updates**: Socket.io for live status updates

### Backend Architecture
- **API Routes**: Next.js API routes for RESTful endpoints
- **State Management**: In-memory storage (replaceable with database)
- **Real-time Communication**: Socket.io for WebSocket connections
- **Error Handling**: Comprehensive error handling and validation

### Data Flow
1. User interacts with frontend components
2. State changes trigger API calls
3. Backend processes requests and updates state
4. Real-time updates pushed via WebSocket
5. Frontend updates UI with latest information

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please refer to the project documentation or create an issue in the repository.

## Acknowledgments

- Built with Next.js 15 and TypeScript
- UI components from shadcn/ui
- Icons from Lucide React
- Styling with Tailwind CSS
- Real-time features with Socket.io