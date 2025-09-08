import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { encoderId } = body
    
    if (!encoderId) {
      return NextResponse.json(
        { error: 'Missing encoder ID' },
        { status: 400 }
      )
    }

    // Simulate encoder shutdown process
    // In a real implementation, this would interface with actual encoder hardware/software
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      encoderId,
      status: 'stopped',
      message: 'Encoder stopped successfully',
      stopTime: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error stopping encoder:', error)
    return NextResponse.json(
      { error: 'Failed to stop encoder' },
      { status: 500 }
    )
  }
}