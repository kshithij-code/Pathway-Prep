import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'uploads')

export async function GET(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('resume') as File
        const interests = formData.getAll('interests[]') as string[]

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        // Ensure upload directory exists
        await writeFile(UPLOAD_DIR, '', { flag: 'a' })

        const buffer = Buffer.from(await file.arrayBuffer())
        const fileName = `${Date.now()}-${file.name}`
        const filePath = path.join(UPLOAD_DIR, fileName)

        await writeFile(filePath, buffer)

        // Send to Flask API
        const response = await fetch('http://127.0.0.1:5000/genarate_ques', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fileName,
                interests,
            }),
        })

        if (!response.ok) {
            throw new Error('Failed to generate questions')
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        )
    }
}

