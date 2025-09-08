import { NextRequest, NextResponse } from 'next/server'

// Simulated encoder status storage (in real app, use database)
const encoderStatuses = new Map<string, any>()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const encoderId = searchParams.get('encoderId')

    if (!encoderId) {
      return NextResponse.json(
        { error: 'Missing encoder ID' },
        { status: 400 }
      )
    }

    const status = encoderStatuses.get(encoderId) || {
      status: 'idle',
      uptime: 0,
      inputHealth: {
        connected: false,
        bitrate: 0,
        packetLoss: 0,
        latency: 0
      },
      outputHealth: {
        active: false,
        viewers: 0,
        uptime: 0,
        errors: 0
      },
      performance: {
        cpuUsage: 0,
        memoryUsage: 0,
        fps: 0,
        queueSize: 0
      }
    }

    return NextResponse.json({
      success: true,
      encoderId,
      status,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error getting encoder status:', error)
    return NextResponse.json(
      { error: 'Failed to get encoder status' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { encoderId, status } = body

    if (!encoderId || !status) {
      return NextResponse.json(
        { error: 'Missing encoder ID or status' },
        { status: 400 }
      )
    }

    // Update encoder status
    encoderStatuses.set(encoderId, {
      ...status,
      lastUpdated: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      encoderId,
      message: 'Status updated successfully'
    })

  } catch (error) {
    console.error('Error updating encoder status:', error)
    return NextResponse.json(
      { error: 'Failed to update encoder status' },
      { status: 500 }
    )
  }
}