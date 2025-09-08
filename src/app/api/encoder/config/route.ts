import { NextRequest, NextResponse } from 'next/server'

// Simulated configuration storage (in real app, use database)
const encoderConfigs = new Map<string, any>()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const encoderId = searchParams.get('encoderId')

    if (!encoderId) {
      // Return all configurations if no specific encoder ID
      const allConfigs = Array.from(encoderConfigs.entries()).map(([id, config]) => ({
        encoderId: id,
        ...config
      }))
      
      return NextResponse.json({
        success: true,
        configs: allConfigs,
        count: allConfigs.length
      })
    }

    const config = encoderConfigs.get(encoderId)
    
    if (!config) {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      encoderId,
      config
    })

  } catch (error) {
    console.error('Error getting encoder configuration:', error)
    return NextResponse.json(
      { error: 'Failed to get encoder configuration' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { 
      encoderId, 
      inputConfig, 
      encodingConfig, 
      outputConfig, 
      scte35Config, 
      ssaiConfig 
    } = body

    if (!encoderId) {
      return NextResponse.json(
        { error: 'Missing encoder ID' },
        { status: 400 }
      )
    }

    // Validate configuration
    if (!inputConfig || !encodingConfig || !outputConfig) {
      return NextResponse.json(
        { error: 'Missing required configuration (input, encoding, or output)' },
        { status: 400 }
      )
    }

    const config = {
      inputConfig,
      encodingConfig,
      outputConfig,
      scte35Config: scte35Config || null,
      ssaiConfig: ssaiConfig || null,
      lastUpdated: new Date().toISOString(),
      version: 1
    }

    // Store configuration
    encoderConfigs.set(encoderId, config)

    return NextResponse.json({
      success: true,
      encoderId,
      config,
      message: 'Configuration saved successfully'
    })

  } catch (error) {
    console.error('Error saving encoder configuration:', error)
    return NextResponse.json(
      { error: 'Failed to save encoder configuration' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { encoderId, ...configUpdates } = body

    if (!encoderId) {
      return NextResponse.json(
        { error: 'Missing encoder ID' },
        { status: 400 }
      )
    }

    const existingConfig = encoderConfigs.get(encoderId)
    
    if (!existingConfig) {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      )
    }

    // Update configuration
    const updatedConfig = {
      ...existingConfig,
      ...configUpdates,
      lastUpdated: new Date().toISOString(),
      version: (existingConfig.version || 1) + 1
    }

    encoderConfigs.set(encoderId, updatedConfig)

    return NextResponse.json({
      success: true,
      encoderId,
      config: updatedConfig,
      message: 'Configuration updated successfully'
    })

  } catch (error) {
    console.error('Error updating encoder configuration:', error)
    return NextResponse.json(
      { error: 'Failed to update encoder configuration' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const encoderId = searchParams.get('encoderId')

    if (!encoderId) {
      return NextResponse.json(
        { error: 'Missing encoder ID' },
        { status: 400 }
      )
    }

    const deleted = encoderConfigs.delete(encoderId)
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      encoderId,
      message: 'Configuration deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting encoder configuration:', error)
    return NextResponse.json(
      { error: 'Failed to delete encoder configuration' },
      { status: 500 }
    )
  }
}