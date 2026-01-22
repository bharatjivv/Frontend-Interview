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

interface BlogDetailProps {
  blogId: number
}

const fetchBlogById = async (id: number): Promise<Blog> => {
  const response = await fetch(`http://localhost:3001/blogs/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch blog')
  }
  return response.json()
}

export default function BlogDetail({ blogId }: BlogDetailProps) {
  const { data: blog, isLoading, error } = useQuery({
    queryKey: ['blog', blogId],
    queryFn: () => fetchBlogById(blogId),
    enabled: !!blogId,
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-48 w-full rounded-md" />
          <Skeleton className="h-6 w-3/4 mt-4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-5/6 mt-2" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading blog: {error instanceof Error ? error.message : 'Unknown error'}
        </AlertDescription>
      </Alert>
    )
  }

  if (!blog) {
    return null
  }

  return (
    <Card>
      <CardHeader className="p-0">
        <img 
          src={blog.coverImage} 
          alt={blog.title}
          className="w-full h-64 object-cover rounded-t-lg"
        />
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.category.map((cat) => (
            <Badge key={cat} variant="secondary">
              {cat}
            </Badge>
          ))}
        </div>
        
        <CardTitle className="text-2xl mb-2">{blog.title}</CardTitle>
        
        <p className="text-sm text-gray-500 mb-4">
          {new Date(blog.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        
        <p className="text-gray-700 italic mb-4">{blog.description}</p>
        
        <div className="prose max-w-none">
          <p className="text-gray-800 whitespace-pre-wrap">{blog.content}</p>
        </div>
      </CardContent>
    </Card>
  )
}