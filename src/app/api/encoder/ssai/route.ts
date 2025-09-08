import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { 
      encoderId, 
      action, 
      adConfig, 
      adBreak, 
      tracking 
    } = body

    if (!encoderId || !action) {
      return NextResponse.json(
        { error: 'Missing encoder ID or action' },
        { status: 400 }
      )
    }

    // Validate action
    const validActions = ['configure', 'insert_ad', 'get_status', 'update_tracking']
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be one of: ' + validActions.join(', ') },
        { status: 400 }
      )
    }

    let result

    switch (action) {
      case 'configure':
        // Configure SSAI settings
        if (!adConfig) {
          return NextResponse.json(
            { error: 'Missing ad configuration' },
            { status: 400 }
          )
        }
        
        result = {
          adConfig,
          status: 'configured',
          enabled: true,
          timestamp: new Date().toISOString()
        }
        break

      case 'insert_ad':
        // Insert ad break
        if (!adBreak) {
          return NextResponse.json(
            { error: 'Missing ad break configuration' },
            { status: 400 }
          )
        }
        
        const adBreakId = `adbreak_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        result = {
          adBreakId,
          duration: adBreak.duration || 30,
          adServer: adBreak.adServer || 'default',
          vastUrl: adBreak.vastUrl || '',
          status: 'scheduled',
          timestamp: new Date().toISOString()
        }
        break

      case 'get_status':
        // Get SSAI status
        result = {
          enabled: true,
          activeAdBreaks: 1,
          totalAdsInserted: 45,
          adFillRate: 85.5,
          averageDuration: 28.5,
          lastAdInsertion: new Date(Date.now() - 300000).toISOString()
        }
        break

      case 'update_tracking':
        // Update ad tracking
        if (!tracking) {
          return NextResponse.json(
            { error: 'Missing tracking data' },
            { status: 400 }
          )
        }
        
        result = {
          tracking,
          status: 'updated',
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
    console.error('Error handling SSAI request:', error)
    return NextResponse.json(
      { error: 'Failed to process SSAI request' },
      { status: 500 }
    )
  }
}