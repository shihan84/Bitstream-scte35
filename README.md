# AWS Elemental MediaLive - Live Stream Encoder

A professional-grade livestream encoder application built with Next.js 15, featuring AWS Elemental MediaLive theming and comprehensive support for HLS, SCTE-35, SSAI, SRT, and MPEG-TS protocols. This application provides a complete web interface for configuring and managing live stream encoding with AWS-inspired design and enterprise-grade functionality.

## 🌟 Key Features

### 📡 **Input Sources & Protocols**
- **SRT (Secure Reliable Transport)**: Enterprise-grade secure transport with encryption, packet recovery, and low latency
- **RTMP (Real-Time Messaging Protocol)**: Industry-standard protocol for live streaming with broad compatibility
- **RTSP (Real-Time Streaming Protocol)**: Protocol for controlling streaming servers with real-time capabilities
- **UDP (User Datagram Protocol)**: Low-latency transport for time-sensitive streaming applications
- **File Input**: Support for file-based streaming and testing scenarios
- **Input Redundancy**: Failover and round-robin redundancy modes for high availability
- **Backup Sources**: Configurable backup input sources for seamless failover

### 🎬 **Advanced Encoding Profiles**
- **Video Encoding**:
  - **H.264/AVC**: Industry-standard codec with broad compatibility
  - **H.265/HEVC**: Next-generation codec with improved compression efficiency
  - **AV1**: Cutting-edge codec with royalty-free licensing and superior compression
  - **Multi-bitrate Support**: Adaptive bitrate streaming for varying network conditions
  - **Resolution Support**: 4K, 1080p, 720p, and 480p profiles
  - **Frame Rate Options**: 60fps, 30fps, 25fps, and 24fps support

- **Audio Encoding**:
  - **AAC**: Advanced Audio Coding for optimal quality and compression
  - **MP3**: Legacy support for broader compatibility
  - **Opus**: Modern codec optimized for real-time communication
  - **Multi-channel Support**: Mono, stereo, and 5.1 surround sound configurations
  - **Sample Rate Options**: 48kHz, 44.1kHz, and 32kHz support

- **Advanced Settings**:
  - **Keyframe Interval**: Configurable GOP structure for streaming optimization
  - **B-Frames**: Advanced compression techniques for improved efficiency
  - **Encoding Profiles**: Baseline, Main, and High profiles for different use cases
  - **Encoding Presets**: Ultra Fast to Slow for quality vs. performance trade-offs

### 📤 **Multi-Format Output Destinations**
- **HLS (HTTP Live Streaming)**:
  - **Adaptive Bitrate Streaming**: Multiple quality levels for optimal viewer experience
  - **Segment Configuration**: Customizable segment durations (2-10 seconds)
  - **Playlist Types**: Event, VOD, and live playlist support
  - **CDN Integration**: Direct output to content delivery networks

- **MPEG-TS (MPEG Transport Stream)**:
  - **Transport Protocols**: UDP, TCP, and SRT encapsulation options
  - **Broadcast Standards**: ATSC and DVB compliance
  - **Bitrate Control**: Configurable transport stream bitrates
  - **Legacy Compatibility**: Support for traditional broadcast systems

- **SRT Output**:
  - **Secure Transport**: AES-256 encryption for secure content delivery
  - **Multiple Modes**: Caller, listener, and rendezvous connection modes
  - **Latency Control**: Configurable latency settings (60-5000ms)
  - **Packet Recovery**: Automatic retransmission for lost packets

- **RTMP Output**:
  - **Social Media Integration**: Direct streaming to platforms like YouTube, Facebook, Twitch
  - **Server Redundancy**: Primary and backup server configuration
  - **Stream Key Management**: Secure stream key authentication
  - **Broad Compatibility**: Support for most streaming platforms and CDNs

### 🏷️ **SCTE-35 Marker Integration**
- **Marker Sources**:
  - **Embedded Detection**: Automatic detection of SCTE-35 markers in input streams
  - **Timecode-based**: Scheduled marker insertion based on timecode
  - **Manual Insertion**: On-demand marker insertion through web interface
  - **API-triggered**: Programmatic control via REST API

- **Marker Types**:
  - **Program Start/End**: Content boundary signaling
  - **Commercial Break**: Advertisement insertion points
  - **Provider Advertisement**: Provider-specific ad breaks
  - **Network Insertion**: Network-level content replacement

