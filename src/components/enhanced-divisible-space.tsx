'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from '@/hooks/use-toast'
import {
  TooltipProvider,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import * as XLSX from 'xlsx'  // استيراد مكتبة xlsx

interface Square {
  id: number
  details: string
  reserved: boolean
  reservedBy: string
  color: string
  tags: string[]
  capacity: number
}

export function EnhancedDivisibleSpaceComponent() {
  const [rows, setRows] = useState(32)
  const [cols, setColumns] = useState(32)
  const [squares, setSquares] = useState<Square[]>([])
  const [name, setName] = useState('')
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const savedState = localStorage.getItem('enhancedDivisibleSpaceState')
    if (savedState) {
      const { rows: savedRows, cols: savedCols, squares: savedSquares, name: savedName } = JSON.parse(savedState)
      setRows(savedRows)
      setColumns(savedCols)
      setSquares(savedSquares)
      setName(savedName || '')
    } else {
      setSquares(Array.from({ length: rows * cols }, (_, i) => ({
        id: i,
        details: '',
        reserved: false,
        reservedBy: '',
        color: '#ff0000',
        tags: [],
        capacity: 1
      })))
    }
  }, [])

  const handleDivisionChange = (newRows: number, newCols: number) => {
    setRows(newRows)
    setColumns(newCols)
    setSquares(Array.from({ length: newRows * newCols }, (_, i) => ({
      id: i,
      details: '',
      reserved: false,
      reservedBy: '',
      color: '#ff0000',
      tags: [],
      capacity: 1
    })))
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

  const handleColorChange = (id: number, color: string) => {
    setSquares(squares.map(sq => 
      sq.id === id ? { ...sq, color } : sq
    ))
    setSelectedSquare(prev => prev && prev.id === id ? { ...prev, color } : prev)
  }

  const handleTagsChange = (id: number, tags: string) => {
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    setSquares(squares.map(sq => 
      sq.id === id ? { ...sq, tags: tagArray } : sq
    ))
    setSelectedSquare(prev => prev && prev.id === id ? { ...prev, tags: tagArray } : prev)
  }

  const handleCapacityChange = (id: number, capacity: number) => {
    setSquares(squares.map(sq => 
      sq.id === id ? { ...sq, capacity } : sq
    ))
    setSelectedSquare(prev => prev && prev.id === id ? { ...prev, capacity } : prev)
  }

  const handleSave = () => {
    localStorage.setItem('enhancedDivisibleSpaceState', JSON.stringify({ rows, cols, squares, name }))
    toast({
      title: "Saved",
      description: "The current space configuration has been saved.",
    })
  }

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(squares.map(square => ({
      'Square ID': square.id + 1, // إضافة 1 لتعكس الأرقام الطبيعية
      'Details': square.details,
      'Reserved': square.reserved ? 'Yes' : 'No',
      'Reserved By': square.reservedBy,
      'Capacity': square.capacity,
      'Tags': square.tags.join(', '),
    })))

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Squares')

    // حفظ الملف بصيغة Excel
    XLSX.writeFile(wb, 'divisible_space.xlsx')
  }

  const filteredSquares = squares.filter(square => 
    square.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    square.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    square.reservedBy.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const reservedSquares = squares.filter(square => square.reserved)

  return (
    <TooltipProvider>
      <div className="container mx-auto p-4 space-y-4 text-6xl" dir="rtl"> {/* إضافة dir="rtl" هنا */}
        <h1 className="text-6xl font-bold">المساحة القابلة للتقسيم المحسّنة</h1>
        <div className="flex flex-wrap gap-4 text-6xl">
          <div className="space-y-2">
            <Label htmlFor="rows">عدد الصفوف</Label>
            <Input
              id="rows"
              type="number"
              min="1"
              value={rows}
              onChange={(e) => handleDivisionChange(Math.max(1, parseInt(e.target.value) || 1), cols)}
              className="w-20 text-6xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cols">عدد الأعمدة</Label>
            <Input
              id="cols"
              type="number"
              min="1"
              value={cols}
              onChange={(e) => handleDivisionChange(rows, Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 text-6xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">اسمك</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-40 text-6xl"
              placeholder="أدخل اسمك"
            />
          </div>
          <Button onClick={handleSave} className="self-end">
            حفظ التكوين
          </Button>
          <Button onClick={handleExport} className="self-end bg-green-500 hover:bg-green-400">
            تصدير إلى Excel
          </Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="search">بحث في المربعات</Label>
          <Input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث حسب التفاصيل أو العلامات أو المحجوز من قبل"
            className="w-full text-6xl"
          />
        </div>
        <div
          className="w-full aspect-video border border-gray-300"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gap: '1px',
          }}
        >
          {filteredSquares.map((square) => (
            <div
              key={square.id}
              className="cursor-pointer border p-2 relative"
              style={{ backgroundColor: square.color }}
              onClick={() => handleSquareClick(square)}
            >
              <div className="flex justify-between items-center">
                
                {square.reserved && <Badge className="bg-green-500">محجوز</Badge>}
              </div>
              {square.reserved && (
                <div className="text-sm mt-2">محجوز من قبل: {square.reservedBy}</div>
              )}
            </div>
          ))}
        </div>
        {selectedSquare && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>تفاصيل المربع {selectedSquare.id + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="details">تفاصيل</Label>
                  <Textarea
                    id="details"
                    value={selectedSquare.details}
                    onChange={(e) => handleDetailsChange(selectedSquare.id, e.target.value)}
                    className="text-6xl"
                    placeholder="أدخل تفاصيل المربع"
                  />
                </div>
                <div>
                  <Label htmlFor="color">اللون</Label>
                  <Input
                    id="color"
                    type="color"
                    value={selectedSquare.color}
                    onChange={(e) => handleColorChange(selectedSquare.id, e.target.value)}
                    className="w-20 text-6xl"
                  />
                </div>
                <div>
                  <Label htmlFor="tags">العلامات</Label>
                  <Input
                    id="tags"
                    type="text"
                    value={selectedSquare.tags.join(', ')}
                    onChange={(e) => handleTagsChange(selectedSquare.id, e.target.value)}
                    className="w-full text-6xl"
                    placeholder="أدخل العلامات (مفصولة بفواصل)"
                  />
                </div>
                <div>
                  <Label htmlFor="capacity">السعة</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={selectedSquare.capacity}
                    onChange={(e) => handleCapacityChange(selectedSquare.id, parseInt(e.target.value))}
                    className="w-20 text-6xl"
                  />
                </div>
                <Button onClick={() => handleReserve(selectedSquare.id)} className="w-full text-4xl">
                  {selectedSquare.reserved ? 'إلغاء الحجز' : 'حجز المربع'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        {reservedSquares.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-6xl">المربعات المحجوزة</h2>
            <ul className="space-y-2 text-6xl">
              {reservedSquares.map((square) => (
                <li key={square.id} className="flex justify-between items-center">
                  <span>المربع {square.id + 1}</span>
                  <span>محجوز من قبل: {square.reservedBy}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

<Tabs defaultValue="all" className="w-full" dir="rtl">
          <TabsList>
            <TabsTrigger value="all">جميع المربعات</TabsTrigger>
            <TabsTrigger value="reserved">المربعات المحجوزة</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>ملخص جميع المربعات</CardTitle>
              </CardHeader>
              <CardContent>
                <p>إجمالي المربعات: {squares.length}</p>
                <p>المربعات المحجوزة: {reservedSquares.length}</p>
                <p>المربعات المتاحة: {squares.length - reservedSquares.length}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
    </TooltipProvider>
  )
}
