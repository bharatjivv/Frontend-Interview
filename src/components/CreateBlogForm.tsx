import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'

interface CreateBlogFormProps {
  onSuccess: () => void
}

interface BlogFormData {
  title: string
  category: string
  description: string
  coverImage: string
  content: string
}

const createBlog = async (blogData: BlogFormData) => {
  const response = await fetch('http://localhost:3001/blogs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...blogData,
      category: blogData.category.split(',').map(c => c.trim().toUpperCase()),
      date: new Date().toISOString(),
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to create blog')
  }

  return response.json()
}

export default function CreateBlogForm({ onSuccess }: CreateBlogFormProps) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    category: '',
    description: '',
    coverImage: '',
    content: '',
  })

  const mutation = useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      setFormData({
        title: '',
        category: '',
        description: '',
        coverImage: '',
        content: '',
      })
      onSuccess()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Blog</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter blog title"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Categories (comma-separated) *</Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., TECH, FINANCE"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple categories with commas</p>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a short description"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="coverImage">Cover Image URL *</Label>
            <Input
              id="coverImage"
              name="coverImage"
              type="url"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your blog content here..."
              rows={10}
              required
            />
          </div>

          {mutation.error && (
            <Alert variant="destructive">
              <AlertDescription>
                {mutation.error instanceof Error ? mutation.error.message : 'Failed to create blog'}
              </AlertDescription>
            </Alert>
          )}

          {mutation.isSuccess && (
            <Alert>
              <AlertDescription>
                Blog created successfully!
              </AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Creating...' : 'Create Blog'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}