- **Advanced Configuration**:
  - **UPID (Unique Program Identifier)**: Multiple UPID types (URI, ADI, ISI, TCI)
  - **Duration Control**: Configurable ad break durations
  - **Preroll/Postroll**: Timing adjustments for seamless transitions
  - **Passthrough Mode**: Forward existing markers without modification

### 📺 **Server-Side Ad Insertion (SSAI)**
- **Ad Decision Servers**:
  - **VAST (Video Ad Serving Template)**: Industry-standard ad response format
  - **VMAP (Video Multiple Ad Playlist)**: Advanced ad scheduling and sequencing
  - **DAI (Dynamic Ad Insertion)**: Google's dynamic ad insertion platform
  - **Custom Integration**: Support for proprietary ad servers

- **Ad Management**:
  - **Ad Break Insertion**: Manual and automatic ad break scheduling
  - **Duration Control**: Configurable ad break lengths
  - **Fallback Strategies**: Slate media, original content, skip options
  - **Dynamic Insertion**: Real-time ad decision making

- **Tracking & Analytics**:
  - **Comprehensive Tracking**: Impression, quartile, and complete event tracking
  - **Beacon Support**: Multiple tracking beacon configurations
  - **Performance Metrics**: Ad fill rates, viewability, and engagement data
  - **Real-time Reporting**: Live ad performance monitoring

### 📊 **Real-time Monitoring & Analytics**
- **Input Health Monitoring**:
  - **Connection Status**: Real-time input source connectivity
  - **Bitrate Analysis**: Incoming stream bitrate monitoring
  - **Packet Loss Detection**: Network reliability metrics
  - **Latency Measurement**: End-to-end delay tracking

- **Encoder Performance**:
  - **CPU Utilization**: Real-time processor usage monitoring
  - **Memory Usage**: RAM consumption tracking
  - **Frame Rate Analysis**: Actual vs. target FPS comparison
  - **Queue Management**: Encoder buffer and queue monitoring

- **Output Health**:
  - **Stream Status**: Individual output stream health
  - **Viewer Analytics**: Concurrent viewer counting
  - **Uptime Tracking**: Stream duration and reliability metrics
  - **Error Monitoring**: Real-time error detection and alerting

- **Quality Metrics**:
  - **Video Quality Score**: Objective quality assessment
  - **Audio Quality Analysis**: Sound quality monitoring
  - **Buffer Health**: Streaming buffer performance
  - **Network Conditions**: Bandwidth and congestion analysis

## 🎨 Design & Theming

