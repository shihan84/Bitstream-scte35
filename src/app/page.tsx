'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  Play, 
  Pause, 
  Square, 
  Settings, 
  Radio, 
  Monitor, 
  Network, 
  Shield,
  Zap,
  Video,
  Music,
  Cloud,
  Server,
  Activity
} from 'lucide-react'

interface EncoderConfig {
  inputConfig: {
    type: string
    url: string
    streamKey?: string
    backupEnabled: boolean
    backupUrl?: string
    redundancy: string
  }
  encodingConfig: {
    video: {
      codec: string
      bitrate: string
      resolution: string
      framerate: string
    }
    audio: {
      codec: string
      bitrate: string
      sampleRate: string
      channels: string
    }
    advanced: {
      keyframeInterval: string
      bFrames: string
      profile: string
      preset: string
    }
    adaptiveBitrate: boolean
  }
  outputConfig: {
    hls: {
      enabled: boolean
      segmentDuration: string
      playlistType: string
      outputUrl: string
    }
    mpegts: {
      enabled: boolean
      transport: string
      bitrate: string
      outputUrl: string
    }
    srt: {
      enabled: boolean
      mode: string
      latency: string
      outputUrl: string
    }
    rtmp: {
      enabled: boolean
      server: string
      streamKey: string
      backup: string
    }
  }
  scte35Config: {
    enabled: boolean
    source: string
    passthrough: boolean
    insertion: string
    upidType: string
    duration: string
    preroll: string
    postroll: string
  }
  ssaiConfig: {
    enabled: boolean
    provider: string
    url: string
    timeout: string
    fallback: string
    tracking: boolean
    beacons: string
    dynamic: boolean
  }
}

