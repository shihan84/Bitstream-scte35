import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { 
      encoderId, 
      action, 
      markerType, 
      duration, 
      upid, 
      description 
    } = body

    if (!encoderId || !action) {
      return NextResponse.json(
        { error: 'Missing encoder ID or action' },
        { status: 400 }
      )
    }

    // Validate action
    const validActions = ['insert', 'remove', 'list', 'configure']
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be one of: ' + validActions.join(', ') },
        { status: 400 }
      )
    }

    let result

    switch (action) {
      case 'insert':
        // Insert SCTE-35 marker
        const markerId = `scte35_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        result = {
          markerId,
          type: markerType || 'program_start',
          duration: duration || 30,
          upid: upid || '',
          description: description || '',
          timestamp: new Date().toISOString(),
          status: 'inserted'
        }
        break

      case 'remove':
        // Remove SCTE-35 marker
        const { markerId: removeMarkerId } = body
        if (!removeMarkerId) {
          return NextResponse.json(
            { error: 'Missing marker ID for removal' },
            { status: 400 }
          )
        }
        
        result = {
          markerId: removeMarkerId,
          status: 'removed',
          timestamp: new Date().toISOString()
        }
        break

      case 'list':
        // List SCTE-35 markers
        result = {
          markers: [
            {
              markerId: 'scte35_001',
              type: 'program_start',
              duration: 30,
              upid: 'test_upid',
              description: 'Test marker',
              timestamp: new Date(Date.now() - 60000).toISOString()
            },
            {
              markerId: 'scte35_002',
              type: 'program_end',
              duration: 0,
              upid: 'test_upid',
              description: 'Test end marker',
              timestamp: new Date(Date.now() - 30000).toISOString()
            }
          ]
        }
        break

      case 'configure':
        // Configure SCTE-35 settings
        const { config } = body
        if (!config) {
          return NextResponse.json(
            { error: 'Missing configuration' },
            { status: 400 }
          )
        }
        
        result = {
          config,
          status: 'configured',
          timestamp: new Date().toISOString()
        }
        break
    }

    return NextResponse.json({
      success: true,
      encoderId,
      action,
      result,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error handling SCTE-35 request:', error)
    return NextResponse.json(
      { error: 'Failed to process SCTE-35 request' },
      { status: 500 }
    )
  }
}