### AWS Elemental MediaLive Theme
- **AWS Orange Color Scheme**: Professional orange (#FF9900) and amber color palette
- **AWS-Inspired UI**: Clean, modern interface following AWS design principles
- **Responsive Design**: Mobile-first layout with AWS cloud aesthetics
- **Professional Components**: shadcn/ui components with AWS theming
- **Status Indicators**: AWS-style badges and progress indicators
- **Alert System**: AWS-themed notifications and alerts

### User Experience
- **Intuitive Navigation**: Tabbed interface with logical feature grouping
- **Real-time Feedback**: Immediate visual response to user actions
- **Progress Indicators**: Visual feedback for long-running operations
- **Status Visualization**: Color-coded status indicators and health metrics
- **Accessibility**: High contrast, keyboard navigation, and screen reader support

## 🏗️ Technical Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with TypeScript for type safety and performance
- **UI Components**: shadcn/ui component library with AWS theming
- **State Management**: React hooks with local state management
- **Real-time Updates**: Socket.io integration for live status updates
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Icon System**: Lucide React icons with AWS-appropriate selections

### Backend Architecture
- **API Framework**: Next.js API Routes for serverless function deployment
- **RESTful Design**: Standard HTTP methods and status codes
- **Error Handling**: Comprehensive error responses and validation
- **State Management**: In-memory storage (easily replaceable with database)
- **Real-time Communication**: Socket.io for WebSocket connections
- **Configuration Management**: JSON-based configuration system

### API Endpoints
```
/api/encoder/start     - Initialize encoder with configuration
/api/encoder/stop      - Gracefully shutdown encoder instance
/api/encoder/status   - Monitor encoder health and performance
/api/encoder/config   - Manage encoder profiles and settings
/api/encoder/scte35   - Control SCTE-35 marker insertion
/api/encoder/ssai     - Manage server-side ad insertion
```

### Data Flow
1. **User Interaction**: Frontend components capture user input
2. **API Communication**: RESTful calls to backend endpoints
3. **Encoder Control**: Backend processes configuration and controls encoder
4. **Real-time Updates**: WebSocket connections push live status updates
5. **UI Updates**: Frontend reflects current encoder state and metrics

## 🚀 Getting Started

### Prerequisites
- **Node.js**: Version 18 or higher
- **npm or yarn**: Package manager for dependencies
- **Modern Web Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Git**: For version control (optional)

### Installation
1. **Clone Repository**
   ```bash
   git clone https://github.com/shihan84/Bitstream-scte35.git
   cd Bitstream-scte35
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access Application**
   Open http://localhost:3000 in your web browser

### Development Commands
- **Development Server**: `npm run dev` - Start development environment
- **Production Build**: `npm run build` - Build optimized production version
- **Production Start**: `npm run start` - Start production server
- **Code Linting**: `npm run lint` - Run code quality checks
- **Database Setup**: `npm run db:push` - Initialize database schema

## 📋 Usage Guide

### Basic Stream Setup
1. **Configure Input Source**
   - Navigate to the **Input** tab
   - Select input type (SRT recommended for professional use)
   - Enter input URL and stream key (if required)
   - Configure backup sources for redundancy

2. **Set Up Encoding Profiles**
   - Go to the **Encoding** tab
   - Configure video codec, bitrate, and resolution
   - Set up audio codec and quality settings
   - Adjust advanced settings for optimization
   - Enable adaptive bitrate streaming

3. **Configure Output Destinations**
   - Access the **Output** tab
   - Enable desired output formats (HLS recommended)
   - Configure CDN endpoints and streaming URLs
   - Set up backup outputs for redundancy

4. **Enable Advanced Features**
   - **SCTE-35**: Configure marker insertion for ad signaling
   - **SSAI**: Set up ad decision servers and tracking
   - **Monitoring**: Configure alerts and notifications

### Advanced Configuration

#### SCTE-35 Marker Setup
1. **Enable SCTE-35 Processing**
   ```typescript
   // In the SCTE-35 tab, enable processing
   - Set source to "Embedded" for automatic detection
   - Configure UPID type and duration settings
   - Set preroll/postroll timing adjustments
   ```

2. **Manual Marker Insertion**
   ```typescript
   // Use the web interface or API
   - Click "Insert SCTE-35 Marker" during live stream
   - Configure marker type and duration
   - Monitor insertion success in status panel
   ```

#### SSAI Configuration
1. **Ad Server Setup**
   ```typescript
   // Configure ad decision server
   - Select provider type (VAST, VMAP, DAI)
   - Enter ad server URL and timeout settings
   - Configure fallback strategies
   - Enable tracking beacons
   ```

2. **Ad Break Management**
   ```typescript
   // Insert ad breaks programmatically
   - Use "Insert Ad Break" button during stream
   - Configure duration and ad server settings
   - Monitor ad performance in analytics
   ```

### API Usage Examples

#### Start Encoder
```javascript
const response = await fetch('/api/encoder/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    inputConfig: {
      type: 'srt',
      url: 'srt://localhost:9999'
    },
    encodingConfig: {
      video: { codec: 'h264', bitrate: '5000', resolution: '1080p' },
      audio: { codec: 'aac', bitrate: '128' }
    },
    outputConfig: {
      hls: { enabled: true, outputUrl: 'https://cdn.example.com/live/stream.m3u8' }
    }
  })
});
```

#### Insert SCTE-35 Marker
```javascript
const response = await fetch('/api/encoder/scte35', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    encoderId: 'encoder_123',
    action: 'insert',
    markerType: 'program_start',
    duration: 30,
    description: 'Manual SCTE-35 insertion'
  })
});
```

#### Insert Ad Break
```javascript
const response = await fetch('/api/encoder/ssai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    encoderId: 'encoder_123',
    action: 'insert_ad',
    adBreak: {
      duration: 30,
      adServer: 'vast',
      vastUrl: 'https://ads.example.com/vast'
    }
  })
});
```

## 🔧 Configuration Options

### Input Configuration
```json
{
  "inputConfig": {
    "type": "srt",
    "url": "srt://localhost:9999",
    "streamKey": "your-stream-key",
    "backupEnabled": true,
    "backupUrl": "srt://backup-server:9999",
    "redundancy": "failover"
  }
}
```

### Encoding Configuration
```json
{
  "encodingConfig": {
    "video": {
      "codec": "h264",
      "bitrate": "5000",
      "resolution": "1080p",
      "framerate": "30"
    },
    "audio": {
      "codec": "aac",
      "bitrate": "128",
      "sampleRate": "48",
      "channels": "stereo"
    },
    "advanced": {
      "keyframeInterval": "2",
      "bFrames": "3",
      "profile": "high",
      "preset": "medium"
    },
    "adaptiveBitrate": true
  }
}
```

### Output Configuration
```json
{
  "outputConfig": {
    "hls": {
      "enabled": true,
      "segmentDuration": "6",
      "playlistType": "event",
      "outputUrl": "https://cdn.example.com/live/stream.m3u8"
    },
    "mpegts": {
      "enabled": false,
      "transport": "udp",
      "bitrate": "6000",
      "outputUrl": "udp://cdn.example.com:9999"
    }
  }
}
```

## 🌐 Browser Support

- **Chrome**: Version 90 and above
- **Firefox**: Version 88 and above
- **Safari**: Version 14 and above
- **Edge**: Version 90 and above
- **Mobile Browsers**: iOS Safari 14+, Chrome for Android 90+

## 🔒 Security Considerations

- **Input Validation**: All user inputs are validated and sanitized
- **API Authentication**: Secure token-based authentication for API endpoints
- **Data Encryption**: SRT protocol provides AES-256 encryption for secure transport
- **CORS Protection**: Configured cross-origin resource sharing policies
- **Rate Limiting**: API endpoints protected against abuse
- **Secure Headers**: Security headers configured for web application protection

## 📈 Performance Optimization

- **Lazy Loading**: Components loaded on demand for improved initial load time
- **Code Splitting**: Application code split into manageable chunks
- **Caching**: Strategic caching of static assets and API responses
- **Optimized Images**: Images optimized for web delivery
- **Minification**: CSS and JavaScript minification for production builds
- **Compression**: Gzip compression for reduced bandwidth usage

## 🤝 Contributing

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/Bitstream-scte35.git
   cd Bitstream-scte35
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Implement your feature or bug fix
   - Add tests if applicable
   - Follow the existing code style

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "Add your feature description"
   ```

