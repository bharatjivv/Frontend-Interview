import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Skeleton } from './ui/skeleton'
import { Alert, AlertDescription } from './ui/alert'

interface Blog {
  id: number
  title: string
  category: string[]
  description: string
  date: string
  coverImage: string
  content: string
}

interface BlogListProps {
  onSelectBlog: (id: number) => void
  selectedBlogId: number | null
}

const fetchBlogs = async (): Promise<Blog[]> => {
  const response = await fetch('http://localhost:3001/blogs')
  if (!response.ok) {
    throw new Error('Failed to fetch blogs')
  }
  return response.json()
}

export default function BlogList({ onSelectBlog, selectedBlogId }: BlogListProps) {
  const { data: blogs, isLoading, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading blogs: {error instanceof Error ? error.message : 'Unknown error'}
        </AlertDescription>
      </Alert>
    )
  }

  if (!blogs || blogs.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No blogs found. Create your first blog!
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">All Blogs</h2>
      {blogs.map((blog) => (
        <Card 
          key={blog.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedBlogId === blog.id ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => onSelectBlog(blog.id)}
        >
          <CardHeader>
            <div className="flex flex-wrap gap-2 mb-2">
              {blog.category.map((cat) => (
                <Badge key={cat} variant="secondary">
                  {cat}
                </Badge>
              ))}
            </div>
            <CardTitle className="text-lg">{blog.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 line-clamp-2">{blog.description}</p>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(blog.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}