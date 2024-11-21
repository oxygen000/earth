'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from '@/hooks/use-toast'

interface Square {
  id: number
  details: string
  reserved: boolean
  reservedBy: string
}

export function DivisibleSpaceComponent() {
  const [rows, setRows] = useState(3)
  const [cols, setColumns] = useState(3)
  const [squares, setSquares] = useState<Square[]>([])
  const [name, setName] = useState('')
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)

  useEffect(() => {
    const savedState = localStorage.getItem('divisibleSpaceState')
    if (savedState) {
      const { rows: savedRows, cols: savedCols, squares: savedSquares, name: savedName } = JSON.parse(savedState)
      setRows(savedRows)
      setColumns(savedCols)
      setSquares(savedSquares)
      setName(savedName || '')
    } else {
      setSquares(Array.from({ length: rows * cols }, (_, i) => ({ id: i, details: '', reserved: false, reservedBy: '' })))
    }
  }, [])

  const handleDivisionChange = (newRows: number, newCols: number) => {
    setRows(newRows)
    setColumns(newCols)
    setSquares(Array.from({ length: newRows * newCols }, (_, i) => ({ id: i, details: '', reserved: false, reservedBy: '' })))
  }

  const handleSquareClick = (square: Square) => {
    setSelectedSquare(square)
  }

  const handleReserve = (id: number) => {
    if (!name) {
      toast({
        title: "Name Required",
        description: "Please enter your name before reserving a square.",
        variant: "destructive",
      })
      return
    }
    setSquares(squares.map(sq => 
      sq.id === id ? { ...sq, reserved: !sq.reserved, reservedBy: !sq.reserved ? name : '' } : sq
    ))
    setSelectedSquare(prev => prev ? { ...prev, reserved: !prev.reserved, reservedBy: !prev.reserved ? name : '' } : null)
  }

  const handleDetailsChange = (id: number, details: string) => {
    setSquares(squares.map(sq => 
      sq.id === id ? { ...sq, details } : sq
    ))
    setSelectedSquare(prev => prev && prev.id === id ? { ...prev, details } : prev)
  }

  const handleSave = () => {
    localStorage.setItem('divisibleSpaceState', JSON.stringify({ rows, cols, squares, name }))
    toast({
      title: "Saved",
      description: "The current space configuration has been saved.",
    })
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold">Divisible Space</h1>
        <div className="flex flex-wrap gap-4">
          <div className="space-y-2">
            <Label htmlFor="rows">Rows</Label>
            <Input
              id="rows"
              type="number"
              min="1"
              value={rows}
              onChange={(e) => handleDivisionChange(Math.max(1, parseInt(e.target.value) || 1), cols)}
              className="w-20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cols">Columns</Label>
            <Input
              id="cols"
              type="number"
              min="1"
              value={cols}
              onChange={(e) => handleDivisionChange(rows, Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-40"
              placeholder="Enter your name"
            />
          </div>
          <Button onClick={handleSave} className="self-end">
            Save Configuration
          </Button>
        </div>
        <div 
          className="w-full max-w-2xl aspect-video bg-red-500 border border-gray-300"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {squares.map((square) => (
            <Tooltip key={square.id}>
              <TooltipTrigger asChild>
                <button
                  className={`border border-white/30 transition-colors duration-300 hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
                    square.reserved ? 'bg-red-300' : ''
                  }`}
                  onClick={() => handleSquareClick(square)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p><strong>Status:</strong> {square.reserved ? 'Reserved' : 'Available'}</p>
                {square.reserved && <p><strong>Reserved by:</strong> {square.reservedBy}</p>}
                <p><strong>Details:</strong> {square.details || 'No details provided'}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        {selectedSquare && (
          <Card>
            <CardHeader>
              <CardTitle>Selected Square Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="squareDetails">Details</Label>
                  <Textarea
                    id="squareDetails"
                    value={selectedSquare.details}
                    onChange={(e) => handleDetailsChange(selectedSquare.id, e.target.value)}
                    placeholder="Enter square details"
                    className="mt-1"
                  />
                </div>
                <div>
                  <p><strong>Status:</strong> {selectedSquare.reserved ? 'Reserved' : 'Available'}</p>
                  {selectedSquare.reserved && <p><strong>Reserved by:</strong> {selectedSquare.reservedBy}</p>}
                </div>
                <Button onClick={() => handleReserve(selectedSquare.id)}>
                  {selectedSquare.reserved ? 'Unreserve' : 'Reserve'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  )
}