5. **Push to Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Submit a pull request to the main repository
   - Provide clear description of changes
   - Link any relevant issues

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support & Documentation

### Documentation
- **API Documentation**: Comprehensive API reference available at `/api` endpoints
- **User Guide**: Detailed usage instructions and configuration examples
- **Troubleshooting**: Common issues and solutions in the wiki

### Getting Help
- **GitHub Issues**: Report bugs and request features
- **Wiki**: Community-contributed documentation and guides
- **Discussions**: Community forum for questions and discussions

### Community
- **Contributors**: Welcome contributions from the community
- **Feedback**: We appreciate your feedback and suggestions
- **Collaboration**: Open to collaboration on features and improvements

## 🎯 Roadmap

### Upcoming Features
- **Multi-Channel Support**: Simultaneous encoding of multiple streams
- **Advanced Analytics**: Enhanced viewer analytics and engagement metrics
- **Cloud Storage Integration**: Direct integration with AWS S3 and other cloud storage
- **AI-Powered Optimization**: Machine learning for quality optimization
- **Mobile App**: Native mobile applications for remote monitoring

### Planned Improvements
- **Database Integration**: Persistent configuration storage
- **User Authentication**: Multi-user support with role-based access
- **Webhook Integration**: Automated notifications and integrations
- **Advanced Monitoring**: Enhanced alerting and notification systems
- **Plugin System**: Extensible architecture for custom features

## 🙏 Acknowledgments

### Technologies & Frameworks
- **Next.js 15**: React framework for production applications
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern React component library
- **Lucide React**: Beautiful icon library
- **Socket.io**: Real-time bidirectional event-based communication

### Inspiration & References
- **AWS Elemental MediaLive**: Professional live video encoding service
- **Bitmovin**: Leading online video platform provider
- **SCTE-35 Standards**: Society of Cable Telecommunications Engineers
- **HLS Specification**: HTTP Live Streaming technical documentation
- **VAST/VMAP Standards**: Digital video advertising specifications

---

**Built with ❤️ using Next.js and AWS Elemental MediaLive design principles**

🌐 **Repository**: https://github.com/shihan84/Bitstream-scte35  
📧 **Contact**: For support and inquiries, please open an issue in the repository  
📄 **License**: MIT License - see LICENSE file for details