export default function LiveStreamEncoder() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [encoderStatus, setEncoderStatus] = useState<'idle' | 'starting' | 'running' | 'stopping'>('idle')
  const [progress, setProgress] = useState(0)
  const [encoderId, setEncoderId] = useState<string | null>(null)
  const [config, setConfig] = useState<EncoderConfig>({
    inputConfig: {
      type: 'srt',
      url: 'srt://localhost:9999',
      streamKey: '',
      backupEnabled: false,
      backupUrl: '',
      redundancy: 'none'
    },
    encodingConfig: {
      video: {
        codec: 'h264',
        bitrate: '5000',
        resolution: '1080p',
        framerate: '30'
      },
      audio: {
        codec: 'aac',
        bitrate: '128',
        sampleRate: '48',
        channels: 'stereo'
      },
      advanced: {
        keyframeInterval: '2',
        bFrames: '3',
        profile: 'high',
        preset: 'medium'
      },
      adaptiveBitrate: true
    },
    outputConfig: {
      hls: {
        enabled: true,
        segmentDuration: '6',
        playlistType: 'event',
        outputUrl: ''
      },
      mpegts: {
        enabled: false,
        transport: 'udp',
        bitrate: '6000',
        outputUrl: ''
      },
      srt: {
        enabled: false,
        mode: 'caller',
        latency: '120',
        outputUrl: ''
      },
      rtmp: {
        enabled: false,
        server: '',
        streamKey: '',
        backup: ''
      }
    },
    scte35Config: {
      enabled: true,
      source: 'embedded',
      passthrough: true,
      insertion: 'none',
      upidType: 'uri',
      duration: '30',
      preroll: '5',
      postroll: '5'
    },
    ssaiConfig: {
      enabled: false,
      provider: 'vast',
      url: '',
      timeout: '10',
      fallback: 'slate',
      tracking: true,
      beacons: 'all',
      dynamic: true
    }
  })

  const handleStartStream = async () => {
    try {
      setEncoderStatus('starting')
      
      const response = await fetch('/api/encoder/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputConfig: config.inputConfig,
          encodingConfig: config.encodingConfig,
          outputConfig: config.outputConfig
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to start encoder')
      }

      setEncoderId(data.encoderId)
      
      // Simulate startup process
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setEncoderStatus('running')
            setIsStreaming(true)
            return 100
          }
          return prev + 10
        })
      }, 200)

    } catch (error) {
      console.error('Error starting stream:', error)
      setEncoderStatus('idle')
      alert('Failed to start stream: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleStopStream = async () => {
    try {
      setEncoderStatus('stopping')
      
      if (encoderId) {
        const response = await fetch('/api/encoder/stop', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ encoderId }),
        })

        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to stop encoder')
        }
      }

      setTimeout(() => {
        setEncoderStatus('idle')
        setIsStreaming(false)
        setProgress(0)
        setEncoderId(null)
      }, 1000)

    } catch (error) {
      console.error('Error stopping stream:', error)
      setEncoderStatus('running')
      alert('Failed to stop stream: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const saveConfiguration = async () => {
    try {
      if (!encoderId) {
        alert('No active encoder instance')
        return
      }

      const response = await fetch('/api/encoder/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          encoderId,
          ...config
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save configuration')
      }

      alert('Configuration saved successfully')

    } catch (error) {
      console.error('Error saving configuration:', error)
      alert('Failed to save configuration: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const insertSCTE35Marker = async () => {
    try {
      if (!encoderId) {
        alert('No active encoder instance')
        return
      }

      const response = await fetch('/api/encoder/scte35', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          encoderId,
          action: 'insert',
          markerType: 'program_start',
          duration: parseInt(config.scte35Config.duration),
          upid: config.scte35Config.upidType,
          description: 'Manual SCTE-35 insertion'
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to insert SCTE-35 marker')
      }

      alert('SCTE-35 marker inserted successfully')

    } catch (error) {
      console.error('Error inserting SCTE-35 marker:', error)
      alert('Failed to insert SCTE-35 marker: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const insertAdBreak = async () => {
    try {
      if (!encoderId) {
        alert('No active encoder instance')
        return
      }

      const response = await fetch('/api/encoder/ssai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          encoderId,
          action: 'insert_ad',
          adBreak: {
            duration: 30,
            adServer: config.ssaiConfig.provider,
            vastUrl: config.ssaiConfig.url
          }
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to insert ad break')
      }

      alert('Ad break inserted successfully')

    } catch (error) {
      console.error('Error inserting ad break:', error)
      alert('Failed to insert ad break: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const updateConfig = (section: keyof EncoderConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const updateNestedConfig = (section: keyof EncoderConfig, subsection: string, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...(prev[section] as any)[subsection],
          [field]: value
        }
      }
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* AWS Themed Header */}
        <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AWS Elemental MediaLive</h1>
                <p className="text-gray-600">
                  Professional live encoding with HLS, SCTE-35, SSAI, SRT, and MPEG-TS support
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isStreaming ? "default" : "secondary"} className={isStreaming ? "bg-green-600" : "bg-gray-600"}>
                {isStreaming ? "Live" : "Offline"}
              </Badge>
              <div className="flex items-center gap-2">
                {encoderStatus === 'idle' && (
                  <Button onClick={handleStartStream} className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Start Stream
                  </Button>
                )}
                {encoderStatus === 'running' && (
                  <Button onClick={handleStopStream} variant="destructive" className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
                    <Square className="w-4 h-4" />
                    Stop Stream
                  </Button>
                )}
                {(encoderStatus === 'starting' || encoderStatus === 'stopping') && (
                  <Button disabled className="bg-orange-400 text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 animate-spin" />
                    {encoderStatus === 'starting' ? 'Starting...' : 'Stopping...'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {encoderStatus !== 'idle' && (
          <Card className="border-orange-200">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">Encoder Status</span>
                  <span className="font-medium text-orange-600 capitalize">{encoderStatus}</span>
                </div>
                <Progress value={progress} className="w-full h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Configuration Tabs */}
        <Tabs defaultValue="input" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6 bg-white border border-orange-200 p-1 rounded-lg">
            <TabsTrigger value="input" className="flex items-center gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <Radio className="w-4 h-4" />
              Input
            </TabsTrigger>
            <TabsTrigger value="encoding" className="flex items-center gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <Settings className="w-4 h-4" />
              Encoding
            </TabsTrigger>
            <TabsTrigger value="output" className="flex items-center gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <Monitor className="w-4 h-4" />
              Output
            </TabsTrigger>
            <TabsTrigger value="scte35" className="flex items-center gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <Zap className="w-4 h-4" />
              SCTE-35
            </TabsTrigger>
            <TabsTrigger value="ssai" className="flex items-center gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <Video className="w-4 h-4" />
              SSAI
            </TabsTrigger>
            <TabsTrigger value="monitor" className="flex items-center gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <Activity className="w-4 h-4" />
              Monitor
            </TabsTrigger>
          </TabsList>

          {/* Input Configuration */}
          <TabsContent value="input">
            <Card className="border-orange-200">
              <CardHeader className="bg-orange-50 border-b border-orange-200">
                <CardTitle className="text-orange-800 flex items-center gap-2">
                  <Radio className="w-5 h-5" />
                  Input Source Configuration
                </CardTitle>
                <CardDescription className="text-orange-700">
                  Configure your live stream input sources with support for SRT, RTMP, and other protocols
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="input-type" className="text-gray-700 font-medium">Input Type</Label>
                      <Select value={config.inputConfig.type} onValueChange={(value) => updateConfig('inputConfig', 'type', value)}>
                        <SelectTrigger className="border-orange-200 focus:border-orange-400">
                          <SelectValue placeholder="Select input type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="srt">SRT (Secure Reliable Transport)</SelectItem>
                          <SelectItem value="rtmp">RTMP</SelectItem>
                          <SelectItem value="rtsp">RTSP</SelectItem>
                          <SelectItem value="udp">UDP</SelectItem>
                          <SelectItem value="file">File Input</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="input-url" className="text-gray-700 font-medium">Input URL/Address</Label>
                      <Input 
                        id="input-url" 
                        value={config.inputConfig.url}
                        onChange={(e) => updateConfig('inputConfig', 'url', e.target.value)}
                        placeholder="srt://localhost:9999"
                        className="border-orange-200 focus:border-orange-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="stream-key" className="text-gray-700 font-medium">Stream Key (if applicable)</Label>
                      <Input 
                        id="stream-key" 
                        value={config.inputConfig.streamKey}
                        onChange={(e) => updateConfig('inputConfig', 'streamKey', e.target.value)}
                        placeholder="Enter stream key"
                        className="border-orange-200 focus:border-orange-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="backup-input" className="text-gray-700 font-medium">Backup Input Source</Label>
                      <Switch 
                        id="backup-input" 
                        checked={config.inputConfig.backupEnabled}
                        onCheckedChange={(checked) => updateConfig('inputConfig', 'backupEnabled', checked)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="backup-url" className="text-gray-700 font-medium">Backup Input URL</Label>
                      <Input 
                        id="backup-url" 
                        value={config.inputConfig.backupUrl}
                        onChange={(e) => updateConfig('inputConfig', 'backupUrl', e.target.value)}
                        placeholder="srt://backup-server:9999"
                        disabled={!config.inputConfig.backupEnabled}
                        className="border-orange-200 focus:border-orange-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="input-redundancy" className="text-gray-700 font-medium">Input Redundancy</Label>
                      <Select value={config.inputConfig.redundancy} onValueChange={(value) => updateConfig('inputConfig', 'redundancy', value)}>
                        <SelectTrigger className="border-orange-200 focus:border-orange-400">
                          <SelectValue placeholder="Select redundancy mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="failover">Failover</SelectItem>
                          <SelectItem value="round-robin">Round Robin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Alert className="border-orange-200 bg-orange-50">
                  <Shield className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-700">
                    SRT provides secure, reliable transport with encryption and packet recovery for professional live streaming.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Encoding Configuration */}
          <TabsContent value="encoding">
            <Card className="border-orange-200">
              <CardHeader className="bg-orange-50 border-b border-orange-200">
                <CardTitle className="text-orange-800 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Encoding Profiles
                </CardTitle>
                <CardDescription className="text-orange-700">
                  Configure multi-bitrate encoding profiles with AWS Elemental MediaLive features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Video Encoding */}
                  <Card className="border-orange-200">
                    <CardHeader className="pb-3 bg-orange-50">
                      <CardTitle className="text-lg text-orange-800 flex items-center gap-2">
                        <Video className="w-5 h-5" />
                        Video
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="video-codec" className="text-gray-700 font-medium">Codec</Label>
                        <Select value={config.encodingConfig.video.codec} onValueChange={(value) => updateNestedConfig('encodingConfig', 'video', 'codec', value)}>
                          <SelectTrigger className="border-orange-200 focus:border-orange-400">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="h264">H.264</SelectItem>
                            <SelectItem value="h265">H.265/HEVC</SelectItem>
                            <SelectItem value="av1">AV1</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="video-bitrate" className="text-gray-700 font-medium">Bitrate (kbps)</Label>
                        <Input 
                          id="video-bitrate" 
                          value={config.encodingConfig.video.bitrate}
                          onChange={(e) => updateNestedConfig('encodingConfig', 'video', 'bitrate', e.target.value)}
                          placeholder="5000"
                          className="border-orange-200 focus:border-orange-400"
                        />
                      </div>

                      <div>
                        <Label htmlFor="resolution" className="text-gray-700 font-medium">Resolution</Label>
                        <Select value={config.encodingConfig.video.resolution} onValueChange={(value) => updateNestedConfig('encodingConfig', 'video', 'resolution', value)}>
                          <SelectTrigger className="border-orange-200 focus:border-orange-400">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="4k">4K (3840x2160)</SelectItem>
                            <SelectItem value="1080p">1080p (1920x1080)</SelectItem>
                            <SelectItem value="720p">720p (1280x720)</SelectItem>
                            <SelectItem value="480p">480p (854x480)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="framerate" className="text-gray-700 font-medium">Frame Rate</Label>
                        <Select value={config.encodingConfig.video.framerate} onValueChange={(value) => updateNestedConfig('encodingConfig', 'video', 'framerate', value)}>
                          <SelectTrigger className="border-orange-200 focus:border-orange-400">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="60">60 fps</SelectItem>
                            <SelectItem value="30">30 fps</SelectItem>
                            <SelectItem value="25">25 fps</SelectItem>
                            <SelectItem value="24">24 fps</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Audio Encoding */}
                  <Card className="border-orange-200">
                    <CardHeader className="pb-3 bg-orange-50">
                      <CardTitle className="text-lg text-orange-800 flex items-center gap-2">
                        <Music className="w-5 h-5" />
                        Audio
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="audio-codec" className="text-gray-700 font-medium">Codec</Label>
                        <Select value={config.encodingConfig.audio.codec} onValueChange={(value) => updateNestedConfig('encodingConfig', 'audio', 'codec', value)}>
                          <SelectTrigger className="border-orange-200 focus:border-orange-400">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="aac">AAC</SelectItem>
                            <SelectItem value="mp3">MP3</SelectItem>
                            <SelectItem value="opus">Opus</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="audio-bitrate" className="text-gray-700 font-medium">Bitrate (kbps)</Label>
                        <Input 
                          id="audio-bitrate" 
                          value={config.encodingConfig.audio.bitrate}
                          onChange={(e) => updateNestedConfig('encodingConfig', 'audio', 'bitrate', e.target.value)}
                          placeholder="128"
                          className="border-orange-200 focus:border-orange-400"
                        />
                      </div>

                      <div>
                        <Label htmlFor="sample-rate" className="text-gray-700 font-medium">Sample Rate</Label>
                        <Select value={config.encodingConfig.audio.sampleRate} onValueChange={(value) => updateNestedConfig('encodingConfig', 'audio', 'sampleRate', value)}>
                          <SelectTrigger className="border-orange-200 focus:border-orange-400">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="48">48 kHz</SelectItem>
                            <SelectItem value="44.1">44.1 kHz</SelectItem>
                            <SelectItem value="32">32 kHz</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="channels" className="text-gray-700 font-medium">Channels</Label>
                        <Select value={config.encodingConfig.audio.channels} onValueChange={(value) => updateNestedConfig('encodingConfig', 'audio', 'channels', value)}>
                          <SelectTrigger className="border-orange-200 focus:border-orange-400">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mono">Mono</SelectItem>
                            <SelectItem value="stereo">Stereo</SelectItem>
                            <SelectItem value="5.1">5.1 Surround</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Advanced Settings */}
                  <Card className="border-orange-200">
                    <CardHeader className="pb-3 bg-orange-50">
                      <CardTitle className="text-lg text-orange-800 flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Advanced
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="keyframe-interval" className="text-gray-700 font-medium">Keyframe Interval</Label>
                        <Input 
                          id="keyframe-interval" 
                          value={config.encodingConfig.advanced.keyframeInterval}
                          onChange={(e) => updateNestedConfig('encodingConfig', 'advanced', 'keyframeInterval', e.target.value)}
                          placeholder="2"
                          className="border-orange-200 focus:border-orange-400"
                        />
                      </div>

                      <div>
                        <Label htmlFor="b-frames" className="text-gray-700 font-medium">B-Frames</Label>
                        <Input 
                          id="b-frames" 
                          value={config.encodingConfig.advanced.bFrames}
                          onChange={(e) => updateNestedConfig('encodingConfig', 'advanced', 'bFrames', e.target.value)}
                          placeholder="3"
                          className="border-orange-200 focus:border-orange-400"
                        />
                      </div>

                      <div>
                        <Label htmlFor="profile" className="text-gray-700 font-medium">Profile</Label>
                        <Select value={config.encodingConfig.advanced.profile} onValueChange={(value) => updateNestedConfig('encodingConfig', 'advanced', 'profile', value)}>
                          <SelectTrigger className="border-orange-200 focus:border-orange-400">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="baseline">Baseline</SelectItem>
                            <SelectItem value="main">Main</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="preset" className="text-gray-700 font-medium">Encoding Preset</Label>
                        <Select value={config.encodingConfig.advanced.preset} onValueChange={(value) => updateNestedConfig('encodingConfig', 'advanced', 'preset', value)}>
                          <SelectTrigger className="border-orange-200 focus:border-orange-400">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ultrafast">Ultra Fast</SelectItem>
                            <SelectItem value="superfast">Super Fast</SelectItem>
                            <SelectItem value="fast">Fast</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="slow">Slow</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch 
                      id="adaptive-bitrate" 
                      checked={config.encodingConfig.adaptiveBitrate}
                      onCheckedChange={(checked) => updateConfig('encodingConfig', 'adaptiveBitrate', checked)}
                    />
                    <Label htmlFor="adaptive-bitrate" className="text-gray-700 font-medium">Enable Adaptive Bitrate Streaming</Label>
                  </div>
                  <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">Add Profile</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Output Configuration */}
          <TabsContent value="output">
            <Card className="border-orange-200">
              <CardHeader className="bg-orange-50 border-b border-orange-200">
                <CardTitle className="text-orange-800 flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Output Destinations
                </CardTitle>
                <CardDescription className="text-orange-700">
                  Configure output destinations with support for HLS, MPEG-TS, and SRT protocols
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* HLS Output */}
                  <Card className="border-orange-200">
                    <CardHeader className="pb-3 bg-orange-50">
                      <CardTitle className="text-lg text-orange-800 flex items-center gap-2">
                        <Cloud className="w-5 h-5" />
                        HLS Output
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="hls-enabled" className="text-gray-700 font-medium">Enable HLS</Label>
                        <Switch 
                          id="hls-enabled" 
                          checked={config.outputConfig.hls.enabled}
                          onCheckedChange={(checked) => updateNestedConfig('outputConfig', 'hls', 'enabled', checked)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="hls-segment-duration" className="text-gray-700 font-medium">Segment Duration (seconds)</Label>
                        <Input 
                          id="hls-segment-duration" 
                          value={config.outputConfig.hls.segmentDuration}
                          onChange={(e) => updateNestedConfig('outputConfig', 'hls', 'segmentDuration', e.target.value)}
                          placeholder="6"
                          className="border-orange-200 focus:border-orange-400"
                        />
                      </div>

                      <div>
                        <Label htmlFor="hls-playlist-type" className="text-gray-700 font-medium">Playlist Type</Label>
                        <Select value={config.outputConfig.hls.playlistType} onValueChange={(value) => updateNestedConfig('outputConfig', 'hls', 'playlistType', value)}>
                          <SelectTrigger className="border-orange-200 focus:border-orange-400">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="event">Event</SelectItem>
                            <SelectItem value="vod">VOD</SelectItem>
                            <SelectItem value="live">Live</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="hls-output-url" className="text-gray-700 font-medium">Output URL</Label>
                        <Input 
                          id="hls-output-url" 
                          value={config.outputConfig.hls.outputUrl}
                          onChange={(e) => updateNestedConfig('outputConfig', 'hls', 'outputUrl', e.target.value)}
                          placeholder="https://cdn.example.com/live/stream.m3u8"
                          className="border-orange-200 focus:border-orange-400"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* MPEG-TS Output */}
                  <Card className="border-orange-200">
                    <CardHeader className="pb-3 bg-orange-50">
                      <CardTitle className="text-lg text-orange-800 flex items-center gap-2">
                        <Network className="w-5 h-5" />
                        MPEG-TS Output
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="mpegts-enabled" className="text-gray-700 font-medium">Enable MPEG-TS</Label>
                        <Switch 
                          id="mpegts-enabled" 
                          checked={config.outputConfig.mpegts.enabled}
                          onCheckedChange={(checked) => updateNestedConfig('outputConfig', 'mpegts', 'enabled', checked)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="mpegts-transport" className="text-gray-700 font-medium">Transport Protocol</Label>
                        <Select value={config.outputConfig.mpegts.transport} onValueChange={(value) => updateNestedConfig('outputConfig', 'mpegts', 'transport', value)}>
                          <SelectTrigger className="border-orange-200 focus:border-orange-400">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="udp">UDP</SelectItem>
                            <SelectItem value="tcp">TCP</SelectItem>
                            <SelectItem value="srt">SRT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="mpegts-bitrate" className="text-gray-700 font-medium">Transport Stream Bitrate</Label>
                        <Input 
                          id="mpegts-bitrate" 
                          value={config.outputConfig.mpegts.bitrate}
                          onChange={(e) => updateNestedConfig('outputConfig', 'mpegts', 'bitrate', e.target.value)}
                          placeholder="6000"
                          className="border-orange-200 focus:border-orange-400"
                        />
                      </div>

                      <div>
                        <Label htmlFor="mpegts-output-url" className="text-gray-700 font-medium">Output URL</Label>
                        <Input 
                          id="mpegts-output-url" 
                          value={config.outputConfig.mpegts.outputUrl}
                          onChange={(e) => updateNestedConfig('outputConfig', 'mpegts', 'outputUrl', e.target.value)}
                          placeholder="udp://cdn.example.com:9999"
                          className="border-orange-200 focus:border-orange-400"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* SRT Output */}
                  <Card className="border-orange-200">
                    <CardHeader className="pb-3 bg-orange-50">
                      <CardTitle className="text-lg text-orange-800 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        SRT Output
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="srt-enabled" className="text-gray-700 font-medium">Enable SRT</Label>
                        <Switch 
                          id="srt-enabled" 
                          checked={config.outputConfig.srt.enabled}
                          onCheckedChange={(checked) => updateNestedConfig('outputConfig', 'srt', 'enabled', checked)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="srt-mode" className="text-gray-700 font-medium">SRT Mode</Label>
                        <Select value={config.outputConfig.srt.mode} onValueChange={(value) => updateNestedConfig('outputConfig', 'srt', 'mode', value)}>
                          <SelectTrigger className="border-orange-200 focus:border-orange-400">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="caller">Caller</SelectItem>
                            <SelectItem value="listener">Listener</SelectItem>
                            <SelectItem value="rendezvous">Rendezvous</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="srt-latency" className="text-gray-700 font-medium">Latency (ms)</Label>
                        <Input 
                          id="srt-latency" 
                          value={config.outputConfig.srt.latency}
                          onChange={(e) => updateNestedConfig('outputConfig', 'srt', 'latency', e.target.value)}
                          placeholder="120"
                          className="border-orange-200 focus:border-orange-400"
                        />
                      </div>

                      <div>
                        <Label htmlFor="srt-output-url" className="text-gray-700 font-medium">Output URL</Label>
                        <Input 
                          id="srt-output-url" 
                          value={config.outputConfig.srt.outputUrl}
                          onChange={(e) => updateNestedConfig('outputConfig', 'srt', 'outputUrl', e.target.value)}
                          placeholder="srt://cdn.example.com:9999"
                          className="border-orange-200 focus:border-orange-400"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* RTMP Output */}
                  <Card className="border-orange-200">
                    <CardHeader className="pb-3 bg-orange-50">
                      <CardTitle className="text-lg text-orange-800 flex items-center gap-2">
                        <Server className="w-5 h-5" />
                        RTMP Output
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="rtmp-enabled" className="text-gray-700 font-medium">Enable RTMP</Label>
                        <Switch 
                          id="rtmp-enabled" 
                          checked={config.outputConfig.rtmp.enabled}
                          onCheckedChange={(checked) => updateNestedConfig('outputConfig', 'rtmp', 'enabled', checked)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="rtmp-server" className="text-gray-700 font-medium">RTMP Server</Label>
                        <Input 
                          id="rtmp-server" 
                          value={config.outputConfig.rtmp.server}
                          onChange={(e) => updateNestedConfig('outputConfig', 'rtmp', 'server', e.target.value)}
                          placeholder="rtmp://live.example.com/live"
                          className="border-orange-200 focus:border-orange-400"
                        />
                      </div>

                      <div>
                        <Label htmlFor="rtmp-stream-key" className="text-gray-700 font-medium">Stream Key</Label>
                        <Input 
                          id="rtmp-stream-key" 
                          value={config.outputConfig.rtmp.streamKey}
                          onChange={(e) => updateNestedConfig('outputConfig', 'rtmp', 'streamKey', e.target.value)}
                          placeholder="Enter stream key"
                          className="border-orange-200 focus:border-orange-400"
                        />
                      </div>

                      <div>
                        <Label htmlFor="rtmp-backup" className="text-gray-700 font-medium">Backup Server</Label>
                        <Input 
                          id="rtmp-backup" 
                          value={config.outputConfig.rtmp.backup}
                          onChange={(e) => updateNestedConfig('outputConfig', 'rtmp', 'backup', e.target.value)}
                          placeholder="rtmp://backup.example.com/live"
                          className="border-orange-200 focus:border-orange-400"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SCTE-35 Configuration */}
          <TabsContent value="scte35">
            <Card className="border-orange-200">
              <CardHeader className="bg-orange-50 border-b border-orange-200">
                <CardTitle className="text-orange-800 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  SCTE-35 Marker Configuration
                </CardTitle>
                <CardDescription className="text-orange-700">
                  Configure SCTE-35 markers for ad insertion and content segmentation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="scte35-enabled" className="text-gray-700 font-medium">Enable SCTE-35</Label>
                      <Switch 
                        id="scte35-enabled" 
                        checked={config.scte35Config.enabled}
                        onCheckedChange={(checked) => updateConfig('scte35Config', 'enabled', checked)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="scte35-source" className="text-gray-700 font-medium">SCTE-35 Source</Label>
                      <Select value={config.scte35Config.source} onValueChange={(value) => updateConfig('scte35Config', 'source', value)}>
                        <SelectTrigger className="border-orange-200 focus:border-orange-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="embedded">Embedded in Stream</SelectItem>
                          <SelectItem value="timecode">Timecode Based</SelectItem>
                          <SelectItem value="manual">Manual Insertion</SelectItem>
                          <SelectItem value="api">API Triggered</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="scte35-passthrough" className="text-gray-700 font-medium">Passthrough Mode</Label>
                      <Switch 
                        id="scte35-passthrough" 
                        checked={config.scte35Config.passthrough}
                        onCheckedChange={(checked) => updateConfig('scte35Config', 'passthrough', checked)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="scte35-insertion" className="text-gray-700 font-medium">Auto Insertion</Label>
                      <Select value={config.scte35Config.insertion} onValueChange={(value) => updateConfig('scte35Config', 'insertion', value)}>
                        <SelectTrigger className="border-orange-200 focus:border-orange-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="interval">Time Interval</SelectItem>
                          <SelectItem value="cue">Cue Points</SelectItem>
                          <SelectItem value="schedule">Scheduled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="scte35-upid" className="text-gray-700 font-medium">UPID Type</Label>
                      <Select value={config.scte35Config.upidType} onValueChange={(value) => updateConfig('scte35Config', 'upidType', value)}>
                        <SelectTrigger className="border-orange-200 focus:border-orange-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="uri">URI</SelectItem>
                          <SelectItem value="adi">ADI</SelectItem>
                          <SelectItem value="isi">ISI</SelectItem>
                          <SelectItem value="tci">TCI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="scte35-duration" className="text-gray-700 font-medium">Default Duration (seconds)</Label>
                      <Input 
                        id="scte35-duration" 
                        value={config.scte35Config.duration}
                        onChange={(e) => updateConfig('scte35Config', 'duration', e.target.value)}
                        placeholder="30"
                        className="border-orange-200 focus:border-orange-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="scte35-preroll" className="text-gray-700 font-medium">Preroll (seconds)</Label>
                      <Input 
                        id="scte35-preroll" 
                        value={config.scte35Config.preroll}
                        onChange={(e) => updateConfig('scte35Config', 'preroll', e.target.value)}
                        placeholder="5"
                        className="border-orange-200 focus:border-orange-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="scte35-postroll" className="text-gray-700 font-medium">Postroll (seconds)</Label>
                      <Input 
                        id="scte35-postroll" 
                        value={config.scte35Config.postroll}
                        onChange={(e) => updateConfig('scte35Config', 'postroll', e.target.value)}
                        placeholder="5"
                        className="border-orange-200 focus:border-orange-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={insertSCTE35Marker} disabled={!isStreaming || !config.scte35Config.enabled} className="bg-orange-500 hover:bg-orange-600 text-white">
                    Insert SCTE-35 Marker
                  </Button>
                  <Button variant="outline" onClick={saveConfiguration} className="border-orange-200 text-orange-700 hover:bg-orange-50">
                    Save Configuration
                  </Button>
                </div>

                <Alert className="border-orange-200 bg-orange-50">
                  <Zap className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-700">
                    SCTE-35 markers enable precise ad insertion and content segmentation. Configure based on your ad server requirements.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SSAI Configuration */}
          <TabsContent value="ssai">
            <Card className="border-orange-200">
              <CardHeader className="bg-orange-50 border-b border-orange-200">
                <CardTitle className="text-orange-800 flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Server-Side Ad Insertion (SSAI)
                </CardTitle>
                <CardDescription className="text-orange-700">
                  Configure server-side ad insertion with ad decision servers and ad tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ssai-enabled" className="text-gray-700 font-medium">Enable SSAI</Label>
                      <Switch 
                        id="ssai-enabled" 
                        checked={config.ssaiConfig.enabled}
                        onCheckedChange={(checked) => updateConfig('ssaiConfig', 'enabled', checked)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="ads-provider" className="text-gray-700 font-medium">Ad Decision Server</Label>
                      <Select value={config.ssaiConfig.provider} onValueChange={(value) => updateConfig('ssaiConfig', 'provider', value)}>
                        <SelectTrigger className="border-orange-200 focus:border-orange-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vast">VAST</SelectItem>
                          <SelectItem value="vmap">VMAP</SelectItem>
                          <SelectItem value="dai">DAI</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="ads-url" className="text-gray-700 font-medium">Ad Server URL</Label>
                      <Input 
                        id="ads-url" 
                        value={config.ssaiConfig.url}
                        onChange={(e) => updateConfig('ssaiConfig', 'url', e.target.value)}
                        placeholder="https://ads.example.com/vast"
                        className="border-orange-200 focus:border-orange-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="ads-timeout" className="text-gray-700 font-medium">Timeout (seconds)</Label>
                      <Input 
                        id="ads-timeout" 
                        value={config.ssaiConfig.timeout}
                        onChange={(e) => updateConfig('ssaiConfig', 'timeout', e.target.value)}
                        placeholder="10"
                        className="border-orange-200 focus:border-orange-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ads-fallback" className="text-gray-700 font-medium">Fallback Strategy</Label>
                      <Select value={config.ssaiConfig.fallback} onValueChange={(value) => updateConfig('ssaiConfig', 'fallback', value)}>
                        <SelectTrigger className="border-orange-200 focus:border-orange-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="slate">Slate Media</SelectItem>
                          <SelectItem value="original">Original Content</SelectItem>
                          <SelectItem value="skip">Skip Ad</SelectItem>
                          <SelectItem value="error">Error Out</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="ads-tracking" className="text-gray-700 font-medium">Ad Tracking</Label>
                      <Switch 
                        id="ads-tracking" 
                        checked={config.ssaiConfig.tracking}
                        onCheckedChange={(checked) => updateConfig('ssaiConfig', 'tracking', checked)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="ads-beacons" className="text-gray-700 font-medium">Tracking Beacons</Label>
                      <Select value={config.ssaiConfig.beacons} onValueChange={(value) => updateConfig('ssaiConfig', 'beacons', value)}>
                        <SelectTrigger className="border-orange-200 focus:border-orange-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Events</SelectItem>
                          <SelectItem value="impression">Impression Only</SelectItem>
                          <SelectItem value="quartile">Quartile Events</SelectItem>
                          <SelectItem value="complete">Complete Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="ads-dynamic" className="text-gray-700 font-medium">Dynamic Ad Insertion</Label>
                      <Switch 
                        id="ads-dynamic" 
                        checked={config.ssaiConfig.dynamic}
                        onCheckedChange={(checked) => updateConfig('ssaiConfig', 'dynamic', checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={insertAdBreak} disabled={!isStreaming || !config.ssaiConfig.enabled} className="bg-orange-500 hover:bg-orange-600 text-white">
                    Insert Ad Break
                  </Button>
                  <Button variant="outline" onClick={saveConfiguration} className="border-orange-200 text-orange-700 hover:bg-orange-50">
                    Save Configuration
                  </Button>
                </div>

                <Alert className="border-orange-200 bg-orange-50">
                  <Video className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-700">
                    SSAI enables seamless ad insertion without client-side buffering, providing a better viewer experience.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring */}
          <TabsContent value="monitor">
            <Card className="border-orange-200">
              <CardHeader className="bg-orange-50 border-b border-orange-200">
                <CardTitle className="text-orange-800 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Stream Monitoring
                </CardTitle>
                <CardDescription className="text-orange-700">
                  Monitor your live stream health, performance, and metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-orange-200">
                    <CardHeader className="pb-3 bg-orange-50">
                      <CardTitle className="text-lg text-orange-800">Input Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status</span>
                          <Badge variant={isStreaming ? "default" : "secondary"} className={isStreaming ? "bg-green-600" : "bg-gray-600"}>
                            {isStreaming ? "Connected" : "Disconnected"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bitrate</span>
                          <span className="font-medium">{isStreaming ? "5.2 Mbps" : "0 Mbps"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Packet Loss</span>
                          <span className="font-medium">{isStreaming ? "0.01%" : "0%"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Latency</span>
                          <span className="font-medium">{isStreaming ? "45ms" : "0ms"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-200">
                    <CardHeader className="pb-3 bg-orange-50">
                      <CardTitle className="text-lg text-orange-800">Encoder Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">CPU Usage</span>
                          <span className="font-medium">{isStreaming ? "45%" : "0%"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Memory</span>
                          <span className="font-medium">{isStreaming ? "2.1 GB" : "0 GB"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">FPS</span>
                          <span className="font-medium">{isStreaming ? "30/30" : "0/30"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Queue</span>
                          <span className="font-medium">{isStreaming ? "12 frames" : "0 frames"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-200">
                    <CardHeader className="pb-3 bg-orange-50">
                      <CardTitle className="text-lg text-orange-800">Output Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">HLS</span>
                          <Badge variant={config.outputConfig.hls.enabled && isStreaming ? "default" : "secondary"} className={config.outputConfig.hls.enabled && isStreaming ? "bg-green-600" : "bg-gray-600"}>
                            {config.outputConfig.hls.enabled && isStreaming ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Viewers</span>
                          <span className="font-medium">{isStreaming ? "1,247" : "0"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Uptime</span>
                          <span className="font-medium">{isStreaming ? "2h 34m" : "0h 0m"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Errors</span>
                          <span className="font-medium">{isStreaming ? "0" : "0"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-orange-200">
                    <CardHeader>
                      <CardTitle className="text-orange-800">Stream Quality Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Video Quality</span>
                            <span className="font-medium">{isStreaming ? "Excellent" : "N/A"}</span>
                          </div>
                          <Progress value={isStreaming ? 95 : 0} className="w-full h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Audio Quality</span>
                            <span className="font-medium">{isStreaming ? "Excellent" : "N/A"}</span>
                          </div>
                          <Progress value={isStreaming ? 98 : 0} className="w-full h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Buffer Health</span>
                            <span className="font-medium">{isStreaming ? "Good" : "N/A"}</span>
                          </div>
                          <Progress value={isStreaming ? 85 : 0} className="w-full h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-200">
                    <CardHeader>
                      <CardTitle className="text-orange-800">Alerts & Notifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                          <span className="text-sm">
                            {isStreaming ? 'Stream started successfully' : 'Stream is offline'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">
                            {isStreaming ? 'High bitrate detected - auto-adjusting' : 'Encoder ready'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${config.inputConfig.backupEnabled ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
                          <span className="text-sm">
                            {config.inputConfig.backupEnabled ? 'Backup input ready' : 'No backup configured'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                          <span className="text-sm">
                            {isStreaming ? 'All outputs healthy' : 'Outputs inactive'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}