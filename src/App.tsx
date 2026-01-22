import { useState } from 'react'
import BlogList from './components/BlogList'
import BlogDetail from './components/BlogDetail'
import CreateBlogForm from './components/CreateBlogForm'
import { Button } from './components/ui/button'

function App() {
  const [selectedBlogId, setSelectedBlogId] = useState<number | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Blog Application</h1>
          <Button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            variant={showCreateForm ? "outline" : "default"}
          >
            {showCreateForm ? 'Cancel' : 'Create New Blog'}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {showCreateForm ? (
          <div className="max-w-3xl mx-auto">
            <CreateBlogForm 
              onSuccess={() => {
                setShowCreateForm(false)
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] lg:overflow-y-auto">
              <BlogList 
                onSelectBlog={setSelectedBlogId}
                selectedBlogId={selectedBlogId}
              />
            </div>
            
            <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] lg:overflow-y-auto">
              {selectedBlogId ? (
                <BlogDetail blogId={selectedBlogId} />
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <p className="text-gray-500">Select a blog to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App