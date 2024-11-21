'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from '@/hooks/use-toast'

interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'on-hold'
  createdAt: string
}

export function ProjectDashboardComponent() {
  const [projects, setProjects] = useState<Project[]>([])
  const [newProject, setNewProject] = useState<Omit<Project, 'id' | 'createdAt'>>({
    name: '',
    description: '',
    status: 'active'
  })

  useEffect(() => {
    const savedProjects = localStorage.getItem('projects')
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects))
  }, [projects])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewProject(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    if (!newProject.name) {
      toast({
        title: "Error",
        description: "Project name is required.",
        variant: "destructive",
      })
      return
    }

    const project: Project = {
      ...newProject,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }

    setProjects(prev => [...prev, project])

    setNewProject({
      name: '',
      description: '',
      status: 'active'
    })

    toast({
      title: "Success",
      description: "Project has been saved successfully.",
    })
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Project Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
          <CardDescription>Enter the details for your new project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              name="name"
              value={newProject.name}
              onChange={handleInputChange}
              placeholder="Enter project name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={newProject.description}
              onChange={handleInputChange}
              placeholder="Enter project description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              value={newProject.status}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>Save Project</Button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Your Projects</h2>
        {projects.length === 0 ? (
          <p>No projects yet. Create your first project above!</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map(project => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>Created on: {new Date(project.createdAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-2">Status: {project.status}</p>
                  <p>{project.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}